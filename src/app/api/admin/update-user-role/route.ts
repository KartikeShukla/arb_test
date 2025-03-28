import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UserRole } from '@/types'; // Keep UserRole for input validation, but DB uses role IDs

// No global client initialization outside of the request handler

export async function POST(request: Request) {
  console.log('🔄 API: update-user-role route handler started');
  
  try {
    // Always use the cookies within the request handler
    const cookieStore = cookies();
    console.log('🔄 API: cookie store initialized');
    
    // Create admin client with service role key for privileged operations - this is critical for role updates
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
    console.log('🔄 API: supabaseAdmin created successfully with service role key');
    
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
    
    // 1. Verify if the requesting user is authenticated and an admin
    console.log('🔄 API: Checking authentication...');
    const { data: { session }, error: sessionError } = await supabaseServerClient.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("API Auth Error:", sessionError);
      return NextResponse.json({ success: false, error: 'Unauthorized: Not authenticated' }, { status: 401 });
    }

    const requestingUserId = session.user.id;
    console.log(`🔄 API: Authenticated user ID: ${requestingUserId}`);

    // 2. Parse request body
    const body = await request.json();
    console.log(`🔄 API: Request body: ${JSON.stringify(body)}`);
    
    const { userId, newRole } = body as { userId: string; newRole: UserRole };

    if (!userId) {
      console.error('🔄 API: Missing userId in request body');
      return NextResponse.json({ success: false, error: 'Missing required field: userId' }, { status: 400 });
    }
    
    if (!newRole) {
      console.error('🔄 API: Missing newRole in request body');
      return NextResponse.json({ success: false, error: 'Missing required field: newRole' }, { status: 400 });
    }
    
    // Convert newRole to title case to match database format (Admin, User, Arbitrator)
    const formattedNewRole = newRole.charAt(0).toUpperCase() + newRole.slice(1).toLowerCase();
    console.log(`🔄 API: Processing role change: ${newRole} → ${formattedNewRole}`);

    if (!['admin', 'user', 'arbitrator'].includes(newRole.toLowerCase())) {
      console.error(`🔄 API: Invalid role value: ${newRole}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid role: must be admin, user, or arbitrator' 
      }, { status: 400 });
    }
    
    // Prevent admin from changing their own role via this API
    if (userId === requestingUserId) {
      console.error('🔄 API: User attempted to change their own role');
      return NextResponse.json({ success: false, error: 'Cannot change your own role via this method.' }, { status: 400 });
    }

    // Check if the requesting user is an admin
    console.log('🔄 API: Verifying admin status of requesting user...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requestingUserId)
      .single();

    if (adminError) {
      console.error("API Admin Role Fetch Error:", adminError);
      return NextResponse.json({ success: false, error: 'Failed to verify admin role' }, { status: 500 });
    }

    console.log(`🔄 API: Requesting user role from DB: ${JSON.stringify(adminData)}`);
    
    if (!adminData || adminData.role !== 'Admin') {
      console.warn(`User ${requestingUserId} attempted admin action without admin role.`);
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('🔄 API: Admin verification successful');

    // 3. First check if the target user exists in profiles
    console.log(`🔄 API: Checking if target user ${userId} exists...`);
    const { data: targetUser, error: targetUserError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single();
      
    if (targetUserError) {
      console.error(`🔄 API: Error fetching target user: ${targetUserError.message}`);
      return NextResponse.json({ 
        success: false, 
        error: `User not found: ${targetUserError.message}` 
      }, { status: 404 });
    }
    
    if (!targetUser) {
      console.error(`🔄 API: Target user ${userId} not found`);
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    console.log(`🔄 API: Target user found. Current role: ${targetUser.role}`);
    
    // If the user already has the requested role, no update needed
    if (targetUser.role === formattedNewRole) {
      console.log(`🔄 API: User already has role ${formattedNewRole}, no update needed`);
      return NextResponse.json({ 
        success: true, 
        message: `User already has role ${formattedNewRole}`, 
        data: { userId, newRole: formattedNewRole, changed: false } 
      }, { status: 200 });
    }

    // 4. Update the user's role in the profiles table
    console.log(`🔄 API: Updating role in profiles table for user ${userId} to ${formattedNewRole}`);
    
    // Start a database transaction
    const { error: beginTxError } = await supabaseAdmin.rpc('begin_transaction');
    if (beginTxError) {
      console.error(`🔄 API: Error beginning transaction: ${beginTxError.message}`);
      // Continue without transaction if not supported
    } else {
      console.log('🔄 API: Transaction started');
    }
    
    const { data: updatedUserRole, error: updateRoleError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: formattedNewRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateRoleError) {
      console.error('🔄 API: Error updating user role in profiles table:', updateRoleError);
      
      // Rollback transaction if it was started
      try {
        await supabaseAdmin.rpc('rollback_transaction');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `Failed to update user role: ${updateRoleError.message}` 
      }, { status: 500 });
    }

    console.log(`🔄 API: Successfully updated profiles table: ${JSON.stringify(updatedUserRole)}`);

    // 5. Sync with user_roles table - upsert to handle both update and insert cases
    console.log(`🔄 API: Syncing role in user_roles table for user ${userId}`);
    
    try {
      const { data: upsertResult, error: upsertError } = await supabaseAdmin
        .from('user_roles')
        .upsert(
          { 
            user_id: userId, 
            role: formattedNewRole,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'user_id',
            ignoreDuplicates: false
          }
        )
        .select();
      
      if (upsertError) {
        console.error('🔄 API: Error upserting to user_roles table:', upsertError);
        // Log error but continue since profiles table was updated successfully
      } else {
        console.log(`🔄 API: Successfully synced user_roles table: ${JSON.stringify(upsertResult)}`);
      }
    } catch (syncError) {
      console.error('🔄 API: Exception during user_roles sync:', syncError);
      // Continue since the main update in profiles was successful
    }

    // 6. Try to record the change in role_changes table if it exists
    console.log(`🔄 API: Attempting to record role change in role_changes table`);
    
    try {
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('role_changes')
        .insert({
          user_id: userId,
          email: targetUser.email || '',
          new_role: formattedNewRole,
          updated_by: requestingUserId
        })
        .select()
        .single();

      if (insertError) {
        // Check if error is because table doesn't exist
        if (insertError.message.includes("relation") && insertError.message.includes("does not exist")) {
          console.log('🔄 API: role_changes table does not exist, skipping notification');
        } else {
          console.error('🔄 API: Error inserting role change notification:', insertError);
        }
        // Don't fail the request, as the main profile update was successful
      } else {
        console.log('🔄 API: Role change notification created:', insertData);
      }
    } catch (broadcastError) {
      console.error('🔄 API: Error broadcasting role change:', broadcastError);
      // Continue since the main update was successful
    }

    // Commit transaction if it was started
    const { error: commitTxError } = await supabaseAdmin.rpc('commit_transaction');
    if (commitTxError) {
      console.error(`🔄 API: Error committing transaction: ${commitTxError.message}`);
      // Transaction might not be supported, but updates were already made
    } else {
      console.log('🔄 API: Transaction committed successfully');
    }

    console.log(`🔄 API: Admin ${requestingUserId} successfully updated role for user ${userId} to ${formattedNewRole}`);

    // 7. Return success response with the formatted role
    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${formattedNewRole}.`, 
      data: { userId, newRole: formattedNewRole, changed: true } 
    }, { status: 200 });

  } catch (error) {
    console.error('🔄 API: Unhandled error updating user role:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
