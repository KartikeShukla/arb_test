import DashboardNavbar from "@/components/dashboard-navbar";
import InstitutionManagement from "@/components/admin/institution-management";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";

export default async function InstitutionsPage() {
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
    .select("role")
    .eq("id", user.id)
    .single();

  // If not admin, redirect to dashboard
  if (userError || userData?.role !== "admin") {
    return redirect("/dashboard");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <InstitutionManagement />
      </main>
    </>
  );
}
