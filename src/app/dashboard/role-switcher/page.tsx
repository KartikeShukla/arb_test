import DashboardNavbar from "@/components/dashboard-navbar";
import RoleSwitcher from "@/components/dashboard/role-switcher";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function RoleSwitcherPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // In a real application, we would fetch the user's role from the database
  // For now, we'll assume the user is an administrator
  const userRole = "admin";
  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <RoleSwitcher userName={userName} />
      </main>
    </>
  );
}
