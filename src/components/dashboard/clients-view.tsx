"use client";

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
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  activeCases: number;
  status: "Active" | "Inactive";
  lastActivity: string;
}

interface ClientsViewProps {
  userRole: "admin" | "arbitrator" | "legal";
}

export default function ClientsView({ userRole }: ClientsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock client data - in a real application, these would be fetched from the database
  const mockClients: Client[] = [
    {
      id: "client-001",
      name: "John Smith",
      email: "john.smith@example.com",
      company: "ABC Corporation",
      activeCases: 3,
      status: "Active",
      lastActivity: "2023-11-05",
    },
    {
      id: "client-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      company: "XYZ Ltd",
      activeCases: 1,
      status: "Active",
      lastActivity: "2023-11-10",
    },
    {
      id: "client-003",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      company: "Global Enterprises",
      activeCases: 2,
      status: "Active",
      lastActivity: "2023-11-08",
    },
    {
      id: "client-004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      company: "Tech Solutions Inc",
      activeCases: 0,
      status: "Inactive",
      lastActivity: "2023-10-15",
    },
    {
      id: "client-005",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      company: "Wilson & Associates",
      activeCases: 4,
      status: "Active",
      lastActivity: "2023-11-12",
    },
  ];

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        {userRole === "admin" && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <CardDescription>View and manage client information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or company..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Active Cases</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell>{client.activeCases}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell>{client.lastActivity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No clients found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
