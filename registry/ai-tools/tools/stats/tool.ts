import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

// Fetch global earthquake counts (per day) from USGS for the last N days
export const StatsSeriesPointSchema = z.object({
  date: z.string(),
  count: z.number(),
})

export const PublicStatsSchema = z.object({
  title: z.string(),
  series: z.array(StatsSeriesPointSchema),
})

export type StatsSeriesPoint = z.infer<typeof StatsSeriesPointSchema>
export type PublicStatsResult = z.infer<typeof PublicStatsSchema>

export const publicStatsTool = tool({
  name: "stats",
  description:
    "Fetch daily counts of global earthquakes from USGS for the last N days.",
  inputSchema: z.object({
    daysBack: z
      .number()
      .int()
      .min(1)
      .max(365)
      .default(30)
      .describe("How many days back from today (UTC) to include"),
    minMagnitude: z
      .number()
      .min(0)
      .max(10)
      .default(5)
      .describe("Minimum magnitude to include"),
  }),
  outputSchema: PublicStatsSchema,
  execute: async ({ daysBack, minMagnitude }): Promise<PublicStatsResult> => {
    const end = new Date()
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000)

    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const params = new URLSearchParams({
      format: "geojson",
      starttime: fmt(start),
      endtime: fmt(end),
      minmagnitude: String(minMagnitude),
    })
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`USGS API failed: ${res.status}`)
    const data = (await res.json()) as {
      features?: Array<{ properties?: { time?: number } }>
    }

    const counts = new Map<string, number>()
    for (const f of data.features ?? []) {
      const t = f?.properties?.time
      if (!Number.isFinite(t)) continue
      const day = new Date(Number(t)).toISOString().slice(0, 10)
      counts.set(day, (counts.get(day) || 0) + 1)
    }

    const series: StatsSeriesPoint[] = []
    for (let i = daysBack; i >= 0; i--) {
      const d = new Date(end.getTime() - i * 24 * 60 * 60 * 1000)
      const day = d.toISOString().slice(0, 10)
      series.push({ date: day, count: counts.get(day) || 0 })
    }

    return { title: `Global M${minMagnitude}+ earthquakes`, series }
  },
})

export default publicStatsTool

export type StatsToolType = UIToolInvocation<typeof publicStatsTool>
