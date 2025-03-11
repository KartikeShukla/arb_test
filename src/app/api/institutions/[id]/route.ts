import { createClient } from "../../../../../supabase/server";
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

    // Only admin or users from the same institution can view institution details
    if (
      userData.role !== "admin" &&
      (userData.role !== "institution" || userData.institution_id !== params.id)
    ) {
      return NextResponse.json(
        { error: "Not authorized to view this institution" },
        { status: 403 },
      );
    }

    // Get institution details
    const { data: institution, error: institutionError } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", params.id)
      .single();

    if (institutionError) {
      return NextResponse.json(
        { error: institutionError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ institution });
  } catch (error) {
    console.error("Error fetching institution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();
    const data = await request.json();

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

    // Check if user is admin
    const { data: userData, error: userRoleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRoleError) {
      return NextResponse.json(
        { error: "Error fetching user role" },
        { status: 500 },
      );
    }

    // Only admin can update institutions
    if (userData.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to update institutions" },
        { status: 403 },
      );
    }

    // Update institution
    const { data: updatedInstitution, error: updateError } = await supabase
      .from("institutions")
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ institution: updatedInstitution });
  } catch (error) {
    console.error("Error updating institution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Check if user is admin
    const { data: userData, error: userRoleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRoleError) {
      return NextResponse.json(
        { error: "Error fetching user role" },
        { status: 500 },
      );
    }

    // Only admin can delete institutions
    if (userData.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete institutions" },
        { status: 403 },
      );
    }

    // Delete institution
    const { error: deleteError } = await supabase
      .from("institutions")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting institution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
