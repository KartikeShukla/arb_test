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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Link2, UserCheck } from "lucide-react";
import { createClient } from "../../../supabase/client";
import { LoadingSpinner } from "../ui/loading-spinner";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Assignment {
  id: string;
  arbitrator_id: string;
  client_id: string;
  created_at: string;
  arbitrator_name?: string;
  client_name?: string;
}

export default function ArbitratorClientAssignment() {
  const [arbitrators, setArbitrators] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedArbitrator, setSelectedArbitrator] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    loadAssignments();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get current user's institution_id
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in");
        setIsLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("institution_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.institution_id) {
        setError("Error fetching institution information");
        setIsLoading(false);
        return;
      }

      const institutionId = userData.institution_id;

      // Get arbitrators for this institution
      const { data: arbitratorData, error: arbitratorError } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .eq("institution_id", institutionId)
        .eq("role", "arbitrator");

      if (arbitratorError) {
        console.error("Error loading arbitrators:", arbitratorError);
      } else {
        setArbitrators(arbitratorData || []);
      }

      // Get clients for this institution
      const { data: clientData, error: clientError } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .eq("institution_id", institutionId)
        .eq("role", "client");

      if (clientError) {
        console.error("Error loading clients:", clientError);
      } else {
        setClients(clientData || []);
      }
    } catch (err) {
      console.error("Unexpected error loading users:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const supabase = createClient();

      // Get current user's institution_id
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("institution_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.institution_id) return;

      const institutionId = userData.institution_id;

      // Get assignments for this institution
      const { data: assignmentData, error: assignmentError } = await supabase
        .from("arbitrator_client_assignments")
        .select("id, arbitrator_id, client_id, created_at")
        .eq("institution_id", institutionId);

      if (assignmentError) {
        console.error("Error loading assignments:", assignmentError);
        return;
      }

      // Enhance assignments with names
      const enhancedAssignments = await Promise.all(
        (assignmentData || []).map(async (assignment) => {
          // Get arbitrator name
          const { data: arbitratorData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", assignment.arbitrator_id)
            .single();

          // Get client name
          const { data: clientData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", assignment.client_id)
            .single();

          return {
            ...assignment,
            arbitrator_name: arbitratorData?.full_name || "Unknown",
            client_name: clientData?.full_name || "Unknown",
          };
        }),
      );

      setAssignments(enhancedAssignments);
    } catch (err) {
      console.error("Unexpected error loading assignments:", err);
    }
  };

  const handleAssign = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedArbitrator || !selectedClient) {
      setError("Please select both an arbitrator and a client");
      return;
    }

    setIsAssigning(true);

    try {
      const supabase = createClient();

      // Get current user's institution_id
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in");
        setIsAssigning(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("institution_id, role")
        .eq("id", user.id)
        .single();

      if (
        userError ||
        !userData?.institution_id ||
        userData.role !== "institution"
      ) {
        setError("You don't have permission to assign arbitrators");
        setIsAssigning(false);
        return;
      }

      // Check if assignment already exists
      const { data: existingAssignment, error: checkError } = await supabase
        .from("arbitrator_client_assignments")
        .select("id")
        .eq("arbitrator_id", selectedArbitrator)
        .eq("client_id", selectedClient)
        .eq("institution_id", userData.institution_id);

      if (checkError) {
        setError("Error checking existing assignments");
        setIsAssigning(false);
        return;
      }

      if (existingAssignment && existingAssignment.length > 0) {
        setError("This arbitrator is already assigned to this client");
        setIsAssigning(false);
        return;
      }

      // Create the assignment
      const { error: createError } = await supabase
        .from("arbitrator_client_assignments")
        .insert({
          arbitrator_id: selectedArbitrator,
          client_id: selectedClient,
          institution_id: userData.institution_id,
          created_by: user.id,
        });

      if (createError) {
        setError(`Failed to create assignment: ${createError.message}`);
        setIsAssigning(false);
        return;
      }

      // Success
      setSuccess("Arbitrator assigned to client successfully");
      setSelectedArbitrator("");
      setSelectedClient("");
      setIsAssigning(false);

      // Reload assignments
      loadAssignments();
    } catch (err) {
      console.error("Error assigning arbitrator to client:", err);
      setError("An unexpected error occurred");
      setIsAssigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Arbitrator-Client Assignments
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign Arbitrator to Client</CardTitle>
          <CardDescription>
            Create a new assignment between an arbitrator and a client
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size={40} />
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="arbitrator">Arbitrator</Label>
                  <Select
                    value={selectedArbitrator}
                    onValueChange={setSelectedArbitrator}
                    disabled={isAssigning || arbitrators.length === 0}
                  >
                    <SelectTrigger id="arbitrator">
                      <SelectValue placeholder="Select arbitrator" />
                    </SelectTrigger>
                    <SelectContent>
                      {arbitrators.map((arbitrator) => (
                        <SelectItem key={arbitrator.id} value={arbitrator.id}>
                          {arbitrator.full_name} ({arbitrator.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                    disabled={isAssigning || clients.length === 0}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.full_name} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAssign}
                  disabled={
                    !selectedArbitrator ||
                    !selectedClient ||
                    isAssigning ||
                    arbitrators.length === 0 ||
                    clients.length === 0
                  }
                  className="flex items-center gap-2"
                >
                  {isAssigning ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      <span>Assign</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Current Assignments
                </h3>
                {assignments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No assignments found. Create your first assignment above.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-4 p-4 border rounded-md"
                      >
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {assignment.arbitrator_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Assigned on{" "}
                              {new Date(
                                assignment.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Assigned to client: {assignment.client_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
