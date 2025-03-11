import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import AdminVerification from "@/components/admin/admin-verification";

export const dynamic = "force-dynamic";

export default async function AdminVerifyPage() {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Verification
          </h1>
        </div>
        <AdminVerification />
      </main>
    </>
  );
}
