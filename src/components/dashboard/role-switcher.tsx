"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scale, FileText, Users, ArrowRight, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoleSwitcherProps {
  userName: string;
}

export default function RoleSwitcher({ userName }: RoleSwitcherProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // In a real application, we would store the selected role in a session or context
      // For now, we'll just navigate to the dashboard with a query parameter
      router.push(`/dashboard?role=${selectedRole}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground">
          Select a role to view the corresponding dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card
          className={`cursor-pointer transition-all ${selectedRole === "admin" ? "ring-2 ring-blue-600" : "hover:shadow-md"}`}
          onClick={() => handleRoleSelect("admin")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Administrator</CardTitle>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <CardDescription>
              Complete oversight of all cases and system configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Case creation and assignment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Workflow template configuration</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Resource allocation tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Performance analytics</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedRole === "arbitrator" ? "ring-2 ring-blue-600" : "hover:shadow-md"}`}
          onClick={() => handleRoleSelect("arbitrator")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Arbitrator</CardTitle>
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <CardDescription>
              Efficient tools to manage assigned cases and conduct proceedings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Case dashboard with priorities</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Document review queue</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Hearing management</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Award drafting assistance</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedRole === "legal" ? "ring-2 ring-blue-600" : "hover:shadow-md"}`}
          onClick={() => handleRoleSelect("legal")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Legal Representative</CardTitle>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardDescription>
              Secure access to case materials and streamlined document
              submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Document repository access</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Submission deadline alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Hearing scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Client case status updates</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedRole === "client" ? "ring-2 ring-blue-600" : "hover:shadow-md"}`}
          onClick={() => handleRoleSelect("client")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Client</CardTitle>
              <UserCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardDescription>
              Track your cases, view documents, and take required actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Case tracking and status updates</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Document access and submission</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Required action notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>Hearing schedule and preparation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="flex items-center gap-2"
          size="lg"
        >
          Continue to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
