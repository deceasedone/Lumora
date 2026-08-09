"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface DotGridProgressProps {
  total: number
  completed: number
  title: string
  caption?: string
  footerLeft?: string
  footerRight?: string
  size?: "xs" | "sm" | "md" | "lg"
  todayIndex?: number
  dotTitle?: (index: number) => string
  className?: string
  headerRight?: React.ReactNode
}

export function DotGridProgress({
  total,
  completed,
  title,
  caption,
  footerLeft,
  footerRight,
  size = "xs",
  todayIndex,
  dotTitle,
  className,
  headerRight
}: DotGridProgressProps) {
  const dots = Array.from({ length: total })
  
  // Perfectly calibrated sizes so they fill the space without causing a scrollbar
  const dotSize = 
    size === "lg" ? "w-8 h-8 sm:w-10 sm:h-10" :       // Week (7 dots)
    size === "md" ? "w-4 h-4 sm:w-5 sm:h-5" :         // Day (24 dots)
    size === "sm" ? "w-2.5 h-2.5 sm:w-3 sm:h-3" :     // Hour (60 dots) - Significantly larger now!
    "w-[3px] h-[3px] sm:w-[3.5px] sm:h-[3.5px]"       // Year (365 dots)
    
  const gap = 
    size === "lg" ? "gap-3 sm:gap-4" : 
    size === "md" ? "gap-1.5 sm:gap-2" : 
    size === "sm" ? "gap-1 sm:gap-1.5" : 
    "gap-[2px]"

  return (
    <div
      className={cn(
        // Reduced top/bottom padding to give the grid more vertical room
        "rounded-[var(--radius)] p-2 px-3 bg-[var(--card)] border border-[var(--border)] flex flex-col h-full w-full overflow-hidden",
        className,
      )}
    >
      {/* HEADER: Smaller fonts, tighter margins */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          <span className="text-[12px] font-bold text-[var(--card-foreground)] whitespace-nowrap">{title}</span>
          {caption && <span className="text-[9.5px] font-medium text-[var(--muted-foreground)] truncate">{caption}</span>}
        </div>
        {headerRight && <div className="shrink-0 ml-2">{headerRight}</div>}
      </div>

      {/* DOT GRID: overflow-hidden prevents the scrollbar, content-start packs them perfectly */}
      <div className={cn("flex-1 overflow-hidden flex flex-wrap content-start", gap)}>
        {dots.map((_, i) => (
          <div
            key={i}
            title={dotTitle ? dotTitle(i) : undefined}
            className={cn(
              dotSize,
              "rounded-full transition-colors",
              i === todayIndex
                ? "bg-[var(--accent)] ring-2 ring-[var(--accent)]/40"
                : i < completed
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--card-foreground)]/10",
            )}
          />
        ))}
      </div>

      {/* FOOTER: Reduced padding above the text, smaller font size */}
      {(footerLeft || footerRight) && (
        <div className="flex justify-between text-[8.5px] tracking-wide font-medium text-[var(--muted-foreground)] pt-1 mt-auto shrink-0 border-t border-[var(--border)]/40">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      )}
    </div>
  )
}