import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

// Renderers
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { SearchPhotosDisplay } from "@/registry/ai-tools/tools/search-photos/component"

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
import type { SearchPhotosResult } from "@/registry/ai-tools/tools/search-photos/tool"
import { searchPhotosTool } from "@/registry/ai-tools/tools/search-photos/tool"

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

  // Photo Search
  const searchPhotosFallback: SearchPhotosResult = {
    query: "nature",
    total: 1000,
    totalPages: 100,
    photos: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        thumb:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
        full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
        alt: "Beautiful mountain landscape",
        photographer: "John Doe",
        photographerUrl: "https://unsplash.com/@johndoe",
        width: 1200,
        height: 800,
        likes: 150,
        description: "A stunning mountain landscape at sunset",
        color: "#4A5568",
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        thumb:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop",
        full: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
        alt: "Forest path in sunlight",
        photographer: "Jane Smith",
        photographerUrl: "https://unsplash.com/@janesmith",
        width: 1200,
        height: 800,
        likes: 89,
        description: "A peaceful forest path bathed in golden sunlight",
        color: "#2D3748",
      },
    ],
    count: 2,
  }
  const searchPhotosDemo = await safe<SearchPhotosResult>(
    // @ts-expect-error - searchPhotosTool is not typed
    () => searchPhotosTool.execute({ query: "nature", count: 2 }),
    searchPhotosFallback
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
    codeSearchPhotos,
    codeSearchPhotosCmp,
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
    read("registry/ai-tools/tools/search-photos/tool.ts"),
    read("registry/ai-tools/tools/search-photos/component.tsx"),
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
    searchPhotos: {
      json: searchPhotosDemo,
      code: codeSearchPhotos,
      componentCode: codeSearchPhotosCmp,
      renderer: <SearchPhotosDisplay data={searchPhotosDemo} />,
    },
  }
}
