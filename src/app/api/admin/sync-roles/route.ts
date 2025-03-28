import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  console.log('🔄 API: sync-roles route handler started');
  
  try {
    // Always use the cookies within the request handler
    const cookieStore = cookies();
    console.log('🔄 API: cookie store initialized');
    
    // Create admin client with service role key for privileged operations
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Create regular client for auth checks
    const supabaseServerClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Verify if the requesting user is authenticated and an admin
    const { data: { session }, error: sessionError } = await supabaseServerClient.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("API Auth Error:", sessionError);
      return NextResponse.json({ success: false, error: 'Unauthorized: Not authenticated' }, { status: 401 });
    }

    const requestingUserId = session.user.id;
    
    // Check if the requesting user is an admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requestingUserId)
      .single();

    if (adminError) {
      console.error("API Admin Role Fetch Error:", adminError);
      return NextResponse.json({ success: false, error: 'Failed to verify admin role' }, { status: 500 });
    }
    
    if (!adminData || adminData.role !== 'Admin') {
      console.warn(`User ${requestingUserId} attempted admin action without admin role.`);
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // First, get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role');
      
    if (profilesError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to fetch profiles: ${profilesError.message}` 
      }, { status: 500 });
    }
    
    // Check if user_roles table exists
    let userRolesExists = true;
    try {
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('user_id')
        .limit(1);
        
      if (error && error.message.includes('relation "user_roles" does not exist')) {
        userRolesExists = false;
      }
    } catch (error) {
      userRolesExists = false;
    }
    
    // If user_roles table doesn't exist, create it
    if (!userRolesExists) {
      try {
        await supabaseAdmin.rpc('create_user_roles_table');
        console.log('Created user_roles table');
      } catch (error) {
        console.error('Error creating user_roles table:', error);
        // Continue anyway - we'll handle this below
      }
    }
    
    // Sync all profiles with user_roles
    const results = {
      total: profiles.length,
      synced: 0,
      errors: 0,
      details: [] as Array<{ id: string, success: boolean, error?: string }>
    };
    
    for (const profile of profiles) {
      try {
        // Upsert to create or update user role
        const { error } = await supabaseAdmin
          .from('user_roles')
          .upsert(
            {
              user_id: profile.id,
              role: profile.role || 'user', // Default to 'user' if null
              updated_at: new Date().toISOString()
            },
            {
              onConflict: 'user_id',
              ignoreDuplicates: false
            }
          );
          
        if (error) {
          console.error(`Error syncing role for user ${profile.id}:`, error);
          results.errors++;
          results.details.push({ 
            id: profile.id, 
            success: false, 
            error: error.message 
          });
        } else {
          results.synced++;
          results.details.push({ id: profile.id, success: true });
        }
      } catch (error) {
        console.error(`Exception syncing role for user ${profile.id}:`, error);
        results.errors++;
        results.details.push({ 
          id: profile.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Synced ${results.synced} of ${results.total} users. Errors: ${results.errors}`,
      data: results
    });

  } catch (error) {
    console.error('API Error syncing roles:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 