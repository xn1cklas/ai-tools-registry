"use client"

import * as React from "react"
import type { WeatherToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import { Badge } from "@/registry/ai-tools/ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function WeatherCard({ invocation }: { invocation: WeatherToolType }) {
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
  // Handle tool invocation states
  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Weather", "Waiting for input…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Preparing weather request
          </div>
          <div className="space-y-2">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Weather", "Fetching data…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
          {part.input ? (
            <div className="rounded-md border border-border/40 bg-muted/40">
              <CodeBlock
                code={JSON.stringify(part.input, null, 2)}
                language="json"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Weather", "Error")}
        <CardContent className={contentBaseClass}>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText || "An error occurred while fetching weather."}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.output === undefined) return null

  const {
    location,
    temperature,
    unit,
    condition,
    high,
    low,
    humidity,
    windKph,
  } = part.output
  return (
    <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
      {renderHeader(
        "Weather",
        location,
        part.output.icon ? (
          <Badge variant="secondary" className="h-9 w-9 rounded-full text-lg">
            {part.output.icon}
          </Badge>
        ) : null
      )}
      <CardContent className={cn(contentBaseClass, "space-y-6 pb-6")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current conditions
            </p>
            <div className="text-5xl font-semibold tracking-tight">
              {temperature}°{unit}
            </div>
            <p className="text-sm text-muted-foreground">{condition}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
            High {high}°{unit} • Low {low}°{unit}
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <dt className="text-muted-foreground text-xs uppercase tracking-wide">
              Humidity
            </dt>
            <dd className="mt-1 font-medium">{Math.round(humidity * 100)}%</dd>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <dt className="text-muted-foreground text-xs uppercase tracking-wide">
              Wind
            </dt>
            <dd className="mt-1 font-medium">{windKph} kph</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
