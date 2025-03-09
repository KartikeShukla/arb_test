import DashboardNavbar from "@/components/dashboard-navbar";
import CalendarView from "@/components/dashboard/calendar-view";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function CalendarPage({
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

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <CalendarView
          userRole={validatedRole as "admin" | "arbitrator" | "legal"}
        />
      </main>
    </>
  );
}
