"use client"

import * as React from "react"
import type { PublicStatsResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/ai-tools/ui/chart"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import type { TooltipContentProps } from "recharts/types/component/Tooltip"
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import type { Props as DefaultLegendContentProps } from "recharts/types/component/DefaultLegendContent"

export function StatsChart({ data }: { data?: PublicStatsResult }) {
  const config: ChartConfig = {
    // Use design system chart color for higher contrast in both themes
    count: { label: "Quakes", color: "var(--border)" },
  }

  const [live, setLive] = React.useState<PublicStatsResult | null>(null)
  React.useEffect(() => {
    if (data) return
    const controller = new AbortController()
    const fetchLive = async () => {
      try {
        const end = new Date()
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
        const fmt = (d: Date) => d.toISOString().slice(0, 10)
        const params = new URLSearchParams({
          format: "geojson",
          starttime: fmt(start),
          endtime: fmt(end),
          minmagnitude: String(5),
        })
        const res = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error("USGS fetch failed")
        const json = (await res.json()) as {
          features?: Array<{ properties?: { time?: number } }>
        }
        const counts = new Map<string, number>()
        for (const f of json.features ?? []) {
          const t = f?.properties?.time
          if (!Number.isFinite(t)) continue
          const day = new Date(Number(t)).toISOString().slice(0, 10)
          counts.set(day, (counts.get(day) || 0) + 1)
        }
        const series: PublicStatsResult["series"] = []
        for (let i = 30; i >= 0; i--) {
          const d = new Date(end.getTime() - i * 24 * 60 * 60 * 1000)
          const day = d.toISOString().slice(0, 10)
          series.push({ date: day, count: counts.get(day) || 0 })
        }
        setLive({ title: "Global M5+ earthquakes", series })
      } catch {
        // swallow for demo; component will render nothing
      }
    }
    fetchLive()
    return () => controller.abort()
  }, [data])

  const source = data ?? live
  const chartData =
    source?.series.map((d) => ({ date: d.date, count: d.count })) ?? []

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{source?.title ?? "Public Stats"}</CardTitle>
        <CardDescription>Source: USGS Earthquake Catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-[300px]">
          <AreaChart
            data={chartData}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />
            <YAxis
              tickFormatter={(v) =>
                Intl.NumberFormat(undefined, { notation: "compact" }).format(
                  Number(v)
                )
              }
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <ChartTooltip
              content={(props: TooltipContentProps<ValueType, NameType>) => (
                <ChartTooltipContent {...props} />
              )}
            />
            <ChartLegend
              verticalAlign="top"
              content={(props: DefaultLegendContentProps) => (
                <ChartLegendContent
                  verticalAlign="top"
                  payload={props.payload}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              fill="var(--color-count)"
              fillOpacity={0.2}
              name="Quakes"
              dot={{
                r: 2,
                stroke: "var(--color-count)",
                fill: "var(--color-count)",
              }}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default StatsChart
