"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "../ui/loading-spinner";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface PermissionStatus {
  authenticated: boolean;
  isAdmin: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  permissions?: {
    institutionsAccessible: boolean;
  };
  error?: string;
}

export default function AdminVerification() {
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/verify-permissions");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify permissions");
      }

      setStatus(data);
    } catch (err: any) {
      console.error("Error checking admin permissions:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Account Verification</CardTitle>
        <CardDescription>
          Verify that the admin account has all necessary permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size={40} />
            <p className="mt-4 text-sm text-muted-foreground">
              Verifying admin permissions...
            </p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-medium">Authentication Status</h3>
                {status?.authenticated ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span>Authenticated</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="mr-1 h-4 w-4" />
                    <span>Not Authenticated</span>
                  </div>
                )}
              </div>

              {status?.authenticated && (
                <>
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-medium">User Details</h3>
                    <div className="text-sm">
                      {status.user?.name} ({status.user?.email})
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-medium">Admin Role</h3>
                    {status.isAdmin ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        <span>Admin Role Confirmed</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="mr-1 h-4 w-4" />
                        <span>
                          Not an Admin (Current role: {status.user?.role})
                        </span>
                      </div>
                    )}
                  </div>

                  {status.isAdmin && status.permissions && (
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-medium">Institution Access</h3>
                      {status.permissions.institutionsAccessible ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          <span>Access Confirmed</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="mr-1 h-4 w-4" />
                          <span>No Access</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={checkPermissions} disabled={isLoading}>
                {isLoading ? "Checking..." : "Verify Again"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
