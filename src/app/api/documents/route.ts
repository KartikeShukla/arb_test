import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("upload_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ documents: data });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const caseId = formData.get("caseId") as string;

    if (!file || !name || !caseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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

    // 1. Check if bucket exists, if not create it
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    if (bucketsError) {
      return NextResponse.json(
        { error: "Error checking storage buckets" },
        { status: 500 },
      );
    }

    const documentsBucketExists = buckets.some(
      (bucket) => bucket.name === "documents",
    );
    if (!documentsBucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket(
        "documents",
        {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        },
      );

      if (createBucketError) {
        return NextResponse.json(
          { error: "Could not create storage bucket" },
          { status: 500 },
        );
      }
    }

    // 2. Upload file to storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${caseId}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 },
      );
    }

    // 2. Insert metadata into database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        name: name,
        case_id: caseId,
        file_type: file.type,
        uploaded_by: user.id,
        file_size: file.size,
        storage_path: filePath,
        status: "active",
        version: "1.0",
        upload_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      // Try to clean up the uploaded file
      await supabase.storage.from("documents").remove([filePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
