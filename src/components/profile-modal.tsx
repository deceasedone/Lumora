"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { ProductivityLogo } from "./ui/ProductivityLogo"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter()
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchUser()
    }
  }, [isOpen])
  
  const handleSignOut = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    router.push("/auth")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--card-foreground)]">Profile</h2>
          <button 
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center">
                <ProductivityLogo size={96} />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[var(--card-foreground)]">{user?.name || 'Loading...'}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{user?.email || 'Loading...'}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
