import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    // Check if user is admin or institution admin
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

    // Validate required fields
    if (!data.email || !data.password || !data.full_name || !data.role) {
      return NextResponse.json(
        { error: "Email, password, full name, and role are required" },
        { status: 400 },
      );
    }

    // Validate institution_id
    if (!data.institution_id && data.role !== "admin") {
      return NextResponse.json(
        { error: "Institution ID is required for non-admin users" },
        { status: 400 },
      );
    }

    // Check permissions
    if (userData.role === "admin") {
      // Admin can create any user
    } else if (userData.role === "institution") {
      // Institution admin can only create users for their institution
      if (userData.institution_id !== data.institution_id) {
        return NextResponse.json(
          { error: "Not authorized to create users for this institution" },
          { status: 403 },
        );
      }

      // Institution admin can't create admin users
      if (data.role === "admin" || data.role === "institution") {
        return NextResponse.json(
          {
            error: "Not authorized to create admin or institution admin users",
          },
          { status: 403 },
        );
      }
    } else {
      // Other users can't create users
      return NextResponse.json(
        { error: "Not authorized to create users" },
        { status: 403 },
      );
    }

    // Create user in Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        name: data.full_name,
        full_name: data.full_name,
        email: data.email,
        user_id: authData.user.id,
        token_identifier: authData.user.id,
        role: data.role,
        institution_id: data.institution_id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ user: profile });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
