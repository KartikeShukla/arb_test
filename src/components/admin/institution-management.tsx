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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Eye, Filter, Search, UserPlus } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreateInstitutionDialog from "./create-institution-dialog";
import { useRouter } from "next/navigation";

interface Institution {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  status: string;
  arbitrator_count?: number;
  client_count?: number;
}

export default function InstitutionManagement() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/institutions");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load institutions");
      }

      // Get institutions with user counts
      const institutionsWithCounts = await Promise.all(
        (data.institutions || []).map(async (institution: Institution) => {
          try {
            // Get arbitrator count
            const arbitratorResponse = await fetch(
              `/api/institutions/${institution.id}/arbitrators`,
            );
            const arbitratorData = await arbitratorResponse.json();

            // Get client count
            const clientResponse = await fetch(
              `/api/institutions/${institution.id}/clients`,
            );
            const clientData = await clientResponse.json();

            return {
              ...institution,
              arbitrator_count: arbitratorData.arbitrators?.length || 0,
              client_count: clientData.clients?.length || 0,
            };
          } catch (error) {
            console.error(
              `Error fetching counts for ${institution.id}:`,
              error,
            );
            return {
              ...institution,
              arbitrator_count: 0,
              client_count: 0,
            };
          }
        }),
      );

      setInstitutions(institutionsWithCounts);
    } catch (err: any) {
      console.error("Error loading institutions:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInstitution = (id: string) => {
    console.log(
      `Navigating to institution detail page: /dashboard/admin/institutions/${id}`,
    );
    router.push(`/dashboard/admin/institutions/${id}`);
  };

  const filteredInstitutions = institutions.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.email &&
        inst.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Institution Management
        </h1>
        <CreateInstitutionDialog onInstitutionCreated={loadInstitutions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arbitration Institutions</CardTitle>
          <CardDescription>
            Manage arbitration institutions and their users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search institutions by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size={40} />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading institutions...
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arbitrators</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.length > 0 ? (
                    filteredInstitutions.map((institution) => (
                      <TableRow key={institution.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">
                              {institution.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{institution.email}</TableCell>
                        <TableCell>{institution.phone}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${institution.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {institution.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {institution.arbitrator_count || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {institution.client_count || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            institution.created_at,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleViewInstitution(institution.id)
                              }
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No institutions found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
