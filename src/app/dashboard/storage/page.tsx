import DashboardNavbar from "@/components/dashboard-navbar";
import StorageManagement from "@/components/dashboard/storage-management";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function StoragePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // In a real application, we would check if the user is an admin
  // For now, we'll allow access to this page for all authenticated users

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Storage Management
          </h1>
        </div>
        <StorageManagement />
      </main>
    </>
  );
}
