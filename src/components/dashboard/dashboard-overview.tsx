"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  Scale,
  Users,
  Building2,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  SkeletonCard,
  SkeletonDashboard,
  SkeletonTable,
} from "../ui/skeleton-card";
import { LoadingSpinner } from "../ui/loading-spinner";
import dynamic from "next/dynamic";
import Link from "next/link";
import InstitutionSummaryWidget from "../admin/institution-summary-widget";

interface CaseStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

interface DashboardOverviewProps {
  userRole: "admin" | "arbitrator" | "legal";
  userName: string;
  caseStats: CaseStats;
}

// Dynamically import components that aren't needed immediately
const CaseList = dynamic(() => import("./case-list"), {
  loading: () => <SkeletonTable />,
});

const CalendarView = dynamic(() => import("./calendar-view"), {
  loading: () => <SkeletonCard className="h-96" />,
});

const DocumentRepository = dynamic(() => import("./document-repository"), {
  loading: () => <SkeletonTable />,
});

export default function DashboardOverview({
  userRole,
  userName,
  caseStats,
}: DashboardOverviewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const roleTitle = {
    admin: "Administrator",
    arbitrator: "Arbitrator",
    legal: "Legal Representative",
  };

  const roleIcon = {
    admin: <Users className="h-5 w-5 text-blue-600" />,
    arbitrator: <Scale className="h-5 w-5 text-blue-600" />,
    legal: <FileText className="h-5 w-5 text-blue-600" />,
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
              {roleIcon[userRole]}
              <span>{roleTitle[userRole]} Dashboard</span>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {userRole === "admin" && (
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Cases
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{caseStats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      All cases in the system
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Cases
                    </CardTitle>
                    <Scale className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{caseStats.active}</div>
                    <p className="text-xs text-muted-foreground">
                      Cases in progress
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Cases
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {caseStats.completed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cases with final awards
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Actions
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {caseStats.pending}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Items requiring attention
                    </p>
                  </CardContent>
                </Card>

                {userRole === "admin" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Institutions
                      </CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">
                        <Link
                          href="/dashboard/admin/institutions"
                          prefetch={false}
                          className="text-blue-600 hover:underline"
                        >
                          View all institutions
                        </Link>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {userRole === "admin" && (
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Institution Management</CardTitle>
                      <CardDescription>
                        Overview of arbitration institutions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InstitutionSummaryWidget />
                    </CardContent>
                  </Card>
                )}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent case activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userRole === "admin" && (
                        <>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                New case filed: ABC Corp vs XYZ Ltd
                              </p>
                              <p className="text-xs text-muted-foreground">
                                10 minutes ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                Arbitrator assigned: Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                1 hour ago
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {userRole === "arbitrator" && (
                        <>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                New document submitted: Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                30 minutes ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                              <Calendar className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                Hearing scheduled: Case #ARB-2023-039
                              </p>
                              <p className="text-xs text-muted-foreground">
                                2 hours ago
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {userRole === "legal" && (
                        <>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                              <Calendar className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                Deadline approaching: Submit defense statement
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due in 3 days
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-md border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <Scale className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                Procedural order issued: Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                1 day ago
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                          <BarChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            System update: AI document analysis now available
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Your next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userRole === "admin" && (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Arbitrator selection deadline
                              </p>
                            </div>
                            <div className="text-sm font-medium text-red-600">
                              Tomorrow
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-039
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Preliminary hearing
                              </p>
                            </div>
                            <div className="text-sm font-medium">In 3 days</div>
                          </div>
                        </>
                      )}

                      {userRole === "arbitrator" && (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Issue procedural order
                              </p>
                            </div>
                            <div className="text-sm font-medium text-red-600">
                              Tomorrow
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-039
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Conduct hearing
                              </p>
                            </div>
                            <div className="text-sm font-medium">In 3 days</div>
                          </div>
                        </>
                      )}

                      {userRole === "legal" && (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-042
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Submit defense statement
                              </p>
                            </div>
                            <div className="text-sm font-medium text-red-600">
                              In 3 days
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                Case #ARB-2023-039
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Prepare for hearing
                              </p>
                            </div>
                            <div className="text-sm font-medium">In 3 days</div>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            Case #ARB-2023-038
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Document submission deadline
                          </p>
                        </div>
                        <div className="text-sm font-medium">In 5 days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              <Suspense fallback={<SkeletonTable />}>
                {activeTab === "cases" && (
                  <CaseList
                    userRole={userRole}
                    initialCases={[
                      {
                        id: "ARB-2023-042",
                        title: "Commercial Contract Dispute",
                        parties: "ABC Corp vs XYZ Ltd",
                        status: "In Progress",
                        type: "Commercial",
                        date: "2023-10-15",
                        stage: "Document Exchange",
                      },
                      {
                        id: "ARB-2023-039",
                        title: "Construction Delay Claim",
                        parties: "BuildRight Inc vs City Development",
                        status: "Hearing",
                        type: "Construction",
                        date: "2023-09-28",
                        stage: "Evidentiary Hearing",
                      },
                    ]}
                  />
                )}
              </Suspense>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <Suspense fallback={<SkeletonCard className="h-96" />}>
                {activeTab === "calendar" && (
                  <CalendarView userRole={userRole} />
                )}
              </Suspense>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Suspense fallback={<SkeletonTable />}>
                {activeTab === "documents" && (
                  <DocumentRepository
                    userRole={userRole}
                    initialDocuments={[
                      {
                        id: "doc-001",
                        name: "Statement of Claim.pdf",
                        caseId: "ARB-2023-042",
                        type: "Statement of Claim",
                        uploadedBy: "John Smith",
                        uploadDate: "2023-10-15",
                        size: "2.4 MB",
                        version: "1.0",
                      },
                      {
                        id: "doc-002",
                        name: "Contract Agreement.pdf",
                        caseId: "ARB-2023-042",
                        type: "Evidence",
                        uploadedBy: "John Smith",
                        uploadDate: "2023-10-15",
                        size: "1.8 MB",
                        version: "1.0",
                      },
                    ]}
                  />
                )}
              </Suspense>
            </TabsContent>

            {userRole === "admin" && (
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>
                      View case statistics and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Analytics dashboard will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  );
}
