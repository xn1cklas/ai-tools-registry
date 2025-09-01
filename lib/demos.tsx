import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

// Renderers
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { DataChart } from "@/registry/ai-tools/tools/charts/component"

// Tool types + tools where needed
import type { GetWeatherResult } from "@/registry/ai-tools/tools/weather/tool"
import type { NewsSearchResult } from "@/registry/ai-tools/tools/news/tool"
import type { WebSearchResult } from "@/registry/ai-tools/tools/websearch/tool"
import type { MarkdownResult } from "@/registry/ai-tools/tools/markdown/tool"
import type { CalculatorResult } from "@/registry/ai-tools/tools/calculator/tool"
import { calculatorTool } from "@/registry/ai-tools/tools/calculator/tool"
import type { TranslateResult } from "@/registry/ai-tools/tools/translate/tool"
import type { TimeNowResult } from "@/registry/ai-tools/tools/time/tool"
import { getWeatherTool } from "@/registry/ai-tools/tools/weather/tool"
import { newsSearchTool } from "@/registry/ai-tools/tools/news/tool"
import type { PublicStatsResult } from "@/registry/ai-tools/tools/stats/tool"
import type { ChartsResult } from "@/registry/ai-tools/tools/charts/tool"
import { chartsTool } from "@/registry/ai-tools/tools/charts/tool"

const read = (p: string) => fs.readFile(path.join(process.cwd(), p), "utf8")

const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function loadDemos() {
  // Weather
  const weatherFallback: GetWeatherResult = {
    location: "San Francisco",
    unit: "C",
    temperature: 21,
    condition: "Sunny",
    high: 24,
    low: 18,
    humidity: 0.45,
    windKph: 8,
    icon: "weather-sun",
  }
  const weatherDemo = await safe<GetWeatherResult>(
    // @ts-expect-error - getWeatherTool is not typed
    () => getWeatherTool.execute({ location: "San Francisco", unit: "C" }),
    weatherFallback
  )

  // News
  const newsFallback: NewsSearchResult = {
    topic: "AI",
    items: [
      {
        id: "ai-1",
        title: "AI breakthrough announced",
        url: "https://example.com/ai-1",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "ai-2",
        title: "New model sets benchmark",
        url: "https://example.com/ai-2",
        publishedAt: new Date().toISOString(),
      },
      { id: "ai-3", title: "Tooling ecosystem expands" },
    ],
  }
  const newsDemo = await safe<NewsSearchResult>(
    // @ts-expect-error - newsSearchTool is not typed
    () => newsSearchTool.execute({ topic: "AI", limit: 5 }),
    newsFallback
  )

  // Calculator
  const calcFallback: CalculatorResult = {
    a: 7,
    b: 3,
    operator: "+",
    result: 10,
  }
  const calcDemo = await safe<CalculatorResult>(
    // @ts-expect-error - calculatorTool is not typed
    () => calculatorTool.execute({ a: 7, b: 3, operator: "+" }),
    calcFallback
  )

  // Translate
  const translateFallback: TranslateResult = {
    text: "Hello, world!",
    targetLanguage: "es",
    translated: "¡Hola, mundo!",
  }
  const translateDemo = translateFallback

  // Time Now
  const timeFallback: TimeNowResult = {
    timeZone: "UTC",
    iso: new Date().toISOString(),
    formatted: new Date().toUTCString(),
  }
  const timeDemo = timeFallback

  // Websearch
  const webFallback: WebSearchResult = {
    query: "chatgpt",
    results: [
      {
        title: "ChatGPT",
        url: "https://openai.com/index/chatgpt/",
        snippet: "ChatGPT is an AI model by OpenAI.",
        source: "openai.com",
      },
      {
        title: "ChatGPT on Wikipedia",
        url: "https://en.wikipedia.org/wiki/ChatGPT",
        snippet: "ChatGPT is a chatbot developed by OpenAI...",
        source: "wikipedia.org",
      },
    ],
  }
  const webDemo = webFallback

  // Markdown
  const mdFallback: MarkdownResult = {
    markdown: `# Hello World\n\nThis is **markdown**.\n\n- Item one\n- Item two\n\n> Tip: You can copy the tool code from the left.`,
  }
  const mdDemo = mdFallback

  // Public Stats (USGS) — live client-side fetch in component; no server fetch.
  const statsDemo: PublicStatsResult | null = null

  // Charts
  const chartsFallback: ChartsResult = {
    title: "Monthly Sales Data",
    data: [
      { month: "Jan", sales: 4000, revenue: 2400, profit: 2400 },
      { month: "Feb", sales: 3000, revenue: 1398, profit: 2210 },
      { month: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
      { month: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
      { month: "May", sales: 1890, revenue: 4800, profit: 2181 },
      { month: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
    ],
    chartType: "line",
    xKey: "month",
    yKeys: ["sales", "revenue", "profit"],
    colors: ["#8884d8", "#82ca9d", "#ffc658"],
  }
  const chartsDemo = await safe<ChartsResult>(
    // @ts-expect-error - chartsTool is not typed
    () => chartsTool.execute(chartsFallback),
    chartsFallback
  )

  // Read code for copy blocks
  const [
    codeWeather,
    codeNews,
    codeCalc,
    codeTranslate,
    codeTime,
    codeWeatherCmp,
    codeNewsCmp,
    codeWeb,
    codeWebCmp,
    codeMd,
    codeMdCmp,
    codeStats,
    codeStatsCmp,
    codeCharts,
    codeChartsCmp,
  ] = await Promise.all([
    read("registry/ai-tools/tools/weather/tool.ts"),
    read("registry/ai-tools/tools/news/tool.ts"),
    read("registry/ai-tools/tools/calculator/tool.ts"),
    read("registry/ai-tools/tools/translate/tool.ts"),
    read("registry/ai-tools/tools/time/tool.ts"),
    read("registry/ai-tools/tools/weather/component.tsx"),
    read("registry/ai-tools/tools/news/component.tsx"),
    read("registry/ai-tools/tools/websearch/tool.ts"),
    read("registry/ai-tools/tools/websearch/component.tsx"),
    read("registry/ai-tools/tools/markdown/tool.ts"),
    read("registry/ai-tools/tools/markdown/component.tsx"),
    read("registry/ai-tools/tools/stats/tool.ts"),
    read("registry/ai-tools/tools/stats/component.tsx"),
    read("registry/ai-tools/tools/charts/tool.ts"),
    read("registry/ai-tools/tools/charts/component.tsx"),
  ])

  return {
    weather: {
      json: weatherDemo,
      code: codeWeather,
      componentCode: codeWeatherCmp,
      renderer: <WeatherCard data={weatherDemo} />,
    },
    news: {
      json: newsDemo,
      code: codeNews,
      componentCode: codeNewsCmp,
      renderer: <NewsList data={newsDemo} />,
    },
    calculator: { json: calcDemo, code: codeCalc },
    translate: { json: translateDemo, code: codeTranslate },
    time: { json: timeDemo, code: codeTime },
    websearch: {
      json: webDemo,
      code: codeWeb,
      componentCode: codeWebCmp,
      renderer: <WebSearchList data={webDemo} />,
    },
    markdown: {
      json: mdDemo,
      code: codeMd,
      componentCode: codeMdCmp,
      renderer: <MarkdownViewer data={mdDemo} />,
    },
    stats: {
      json: statsDemo,
      code: codeStats,
      componentCode: codeStatsCmp,
      renderer: <StatsChart />,
    },
    charts: {
      json: chartsDemo,
      code: codeCharts,
      componentCode: codeChartsCmp,
      renderer: <DataChart data={chartsDemo} />,
    },
  }
}
