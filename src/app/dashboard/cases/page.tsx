import DashboardNavbar from "@/components/dashboard-navbar";
import CaseList from "@/components/dashboard/case-list";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function CasesPage({
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

  // Mock case data - in a real application, these would be fetched from the database
  const mockCases = [
    {
      id: "ARB-2023-042",
      title: "Commercial Contract Dispute",
      parties: "ABC Corp vs XYZ Ltd",
      status: "In Progress" as const,
      type: "Commercial",
      date: "2023-10-15",
      stage: "Document Exchange",
    },
    {
      id: "ARB-2023-039",
      title: "Construction Delay Claim",
      parties: "BuildRight Inc vs City Development",
      status: "Hearing" as const,
      type: "Construction",
      date: "2023-09-28",
      stage: "Evidentiary Hearing",
    },
    {
      id: "ARB-2023-038",
      title: "Intellectual Property Dispute",
      parties: "Tech Innovations vs Global Software",
      status: "Filed" as const,
      type: "IP",
      date: "2023-09-22",
      stage: "Arbitrator Selection",
    },
    {
      id: "ARB-2023-035",
      title: "Employment Contract Dispute",
      parties: "John Doe vs Enterprise Corp",
      status: "Deliberation" as const,
      type: "Employment",
      date: "2023-08-17",
      stage: "Award Drafting",
    },
    {
      id: "ARB-2023-031",
      title: "International Trade Dispute",
      parties: "Global Exports Ltd vs Import Solutions",
      status: "Completed" as const,
      type: "International Trade",
      date: "2023-07-05",
      stage: "Award Issued",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <CaseList
          userRole={validatedRole as "admin" | "arbitrator" | "legal"}
          initialCases={mockCases}
        />
      </main>
    </>
  );
}
