"use client"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from "react"

interface DotGridProgressProps {
  total: number
  completed: number
  title: string
  caption?: string
  footerLeft?: string
  footerRight?: string
  /** @deprecated sizing is now computed automatically to fit the container — no longer used, kept so existing callers don't break */
  size?: "xs" | "sm" | "md" | "lg"
  todayIndex?: number
  dotTitle?: (index: number) => string
  className?: string
  headerRight?: React.ReactNode
}

const GAP = 3 // px
const MAX_DOT_SIZE = 26 // px — stops low-count views (e.g. Week's 7 dots) from ballooning to fill the whole box

export function DotGridProgress({
  total,
  completed,
  title,
  caption,
  footerLeft,
  footerRight,
  todayIndex,
  dotTitle,
  className,
  headerRight,
}: DotGridProgressProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{ cols: number; dotSize: number } | null>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width <= 0 || height <= 0 || total <= 0) return

      const idealCols = Math.sqrt((total * width) / height)
      const cols = Math.min(total, Math.max(1, Math.round(idealCols)))
      const rows = Math.ceil(total / cols)

      const cellW = (width - (cols - 1) * GAP) / cols
      const cellH = (height - (rows - 1) * GAP) / rows
      const dotSize = Math.max(2, Math.min(MAX_DOT_SIZE, Math.floor(Math.min(cellW, cellH))))

      setLayout({ cols, dotSize })
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(el)
    return () => observer.disconnect()
  }, [total])

  const dots = Array.from({ length: total })

  return (
    <div
      className={cn(
        "rounded-[var(--radius)] p-1.5 px-2.5 bg-[var(--card)] border border-[var(--border)] flex flex-col h-full w-full overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          <span className="text-[12px] font-bold text-[var(--card-foreground)] whitespace-nowrap">{title}</span>
          {caption && <span className="text-[9.5px] font-medium text-[var(--muted-foreground)] truncate">{caption}</span>}
        </div>
        {headerRight && <div className="shrink-0 ml-2">{headerRight}</div>}
      </div>

      <div ref={gridRef} className="flex-1 min-h-0 overflow-hidden flex items-center justify-center">
        {layout && (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, ${layout.dotSize}px)`,
              gap: `${GAP}px`,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {dots.map((_, i) => (
              <div
                key={i}
                title={dotTitle ? dotTitle(i) : undefined}
                style={{ width: layout.dotSize, height: layout.dotSize }}
                className={cn(
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
        )}
      </div>

      {(footerLeft || footerRight) && (
        <div className="flex justify-between text-[8.5px] tracking-wide font-medium text-[var(--muted-foreground)] pt-0.5 mt-auto shrink-0 border-t border-[var(--border)]/40">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      )}
    </div>
  )
}