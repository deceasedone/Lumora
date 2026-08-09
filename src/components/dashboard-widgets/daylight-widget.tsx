"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Sun, Moon, TreePine, MapPin } from "lucide-react"
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
    headerRight = <span className="text-xs text-[var(--muted-foreground)] font-medium">Sun never sets today</span>
    content = (
      <div className="flex items-center justify-center flex-1 text-[var(--accent)]">
        <Sun className={cn("w-8 h-8", !reducedMotion && "animate-pulse")} />
      </div>
    )
  } else if (sun.polar === "night" || !sun.sunrise || !sun.sunset) {
    headerRight = <span className="text-xs text-[var(--muted-foreground)] font-medium">Sun never rises today</span>
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
      remainingLabel = `${formatDuration(sunset.getTime() - now.getTime())} left`
    }

    // New Header Right with the Moon Icon!
    headerRight = (
      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
        <span>{remainingLabel}</span>
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
      </div>
    )

    // Calculate arc positioning (0 to 100 for X, sine wave for Y)
    const sunX = percent;
    // Map 0-100 to 0-PI. Height peaks dynamically.
    const sunY = Math.sin((percent / 100) * Math.PI) * 80;

    content = (
      <div className="flex-1 flex flex-col justify-end mt-2 relative min-h-[50px]">
        {/* The Sky/Arc Scene */}
        <div className="relative w-full h-full flex-1 mb-1">
          {/* Sun Path Arc */}
          <svg 
            className="absolute bottom-0 w-full h-[150%] text-[var(--muted-foreground)]/20 pointer-events-none" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 50"
          >
            <path d="M 0 50 Q 50 -10 100 50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          
          {/* Moving Sun on the Arc */}
          <div 
            className="absolute flex items-center justify-center z-10"
            style={{ 
              left: `calc(${sunX}% - 12px)`, // Center the icon
              bottom: `calc(${sunY}%)`, 
              transition: "all 1s ease-out"
            }}
          >
            <Sun className={cn(
              "w-6 h-6 text-orange-400 drop-shadow-md", 
              !reducedMotion && !isBeforeSunrise && !isAfterSunset && "animate-[spin_10s_linear_infinite]",
              (isBeforeSunrise || isAfterSunset) && "opacity-40" // Dim it at night
            )} />
          </div>
        </div>

        {/* Ground / Horizon Line (Trees sit exactly ON this line now) */}
        <div className="relative h-4 border-b-[1.5px] border-[var(--border)]">
          <TreePine className="w-4 h-4 text-emerald-600/70 absolute bottom-0 left-[15%]" />
          <TreePine className="w-3 h-3 text-emerald-600/50 absolute bottom-0 left-[20%]" />
          <TreePine className="w-5 h-5 text-emerald-600/70 absolute bottom-0 right-[10%]" />
        </div>
        
        {/* Times physically placed BELOW the ground line so they don't overlap */}
        <div className="flex w-full justify-between text-[10px] text-[var(--muted-foreground)] font-mono pt-1.5 px-1">
          <span>{formatClock(sunrise)}</span>
          <span className="text-[var(--card-foreground)] font-bold">{formatClock(now)}</span>
          <span>{formatClock(sunset)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius)] p-3 sm:p-4 bg-[var(--card)] border border-[var(--border)] flex flex-col gap-1 h-full w-full overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        {/* Adjusted to font-medium to match right side */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--card-foreground)]">
          <Sun className="w-4 h-4 text-orange-400" />
          Daylight
        </div>
        {headerRight}
      </div>
      {content}
      {locationSource === "fallback" && (
        <div className="flex items-center justify-center gap-1 text-[9px] text-[var(--muted-foreground)] mt-1">
          <MapPin className="w-3 h-3" />
          Enable location for accurate times
        </div>
      )}
    </div>
  )
}
