"use client"

import { useEffect, useState } from "react"
import { DotGridProgress } from "./dot-progress" // Ensure correct path!
import { ArrowRightLeft } from "lucide-react"

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const MODES = ["YEAR", "WEEK", "DAY", "HOUR"] as const
type Mode = typeof MODES[number]

export function YearWidget() {
  const [modeIndex, setModeIndex] = useState(0)
  const mode = MODES[modeIndex]

  const [data, setData] = useState<{
    total: number
    elapsed: number
    title: string
    caption: string
    footerLeft: string
    footerRight: string
    size: "xs" | "sm" | "md" | "lg"
  } | null>(null)

  useEffect(() => {
    const updateStats = () => {
      const now = new Date()
      let total = 0, elapsed = 0
      let title = "", caption = "", footerLeft = "", footerRight = ""
      let size: "xs" | "sm" | "md" | "lg" | "xl" = "md"

      if (mode === "YEAR") {
        const year = now.getFullYear()
        const start = new Date(year, 0, 1)
        const end = new Date(year + 1, 0, 1)
        total = Math.round((end.getTime() - start.getTime()) / 86400000)
        elapsed = Math.floor((now.getTime() - start.getTime()) / 86400000)
        
        title = "Time Remaining"
        caption = `Year · ${year}`
        footerLeft = `${elapsed} days elapsed`
        footerRight = `${total - elapsed} days left`
        size = "xs"
      } 
      else if (mode === "WEEK") {
        total = 7
        elapsed = now.getDay()
        
        title = "Time Remaining"
        caption = "This Week"
        footerLeft = `${elapsed} days elapsed`
        footerRight = `${total - elapsed} days left`
        size = "lg" // Mapped to new lg size
      } 
      else if (mode === "DAY") {
        total = 24
        elapsed = now.getHours()
        
        title = "Time Remaining"
        caption = "Today"
        footerLeft = `${elapsed} hrs elapsed`
        footerRight = `${total - elapsed} hrs left`
        size = "md" // Mapped to new md size
      } 
      else if (mode === "HOUR") {
        total = 60
        elapsed = now.getMinutes()
        
        title = "Time Remaining"
        caption = "Current Hour"
        footerLeft = `${elapsed} mins elapsed`
        footerRight = `${total - elapsed} mins left`
        size = "sm" // Mapped to new sm size
      }

      setData({ total, elapsed, title, caption, footerLeft, footerRight, size })
    }

    updateStats()
    // Update every 10 seconds to keep minutes completely live
    const interval = setInterval(updateStats, 10000)
    return () => clearInterval(interval)
  }, [mode])

  if (!data) {
    return (
      <div className="rounded-[var(--radius)] p-3 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center h-full w-full">
        <span className="text-xs text-[var(--muted-foreground)]">Loading…</span>
      </div>
    )
  }

  // Optional tooltips for dots
  const dotTitle = (index: number) => {
    if (mode === "YEAR") return `Day ${index + 1}`
    if (mode === "WEEK") return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][index]
    if (mode === "DAY") return `${index}:00`
    if (mode === "HOUR") return `Minute ${index + 1}`
    return ""
  }

  const switcherButton = (
    <button
      onClick={() => setModeIndex((prev) => (prev + 1) % MODES.length)}
      className="p-1 rounded-md bg-[var(--muted)]/50 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors text-[var(--muted-foreground)]"
      title="Switch View"
    >
      <ArrowRightLeft className="w-3.5 h-3.5" />
    </button>
  )

  return (
    <DotGridProgress
      total={data.total}
      completed={data.elapsed}
      todayIndex={data.elapsed}
      dotTitle={dotTitle}
      title={data.title}
      caption={data.caption}
      size={data.size}
      footerLeft={data.footerLeft}
      footerRight={data.footerRight}
      headerRight={switcherButton}
      className="h-full w-full aspect-auto"
    />
  )
}
