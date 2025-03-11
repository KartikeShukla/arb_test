import { createClient } from "../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin or belongs to the institution
    const { data: userData, error: userRoleError } = await supabase
      .from("users")
      .select("role, institution_id")
      .eq("id", user.id)
      .single();

    if (userRoleError) {
      return NextResponse.json(
        { error: "Error fetching user role" },
        { status: 500 },
      );
    }

    // Only admin or users from the same institution can view clients
    if (
      userData.role !== "admin" &&
      (userData.role !== "institution" || userData.institution_id !== params.id)
    ) {
      return NextResponse.json(
        { error: "Not authorized to view these clients" },
        { status: 403 },
      );
    }

    // Get clients for the institution
    const { data: clients, error: clientsError } = await supabase
      .from("users")
      .select("id, full_name, email, created_at")
      .eq("institution_id", params.id)
      .eq("role", "client");

    if (clientsError) {
      return NextResponse.json(
        { error: clientsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
