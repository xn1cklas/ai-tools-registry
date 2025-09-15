import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

// Renderers
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { QRCodeDisplay } from "@/registry/ai-tools/tools/qrcode/component"
import { ImageGrid } from "@/registry/ai-tools/tools/image/component"

// Tool types + tools where needed
import type {
  GetWeatherResult,
  WeatherToolType,
} from "@/registry/ai-tools/tools/weather/tool"
import type {
  NewsSearchResult,
  NewsToolType,
} from "@/registry/ai-tools/tools/news/tool"
import type {
  WebSearchResult,
  WebSearchToolType,
} from "@/registry/ai-tools/tools/websearch/tool"
import { webSearchTool } from "@/registry/ai-tools/tools/websearch/tool"
import { webSearchBraveTool } from "@/registry/ai-tools/tools/websearch/websearch-brave-tool"
import { webSearchDDGTool } from "@/registry/ai-tools/tools/websearch/websearch-duckduckgo-tool"
import { webSearchExaTool } from "@/registry/ai-tools/tools/websearch/websearch-exa-tool"
import { webSearchPerplexityTool } from "@/registry/ai-tools/tools/websearch/websearch-perplexity-tool"

import { getWeatherTool } from "@/registry/ai-tools/tools/weather/tool"
import { newsSearchTool } from "@/registry/ai-tools/tools/news/tool"
import type {
  PublicStatsResult,
  StatsToolType,
} from "@/registry/ai-tools/tools/stats/tool"
import { publicStatsTool } from "@/registry/ai-tools/tools/stats/tool"
import type {
  QRCodeResult,
  QRCodeToolType,
} from "@/registry/ai-tools/tools/qrcode/tool"
import { qrCodeTool } from "@/registry/ai-tools/tools/qrcode/tool"
import type { ImageResult } from "@/registry/ai-tools/tools/image/schema"
import WeatherCard from "@/registry/ai-tools/tools/weather/component"
import { ImageToolType } from "@/registry/ai-tools/tools/image/tool"

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

  // Websearch — live queries per provider (best-effort)
  let webDemo: WebSearchResult
  let webDemoBrave: WebSearchResult | null = null
  let webDemoDDG: WebSearchResult | null = null
  let webDemoExa: WebSearchResult | null = null
  let webDemoPerplexity: WebSearchResult | null = null
  try {
    // @ts-expect-error - webSearchTool is not typed
    webDemo = await webSearchTool.execute({ query: "chatgpt", limit: 5 })
  } catch {
    // If the live query fails, return an empty result set to keep UI stable
    webDemo = { query: "chatgpt", results: [] }
  }

  try {
    // @ts-expect-error - webSearchBraveTool is not typed
    webDemoBrave = await webSearchBraveTool.execute({
      query: "chatgpt",
      limit: 5,
    })
  } catch {
    webDemoBrave = null
  }

  try {
    // @ts-expect-error - webSearchDDGTool is not typed
    webDemoDDG = await webSearchDDGTool.execute({ query: "chatgpt", limit: 5 })
  } catch {
    webDemoDDG = null
  }

  try {
    // @ts-expect-error - webSearchExaTool is not typed
    webDemoExa = await webSearchExaTool.execute({ query: "chatgpt", limit: 5 })
  } catch {
    webDemoExa = null
  }

  try {
    // @ts-expect-error - webSearchPerplexityTool is not typed
    webDemoPerplexity = await webSearchPerplexityTool.execute({
      query: "chatgpt",
      limit: 5,
    })
  } catch {
    webDemoPerplexity = null
  }

  // Public Stats (USGS)
  const statsFallback: PublicStatsResult = { title: "Public Stats", series: [] }
  const statsDemo = await safe<PublicStatsResult>(
    // @ts-expect-error - publicStatsTool is not typed
    () => publicStatsTool.execute({ daysBack: 30, minMagnitude: 5 }),
    statsFallback
  )

  // QR Code — no fallback, surface errors
  let qrDemo: QRCodeResult = {
    data: "https://ai-tools-registry.vercel.app",
    size: 300,
    output: "https://ai-tools-registry.vercel.app",
  }
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

  // Image generation — do not call live providers in demo; show placeholder output
  const imageDemo: ImageResult = {
    provider: "demo",
    prompt: "A serene landscape with mountains at sunrise",
    images: [
      { url: "https://picsum.photos/seed/ai-tools-1/640/640" },
      { url: "https://picsum.photos/seed/ai-tools-2/640/640" },
    ],
    aspectRatio: "1:1",
  }

  // Read code for copy blocks
  const [
    codeWeather,
    codeNews,
    codeWeatherCmp,
    codeNewsCmp,
    codeWeb,
    codeWebCmp,
    codeWebBrave,
    codeWebDDG,
    codeWebExa,
    codeWebPerplexity,
    codeStats,
    codeStatsCmp,
    codeQr,
    codeQrCmp,
    codeImg,
    codeImgCmp,
    codeImgOpenAI,
    codeImgFal,
    codeImgRunware,
  ] = await Promise.all([
    read("registry/ai-tools/tools/weather/tool.ts"),
    read("registry/ai-tools/tools/news/tool.ts"),
    read("registry/ai-tools/tools/weather/component.tsx"),
    read("registry/ai-tools/tools/news/component.tsx"),
    read("registry/ai-tools/tools/websearch/tool.ts"),
    read("registry/ai-tools/tools/websearch/component.tsx"),
    read("registry/ai-tools/tools/websearch/websearch-brave-tool.ts"),
    read("registry/ai-tools/tools/websearch/websearch-duckduckgo-tool.ts"),
    read("registry/ai-tools/tools/websearch/websearch-exa-tool.ts"),
    read("registry/ai-tools/tools/websearch/websearch-perplexity-tool.ts"),
    read("registry/ai-tools/tools/stats/tool.ts"),
    read("registry/ai-tools/tools/stats/component.tsx"),
    read("registry/ai-tools/tools/qrcode/tool.ts"),
    read("registry/ai-tools/tools/qrcode/component.tsx"),
    read("registry/ai-tools/tools/image/tool.ts"),
    read("registry/ai-tools/tools/image/component.tsx"),
    read("registry/ai-tools/tools/image/image-openai-tool.ts"),
    read("registry/ai-tools/tools/image/image-fal-tool.ts"),
    read("registry/ai-tools/tools/image/image-runware-tool.ts"),
  ])

  const newsPart: NewsToolType = {
    toolCallId: "tc_demo_news",
    state: "output-available",
    input: { topic: "AI", limit: 5 },
    output: {
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
    },
  }

  const weatherPart: WeatherToolType = {
    toolCallId: "tc_demo_weather",
    state: "output-available",
    input: { location: "San Francisco", unit: "C" },
    output: weatherDemo,
  }

  const webSearchPart: WebSearchToolType = {
    toolCallId: "tc_demo_websearch",
    state: "output-available",
    input: { query: "chatgpt", limit: 5 },
    output: webDemo,
  }

  const statsPart: StatsToolType = {
    toolCallId: "tc_demo_stats",
    state: "output-available",
    input: { daysBack: 30, minMagnitude: 5 },
    output: statsDemo ?? { title: "Public Stats", series: [] },
  }

  const qrPart: QRCodeToolType = {
    toolCallId: "tc_demo_qrcode",
    state: "output-available",
    input: { data: "https://ai-tools-registry.vercel.app", size: 300 },
    output: qrDemo,
  }

  const imagePart: ImageToolType = {
    toolCallId: "tc_demo_image",
    state: "output-available",
    input: { prompt: imageDemo.prompt, n: 2, aspectRatio: "1:1" },
    output: imageDemo,
  }

  type DemoEntry = {
    isNew?: boolean
    name: string
    heading: string
    subheading?: string
    json: unknown
    code: string
    componentCode?: string
    renderer?: React.ReactNode
    variants?: Array<{
      key: string
      label: string
      json: unknown
      code: string
      renderer?: React.ReactNode
    }>
  }

  const baseline = [
    // display order baseline; will be dynamically sorted with new-first
    "stats",
    "weather",
    "news",
    "websearch",
    "image",
    "qrcode",
  ] as const

  type DemoKey = (typeof baseline)[number]

  const demos: Record<DemoKey, DemoEntry> = {
    weather: {
      name: "weather",
      heading: "Get Weather",
      subheading: "Returns weather for a location",
      json: weatherDemo,
      code: codeWeather,
      componentCode: codeWeatherCmp,
      renderer: <WeatherCard {...weatherPart} />,
    },
    news: {
      name: "news",
      heading: "News Search",
      subheading: "Returns headlines for a topic",
      json: newsDemo,
      code: codeNews,
      componentCode: codeNewsCmp,
      renderer: <NewsList {...newsPart} />,
    },

    websearch: {
      name: "websearch",
      heading: "Web Search",
      subheading: "Search the web and show results",
      json: webDemo,
      code: codeWeb,
      componentCode: codeWebCmp,
      renderer: <WebSearchList {...webSearchPart} />,
      isNew: true,
      variants: [
        {
          key: "ddg",
          label: "DuckDuckGo",
          json: webDemoDDG ?? webDemo,
          code: codeWebDDG,
          renderer: (
            <WebSearchList
              toolCallId="tc_demo_websearch_ddg"
              state="output-available"
              input={{ query: "chatgpt", limit: 5 }}
              output={webDemoDDG ?? webDemo}
            />
          ),
        },
        {
          key: "brave",
          label: "Brave",
          json: webDemoBrave ?? webDemo,
          code: codeWebBrave,
          renderer: (
            <WebSearchList
              toolCallId="tc_demo_websearch_brave"
              state="output-available"
              input={{ query: "chatgpt", limit: 5 }}
              output={
                webDemoBrave ?? webDemoDDG ?? { query: "chatgpt", results: [] }
              }
            />
          ),
        },

        {
          key: "exa",
          label: "EXA",
          json: webDemoExa ?? webDemo,
          code: codeWebExa,
          renderer: (
            <WebSearchList
              toolCallId="tc_demo_websearch_exa"
              state="output-available"
              input={{ query: "chatgpt", limit: 5 }}
              output={
                webDemoExa ?? webDemoDDG ?? { query: "chatgpt", results: [] }
              }
            />
          ),
        },
        {
          key: "perplexity",
          label: "Perplexity",
          json: webDemoPerplexity ?? webDemoDDG,
          code: codeWebPerplexity,
          renderer: (
            <WebSearchList
              toolCallId="tc_demo_websearch_perplexity"
              state="output-available"
              input={{ query: "chatgpt", limit: 5 }}
              output={
                webDemoPerplexity ??
                webDemoDDG ?? { query: "chatgpt", results: [] }
              }
            />
          ),
        },
      ],
    },
    image: {
      name: "image",
      heading: "Image Generation",
      subheading: "Generate images from text prompts",
      json: imageDemo,
      code: codeImg,
      componentCode: codeImgCmp,
      renderer: <ImageGrid {...imagePart} />,
      isNew: true,
      variants: [
        {
          key: "openai",
          label: "OpenAI",
          json: imageDemo,
          code: codeImgOpenAI,
          renderer: (
            <ImageGrid
              toolCallId="tc_demo_image_openai"
              state="output-available"
              input={{ prompt: imageDemo.prompt, n: 2, aspectRatio: "1:1" }}
              output={imageDemo}
            />
          ),
        },
        {
          key: "fal",
          label: "FAL.ai",
          json: imageDemo,
          code: codeImgFal,
          renderer: (
            <ImageGrid
              toolCallId="tc_demo_image_fal"
              state="output-available"
              input={{ prompt: imageDemo.prompt, n: 2, aspectRatio: "1:1" }}
              output={imageDemo}
            />
          ),
        },
        {
          key: "runware",
          label: "Runware",
          json: imageDemo,
          code: codeImgRunware,
          renderer: (
            <ImageGrid
              toolCallId="tc_demo_image_runware"
              state="output-available"
              input={{ prompt: imageDemo.prompt, n: 2, aspectRatio: "1:1" }}
              output={imageDemo}
            />
          ),
        },
      ],
    },
    stats: {
      name: "stats",
      heading: "Public Stats",
      subheading: "Global M5+ earthquakes — last 30 days",
      json: statsDemo,
      code: codeStats,
      componentCode: codeStatsCmp,
      renderer: <StatsChart {...statsPart} />,
    },
    qrcode: {
      name: "qrcode",
      heading: "QR Code Generator",
      subheading: "Generate QR codes for text or URLs",
      json: qrDemo ?? qrError,
      code: codeQr,
      componentCode: codeQrCmp,
      renderer: <QRCodeDisplay {...qrPart} />,
    },
  }

  const entries: DemoKey[] = [...baseline].sort((a, b) => {
    const aNew = demos[a]?.isNew ? 1 : 0
    const bNew = demos[b]?.isNew ? 1 : 0
    if (aNew !== bNew) return bNew - aNew
    return 0
  })

  return {
    ...demos,
    entries,
  }
}
