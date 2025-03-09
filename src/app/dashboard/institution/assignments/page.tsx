import DashboardNavbar from "@/components/dashboard-navbar";
import ArbitratorClientAssignment from "@/components/institution/arbitrator-client-assignment";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";

export default async function AssignmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, institution_id")
    .eq("id", user.id)
    .single();

  // If not institution admin, redirect to dashboard
  if (
    userError ||
    userData?.role !== "institution" ||
    !userData?.institution_id
  ) {
    return redirect("/dashboard");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <ArbitratorClientAssignment />
      </main>
    </>
  );
}
