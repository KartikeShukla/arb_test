"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/config/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }
    
    // Check active session
    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession()
      
      setSession(activeSession)
      setUser(activeSession?.user ?? null)
      setIsLoading(false)
    }
    
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setIsLoading(false)
    })
    
    return () => {
      subscription?.unsubscribe()
    }
  }, [])
  
  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }
  
  const value = {
    user,
    session,
    isLoading,
    signOut
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
} 