import { LoadingPage } from "@/components/ui/loading-page";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function CalendarLoading() {
  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <LoadingPage />
      </main>
    </>
  );
}
