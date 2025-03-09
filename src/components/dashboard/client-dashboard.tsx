"use client";

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
import {
  AlertCircle,
  BarChart,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Scale,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";
import {
  SkeletonCard,
  SkeletonDashboard,
  SkeletonTable,
} from "../ui/skeleton-card";

interface ClientDashboardProps {
  userName: string;
}

interface ClientCase {
  id: string;
  title: string;
  status: "Filed" | "In Progress" | "Hearing" | "Deliberation" | "Completed";
  type: string;
  filingDate: string;
  lastUpdate: string;
  arbitrator: string;
  opponent: string;
}

interface ClientDocument {
  id: string;
  name: string;
  caseId: string;
  type: string;
  uploadDate: string;
  size: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Requires Action";
}

interface ClientAction {
  id: string;
  caseId: string;
  type: string;
  description: string;
  dueDate: string;
  status: "Pending" | "Completed" | "Overdue";
  priority: "Low" | "Medium" | "High";
}

export default function ClientDashboard({ userName }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [casesLoaded, setCasesLoaded] = useState(false);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [actionsLoaded, setActionsLoaded] = useState(false);

  // Mock data for client cases
  const mockCases: ClientCase[] = [
    {
      id: "ARB-2023-042",
      title: "Commercial Contract Dispute",
      status: "In Progress",
      type: "Commercial",
      filingDate: "2023-10-15",
      lastUpdate: "2023-11-10",
      arbitrator: "Dr. James Wilson",
      opponent: "XYZ Ltd",
    },
    {
      id: "ARB-2023-039",
      title: "Construction Delay Claim",
      status: "Hearing",
      type: "Construction",
      filingDate: "2023-09-28",
      lastUpdate: "2023-11-05",
      arbitrator: "Maria Rodriguez",
      opponent: "City Development",
    },
    {
      id: "ARB-2023-031",
      title: "International Trade Dispute",
      status: "Completed",
      type: "International Trade",
      filingDate: "2023-07-05",
      lastUpdate: "2023-10-20",
      arbitrator: "Dr. Sarah Chen",
      opponent: "Import Solutions",
    },
  ];

  // Mock data for client documents
  const mockDocuments: ClientDocument[] = [
    {
      id: "doc-001",
      name: "Statement of Claim.pdf",
      caseId: "ARB-2023-042",
      type: "Statement of Claim",
      uploadDate: "2023-10-15",
      size: "2.4 MB",
      status: "Approved",
    },
    {
      id: "doc-002",
      name: "Contract Agreement.pdf",
      caseId: "ARB-2023-042",
      type: "Evidence",
      uploadDate: "2023-10-15",
      size: "1.8 MB",
      status: "Approved",
    },
    {
      id: "doc-003",
      name: "Expert Witness Report.pdf",
      caseId: "ARB-2023-039",
      type: "Expert Report",
      uploadDate: "2023-10-22",
      size: "5.2 MB",
      status: "Pending Review",
    },
    {
      id: "doc-004",
      name: "Response to Procedural Order.pdf",
      caseId: "ARB-2023-042",
      type: "Response",
      uploadDate: "2023-11-08",
      size: "1.1 MB",
      status: "Requires Action",
    },
  ];

  // Mock data for client actions
  const mockActions: ClientAction[] = [
    {
      id: "action-001",
      caseId: "ARB-2023-042",
      type: "Document Submission",
      description: "Submit response to procedural order",
      dueDate: "2023-11-20",
      status: "Pending",
      priority: "High",
    },
    {
      id: "action-002",
      caseId: "ARB-2023-039",
      type: "Hearing Preparation",
      description: "Prepare for upcoming evidentiary hearing",
      dueDate: "2023-11-25",
      status: "Pending",
      priority: "Medium",
    },
    {
      id: "action-003",
      caseId: "ARB-2023-042",
      type: "Fee Payment",
      description: "Pay administrative fees for the next phase",
      dueDate: "2023-11-15",
      status: "Overdue",
      priority: "High",
    },
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulate loading data when tab changes
  useEffect(() => {
    if (activeTab === "cases" && !casesLoaded) {
      setCasesLoaded(true);
    } else if (activeTab === "documents" && !documentsLoaded) {
      setDocumentsLoaded(true);
    } else if (activeTab === "actions" && !actionsLoaded) {
      setActionsLoaded(true);
    }
  }, [activeTab, casesLoaded, documentsLoaded, actionsLoaded]);

  const filteredCases = mockCases.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Filed":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-amber-100 text-amber-800";
      case "Hearing":
        return "bg-purple-100 text-purple-800";
      case "Deliberation":
        return "bg-indigo-100 text-indigo-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Requires Action":
        return "bg-amber-100 text-amber-800";
      case "Pending Review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-amber-100 text-amber-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <SkeletonDashboard />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {userName}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Client Dashboard</span>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cases">My Cases</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="actions">Required Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Cases
                    </CardTitle>
                    <Scale className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockCases.filter((c) => c.status !== "Completed").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cases in progress
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Documents
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        mockDocuments.filter(
                          (d) => d.status === "Pending Review",
                        ).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Documents awaiting review
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Required Actions
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        mockActions.filter((a) => a.status !== "Completed")
                          .length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Actions requiring attention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Hearings
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">
                      Scheduled in the next 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Case Status</CardTitle>
                    <CardDescription>
                      Your active arbitration cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCases.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-4 rounded-md border p-4"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Scale className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{c.title}</p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}
                              >
                                {c.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Case #{c.id}</span>
                              <span>Last updated: {c.lastUpdate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Required Actions</CardTitle>
                    <CardDescription>
                      Items requiring your attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActions
                        .filter((a) => a.status !== "Completed")
                        .map((action) => (
                          <div
                            key={action.id}
                            className="flex justify-between items-start border-b pb-3"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {action.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Case #{action.caseId} - Due: {action.dueDate}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}
                              >
                                {action.priority}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}
                              >
                                {action.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              {activeTab === "cases" && !casesLoaded ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size={40} />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading cases...
                  </p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Cases</CardTitle>
                        <CardDescription>
                          Track and manage your arbitration cases
                        </CardDescription>
                      </div>
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search cases..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Filing Date</TableHead>
                            <TableHead>Arbitrator</TableHead>
                            <TableHead>Opponent</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCases.length > 0 ? (
                            filteredCases.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell className="font-medium">
                                  {c.id}
                                </TableCell>
                                <TableCell>{c.title}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}
                                  >
                                    {c.status}
                                  </span>
                                </TableCell>
                                <TableCell>{c.type}</TableCell>
                                <TableCell>{c.filingDate}</TableCell>
                                <TableCell>{c.arbitrator}</TableCell>
                                <TableCell>{c.opponent}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <MessageSquare className="h-4 w-4" />
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
                                No cases found matching your search criteria.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {activeTab === "documents" && !documentsLoaded ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size={40} />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading documents...
                  </p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>
                          Access and manage your case documents
                        </CardDescription>
                      </div>
                      <div className="flex gap-4">
                        <div className="relative w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search documents..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Upload Document</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                              <TableRow key={doc.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">
                                      {doc.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{doc.caseId}</TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{doc.uploadDate}</TableCell>
                                <TableCell>{doc.size}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}
                                  >
                                    {doc.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-4 text-muted-foreground"
                              >
                                No documents found matching your search
                                criteria.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {activeTab === "actions" && !actionsLoaded ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size={40} />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading actions...
                  </p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Actions</CardTitle>
                    <CardDescription>
                      Tasks and actions requiring your attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockActions.map((action) => (
                            <TableRow key={action.id}>
                              <TableCell className="font-medium">
                                {action.description}
                              </TableCell>
                              <TableCell>{action.caseId}</TableCell>
                              <TableCell>{action.type}</TableCell>
                              <TableCell>{action.dueDate}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}
                                >
                                  {action.priority}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}
                                >
                                  {action.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Take Action
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
