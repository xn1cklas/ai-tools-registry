import * as React from "react"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import registry from "@/registry.json"
import { Button } from "@/registry/ai-tools/ui/button"
import type { WebSearchResult } from "@/registry/ai-tools/tools/websearch/tool"
import type { MarkdownResult } from "@/registry/ai-tools/tools/markdown/tool"
import { ToolDemoCard } from "@/components/tool-demo-card"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"
import { loadDemos } from "@/lib/demos"

const getRegistryItemFromJson = React.cache(
  (name: string): ExtendedRegistryItem | null => {
    // Be permissive here so the homepage renders even if a registry item
    // doesn't strictly match the shadcn schema (useful while iterating).
    return registry.items.find((item) => item.name === name) ?? null
  }
)

const toolNames = [
  "stats",
  "weather",
  "news",
  "calculator",
  "translate",
  "time",
  "websearch",
  "markdown",
  "qrcode",
  "polar",
]

export default async function Home() {
  const demos = await loadDemos()

  const items = toolNames
    .map((name) => ({ name, item: getRegistryItemFromJson(name) }))
    .filter(
      (x): x is { name: string; item: ExtendedRegistryItem } => x.item !== null
    )

  const pack = getRegistryItemFromJson("tool-pack")

  return (
    <main className="max-w-7xl mx-auto flex flex-col px-4 py-8 flex-1 gap-10 md:gap-12">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">
          AI Tools Registry
        </h1>
        <p className="text-sm text-muted-foreground">
          Install AI SDK tools into your project with the shadcn CLI. Some tools
          include UI components to render the result in your chat view. <br />
          To learn how to use tools, check out the AI SDK docs.
        </p>
        <p className="text-sm text-muted-foreground">
          To add your own tools to the AI Tools Registry, file a PR on our
          public{" "}
          <a
            href="https://github.com/xn1cklas/ai-tools-registry"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            GitHub repository
          </a>
          .
        </p>
        {pack && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <AddCommand name={pack.name} />
            <OpenInV0 name={pack.name} />
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground"
              asChild
            >
              <a
                href="https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling"
                target="_blank"
                rel="noreferrer"
              >
                Docs: AI SDK Tool Calling →
              </a>
            </Button>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6">
        {/* Public Stats */}
        {(() => {
          const item = getRegistryItemFromJson("stats")
          if (!item || !demos.stats) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.stats.json}
              code={demos.stats.code}
              componentCode={demos.stats.componentCode}
              renderer={demos.stats.renderer}
              heading="Public Stats"
              subheading="Global M5+ earthquakes — last 30 days"
            />
          )
        })()}

        {/* Weather */}
        {(() => {
          const item = getRegistryItemFromJson("weather")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.weather.json}
              code={demos.weather.code}
              componentCode={demos.weather.componentCode}
              renderer={demos.weather.renderer}
              heading="Get Weather"
              subheading="Returns weather for a location"
            />
          )
        })()}

        {/* News */}
        {(() => {
          const item = getRegistryItemFromJson("news")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.news.json}
              code={demos.news.code}
              componentCode={demos.news.componentCode}
              renderer={demos.news.renderer}
              heading="News Search"
              subheading="Returns headlines for a topic"
            />
          )
        })()}

        {/* Calculator */}
        {(() => {
          const item = getRegistryItemFromJson("calculator")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.calculator.json}
              code={demos.calculator.code}
              heading="Calculator"
              subheading="Basic arithmetic"
            />
          )
        })()}

        {/* Translate */}
        {(() => {
          const item = getRegistryItemFromJson("translate")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.translate.json}
              code={demos.translate.code}
              heading="Translate"
              subheading="Translate text (mock)"
            />
          )
        })()}

        {/* Time */}
        {(() => {
          const item = getRegistryItemFromJson("time")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.time.json}
              code={demos.time.code}
              heading="Time Now"
              subheading="Current time for timezone"
            />
          )
        })()}

        {/* Web Search */}
        {(() => {
          const item = getRegistryItemFromJson("websearch")
          if (!item) return null
          const webDemo: WebSearchResult = demos.websearch.json
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={webDemo}
              code={demos.websearch.code}
              componentCode={demos.websearch.componentCode}
              renderer={demos.websearch.renderer}
              heading="Web Search"
              subheading="Search the web and show results"
            />
          )
        })()}

        {/* Markdown */}
        {(() => {
          const item = getRegistryItemFromJson("markdown")
          if (!item) return null
          const mdDemo: MarkdownResult = demos.markdown.json
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={mdDemo}
              code={demos.markdown.code}
              componentCode={demos.markdown.componentCode}
              renderer={demos.markdown.renderer}
              heading="Markdown"
              subheading="Render markdown in your chat view"
            />
          )
        })()}

        {/* QR Code */}
        {(() => {
          const item = getRegistryItemFromJson("qrcode")
          if (!item) return null
          return (
            <ToolDemoCard
              key={item.name}
              registryItem={item}
              json={demos.qrcode?.json}
              code={demos.qrcode?.code}
              componentCode={demos.qrcode?.componentCode}
              renderer={demos.qrcode?.renderer}
              heading="QR Code Generator"
              subheading="Generate QR codes for text or URLs"
            />
          )
        })()}
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-sm font-medium">All Tools</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ item }) => (
            <div
              key={item.name}
              className="border rounded-lg p-4 bg-muted/30 flex flex-col gap-3"
            >
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
