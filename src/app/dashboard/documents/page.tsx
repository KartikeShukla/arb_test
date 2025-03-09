import DashboardNavbar from "@/components/dashboard-navbar";
import DocumentRepository from "@/components/dashboard/document-repository";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function DocumentsPage({
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

  // Mock document data - in a real application, these would be fetched from the database
  const mockDocuments = [
    {
      id: "doc-001",
      name: "Statement of Claim.pdf",
      caseId: "ARB-2023-042",
      type: "Statement of Claim",
      uploadedBy: "John Smith",
      uploadDate: "2023-10-15",
      size: "2.4 MB",
      version: "1.0",
    },
    {
      id: "doc-002",
      name: "Contract Agreement.pdf",
      caseId: "ARB-2023-042",
      type: "Evidence",
      uploadedBy: "John Smith",
      uploadDate: "2023-10-15",
      size: "1.8 MB",
      version: "1.0",
    },
    {
      id: "doc-003",
      name: "Statement of Defense.pdf",
      caseId: "ARB-2023-042",
      type: "Statement of Defense",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2023-10-28",
      size: "3.1 MB",
      version: "1.0",
    },
    {
      id: "doc-004",
      name: "Procedural Order No. 1.pdf",
      caseId: "ARB-2023-042",
      type: "Procedural Order",
      uploadedBy: "Arbitrator Panel",
      uploadDate: "2023-11-05",
      size: "0.8 MB",
      version: "1.0",
    },
    {
      id: "doc-005",
      name: "Expert Witness Report.pdf",
      caseId: "ARB-2023-039",
      type: "Expert Report",
      uploadedBy: "Dr. Robert Chen",
      uploadDate: "2023-10-22",
      size: "5.2 MB",
      version: "1.0",
    },
    {
      id: "doc-006",
      name: "Final Award.pdf",
      caseId: "ARB-2023-031",
      type: "Award",
      uploadedBy: "Arbitrator Panel",
      uploadDate: "2023-09-15",
      size: "1.5 MB",
      version: "1.0",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <DocumentRepository
          userRole={validatedRole as "admin" | "arbitrator" | "legal"}
          initialDocuments={mockDocuments}
        />
      </main>
    </>
  );
}
