"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Sun, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSunTimes, type SunTimes } from "@/utils/solar"
import { getSetting, setSetting } from "@/utils/idb.util"

interface Coords {
  lat: number
  lng: number
}

const FALLBACK_COORDS: Coords = { lat: 28.6139, lng: 77.209 } // neutral fallback — New Delhi
const GEO_SETTING_KEY = "daylightCoords"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

function formatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDuration(ms: number) {
  const totalMinutes = Math.max(0, Math.round(ms / 60000))
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

export function DaylightWidget() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [locationSource, setLocationSource] = useState<"geo" | "cached" | "fallback" | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cached = await getSetting<Coords>(GEO_SETTING_KEY)
      if (cached && !cancelled) {
        setCoords(cached)
        setLocationSource("cached")
      }

      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return
            const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            setCoords(next)
            setLocationSource("geo")
            setSetting(GEO_SETTING_KEY, next)
          },
          () => {
            if (cancelled || cached) return
            setCoords(FALLBACK_COORDS)
            setLocationSource("fallback")
          },
          { timeout: 8000 },
        )
      } else if (!cached) {
        setCoords(FALLBACK_COORDS)
        setLocationSource("fallback")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  if (!coords || !now) {
    return (
      <div className="rounded-[var(--radius)] p-5 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center h-40">
        <span className="text-xs text-[var(--muted-foreground)]">Loading daylight…</span>
      </div>
    )
  }

  const sun: SunTimes = getSunTimes(now, coords.lat, coords.lng)

  let content: ReactNode
  let headerRight: ReactNode

  if (sun.polar === "day") {
    headerRight = <span className="text-xs text-[var(--muted-foreground)]">Sun never sets today</span>
    content = (
      <div className="flex items-center justify-center flex-1 text-[var(--accent)]">
        <Sun className={cn("w-8 h-8", !reducedMotion && "animate-pulse")} />
      </div>
    )
  } else if (sun.polar === "night" || !sun.sunrise || !sun.sunset) {
    headerRight = <span className="text-xs text-[var(--muted-foreground)]">Sun never rises today</span>
    content = (
      <div className="flex items-center justify-center flex-1 text-[var(--muted-foreground)]">
        <span className="text-sm">Polar night</span>
      </div>
    )
  } else {
    const { sunrise, sunset } = sun
    const totalDaylight = sunset.getTime() - sunrise.getTime()
    const isBeforeSunrise = now < sunrise
    const isAfterSunset = now > sunset

    let percent: number
    let remainingLabel: string

    if (isBeforeSunrise) {
      percent = 0
      remainingLabel = `Sunrise in ${formatDuration(sunrise.getTime() - now.getTime())}`
    } else if (isAfterSunset) {
      percent = 100
      remainingLabel = "Night"
    } else {
      const elapsed = now.getTime() - sunrise.getTime()
      percent = Math.min(100, Math.max(0, (elapsed / totalDaylight) * 100))
      remainingLabel = `${formatDuration(sunset.getTime() - now.getTime())} remaining`
    }

    headerRight = <span className="text-xs text-[var(--muted-foreground)]">{remainingLabel}</span>

    content = (
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="relative h-1.5 rounded-full bg-[var(--muted)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
            style={{ width: `${percent}%` }}
          />
          {!isBeforeSunrise && !isAfterSunset && (
            <div
              className={cn(
                "absolute -top-2 -translate-x-1/2 text-[var(--accent)]",
                !reducedMotion && "animate-pulse",
              )}
              style={{ left: `${percent}%` }}
            >
              <Sun className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
          <span>{formatClock(sunrise)}</span>
          <span className="font-medium text-[var(--card-foreground)]">{formatClock(now)}</span>
          <span>{formatClock(sunset)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius)] p-5 bg-[var(--card)] border border-[var(--border)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--card-foreground)]">
          <Sun className="w-4 h-4 text-[var(--accent)]" />
          Daylight
        </div>
        {headerRight}
      </div>
      {content}
      {locationSource === "fallback" && (
        <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
          <MapPin className="w-3 h-3" />
          Enable location for accurate times
        </div>
      )}
    </div>
  )
}
