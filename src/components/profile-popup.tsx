"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

type ProfilePopupProps = {
  isOpen: boolean
  onClose: () => void
  user: {
    name: string
    email: string
    avatar: string
  }
  stats: {
    totalFocus: number
    totalSessions: number
    currentStreak: number
  }
}

export function ProfilePopup({ isOpen, onClose, user, stats }: ProfilePopupProps) {
  const router = useRouter()
  
  const handleSignOut = () => {
    localStorage.removeItem("authToken")
    router.push("/auth")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={`./images.jpeg`}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
              <span className="text-2xl font-bold">
                {(stats.totalFocus / 3600000).toFixed(1)}h
              </span>
              <span className="text-xs text-muted-foreground">Focus Time</span>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
              <span className="text-2xl font-bold">{stats.totalSessions}</span>
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
              <span className="text-2xl font-bold">{stats.currentStreak}</span>
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
