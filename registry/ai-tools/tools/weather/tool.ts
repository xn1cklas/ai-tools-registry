import { z } from "zod"
import type { Tool } from "ai"

// Example tool definition compatible with AI SDK tool calling
export const getWeatherTool: Tool = {
  name: "getWeather",
  description: "Get the current weather for a location.",
  inputSchema: z.object({
    location: z.string().describe("City name, address or coordinates"),
    unit: z.enum(["C", "F"]).default("C"),
  }),
  execute: async ({
    location,
    unit,
  }: {
    location: string
    unit: "C" | "F"
  }): Promise<GetWeatherResult> => {
    throw new Error(
      "getWeather not implemented. Connect a weather API (e.g. OpenWeather) and return { location, unit, temperature, condition, high, low, humidity, windKph }."
    )
  },
}

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
