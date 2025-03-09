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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, UserPlus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "../../../supabase/client";

interface CreateInstitutionAdminDialogProps {
  institution: {
    id: string;
    name: string;
  };
  onUserCreated: () => void;
}

export function CreateInstitutionAdminDialog({
  institution,
  onUserCreated,
}: CreateInstitutionAdminDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

      // 2. Update the user profile with role and institution_id
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: authData.user.id,
        token_identifier: authData.user.id,
        role: "institution", // Set role to institution admin
        institution_id: institution.id,
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
      setSuccess(
        `Institution admin ${fullName} created successfully for ${institution.name}`,
      );
      setFullName("");
      setEmail("");
      setPassword("");
      setIsCreating(false);

      // Notify parent after a delay to show success message
      setTimeout(() => {
        setOpen(false);
        onUserCreated();
      }, 2000);
    } catch (err) {
      console.error("Error creating institution admin:", err);
      setError("An unexpected error occurred");
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Create Institution Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Admin for {institution.name}</DialogTitle>
          <DialogDescription>
            Create an administrator account for this institution
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
              placeholder="admin@institution.com"
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
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
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
                <span>Create Admin</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
