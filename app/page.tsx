import * as React from "react"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import registry from "@/registry.json"
import { Separator } from "@/registry/alpine/ui/separator"
import { Button } from "@/registry/alpine/ui/button"
import { WeatherCard } from "@/registry/alpine/tools/components/weather-card"
import { NewsList } from "@/registry/alpine/tools/components/news-list"
import { getWeatherTool } from "@/registry/alpine/tools/get-weather"
import { newsSearchTool } from "@/registry/alpine/tools/news-search"
import { calculatorTool } from "@/registry/alpine/tools/calculator"
import { translateTool } from "@/registry/alpine/tools/translate"
import { timeNowTool } from "@/registry/alpine/tools/time-now"
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
  // Demo data for all tools (runs on server, mock implementations)
  const weatherDemo = await getWeatherTool.execute({ location: "San Francisco", unit: "C" })
  const newsDemo = await newsSearchTool.execute({ topic: "AI", limit: 5 })
  const calcDemo = await calculatorTool.execute({ a: 7, b: 3, operator: "+" })
  const translateDemo = await translateTool.execute({ text: "Hello, world!", targetLanguage: "es" })
  const timeDemo = await timeNowTool.execute({ timeZone: "UTC", locale: "en-US" })

  const items = toolNames
    .map((name) => ({ name, item: getRegistryItemFromJson(name) }))
    .filter((x) => Boolean(x.item)) as { name: string; item: NonNullable<ReturnType<typeof getRegistryItemFromJson>> }[]

  const pack = getRegistryItemFromJson("tool-pack")

  return (
    <main className="max-w-7xl mx-auto flex flex-col px-4 py-8 flex-1 gap-10 md:gap-12">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">AI Tools Registry</h1>
        <p className="text-sm text-muted-foreground">
          Install AI SDK tool definitions (and optional result components) into your project with the shadcn CLI.
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

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weather */}
        {(() => {
          const item = getRegistryItemFromJson("tool-get-weather")
          if (!item) return null
          const code = `import { tool } from 'ai'\nimport { getWeatherTool } from '@/registry/alpine/tools/get-weather'\n\n// Register with AI SDK\nexport const tools = {\n  [getWeatherTool.name]: tool({\n    description: getWeatherTool.description,\n    parameters: getWeatherTool.parameters,\n    execute: getWeatherTool.execute,\n  }),\n}\n\n// Manual call (for testing)\nconst result = await getWeatherTool.execute({ location: 'San Francisco', unit: 'C' })\nconsole.log(result)`
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={weatherDemo}
              code={code}
              renderer={<WeatherCard data={weatherDemo} />}
              heading="Tool: Get Weather"
              subheading="Returns weather for a location"
            />
          )
        })()}

        {/* News Search */}
        {(() => {
          const item = getRegistryItemFromJson("tool-news-search")
          if (!item) return null
          const code = `import { tool } from 'ai'\nimport { newsSearchTool } from '@/registry/alpine/tools/news-search'\n\nexport const tools = {\n  [newsSearchTool.name]: tool({\n    description: newsSearchTool.description,\n    parameters: newsSearchTool.parameters,\n    execute: newsSearchTool.execute,\n  }),\n}\n\nconst result = await newsSearchTool.execute({ topic: 'AI', limit: 5 })\nconsole.log(result)`
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={newsDemo}
              code={code}
              renderer={<NewsList data={newsDemo} />}
              heading="Tool: News Search"
              subheading="Returns headlines for a topic"
            />
          )
        })()}

        {/* Calculator */}
        {(() => {
          const item = getRegistryItemFromJson("tool-calculator")
          if (!item) return null
          const code = `import { tool } from 'ai'\nimport { calculatorTool } from '@/registry/alpine/tools/calculator'\n\nexport const tools = {\n  [calculatorTool.name]: tool({\n    description: calculatorTool.description,\n    parameters: calculatorTool.parameters,\n    execute: calculatorTool.execute,\n  }),\n}\n\nconst result = await calculatorTool.execute({ a: 7, b: 3, operator: '+' })\nconsole.log(result)`
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={calcDemo}
              code={code}
              heading="Tool: Calculator"
              subheading="Basic arithmetic"
            />
          )
        })()}

        {/* Translate */}
        {(() => {
          const item = getRegistryItemFromJson("tool-translate")
          if (!item) return null
          const code = `import { tool } from 'ai'\nimport { translateTool } from '@/registry/alpine/tools/translate'\n\nexport const tools = {\n  [translateTool.name]: tool({\n    description: translateTool.description,\n    parameters: translateTool.parameters,\n    execute: translateTool.execute,\n  }),\n}\n\nconst result = await translateTool.execute({ text: 'Hello, world!', targetLanguage: 'es' })\nconsole.log(result)`
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={translateDemo}
              code={code}
              heading="Tool: Translate"
              subheading="Translate text (mock)"
            />
          )
        })()}

        {/* Time Now */}
        {(() => {
          const item = getRegistryItemFromJson("tool-time-now")
          if (!item) return null
          const code = `import { tool } from 'ai'\nimport { timeNowTool } from '@/registry/alpine/tools/time-now'\n\nexport const tools = {\n  [timeNowTool.name]: tool({\n    description: timeNowTool.description,\n    parameters: timeNowTool.parameters,\n    execute: timeNowTool.execute,\n  }),\n}\n\nconst result = await timeNowTool.execute({ timeZone: 'UTC', locale: 'en-US' })\nconsole.log(result)`
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={timeDemo}
              code={code}
              heading="Tool: Time Now"
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
