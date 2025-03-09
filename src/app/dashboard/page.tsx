import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get the role from the query parameter or default to admin
  const userRole = searchParams.role || "admin";

  // Validate that the role is one of the allowed values
  const validRoles = ["admin", "arbitrator", "legal"];
  const validatedRole = validRoles.includes(userRole as string)
    ? userRole
    : "admin";
  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  // Mock case statistics - in a real application, these would be fetched from the database
  const caseStats = {
    total: 42,
    active: 18,
    completed: 24,
    pending: 7,
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <DashboardOverview
          userRole={validatedRole as "admin" | "arbitrator" | "legal"}
          userName={userName}
          caseStats={caseStats}
        />
      </main>
    </>
  );
}
