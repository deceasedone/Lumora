// Lightweight sunrise/sunset calculator (NOAA "Sunrise equation", no dependency)
// Accuracy: within a few minutes — sufficient for a UI widget.

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function fromJulian(j: number): Date {
  return new Date((j - 2440587.5) * 86400000)
}

export interface SunTimes {
  sunrise: Date | null
  sunset: Date | null
  /** "day" = sun never sets (polar day), "night" = sun never rises (polar night), null = normal */
  polar: "day" | "night" | null
}

export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const JD = toJulian(date)
  const n = Math.floor(JD - 2451545.0 + 0.0008)
  const Jstar = n - lng / 360
  const M = (357.5291 + 0.98560028 * Jstar) % 360
  const Mrad = M * RAD
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad)
  const lambda = (M + 102.9372 + C + 180) % 360
  const lambdaRad = lambda * RAD
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad)
  const sinDelta = Math.sin(lambdaRad) * Math.sin(23.4397 * RAD)
  const delta = Math.asin(sinDelta)
  const latRad = lat * RAD

  const cosOmega0 =
    (Math.sin(-0.833 * RAD) - Math.sin(latRad) * Math.sin(delta)) / (Math.cos(latRad) * Math.cos(delta))

  if (cosOmega0 > 1) return { sunrise: null, sunset: null, polar: "night" }
  if (cosOmega0 < -1) return { sunrise: null, sunset: null, polar: "day" }

  const omega0 = Math.acos(cosOmega0) * DEG
  const Jrise = Jtransit - omega0 / 360
  const Jset = Jtransit + omega0 / 360

  return { sunrise: fromJulian(Jrise), sunset: fromJulian(Jset), polar: null }
}
