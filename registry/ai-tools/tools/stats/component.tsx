"use client"

import * as React from "react"
import type { StatsSeriesPoint, StatsToolType } from "./tool"
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
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function StatsChart({ invocation }: { invocation: StatsToolType }) {
  const part = invocation
  const cardBaseClass =
    "not-prose flex w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background/95 py-0 text-foreground shadow-sm"
  const headerBaseClass =
    "flex flex-col gap-2 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
  const contentBaseClass = "px-6 py-5"
  const renderHeader = (
    title: React.ReactNode,
    description?: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const descriptionNode =
      typeof description === "string" ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : (
        (description ?? null)
      )

    return (
      <CardHeader className={headerBaseClass}>
        {(title || descriptionNode) && (
          <div className="space-y-1">
            {title ? (
              <h3 className="text-sm font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
            ) : null}
            {descriptionNode}
          </div>
        )}
        {actions ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {actions}
          </div>
        ) : null}
      </CardHeader>
    )
  }
  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Public Stats", "Waiting for parameters…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Preparing request
          </div>
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-3">
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Public Stats", "Loading…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Running tool
          </div>
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-3">
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Public Stats", "Error")}
        <CardContent className={contentBaseClass}>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText || "An error occurred while loading stats."}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!part.output) {
    return (
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Public Stats", "No data")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div>No data to display.</div>
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-3">
            <Skeleton className="h-[260px] w-full rounded-lg" />
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
    <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
      {renderHeader(
        part.output?.title ?? "Public Stats",
        "Source: USGS Earthquake Catalog"
      )}
      <CardContent className={cn(contentBaseClass, "pb-6")}>
        <ChartContainer config={config} className="h-[260px] sm:h-[320px]">
          <AreaChart
            data={chartData}
            margin={{ left: 8, right: 8, top: 16, bottom: 8 }}
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
