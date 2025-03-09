import { createClient } from "../../../../../../supabase/server";
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

    // Get the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("documents")
      .download(document.storage_path);

    if (fileError) {
      return NextResponse.json({ error: fileError.message }, { status: 500 });
    }

    // Determine content type
    const contentType = document.file_type || "application/octet-stream";

    // Create a response with the file data
    const response = new NextResponse(fileData, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${document.name}"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error downloading document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
