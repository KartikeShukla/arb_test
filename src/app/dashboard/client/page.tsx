import DashboardNavbar from "@/components/dashboard-navbar";
import ClientDashboard from "@/components/dashboard/client-dashboard";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function ClientPage({
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

  // Get the role from the query parameter or default to client
  const userRole = searchParams.role || "client";

  // For a real application, we would verify that the user is actually a client
  // For now, we'll just allow access if the role is set to client
  if (userRole !== "client" && userRole !== "admin") {
    return redirect("/dashboard");
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <ClientDashboard userName={userName} />
      </main>
    </>
  );
}
