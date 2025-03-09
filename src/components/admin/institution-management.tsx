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
import { Building2, Eye, Filter, Plus, Search, UserPlus } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { createClient } from "../../../supabase/client";
import { CreateInstitutionDialog } from "./create-institution-dialog";
import { CreateUserDialog } from "./create-user-dialog";
import { CreateInstitutionAdminDialog } from "./create-institution-admin-dialog";

interface Institution {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  status: string;
}

export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading institutions:", error);
      } else {
        setInstitutions(data || []);
      }
    } catch (err) {
      console.error("Unexpected error loading institutions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInstitution = () => {
    // This will be handled by the CreateInstitutionDialog component
    // After successful creation, we'll reload the institutions
    loadInstitutions();
  };

  const handleCreateUser = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsCreateUserDialogOpen(true);
  };

  const filteredInstitutions = institutions.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email?.toLowerCase().includes(searchTerm.toLowerCase()),
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
                          {new Date(
                            institution.created_at,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCreateUser(institution)}
                              title="Create Institution User"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
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
                        colSpan={6}
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

      {selectedInstitution && (
        <CreateUserDialog
          isOpen={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          institution={selectedInstitution}
          onUserCreated={() => {
            setIsCreateUserDialogOpen(false);
            setSelectedInstitution(null);
          }}
        />
      )}
    </div>
  );
}
