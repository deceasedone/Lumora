"use client"

import { useEffect, useState } from "react"
import { DotGridProgress } from "@/components/dot-grid-progress"

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function YearWidget() {
  const [data, setData] = useState<{
    year: number
    total: number
    elapsed: number
    left: number
  } | null>(null)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const start = new Date(year, 0, 1)
    const end = new Date(year + 1, 0, 1)
    const total = Math.round((end.getTime() - start.getTime()) / 86400000)
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 86400000)
    setData({ year, total, elapsed, left: total - elapsed })
  }, [])

  if (!data) {
    return (
      <div className="rounded-[var(--radius)] p-5 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center h-40">
        <span className="text-xs text-[var(--muted-foreground)]">Loading…</span>
      </div>
    )
  }

  const dotTitle = (index: number) => {
    const d = new Date(data.year, 0, 1 + index)
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <DotGridProgress
      total={data.total}
      completed={data.elapsed}
      todayIndex={data.elapsed}
      dotTitle={dotTitle}
      title="Time Remaining"
      caption={`Year · ${data.year}${isLeapYear(data.year) ? " (leap)" : ""}`}
      size="xs"
      footerLeft={`${data.elapsed} days elapsed`}
      footerRight={`${data.left} days left`}
      className="aspect-auto"
    />
  )
}
