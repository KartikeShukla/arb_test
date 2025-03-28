"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/config/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    if (!supabase) {
      router.push("/")
      return
    }
    
    const handleAuthCallback = async () => {
      if (!supabase) {
        console.error("Supabase client is not available");
        return;
      }
      
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error("Error during authentication:", error.message)
      }
      
      // Redirect to the home page after successful authentication
      router.push("/")
    }
    
    handleAuthCallback()
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Authentication...</h1>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
} 