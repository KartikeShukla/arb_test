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

interface Institution {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  status: string;
}

interface CreateInstitutionAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  onUserCreated: () => void;
}

export default function CreateInstitutionAdminDialog({
  isOpen,
  onClose,
  institution,
  onUserCreated,
}: CreateInstitutionAdminDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("Creating institution admin with data:", {
        full_name: fullName,
        email,
        role: "institution",
        institution_id: institution.id,
      });

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: "institution",
          institution_id: institution.id,
        }),
      });

      const data = await response.json();
      console.log("Institution admin creation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create institution admin");
      }

      // Success
      setSuccess(
        `Institution admin ${fullName} created successfully for ${institution.name}`,
      );
      setFullName("");
      setEmail("");
      setPassword("");

      // Notify parent after a delay to show success message
      setTimeout(() => {
        onUserCreated();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Error creating institution admin:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
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
