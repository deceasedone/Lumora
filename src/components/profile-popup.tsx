"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ProductivityLogo } from "./ui/ProductivityLogo"

type ProfilePopupProps = {
  isOpen: boolean
  onClose: () => void
}

export function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
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
                <h3 className="text-xl font-semibold">{user?.name || 'Loading...'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || 'Loading...'}</p>
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
      </DialogContent>
    </Dialog>
  )
}
