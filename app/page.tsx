import * as React from "react"
import { promises as fs } from "fs"
import path from "path"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import registry from "@/registry.json"
import { Separator } from "@/registry/alpine/ui/separator"
import { Button } from "@/registry/alpine/ui/button"
import { WeatherCard } from "@/registry/alpine/tools/weather/component"
import { NewsList } from "@/registry/alpine/tools/news/component"
import { getWeatherTool } from "@/registry/alpine/tools/weather/tool"
import { newsSearchTool } from "@/registry/alpine/tools/news/tool"
import { calculatorTool } from "@/registry/alpine/tools/calculator/tool"
import { translateTool } from "@/registry/alpine/tools/translate/tool"
import { timeNowTool } from "@/registry/alpine/tools/time/tool"
import { ToolDemoCard } from "@/components/tool-demo-card"

const getRegistryItemFromJson = React.cache((name: string) => {
  // Be permissive here so the homepage renders even if a registry item
  // doesn't strictly match the shadcn schema (useful while iterating).
  return registry.items.find((item) => item.name === name) ?? null
})

const toolNames = [
  "tool-get-weather",
  "tool-news-search",
  "tool-calculator",
  "tool-translate",
  "tool-time-now",
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
  const weatherDemo = await safe(
    () => getWeatherTool.execute({ location: "San Francisco", unit: "C" }),
    {
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
  )
  const newsDemo = await safe(
    () => newsSearchTool.execute({ topic: "AI", limit: 5 }),
    {
      topic: "AI",
      items: [
        { id: "ai-1", title: "AI breakthrough announced", url: "https://example.com/ai-1", publishedAt: new Date().toISOString() },
        { id: "ai-2", title: "New model sets benchmark", url: "https://example.com/ai-2", publishedAt: new Date().toISOString() },
        { id: "ai-3", title: "Tooling ecosystem expands" },
      ],
    }
  )
  const calcDemo = await safe(
    () => calculatorTool.execute({ a: 7, b: 3, operator: "+" }),
    { a: 7, b: 3, operator: "+", result: 10 }
  )
  const translateDemo = await safe(
    () => translateTool.execute({ text: "Hello, world!", targetLanguage: "es" }),
    { text: "Hello, world!", targetLanguage: "es", translated: "¡Hola, mundo!" }
  )
  const timeDemo = await safe(
    () => timeNowTool.execute({ timeZone: "UTC", locale: "en-US" }),
    { timeZone: "UTC", iso: new Date().toISOString(), formatted: new Date().toUTCString() }
  )

  // Read actual registry item source files for copyable code display
  const read = (p: string) => fs.readFile(path.join(process.cwd(), p), "utf8")
  const [codeWeather, codeNews, codeCalc, codeTranslate, codeTime] = await Promise.all([
    read("registry/alpine/tools/weather/tool.ts"),
    read("registry/alpine/tools/news/tool.ts"),
    read("registry/alpine/tools/calculator/tool.ts"),
    read("registry/alpine/tools/translate/tool.ts"),
    read("registry/alpine/tools/time/tool.ts"),
  ])

  const items = toolNames
    .map((name) => ({ name, item: getRegistryItemFromJson(name) }))
    .filter((x) => Boolean(x.item)) as { name: string; item: NonNullable<ReturnType<typeof getRegistryItemFromJson>> }[]

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
          To add your own tools to the ai tools registry, file a PR on our public <a href="https://github.com/shadcn/ai-tools-registry" target="_blank" rel="noreferrer" className="underline">GitHub repository</a>.
        </p>
        {pack && (
          <div className="flex items-center gap-2 mt-2">
            <AddCommand registryItem={pack} />
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
          const item = getRegistryItemFromJson("tool-get-weather")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={weatherDemo}
              code={codeWeather}
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
                <AddCommand registryItem={item} />
                <OpenInV0 name={item.name} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
