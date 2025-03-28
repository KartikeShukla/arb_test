"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/config/supabase"
import { toast } from "@/components/ui/use-toast"

// Define permissions type
type Permission = 'read:cases' | 'write:cases' | 'manage:users' | 'view:admin-dashboard';

type UserRole = "admin" | "user" | "arbitrator"

// Map roles to permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  'admin': ['read:cases', 'write:cases', 'manage:users', 'view:admin-dashboard'],
  'user': ['read:cases', 'write:cases'],
  'arbitrator': ['read:cases', 'write:cases']
};

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  userRole: UserRole | null
  isAdmin: boolean
  hasPermission: (permission: Permission) => boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  
  // Function to fetch user role from database - with useCallback
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    if (!supabase) return null
    
    try {
      console.log(`Fetching role for user ${userId}`);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error || !data) {
        console.error("Error fetching user role:", error)
        return null
      }
      
      console.log(`Fetched role for user ${userId}:`, data.role);
      return data.role as UserRole
    } catch (err) {
      console.error("Exception fetching user role:", err)
      return null
    }
  }, [])
  
  const updateSessionAndUser = useCallback(async (newSession: Session | null) => {
    setSession(newSession)
    setUser(newSession?.user ?? null)
    
    // If user is logged in, fetch role
    if (newSession?.user) {
      const role = await fetchUserRole(newSession.user.id)
      setUserRole(role)
    } else {
      setUserRole(null)
    }
    
    setIsLoading(false)
  }, [fetchUserRole])
  
  // Set up realtime subscription for role changes
  useEffect(() => {
    if (!supabase || !user) return
    
    console.log('Setting up realtime subscription for role changes');

    // Subscribe to role changes for the current user
    const channel = supabase
      .channel('public:role_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'role_changes',
        filter: `user_id=eq.${user.id}`,
      }, async (payload) => {
        console.log('Received role change notification:', payload);
        
        // Extract the new role from the payload
        const { new_role } = payload.new as { new_role: UserRole };
        
        if (new_role) {
          console.log(`User role changed to: ${new_role}`);
          
          // Update the user role in state
          setUserRole(new_role);
          
          // Notify the user about their role change
          toast({
            title: "Your access level has changed",
            description: `Your role has been updated to ${new_role}. The page will refresh to apply changes.`,
          });
          
          // Refresh the page after a short delay to ensure user sees the toast
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      })
      .subscribe((status) => {
        console.log('Role changes subscription status:', status);
      });

    // Cleanup function
    return () => {
      console.log('Unsubscribing from role changes');
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, toast]);
  
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }
    
    // Check active session
    const checkSession = async () => {
      if (!supabase) return
      
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession()
        await updateSessionAndUser(activeSession)
      } catch (err) {
        console.error("Error checking session:", err)
        setIsLoading(false)
      }
    }
    
    checkSession()
    
    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | undefined
    
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        await updateSessionAndUser(newSession)
      })
      
      subscription = data.subscription
    } catch (err) {
      console.error("Error setting up auth state change listener:", err)
      setIsLoading(false)
    }
    
    // Cleanup subscription
    return () => {
      subscription?.unsubscribe()
    }
  }, [updateSessionAndUser])
  
  const signOut = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      setUserRole(null)
    } catch (err) {
      console.error("Error during sign out:", err)
    }
  }
  
  // Helper to check if user has specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!userRole) return false
    return rolePermissions[userRole].includes(permission)
  }, [userRole])
  
  const value = {
    user,
    session,
    isLoading,
    userRole,
    isAdmin: userRole === "admin",
    hasPermission,
    signOut
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 