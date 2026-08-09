"use client"

import { cn } from "@/lib/utils"

interface DotGridProgressProps {
  total: number
  completed: number
  title: string
  caption?: string
  footerLeft?: string
  footerRight?: string
  size?: "sm" | "lg"
  todayIndex?: number
  dotTitle?: (index: number) => string
  className?: string
}

export function DotGridProgress({
  total,
  completed,
  title,
  caption,
  footerLeft,
  footerRight,
  size = "lg",
  todayIndex,
  dotTitle,
  className,
}: DotGridProgressProps) {
  const dots = Array.from({ length: total })
  const dotSize = size === "lg" ? "w-2.5 h-2.5" : "w-1.5 h-1.5"
  const gap = size === "lg" ? "gap-1.5" : "gap-1"

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] p-5 bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between",
        size === "lg" ? "aspect-[4/3]" : "aspect-square",
        className,
      )}
    >
      <div>
        <div className="text-sm font-medium text-[var(--card-foreground)]">{title}</div>
        {caption && <div className="text-xs text-[var(--muted-foreground)]">{caption}</div>}
      </div>

      <div className={cn("flex flex-wrap content-start overflow-hidden", gap)}>
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

      {(footerLeft || footerRight) && (
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] pt-2">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      )}
    </div>
  )
}
