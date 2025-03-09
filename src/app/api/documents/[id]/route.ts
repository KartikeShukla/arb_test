import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Get document metadata
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", params.id)
      .single();

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 404 });
    }

    // Get signed URL for the document
    const { data: urlData, error: urlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.storage_path, 60); // URL valid for 60 seconds

    if (urlError) {
      return NextResponse.json({ error: urlError.message }, { status: 500 });
    }

    return NextResponse.json({
      document: {
        ...document,
        url: urlData.signedUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
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

    // Get document metadata
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", params.id)
      .single();

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 404 });
    }

    // Check if user is authorized to delete this document
    if (document.uploaded_by !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this document" },
        { status: 403 },
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.storage_path]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 },
      );
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", params.id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
