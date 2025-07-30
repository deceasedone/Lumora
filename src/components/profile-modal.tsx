"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface ProfileModalProps {
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

export function ProfileModal({ isOpen, onClose, user, stats }: ProfileModalProps) {
  const router = useRouter()
  
  const handleSignOut = () => {
    localStorage.removeItem("authToken")
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
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[var(--card-foreground)]">{user.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--muted)]">
              <span className="text-2xl font-bold text-[var(--foreground)]">
                {(stats.totalFocus / 3600000).toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">Focus Time</span>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--muted)]">
              <span className="text-2xl font-bold text-[var(--foreground)]">{stats.totalSessions}</span>
              <span className="text-xs text-[var(--muted-foreground)]">Sessions</span>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-[var(--muted)]">
              <span className="text-2xl font-bold text-[var(--foreground)]">{stats.currentStreak}</span>
              <span className="text-xs text-[var(--muted-foreground)]">Day Streak</span>
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
      </div>
    </div>
  )
}
