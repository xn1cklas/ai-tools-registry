import { tool } from "ai"
import { z } from "zod"

// Tool definition first
export const getWeatherTool = tool({
  description: "Get the current weather for a location.",
  inputSchema: z.object({
    location: z.string().describe("City name, address or coordinates"),
    unit: z.enum(["C", "F"]).default("C"),
  }),
  execute: async ({ location, unit }) => {
    const { latitude, longitude, name } = await geocodeLocation(location)

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "wind_speed_10m",
        "weather_code",
      ].join(","),
      daily: ["temperature_2m_max", "temperature_2m_min"].join(","),
      timezone: "auto",
      temperature_unit: unit === "F" ? "fahrenheit" : "celsius",
      wind_speed_unit: "kmh",
    })

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Weather API failed: ${res.status}`)
    const data = (await res.json()) as ForecastResponse

    const current = data?.current
    const daily = data?.daily
    if (!current || !daily) throw new Error("Malformed weather API response")

    const weatherCode = Number(current.weather_code)
    const mapped = mapWeatherCode(weatherCode)

    const result: GetWeatherResult = {
      location: name,
      unit,
      temperature: Math.round(Number(current.temperature_2m)),
      condition: mapped.condition,
      high: Math.round(Number(daily.temperature_2m_max?.[0])),
      low: Math.round(Number(daily.temperature_2m_min?.[0])),
      humidity: Math.max(
        0,
        Math.min(1, Number(current.relative_humidity_2m) / 100)
      ),
      windKph: Math.round(Number(current.wind_speed_10m)),
      icon: mapped.icon,
    }

    return result
  },
})

// Re-export shape for result rendering components
export interface GetWeatherResult {
  location: string
  unit: "C" | "F"
  temperature: number
  condition: string
  high: number
  low: number
  humidity: number // 0..1
  windKph: number
  icon?: string
}

// API response types (from Open-Meteo)
interface GeocodeItem {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  country_code?: string
  admin1?: string
  timezone?: string
}

interface GeocodeResponse {
  results?: GeocodeItem[]
}

interface ForecastCurrent {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  wind_speed_10m: number
  weather_code: number
}

interface ForecastDaily {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
}

interface ForecastResponse {
  current: ForecastCurrent
  daily: ForecastDaily
}

// Helper functions (hoisted)
async function geocodeLocation(location: string): Promise<{
  latitude: number
  longitude: number
  name: string
}> {
  // Allow "lat,lon" inputs without geocoding
  const coordMatch = location
    .trim()
    .match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (coordMatch) {
    const latitude = parseFloat(coordMatch[1])
    const longitude = parseFloat(coordMatch[2])
    return {
      latitude,
      longitude,
      name: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
    }
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    location
  )}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as GeocodeResponse
  const first = data?.results?.[0]
  if (!first) throw new Error(`Location not found: ${location}`)
  const nameParts = [first.name, first.admin1, first.country_code].filter(
    Boolean
  )
  return {
    latitude: first.latitude,
    longitude: first.longitude,
    name: nameParts.join(", "),
  }
}

function mapWeatherCode(code: number): { condition: string; icon?: string } {
  switch (code) {
    case 0:
      return { condition: "Clear sky", icon: "weather-sun" }
    case 1:
      return { condition: "Mainly clear", icon: "weather-sun" }
    case 2:
      return { condition: "Partly cloudy", icon: "weather-partly" }
    case 3:
      return { condition: "Overcast", icon: "weather-cloud" }
    case 45:
    case 48:
      return { condition: "Fog", icon: "weather-fog" }
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { condition: "Drizzle", icon: "weather-drizzle" }
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { condition: "Rain", icon: "weather-rain" }
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: "Snow", icon: "weather-snow" }
    case 80:
    case 81:
    case 82:
      return { condition: "Showers", icon: "weather-showers" }
    case 85:
    case 86:
      return { condition: "Snow showers", icon: "weather-snow" }
    case 95:
    case 96:
    case 99:
      return { condition: "Thunderstorm", icon: "weather-thunder" }
    default:
      return { condition: "Unknown" }
  }
}

export default getWeatherTool
