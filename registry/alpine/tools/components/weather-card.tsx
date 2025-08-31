"use client"

import * as React from "react"
import type { GetWeatherResult } from "../get-weather"

export function WeatherCard({ data }: { data: GetWeatherResult }) {
  const { location, temperature, unit, condition, high, low, humidity, windKph } = data
  return (
    <div className="w-full max-w-sm rounded-xl border bg-white text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Weather</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">Powered by your tool</div>
      </div>
      <div className="px-6 pb-6">
        <div className="text-lg font-semibold mb-1">{location}</div>
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-bold">{temperature}°{unit}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{condition}</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <div className="text-gray-500 dark:text-gray-400">High</div>
            <div className="font-medium">{high}°{unit}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <div className="text-gray-500 dark:text-gray-400">Low</div>
            <div className="font-medium">{low}°{unit}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800/50">
            <div className="text-gray-500 dark:text-gray-400">Humidity</div>
            <div className="font-medium">{Math.round(humidity * 100)}%</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">Wind: {windKph} kph</div>
      </div>
    </div>
  )
}

export default WeatherCard
