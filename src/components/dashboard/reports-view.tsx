"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart, Download } from "lucide-react";
import { Button } from "../ui/button";

export default function ReportsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Case Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Case Distribution</CardTitle>
                <CardDescription>By type and status</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-16 w-16 text-blue-600 opacity-70" />
                  <span className="sr-only">
                    Pie chart showing case distribution
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Resolution Time</CardTitle>
                <CardDescription>Average days to resolution</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-16 w-16 text-blue-600 opacity-70" />
                  <span className="sr-only">
                    Bar chart showing case resolution time
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Volume Trends</CardTitle>
                <CardDescription>Monthly case filings</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
                  <LineChart className="h-16 w-16 text-blue-600 opacity-70" />
                  <span className="sr-only">
                    Line chart showing case volume trends
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Year-to-date metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Cases Filed
                  </p>
                  <p className="text-3xl font-bold">127</p>
                  <p className="text-sm text-green-600">↑ 12% from last year</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Resolution Time
                  </p>
                  <p className="text-3xl font-bold">142 days</p>
                  <p className="text-sm text-green-600">↓ 8% from last year</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Arbitrator Utilization
                  </p>
                  <p className="text-3xl font-bold">87%</p>
                  <p className="text-sm text-green-600">↑ 5% from last year</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Client Satisfaction
                  </p>
                  <p className="text-3xl font-bold">92%</p>
                  <p className="text-sm text-green-600">↑ 3% from last year</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Analytics</CardTitle>
              <CardDescription>
                Detailed case performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Case analytics content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Arbitrator and system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance metrics content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Revenue and expense analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Financial reports content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
