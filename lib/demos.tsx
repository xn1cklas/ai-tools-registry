import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

// Renderers
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { QRCodeDisplay } from "@/registry/ai-tools/tools/qrcode/component"

// Tool types + tools where needed
import type { GetWeatherResult } from "@/registry/ai-tools/tools/weather/tool"
import type { NewsSearchResult } from "@/registry/ai-tools/tools/news/tool"
import type { WebSearchResult } from "@/registry/ai-tools/tools/websearch/tool"
import { webSearchTool } from "@/registry/ai-tools/tools/websearch/tool"
import type { MarkdownResult } from "@/registry/ai-tools/tools/markdown/tool"
import type { CalculatorResult } from "@/registry/ai-tools/tools/calculator/tool"
import { calculatorTool } from "@/registry/ai-tools/tools/calculator/tool"
import type { TranslateResult } from "@/registry/ai-tools/tools/translate/tool"
import type { TimeNowResult } from "@/registry/ai-tools/tools/time/tool"
import { getWeatherTool } from "@/registry/ai-tools/tools/weather/tool"
import { newsSearchTool } from "@/registry/ai-tools/tools/news/tool"
import type { PublicStatsResult } from "@/registry/ai-tools/tools/stats/tool"
import type { QRCodeResult } from "@/registry/ai-tools/tools/qrcode/tool"
import { qrCodeTool } from "@/registry/ai-tools/tools/qrcode/tool"
import { ToolUIPart } from "ai"
import { DynamicToolComponent } from "@/registry/ai-tools/tools/fallback/component"

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

  // Websearch — live query (no static fallback)
  let webDemo: WebSearchResult
  try {
    // @ts-expect-error - webSearchTool is not typed
    webDemo = await webSearchTool.execute({ query: "chatgpt", limit: 5 })
  } catch {
    // If the live query fails, return an empty result set to keep UI stable
    webDemo = { query: "chatgpt", results: [] }
  }

  // Markdown
  const mdFallback: MarkdownResult = {
    markdown: `# Hello World\n\nThis is **markdown**.\n\n- Item one\n- Item two\n\n> Tip: You can copy the tool code from the left.`,
  }
  const mdDemo = mdFallback

  // Public Stats (USGS) — live client-side fetch in component; no server fetch.
  const statsDemo: PublicStatsResult | null = null

  // QR Code — no fallback, surface errors
  let qrDemo: QRCodeResult | null = null
  let qrError: { error: string } | null = null
  try {
    // @ts-expect-error - qrCodeTool is not typed
    qrDemo = await qrCodeTool.execute({
      data: "https://ai-tools-registry.vercel.app",
      size: 300,
    })
  } catch (err) {
    qrError = {
      error: err instanceof Error ? err.message : "QR code generation failed",
    }
  }

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
    codeQr,
    codeQrCmp,
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
    read("registry/ai-tools/tools/qrcode/tool.ts"),
    read("registry/ai-tools/tools/qrcode/component.tsx"),
  ])

  const part: ToolUIPart = {
    type: "tool-translate",
    toolCallId: "tc_demo_1",
    state: "output-available",
    input: { text: "Hello", targetLanguage: "es" },
    output: { translated: "¡Hola!" },
  }

  return {
    weather: {
      name: "weather",
      heading: "Get Weather",
      subheading: "Returns weather for a location",
      json: weatherDemo,
      code: codeWeather,
      componentCode: codeWeatherCmp,
      renderer: <WeatherCard data={weatherDemo} />,
    },
    news: {
      name: "news",
      heading: "News Search",
      subheading: "Returns headlines for a topic",
      json: newsDemo,
      code: codeNews,
      componentCode: codeNewsCmp,
      renderer: <NewsList data={newsDemo} />,
    },
    calculator: {
      name: "calculator",
      heading: "Calculator",
      subheading: "Basic arithmetic",
      json: calcDemo,
      code: codeCalc,
    },
    translate: {
      name: "translate",
      heading: "Translate",
      subheading: "Translate text (mock)",
      json: translateDemo,
      code: codeTranslate,
      renderer: <DynamicToolComponent part={part} />,
    },
    time: {
      name: "time",
      heading: "Time Now",
      subheading: "Current time for timezone",
      json: timeDemo,
      code: codeTime,
    },
    websearch: {
      name: "websearch",
      heading: "Web Search",
      subheading: "Search the web and show results",
      json: webDemo,
      code: codeWeb,
      componentCode: codeWebCmp,
      renderer: <WebSearchList data={webDemo} />,
    },
    markdown: {
      name: "markdown",
      heading: "Markdown",
      subheading: "Render markdown in your chat view",
      json: mdDemo,
      code: codeMd,
      componentCode: codeMdCmp,
      renderer: <MarkdownViewer data={mdDemo} />,
    },
    stats: {
      name: "stats",
      heading: "Public Stats",
      subheading: "Global M5+ earthquakes — last 30 days",
      json: statsDemo,
      code: codeStats,
      componentCode: codeStatsCmp,
      renderer: <StatsChart />,
    },
    qrcode: {
      name: "qrcode",
      heading: "QR Code Generator",
      subheading: "Generate QR codes for text or URLs",
      json: qrDemo ?? qrError,
      code: codeQr,
      componentCode: codeQrCmp,
      renderer: qrDemo ? <QRCodeDisplay data={qrDemo} /> : undefined,
    },
    entries: [
      // display order
      "stats",
      "weather",
      "news",
      "calculator",
      "translate",
      "time",
      "websearch",
      "markdown",
      "qrcode",
    ],
  }
}
