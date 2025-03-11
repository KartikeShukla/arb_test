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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
  Pencil,
  Search,
  UserCircle,
  Eye,
} from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateUserDialog } from "./create-user-dialog";
import { useRouter } from "next/navigation";

interface Institution {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  status: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface InstitutionDetailProps {
  institution: Institution;
}

export default function InstitutionDetail({
  institution,
}: InstitutionDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [arbitrators, setArbitrators] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"arbitrator" | "client">(
    "arbitrator",
  );

  useEffect(() => {
    // Load both arbitrators and clients on component mount
    fetchArbitrators();
    fetchClients();
    setIsLoading(false);
  }, []);

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === "arbitrators") {
      fetchArbitrators();
    } else if (activeTab === "clients") {
      fetchClients();
    }
  }, [activeTab]);

  const fetchArbitrators = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/institutions/${institution.id}/arbitrators`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch arbitrators");
      }

      setArbitrators(data.arbitrators || []);
    } catch (err) {
      console.error("Error fetching arbitrators:", err);
      setError("Failed to load arbitrators");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/institutions/${institution.id}/clients`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch clients");
      }

      setClients(data.clients || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = (role: "arbitrator" | "client") => {
    setSelectedRole(role);
    setIsCreateUserDialogOpen(true);
  };

  const handleUserCreated = () => {
    setIsCreateUserDialogOpen(false);
    if (selectedRole === "arbitrator") {
      fetchArbitrators();
    } else {
      fetchClients();
    }
  };

  const filteredArbitrators = arbitrators.filter(
    (arbitrator) =>
      arbitrator.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbitrator.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Institution Details
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admin/institutions")}
        >
          Back to Institutions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>{institution.name}</CardTitle>
              <CardDescription>
                Institution ID: {institution.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {institution.email || "No email provided"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {institution.phone || "No phone provided"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {institution.address || "No address provided"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Created on:{" "}
                  {new Date(institution.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${institution.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {institution.status}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="arbitrators">Arbitrators</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institution Summary</CardTitle>
              <CardDescription>
                Overview of users and activity for {institution.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-2 border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-purple-600" />
                      Arbitrators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="text-3xl font-bold text-purple-700">
                        {arbitrators.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {arbitrators.length === 1
                          ? "Arbitrator"
                          : "Arbitrators"}{" "}
                        registered with this institution
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 w-full justify-center"
                        onClick={() => setActiveTab("arbitrators")}
                      >
                        View Arbitrators
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-green-600" />
                      Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="text-3xl font-bold text-green-700">
                        {clients.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {clients.length === 1 ? "Client" : "Clients"} registered
                        with this institution
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 w-full justify-center"
                        onClick={() => setActiveTab("clients")}
                      >
                        View Clients
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      Add Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Add new users to this institution
                      </p>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <Button
                          variant="outline"
                          className="w-full justify-center border-purple-200 hover:bg-purple-50"
                          onClick={() => {
                            setSelectedRole("arbitrator");
                            setIsCreateUserDialogOpen(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4 text-purple-600" />
                          Add Arbitrator
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-center border-green-200 hover:bg-green-50"
                          onClick={() => {
                            setSelectedRole("client");
                            setIsCreateUserDialogOpen(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4 text-green-600" />
                          Add Client
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-center border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedRole("institution");
                            setIsCreateUserDialogOpen(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4 text-blue-600" />
                          Add Admin
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Institution</CardTitle>
              <CardDescription>Update institution details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name</Label>
                    <Input
                      id="name"
                      defaultValue={institution.name}
                      placeholder="Enter institution name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={institution.email || ""}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue={institution.phone || ""}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      defaultValue={institution.address || ""}
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    <span>Update Institution</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arbitrators" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Arbitrators</CardTitle>
                  <CardDescription>
                    Manage arbitrators for {institution.name}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleCreateUser("arbitrator")}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Arbitrator</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search arbitrators..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
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
                    Loading arbitrators...
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredArbitrators.length > 0 ? (
                        filteredArbitrators.map((arbitrator) => (
                          <TableRow key={arbitrator.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                                  {arbitrator.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {arbitrator.full_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Arbitrator
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{arbitrator.email}</TableCell>
                            <TableCell>
                              {new Date(
                                arbitrator.created_at,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No arbitrators found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>
                    Manage clients for {institution.name}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleCreateUser("client")}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Client</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
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
                    Loading clients...
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                                  {client.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {client.full_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Client
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              {new Date(client.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No clients found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isCreateUserDialogOpen && (
        <CreateUserDialog
          isOpen={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          institution={institution}
          onUserCreated={handleUserCreated}
          initialRole={selectedRole === "arbitrator" ? "arbitrator" : "client"}
        />
      )}
    </div>
  );
}
