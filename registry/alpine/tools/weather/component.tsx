"use client"

import * as React from "react"
import type { GetWeatherResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/alpine/ui/card"

export function WeatherCard({ data }: { data: GetWeatherResult }) {
  const { location, temperature, unit, condition, high, low, humidity, windKph } = data
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Powered by your tool</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="text-lg font-semibold mb-1">{location}</div>
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-bold">{temperature}°{unit}</div>
          <div className="text-sm text-muted-foreground">{condition}</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">High</div>
            <div className="font-medium">{high}°{unit}</div>
          </div>
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">Low</div>
            <div className="font-medium">{low}°{unit}</div>
          </div>
          <div className="rounded-md bg-muted p-3 text-center">
            <div className="text-muted-foreground">Humidity</div>
            <div className="font-medium">{Math.round(humidity * 100)}%</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">Wind: {windKph} kph</div>
      </CardContent>
    </Card>
  )
}

export default WeatherCard
