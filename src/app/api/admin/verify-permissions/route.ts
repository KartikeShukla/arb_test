import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// API endpoint to verify admin permissions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required", authenticated: false },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: userData, error: userRoleError } = await supabase
      .from("users")
      .select("role, email, full_name")
      .eq("id", user.id)
      .single();

    if (userRoleError) {
      return NextResponse.json(
        {
          error: "Error fetching user role",
          authenticated: true,
          isAdmin: false,
        },
        { status: 500 },
      );
    }

    // Check if the user is an admin
    const isAdmin = userData?.role === "admin";

    // Test admin permissions by trying to access institutions
    let institutionsAccessible = false;
    if (isAdmin) {
      const { data: institutions, error: institutionsError } = await supabase
        .from("institutions")
        .select("id, name")
        .limit(1);

      institutionsAccessible = !institutionsError;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: userData?.email || user.email,
        role: userData?.role,
        name: userData?.full_name || user.user_metadata?.full_name,
      },
      isAdmin,
      permissions: {
        institutionsAccessible,
      },
    });
  } catch (error) {
    console.error("Error verifying admin permissions:", error);
    return NextResponse.json(
      { error: "Internal server error", authenticated: false, isAdmin: false },
      { status: 500 },
    );
  }
}
