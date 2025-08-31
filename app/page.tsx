import * as React from "react"
import { promises as fs } from "fs"
import path from "path"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import registry from "@/registry.json"
import { Button } from "@/registry/ai-tools/ui/button"
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { getWeatherTool, type GetWeatherResult } from "@/registry/ai-tools/tools/weather/tool"
import { newsSearchTool, type NewsSearchResult } from "@/registry/ai-tools/tools/news/tool"
import type { WebSearchResult } from "@/registry/ai-tools/tools/websearch/tool"
import type { MarkdownResult } from "@/registry/ai-tools/tools/markdown/tool"
import { calculatorTool, type CalculatorResult } from "@/registry/ai-tools/tools/calculator/tool"
import { translateTool, type TranslateResult } from "@/registry/ai-tools/tools/translate/tool"
import { timeNowTool, type TimeNowResult } from "@/registry/ai-tools/tools/time/tool"
import { ToolDemoCard } from "@/components/tool-demo-card"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"

const getRegistryItemFromJson = React.cache((name: string): ExtendedRegistryItem | null => {
  // Be permissive here so the homepage renders even if a registry item
  // doesn't strictly match the shadcn schema (useful while iterating).
  // @ts-expect-error - registry.items is not typed
  return registry.items.find((item) => item.name === name) ?? null
})

const toolNames = [
  "weather",
  "tool-news-search",
  "tool-calculator",
  "tool-translate",
  "tool-time-now",
  "tool-websearch",
  "tool-markdown",
]

export default async function Home() {
  // Demo data for all tools (runs on server). Tools are shipped unimplemented; use fallbacks for the gallery.
  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn()
    } catch {
      return fallback
    }
  }
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
  const weatherDemo: GetWeatherResult = await safe<GetWeatherResult>(
    // @ts-expect-error - getWeatherTool is not typed
    () => getWeatherTool.execute({ location: "San Francisco", unit: "C" }),
    weatherFallback
  )

  const newsFallback: NewsSearchResult = {
    topic: "AI",
    items: [
      { id: "ai-1", title: "AI breakthrough announced", url: "https://example.com/ai-1", publishedAt: new Date().toISOString() },
      { id: "ai-2", title: "New model sets benchmark", url: "https://example.com/ai-2", publishedAt: new Date().toISOString() },
      { id: "ai-3", title: "Tooling ecosystem expands" },
    ],
  }
  const newsDemo: NewsSearchResult = await safe<NewsSearchResult>(
    // @ts-expect-error - newsSearchTool is not typed
    () => newsSearchTool.execute({ topic: "AI", limit: 5 }),
    newsFallback
  )

  const calcFallback: CalculatorResult = { a: 7, b: 3, operator: "+", result: 10 }
  const calcDemo: CalculatorResult = await safe<CalculatorResult>(
    () => calculatorTool.execute({ a: 7, b: 3, operator: "+" }),
    calcFallback
  )

  const translateFallback: TranslateResult = { text: "Hello, world!", targetLanguage: "es", translated: "¡Hola, mundo!" }
  const translateDemo: TranslateResult = await safe<TranslateResult>(
    // @ts-expect-error - translateTool is not typed
    () => translateTool.execute({ text: "Hello, world!", targetLanguage: "es" }),
    translateFallback
  )

  const timeFallback: TimeNowResult = { timeZone: "UTC", iso: new Date().toISOString(), formatted: new Date().toUTCString() }
  const timeDemo: TimeNowResult = await safe<TimeNowResult>(
    // @ts-expect-error - timeNowTool is not typed
    () => timeNowTool.execute({ timeZone: "UTC", locale: "en-US" }),
    timeFallback
  )

  // Read actual registry item source files for copyable code display
  const read = (p: string) => fs.readFile(path.join(process.cwd(), p), "utf8")
  const [codeWeather, codeNews, codeCalc, codeTranslate, codeTime] = await Promise.all([
    read("registry/ai-tools/tools/weather/tool.ts"),
    read("registry/ai-tools/tools/news/tool.ts"),
    read("registry/ai-tools/tools/calculator/tool.ts"),
    read("registry/ai-tools/tools/translate/tool.ts"),
    read("registry/ai-tools/tools/time/tool.ts"),
  ])
  const [codeWeatherCmp, codeNewsCmp, codeWeb, codeWebCmp, codeMd, codeMdCmp] = await Promise.all([
    read("registry/ai-tools/tools/weather/component.tsx"),
    read("registry/ai-tools/tools/news/component.tsx"),
    read("registry/ai-tools/tools/websearch/tool.ts"),
    read("registry/ai-tools/tools/websearch/component.tsx"),
    read("registry/ai-tools/tools/markdown/tool.ts"),
    read("registry/ai-tools/tools/markdown/component.tsx"),
  ])

  const items = toolNames
    .map((name) => ({ name, item: getRegistryItemFromJson(name) }))
    .filter((x): x is { name: string; item: ExtendedRegistryItem } => x.item !== null)

  const pack = getRegistryItemFromJson("tool-pack")

  return (
    <main className="max-w-7xl mx-auto flex flex-col px-4 py-8 flex-1 gap-10 md:gap-12">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">AI Tools Registry</h1>
        <p className="text-sm text-muted-foreground">
          Install AI SDK tools into your project with the shadcn CLI. Some tools include UI components to render the result in your chat view. <br />
          To learn how to use tools, check out the AI SDK docs.
        </p>
        <p className="text-sm text-muted-foreground">
          To add your own tools to the AI Tools Registry, file a PR on our public <a href="https://github.com/xn1cklas/ai-tools-registry" target="_blank" rel="noreferrer" className="underline">GitHub repository</a>.
        </p>
        {pack && (
          <div className="flex items-center gap-2 mt-2">
            <AddCommand name={pack.name} />
            <OpenInV0 name={pack.name} />
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground"
              asChild
            >
              <a href="https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling" target="_blank" rel="noreferrer">
                Docs: AI SDK Tool Calling →
              </a>
            </Button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6">
        {/* Weather */}
        {(() => {
          const item = getRegistryItemFromJson("weather")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={weatherDemo}
              code={codeWeather}
              componentCode={codeWeatherCmp}
              renderer={<WeatherCard data={weatherDemo} />}
              heading="Get Weather"
              subheading="Returns weather for a location"
            />
          )
        })()}

        {/* News Search */}
        {(() => {
          const item = getRegistryItemFromJson("tool-news-search")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={newsDemo}
              code={codeNews}
              componentCode={codeNewsCmp}
              renderer={<NewsList data={newsDemo} />}
              heading="News Search"
              subheading="Returns headlines for a topic"
            />
          )
        })()}

        {/* Calculator */}
        {(() => {
          const item = getRegistryItemFromJson("tool-calculator")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={calcDemo}
              code={codeCalc}
              heading="Calculator"
              subheading="Basic arithmetic"
            />
          )
        })()}

        {/* Translate */}
        {(() => {
          const item = getRegistryItemFromJson("tool-translate")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={translateDemo}
              code={codeTranslate}
              heading="Translate"
              subheading="Translate text (mock)"
            />
          )
        })()}

        {/* Time Now */}
        {(() => {
          const item = getRegistryItemFromJson("tool-time-now")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={timeDemo}
              code={codeTime}
              heading="Time Now"
              subheading="Current time for timezone"
            />
          )
        })()}

        {/* Web Search */}
        {(() => {
          const item = getRegistryItemFromJson("tool-websearch")
          if (!item) return null
          const webFallback: WebSearchResult = {
            query: "chatgpt",
            results: [
              { title: "ChatGPT", url: "https://openai.com/index/chatgpt/", snippet: "ChatGPT is an AI model by OpenAI.", source: "openai.com" },
              { title: "ChatGPT on Wikipedia", url: "https://en.wikipedia.org/wiki/ChatGPT", snippet: "ChatGPT is a chatbot developed by OpenAI...", source: "wikipedia.org" },
            ],
          }
          const webDemo: WebSearchResult = webFallback
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={webDemo}
              code={codeWeb}
              componentCode={codeWebCmp}
              renderer={<WebSearchList data={webDemo} />}
              heading="Web Search"
              subheading="Search the web and show results"
            />
          )
        })()}

        {/* Markdown */}
        {(() => {
          const item = getRegistryItemFromJson("tool-markdown")
          if (!item) return null
          const mdFallback: MarkdownResult = {
            markdown: `# Hello World\n\nThis is **markdown**.\n\n- Item one\n- Item two\n\n> Tip: You can copy the tool code from the left.`,
          }
          const mdDemo: MarkdownResult = mdFallback
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={mdDemo}
              code={codeMd}
              componentCode={codeMdCmp}
              renderer={<MarkdownViewer data={mdDemo} />}
              heading="Markdown"
              subheading="Render markdown in your chat view"
            />
          )
        })()}
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-sm font-medium">All Tools</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ item }) => (
            <div key={item.name} className="border rounded-lg p-4 bg-muted/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{item.title}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2 min-h-[2lh]">
                {item.description}
              </div>
              <div className="flex gap-2 mt-auto">
                <AddCommand name={item.name} />
                <OpenInV0 name={item.name} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
