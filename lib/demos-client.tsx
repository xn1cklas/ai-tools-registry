import * as React from "react"

// Renderers only (no fs) for client usage
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"

export async function loadClientDemos() {
  return {
    weather: { renderer: <WeatherCard data={{
      location: "",
      unit: "C",
      temperature: 0,
      condition: "",
      high: 0,
      low: 0,
      humidity: 0,
      windKph: 0,
    }} /> },
    news: { renderer: <NewsList data={{ topic: "", items: [] }} /> },
    websearch: { renderer: <WebSearchList data={{ query: "", results: [] }} /> },
    markdown: { renderer: <MarkdownViewer data={{ markdown: "" }} /> },
    stats: { renderer: <StatsChart /> },
  }
}

