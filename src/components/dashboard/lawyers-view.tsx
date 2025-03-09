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

interface Lawyer {
  id: string;
  name: string;
  email: string;
  firm: string;
  specialization: string;
  activeCases: number;
  status: "Active" | "Inactive";
  lastActivity: string;
}

interface LawyersViewProps {
  userRole: "admin" | "arbitrator" | "legal";
}

export default function LawyersView({ userRole }: LawyersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock lawyer data - in a real application, these would be fetched from the database
  const mockLawyers: Lawyer[] = [
    {
      id: "lawyer-001",
      name: "Jennifer Adams",
      email: "jennifer.adams@lawfirm.com",
      firm: "Adams & Partners",
      specialization: "Commercial Arbitration",
      activeCases: 5,
      status: "Active",
      lastActivity: "2023-11-12",
    },
    {
      id: "lawyer-002",
      name: "David Chen",
      email: "david.chen@lawfirm.com",
      firm: "Global Legal Solutions",
      specialization: "International Disputes",
      activeCases: 3,
      status: "Active",
      lastActivity: "2023-11-10",
    },
    {
      id: "lawyer-003",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@lawfirm.com",
      firm: "Rodriguez & Associates",
      specialization: "Construction Disputes",
      activeCases: 4,
      status: "Active",
      lastActivity: "2023-11-08",
    },
    {
      id: "lawyer-004",
      name: "James Wilson",
      email: "james.wilson@lawfirm.com",
      firm: "Wilson Legal Group",
      specialization: "IP Disputes",
      activeCases: 2,
      status: "Active",
      lastActivity: "2023-11-05",
    },
    {
      id: "lawyer-005",
      name: "Sophia Kim",
      email: "sophia.kim@lawfirm.com",
      firm: "International Legal Advisors",
      specialization: "Energy Disputes",
      activeCases: 0,
      status: "Inactive",
      lastActivity: "2023-10-20",
    },
  ];

  const filteredLawyers = mockLawyers.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Legal Representatives
        </h1>
        {userRole === "admin" && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Lawyer</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lawyer Management</CardTitle>
          <CardDescription>
            View and manage legal representatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lawyers by name, email, firm, or specialization..."
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
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Firm</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Active Cases</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLawyers.length > 0 ? (
                  filteredLawyers.map((lawyer) => (
                    <TableRow key={lawyer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{lawyer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{lawyer.email}</TableCell>
                      <TableCell>{lawyer.firm}</TableCell>
                      <TableCell>{lawyer.specialization}</TableCell>
                      <TableCell>{lawyer.activeCases}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${lawyer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {lawyer.status}
                        </span>
                      </TableCell>
                      <TableCell>{lawyer.lastActivity}</TableCell>
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
                      colSpan={8}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No lawyers found matching your search criteria.
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
