"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, X, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TIMEZONE_CITIES, getLocalTimezoneCity, type CityTimezone } from "@/data/timezones"
import { getSetting, setSetting } from "@/utils/idb.util"

const SETTING_KEY = "worldClockLocations"
const MAX_VISIBLE = 6

function getLocalDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
}

function getDayOffset(date: Date, timezone: string) {
  const here = getLocalDateKey(date, Intl.DateTimeFormat().resolvedOptions().timeZone)
  const there = getLocalDateKey(date, timezone)
  if (here === there) return 0
  return there > here ? 1 : -1
}

function formatClockFor(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function formatOffsetFor(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  }).formatToParts(date)
  const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? ""
  return offset.replace("GMT", "GMT ")
}

function isValidStoredLocations(data: unknown): data is CityTimezone[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item.city === "string" &&
        typeof item.timezone === "string" &&
        typeof item.country === "string" &&
        typeof item.flag === "string",
    )
  )
}

export function WorldClockWidget() {
  const [locations, setLocations] = useState<CityTimezone[] | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    ;(async () => {
      const stored = await getSetting<CityTimezone[]>(SETTING_KEY)
      if (isValidStoredLocations(stored) && stored.length > 0) {
        setLocations(stored)
      } else {
        const local = getLocalTimezoneCity()
        setLocations([local])
        setSetting(SETTING_KEY, [local])
      }
    })()
  }, [])

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const persist = (next: CityTimezone[]) => {
    setLocations(next)
    setSetting(SETTING_KEY, next)
  }

  const addLocation = (city: CityTimezone) => {
    if (!locations) return
    if (locations.some((l) => l.timezone === city.timezone && l.city === city.city)) return
    if (locations.length >= MAX_VISIBLE) return
    persist([...locations, city])
  }

  const removeLocation = (city: CityTimezone) => {
    if (!locations || locations.length <= 1) return
    persist(locations.filter((l) => !(l.timezone === city.timezone && l.city === city.city)))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return TIMEZONE_CITIES
    return TIMEZONE_CITIES.filter(
      (c) => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    )
  }, [search])

  if (!locations || !now) {
    return (
      <div className="rounded-[var(--radius)] p-3 sm:p-4 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center h-full w-56 shrink-0">
        <span className="text-xs text-[var(--muted-foreground)]">Loading…</span>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius)] p-3 sm:p-4 bg-[var(--card)] border border-[var(--border)] flex flex-col gap-2 h-full w-56 shrink-0 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--card-foreground)]">World Clock</span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-80 transition-opacity"
              aria-label="Add location"
              disabled={locations.length >= MAX_VISIBLE}
            >
              <Plus className="w-3 h-3" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add World Clock</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                autoFocus
                placeholder="Search city or country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
              {filtered.map((city) => {
                const alreadyAdded = locations.some(
                  (l) => l.timezone === city.timezone && l.city === city.city,
                )
                return (
                  <button
                    key={`${city.city}-${city.timezone}`}
                    onClick={() => {
                      addLocation(city)
                      setDialogOpen(false)
                      setSearch("")
                    }}
                    disabled={alreadyAdded || locations.length >= MAX_VISIBLE}
                    className="flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-left text-sm hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>{city.flag}</span>
                    <span className="text-[var(--card-foreground)]">{city.city}</span>
                    <span className="text-[var(--muted-foreground)] text-xs ml-auto">{city.country}</span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center text-xs text-[var(--muted-foreground)] py-6">No matches</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pr-1 pb-1">
        {locations.map((loc) => {
          const dayOffset = getDayOffset(now, loc.timezone)
          return (
            <div key={`${loc.city}-${loc.timezone}`} className="flex items-center justify-between group">
              <div className="flex items-center gap-1.5 min-w-0">
                <span>{loc.flag}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[var(--card-foreground)] truncate">{loc.city}</div>
                  <div className="text-[10px] text-[var(--muted-foreground)] truncate">
                    {loc.country} · {formatOffsetFor(now, loc.timezone)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-mono text-[var(--card-foreground)]">
                    {formatClockFor(now, loc.timezone)}
                  </div>
                  {dayOffset !== 0 && (
                    <div className="text-[9px] text-[var(--accent)]">
                      {dayOffset === 1 ? "Tomorrow" : "Yesterday"}
                    </div>
                  )}
                </div>
                {locations.length > 1 && (
                  <button
                    onClick={() => removeLocation(loc)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                    aria-label={`Remove ${loc.city}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
