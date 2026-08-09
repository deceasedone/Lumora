export interface CityTimezone {
  city: string
  country: string
  timezone: string // IANA identifier
  flag: string
}

export const TIMEZONE_CITIES: CityTimezone[] = [
  { city: "New Delhi", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Mumbai", country: "India", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "London", country: "United Kingdom", timezone: "Europe/London", flag: "🇬🇧" },
  { city: "New York", country: "United States", timezone: "America/New_York", flag: "🇺🇸" },
  { city: "Los Angeles", country: "United States", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Chicago", country: "United States", timezone: "America/Chicago", flag: "🇺🇸" },
  { city: "San Francisco", country: "United States", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Sydney", country: "Australia", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { city: "Singapore", country: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
  { city: "Paris", country: "France", timezone: "Europe/Paris", flag: "🇫🇷" },
  { city: "Berlin", country: "Germany", timezone: "Europe/Berlin", flag: "🇩🇪" },
  { city: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Hong Kong", country: "Hong Kong", timezone: "Asia/Hong_Kong", flag: "🇭🇰" },
  { city: "Toronto", country: "Canada", timezone: "America/Toronto", flag: "🇨🇦" },
  { city: "Beijing", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Shanghai", country: "China", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Seoul", country: "South Korea", timezone: "Asia/Seoul", flag: "🇰🇷" },
  { city: "Moscow", country: "Russia", timezone: "Europe/Moscow", flag: "🇷🇺" },
  { city: "Sao Paulo", country: "Brazil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
  { city: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", flag: "🇲🇽" },
  { city: "Cairo", country: "Egypt", timezone: "Africa/Cairo", flag: "🇪🇬" },
  { city: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", flag: "🇹🇷" },
  { city: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", flag: "🇹🇭" },
  { city: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta", flag: "🇮🇩" },
  { city: "Auckland", country: "New Zealand", timezone: "Pacific/Auckland", flag: "🇳🇿" },
  { city: "Honolulu", country: "United States", timezone: "Pacific/Honolulu", flag: "🇺🇸" },
  { city: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam", flag: "🇳🇱" },
  { city: "Madrid", country: "Spain", timezone: "Europe/Madrid", flag: "🇪🇸" },
  { city: "Rome", country: "Italy", timezone: "Europe/Rome", flag: "🇮🇹" },
]

export function getLocalTimezoneCity(): CityTimezone {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const match = TIMEZONE_CITIES.find((c) => c.timezone === tz)
  if (match) return match
  const cityName = tz.split("/").pop()?.replace(/_/g, " ") || "Local"
  return { city: cityName, country: "", timezone: tz, flag: "📍" }
}
