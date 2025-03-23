"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { LogOut, User } from "lucide-react"
import { useState } from "react"

export function UserButton() {
  const { user, signOut, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  // When loading, show a placeholder
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full">
        <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
      </Button>
    )
  }
  
  // When not logged in, show nothing (should be handled by the parent component)
  if (!user) {
    return null
  }
  
  // User's initials or first letter of email
  const userInitial = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.charAt(0)
    : user.email?.charAt(0) || "U"
    
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 rounded-full border border-gray-200"
        onClick={toggleMenu}
      >
        <span className="font-semibold text-sm">{userInitial}</span>
      </Button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <p className="font-medium">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="text-gray-500 truncate">{user.email}</p>
            </div>
            
            <button
              onClick={() => {
                signOut()
                setIsMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 