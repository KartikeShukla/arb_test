import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import InstitutionDetail from "@/components/admin/institution-detail";

export default async function InstitutionDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Get institution details
  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (institutionError || !institution) {
    return redirect("/dashboard/admin/institutions");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <InstitutionDetail institution={institution} />
      </main>
    </>
  );
}
