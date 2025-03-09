"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Scale,
  FileText,
  Calendar,
  BarChart,
  Settings,
  Users,
  Database,
  Building2,
  UserPlus,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(data?.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getUserRole();
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="flex items-center gap-2 text-xl font-bold"
          >
            <Scale className="h-6 w-6 text-blue-600" />
            <span>ArbiCase</span>
          </Link>
          <div className="hidden md:flex ml-10 gap-6 items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {/* Common links for all users */}
            <Link
              href="/dashboard/cases"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
            >
              <FileText className="h-4 w-4" />
              <span>Cases</span>
            </Link>
            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
            <Link
              href="/dashboard/documents"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
            >
              <Database className="h-4 w-4" />
              <span>Documents</span>
            </Link>

            {/* Admin-only links */}
            {userRole === "admin" && (
              <>
                <Link
                  href="/dashboard/admin/institutions"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Institutions</span>
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
              </>
            )}

            {/* Institution admin links */}
            {userRole === "institution" && (
              <>
                <Link
                  href="/dashboard/institution/users"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  href="/dashboard/institution/assignments"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <Link2 className="h-4 w-4" />
                  <span>Assignments</span>
                </Link>
                <Link
                  href="/dashboard/cases"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  <span>Cases</span>
                </Link>
                <Link
                  href="/dashboard/clients"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Clients</span>
                </Link>
              </>
            )}

            {/* For testing - will be removed in production */}
            <Link
              href="/dashboard/role-switcher"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium"
            >
              <Users className="h-4 w-4" />
              <span>Switch Role</span>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <span className="flex items-center gap-2">
                    Role:{" "}
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      {userRole || "User"}
                    </span>
                  </span>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
