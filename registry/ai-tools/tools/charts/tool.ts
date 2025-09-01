import { tool } from "ai"
import { z } from "zod"

export const chartsTool = tool({
  description: "Render data as interactive charts using recharts.",
  inputSchema: z.object({
    title: z.string().describe("Title of the chart"),
    data: z
      .array(z.record(z.string(), z.union([z.string(), z.number()])))
      .describe("Array of data objects to visualize"),
    chartType: z
      .enum(["line", "bar", "area", "pie", "scatter"])
      .default("line")
      .describe("Type of chart to render"),
    xKey: z.string().describe("Key for x-axis data (not used for pie charts)"),
    yKeys: z
      .array(z.string())
      .describe("Keys for y-axis data (or value key for pie charts)"),
    colors: z
      .array(z.string())
      .optional()
      .describe("Optional array of colors for each data series"),
  }),
  execute: async ({ title, data, chartType, xKey, yKeys, colors }) => {
    // Validate data has required keys
    if (data.length === 0) {
      throw new Error("Data array cannot be empty")
    }

    const firstItem = data[0]
    if (chartType !== "pie" && !firstItem.hasOwnProperty(xKey)) {
      throw new Error(`Data objects must have the xKey property: ${xKey}`)
    }

    for (const yKey of yKeys) {
      if (!firstItem.hasOwnProperty(yKey)) {
        throw new Error(`Data objects must have the yKey property: ${yKey}`)
      }
    }

    const result: ChartsResult = {
      title,
      data,
      chartType,
      xKey,
      yKeys,
      colors: colors || generateDefaultColors(yKeys.length),
    }

    return result
  },
})

function generateDefaultColors(count: number): string[] {
  const defaultColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#67b7dc",
  ]

  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    colors.push(defaultColors[i % defaultColors.length])
  }
  return colors
}

export interface ChartsResult {
  title: string
  data: Array<Record<string, string | number>>
  chartType: "line" | "bar" | "area" | "pie" | "scatter"
  xKey: string
  yKeys: string[]
  colors: string[]
}

export default chartsTool
