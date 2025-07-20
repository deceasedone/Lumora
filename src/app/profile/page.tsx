"use client"

import Link from "next/link"
import { ChevronLeft, Clock, Flame, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LumoraLogo } from "@/components/lumora"
import "@/styles/themes.css"

// Dummy data for the profile page
const user = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatar: "https://i.pravatar.cc/150?u=alexdoe",
}

const weeklyStats = [
  { day: "Mon", time: 3600000 }, // 1 hour
  { day: "Tue", time: 7200000 }, // 2 hours
  { day: "Wed", time: 5400000 }, // 1.5 hours
  { day: "Thu", time: 9000000 }, // 2.5 hours
  { day: "Fri", time: 10800000 }, // 3 hours
  { day: "Sat", time: 2700000 }, // 0.75 hours
  { day: "Sun", time: 6300000 }, // 1.75 hours
]

const totalFocusTime = 45000000 // 12.5 hours
const totalSessions = 25
const currentStreak = 5

export default function ProfilePage() {
  const maxTime = Math.max(...weeklyStats.map((s) => s.time), 1) // Avoid division by zero

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="flex h-16 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <LumoraLogo />
          <h1 className="text-xl font-semibold">Profile & Stats</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
        {/* User Info Card */}
        <div className="mb-8 flex flex-col items-center gap-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-24 w-24 rounded-full border-2 border-[var(--primary)]"
          />
          <div>
            <h2 className="text-center text-2xl font-bold sm:text-left">
              {user.name}
            </h2>
            <p className="text-center text-[var(--muted-foreground)] sm:text-left">
              {user.email}
            </p>
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-[var(--primary)]" />
            <div className="text-2xl font-bold">
              {(totalFocusTime / 3600000).toFixed(1)}h
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">Total Focus</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Total Sessions
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center">
            <Flame className="mx-auto mb-2 h-8 w-8 text-orange-500" />
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Current Streak
            </p>
          </div>
        </div>

        {/* Weekly Focus Chart */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="mb-6 text-lg font-semibold">This Week's Focus</h3>
          <div className="flex h-64 items-end justify-between gap-2 text-center">
            {weeklyStats.map((stat) => (
              <div
                key={stat.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-[var(--primary)] transition-all duration-500 hover:bg-[var(--accent)]"
                  style={{ height: `${(stat.time / maxTime) * 100}%` }}
                />
                <p className="text-xs font-medium text-[var(--muted-foreground)]">
                  {stat.day}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}