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
import { Building2, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreateInstitutionAdminDialog from "./create-institution-admin-dialog";

interface Institution {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  status: string;
}

interface CreateInstitutionDialogProps {
  onInstitutionCreated: () => void;
}

export default function CreateInstitutionDialog({
  onInstitutionCreated,
}: CreateInstitutionDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [createdInstitution, setCreatedInstitution] =
    useState<Institution | null>(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Institution name is required");
      return;
    }

    setIsCreating(true);

    try {
      console.log("Creating institution with data:", {
        name,
        email,
        phone,
        address,
      });

      const response = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          status: "active",
        }),
      });

      const data = await response.json();
      console.log("Institution creation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create institution");
      }

      // Store the created institution for admin creation
      setCreatedInstitution(data.institution);

      // Show success message
      setSuccess(
        `Institution ${name} created successfully. Now create an administrator for this institution.`,
      );

      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");

      // Show admin creation dialog after a short delay
      setTimeout(() => {
        setShowAdminDialog(true);
      }, 1000);
    } catch (err: any) {
      console.error("Error creating institution:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAdminCreated = () => {
    // Close this dialog and notify parent component
    setOpen(false);
    setShowAdminDialog(false);
    setCreatedInstitution(null);
    onInstitutionCreated();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Institution</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Institution</DialogTitle>
            <DialogDescription>
              Add a new arbitration institution to the platform
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
              <Label htmlFor="institution-name" className="required">
                Institution Name
              </Label>
              <Input
                id="institution-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter institution name"
                disabled={isCreating || showAdminDialog}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-email">Email</Label>
              <Input
                id="institution-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@institution.com"
                disabled={isCreating || showAdminDialog}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-phone">Phone</Label>
              <Input
                id="institution-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={isCreating || showAdminDialog}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-address">Address</Label>
              <Input
                id="institution-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, Country"
                disabled={isCreating || showAdminDialog}
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
            {!showAdminDialog && (
              <Button
                onClick={handleCreate}
                disabled={!name.trim() || isCreating}
                className="flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>Create Institution</span>
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating institution admin */}
      {createdInstitution && showAdminDialog && (
        <CreateInstitutionAdminDialog
          isOpen={showAdminDialog}
          onClose={() => setShowAdminDialog(false)}
          institution={createdInstitution}
          onUserCreated={handleAdminCreated}
        />
      )}
    </>
  );
}
