import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// API endpoint to check and create storage buckets
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user to verify admin status
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

    // List all buckets
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      return NextResponse.json(
        { error: bucketsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ buckets });
  } catch (error) {
    console.error("Error fetching storage buckets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// API endpoint to create a new bucket
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user to verify admin status
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

    const { bucketName, isPublic } = await request.json();

    if (!bucketName) {
      return NextResponse.json(
        { error: "Bucket name is required" },
        { status: 400 },
      );
    }

    // Check if bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (bucketExists) {
      return NextResponse.json(
        { message: `Bucket '${bucketName}' already exists` },
        { status: 200 },
      );
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic || false,
      fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Bucket '${bucketName}' created successfully`,
      data,
    });
  } catch (error) {
    console.error("Error creating storage bucket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
