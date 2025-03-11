"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "../../../supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Institution {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  status: string;
}

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  onUserCreated: () => void;
  initialRole?: "arbitrator" | "client" | "institution";
}

export function CreateUserDialog(props: CreateUserDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(props.initialRole || "arbitrator");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsCreating(true);

    try {
      const supabase = createClient();

      // Check if the current user has permission to create users for this institution
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setError("You must be logged in to create users");
        setIsCreating(false);
        return;
      }

      // Get current user's role and institution
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, institution_id")
        .eq("id", currentUser.id)
        .single();

      if (userError) {
        setError("Error verifying your permissions");
        setIsCreating(false);
        return;
      }

      // Verify permissions - only admin can create institution users, and institution users can only create users for their institution
      if (
        userData.role !== "admin" &&
        (userData.role !== "institution" ||
          userData.institution_id !== props.institution.id)
      ) {
        setError(
          "You don't have permission to create users for this institution",
        );
        setIsCreating(false);
        return;
      }

      // 1. Create the user in Auth
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
          },
        });

      if (authError) {
        setError(authError.message);
        setIsCreating(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create user");
        setIsCreating(false);
        return;
      }

      // 2. Insert the user profile with role and institution_id
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: authData.user.id,
        token_identifier: authData.user.id,
        role: role,
        institution_id: props.institution.id,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        setError(
          `User created but profile update failed: ${profileError.message}`,
        );
        setIsCreating(false);
        return;
      }

      // Success
      setSuccess(`User ${fullName} created successfully with role: ${role}`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("arbitrator"); // Default to arbitrator for next creation
      setIsCreating(false);

      // Notify parent after a delay to show success message
      setTimeout(() => {
        props.onUserCreated();
      }, 2000);
    } catch (err) {
      console.error("Error creating user:", err);
      setError("An unexpected error occurred");
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User for {props.institution.name}</DialogTitle>
          <DialogDescription>
            Add a new user associated with this institution
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-2 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name" className="required">
              Full Name
            </Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              disabled={isCreating}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="required">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isCreating}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="required">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              disabled={isCreating}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="required">
              Role
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isCreating}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arbitrator">Arbitrator</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="institution">Institution Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={props.onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              !fullName.trim() ||
              !email.trim() ||
              !password.trim() ||
              isCreating
            }
            className="flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create User</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
