import { tool } from "ai"
import { z } from "zod"

// Example tool definition compatible with AI SDK tool calling
export const getWeatherTool = tool({
  description: "Get the current weather for a location.",
  inputSchema: z.object({
    location: z.string().describe("City name, address or coordinates"),
    unit: z.enum(["C", "F"]).default("C"),
  }),
  execute: async ({ location, unit }) => {
    return {
      location,
      unit,
      temperature: 21,
      condition: "Sunny",
      high: 24,
      low: 18,
      humidity: 0.45,
      windKph: 8,
      icon: "weather-sun",
    }
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

export default getWeatherTool
