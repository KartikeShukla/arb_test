import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// API endpoint to test document policies
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

    // Test inserting a document
    const testDoc = {
      name: "Test Document",
      case_id: "TEST-CASE",
      file_type: "text/plain",
      uploaded_by: user.id,
      file_size: 100,
      storage_path: "test/test.txt",
      status: "test",
      version: "1.0",
      upload_date: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from("documents")
      .insert(testDoc)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: insertError.message,
          details: {
            code: insertError.code,
            hint: insertError.hint,
            details: insertError.details,
          },
          user_id: user.id,
        },
        { status: 500 },
      );
    }

    // Clean up the test document
    await supabase.from("documents").delete().eq("id", insertData.id);

    return NextResponse.json({
      success: true,
      message: "RLS policies are working correctly",
      user_id: user.id,
    });
  } catch (error) {
    console.error("Error testing document policies:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
}
