"use client"

import * as React from "react"
import type { StatsSeriesPoint, StatsToolType } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { Loader } from "@/registry/ai-elements/loader"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/ai-tools/ui/chart"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Props as DefaultLegendContentProps } from "recharts/types/component/DefaultLegendContent"

export function StatsChart(part: StatsToolType) {
  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Public Stats</CardTitle>
          <CardDescription>Waiting for parameters…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader /> Preparing request
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Public Stats</CardTitle>
          <CardDescription>Loading…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader /> Running tool
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Public Stats</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
            {part.errorText || "An error occurred while loading stats."}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!part.output) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Public Stats</CardTitle>
          <CardDescription>No data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No data to display.
          </div>
        </CardContent>
      </Card>
    )
  }

  const config: ChartConfig = {
    count: { label: "Quakes", color: "var(--border)" },
  }

  const chartData =
    part.output?.series.map((d: StatsSeriesPoint) => ({
      date: d.date,
      count: d.count,
    })) ?? []

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{part.output?.title ?? "Public Stats"}</CardTitle>
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
            <ChartTooltip content={<ChartTooltipContent />} />
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
