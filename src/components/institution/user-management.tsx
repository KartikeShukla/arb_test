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
import { Eye, Filter, Plus, Search, UserCircle } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { createClient } from "../../../supabase/client";
import { CreateUserDialog } from "../admin/create-user-dialog";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Institution {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  status: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  useEffect(() => {
    loadInstitutionAndUsers();
  }, []);

  const loadInstitutionAndUsers = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user");
        setIsLoading(false);
        return;
      }

      // Get user's institution
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("institution_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.institution_id) {
        console.error("Error getting user's institution:", userError);
        setIsLoading(false);
        return;
      }

      // Get institution details
      const { data: institutionData, error: institutionError } = await supabase
        .from("institutions")
        .select("*")
        .eq("id", userData.institution_id)
        .single();

      if (institutionError) {
        console.error("Error getting institution details:", institutionError);
        setIsLoading(false);
        return;
      }

      setInstitution(institutionData);

      // Get users for this institution
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("institution_id", userData.institution_id)
        .order("created_at", { ascending: false });

      if (usersError) {
        console.error("Error loading users:", usersError);
      } else {
        setUsers(usersData || []);
      }
    } catch (err) {
      console.error("Unexpected error loading users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    setIsCreateUserDialogOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "institution":
        return "bg-blue-100 text-blue-800";
      case "arbitrator":
        return "bg-purple-100 text-purple-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button
          className="flex items-center gap-2"
          onClick={handleCreateUser}
          disabled={!institution}
        >
          <Plus className="h-4 w-4" />
          <span>New User</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institution Users</CardTitle>
          <CardDescription>
            {institution
              ? `Manage users for ${institution.name}`
              : "Loading institution details..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
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
                Loading users...
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">
                              {user.full_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No users found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {institution && (
        <CreateUserDialog
          isOpen={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          institution={institution}
          onUserCreated={() => {
            setIsCreateUserDialogOpen(false);
            loadInstitutionAndUsers();
          }}
        />
      )}
    </div>
  );
}
