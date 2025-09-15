"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import type { WeatherToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import { Badge } from "@/registry/ai-tools/ui/badge"

export function WeatherCard(part: WeatherToolType) {
  // Handle tool invocation states
  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Waiting for input…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader /> Preparing weather request
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Fetching data…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          {part.input ? (
            <div className="rounded-md bg-muted/50">
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Weather</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{location}</span>
              {part.output.icon ? (
                <Badge variant="secondary" className="rounded-full">
                  {part.output.icon}
                </Badge>
              ) : null}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="text-lg font-semibold mb-1">{location}</div>
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-bold">
            {temperature}°{unit}
          </div>
          <div className="text-sm text-muted-foreground">{condition}</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">High</div>
            <div className="font-medium">
              {high}°{unit}
            </div>
          </div>
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">Low</div>
            <div className="font-medium">
              {low}°{unit}
            </div>
          </div>
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">Humidity</div>
            <div className="font-medium">{Math.round(humidity * 100)}%</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Wind: {windKph} kph
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherCard
