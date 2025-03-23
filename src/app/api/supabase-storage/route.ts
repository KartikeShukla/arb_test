import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges using the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// This is safer for server-side API routes
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export async function POST(request: NextRequest) {
  try {
    const { bucketName } = await request.json();

    if (!bucketName) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing bucket name" 
      }, { status: 400 });
    }

    console.log(`Checking bucket '${bucketName}' status...`);

    // Check if the bucket exists
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket(bucketName);

    if (bucketError) {
      if (bucketError.message.includes('does not exist')) {
        return NextResponse.json({ 
          success: false, 
          message: `Bucket '${bucketName}' does not exist. Please contact an administrator for assistance.`,
          exists: false,
          isPublic: false
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: false, 
        message: `Error checking bucket: ${bucketError.message}`,
        exists: false,
        isPublic: false
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Bucket '${bucketName}' exists${bucketData.public ? ' and is public' : ' but is not public'}`,
      exists: true,
      isPublic: bucketData.public
    });

  } catch (error) {
    console.error("Error in supabase-storage API route:", error);
    return NextResponse.json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
} 