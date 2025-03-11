"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Building2, UserCircle, Users } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import Link from "next/link";

export default function InstitutionSummaryWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    institutions: 0,
    arbitrators: 0,
    clients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching institution statistics...");
        // Fetch institutions
        const institutionsResponse = await fetch("/api/institutions");
        const institutionsData = await institutionsResponse.json();
        const institutions = institutionsData.institutions || [];
        console.log(`Found ${institutions.length} institutions`);

        // Count arbitrators and clients across all institutions
        let arbitratorCount = 0;
        let clientCount = 0;

        for (const institution of institutions) {
          try {
            // Get arbitrator count
            const arbitratorResponse = await fetch(
              `/api/institutions/${institution.id}/arbitrators`,
            );
            const arbitratorData = await arbitratorResponse.json();
            const arbitratorLength = arbitratorData.arbitrators?.length || 0;
            arbitratorCount += arbitratorLength;
            console.log(
              `Institution ${institution.id} has ${arbitratorLength} arbitrators`,
            );

            // Get client count
            const clientResponse = await fetch(
              `/api/institutions/${institution.id}/clients`,
            );
            const clientData = await clientResponse.json();
            const clientLength = clientData.clients?.length || 0;
            clientCount += clientLength;
            console.log(
              `Institution ${institution.id} has ${clientLength} clients`,
            );
          } catch (err) {
            console.error(
              `Error fetching counts for institution ${institution.id}:`,
              err,
            );
          }
        }

        setStats({
          institutions: institutions.length,
          arbitrators: arbitratorCount,
          clients: clientCount,
        });
        console.log("Institution stats updated:", {
          institutions: institutions.length,
          arbitrators: arbitratorCount,
          clients: clientCount,
        });
      } catch (error) {
        console.error("Error fetching institution stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Institution Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner size={24} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institution Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{stats.institutions}</div>
            <div className="text-sm text-muted-foreground">Institutions</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{stats.arbitrators}</div>
            <div className="text-sm text-muted-foreground">Arbitrators</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-2">
              <UserCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <div className="text-sm text-muted-foreground">Clients</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link
            href="/dashboard/admin/institutions"
            prefetch={false}
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View all institutions
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
