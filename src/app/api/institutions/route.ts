import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin
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

    let institutions;

    if (userData.role === "admin") {
      // Admin can see all institutions
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      institutions = data;
    } else if (userData.role === "institution" && userData.institution_id) {
      // Institution admin can only see their own institution
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .eq("id", userData.institution_id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      institutions = [data];
    } else {
      // Other users can't see institutions
      return NextResponse.json(
        { error: "Not authorized to view institutions" },
        { status: 403 },
      );
    }

    return NextResponse.json({ institutions });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    // Only admin can create institutions
    if (userData.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to create institutions" },
        { status: 403 },
      );
    }

    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: "Institution name is required" },
        { status: 400 },
      );
    }

    // Create institution
    const { data: institution, error: createError } = await supabase
      .from("institutions")
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        created_by: user.id,
        status: data.status || "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ institution });
  } catch (error) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
