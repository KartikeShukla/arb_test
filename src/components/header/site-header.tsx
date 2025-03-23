"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"
import { UserButton } from "@/components/auth/user-button"
import { useAuth } from "@/components/auth/auth-provider" 

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, isLoading } = useAuth()
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  const openAuthModal = () => {
    setAuthModalOpen(true)
  }
  
  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header className="w-full bg-white shadow-sm z-40 sticky top-0">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary font-playfair font-bold text-xl">
              Indian Arbitration
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Authentication / User Profile */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <UserButton />
            ) : (
              <Button 
                variant="default" 
                className="bg-primary-dark text-white hover:bg-primary-dark/90"
                onClick={openAuthModal}
              >
                Sign Up
              </Button>
            )}
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 rounded-md p-0"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Toggle Menu</span>
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 mt-4 border-t">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {!user && !isLoading && (
                <Button 
                  variant="default" 
                  className="bg-primary-dark text-white hover:bg-primary-dark/90 mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal()
                  }}
                >
                  Sign Up
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </header>
  )
} 