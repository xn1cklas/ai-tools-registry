import { z } from "zod"
// AI SDK v3: import { tool } from 'ai'
// The import is intentionally not resolved here; it will resolve in consumer apps.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {} from "ai"

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

// Example tool definition compatible with AI SDK tool calling
export const getWeatherTool = {
  name: "getWeather",
  description: "Get the current weather for a location (demo/mock).",
  parameters: z.object({
    location: z.string().describe("City name, address or coordinates"),
    unit: z.enum(["C", "F"]).default("C"),
  }),
  // Replace with a real API call in your app.
  execute: async ({ location, unit }: { location: string; unit: "C" | "F" }): Promise<GetWeatherResult> => {
    // Deterministic mock values based on input
    const hash = Array.from(location).reduce((a, c) => a + c.charCodeAt(0), 0)
    const base = 18 + (hash % 10)
    const cTemp = base
    const fTemp = Math.round(cTemp * 1.8 + 32)
    const temp = unit === "C" ? cTemp : fTemp
    return {
      location,
      unit,
      temperature: temp,
      condition: ["Sunny", "Cloudy", "Rain", "Partly Cloudy"][hash % 4],
      high: temp + 3,
      low: temp - 2,
      humidity: ((hash % 60) + 20) / 100,
      windKph: (hash % 30) + 5,
      icon: "weather-sun",
    }
  },
}

export default getWeatherTool

