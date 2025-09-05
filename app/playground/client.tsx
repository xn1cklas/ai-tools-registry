"use client"

import * as React from "react"
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { MarkdownViewer } from "@/registry/ai-tools/tools/markdown/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { Button } from "@/registry/ai-tools/ui/button"
import { Input } from "@/registry/ai-tools/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { ScrollArea } from "@/components/ui/lina-scroll-area"

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "tool"; name: string; renderer: React.ReactNode }

export default function Playground() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [tool, setTool] = React.useState<string>("weather")
  const [renderers, setRenderers] = React.useState<
    Record<string, React.ReactNode>
  >({})
  const [toolLoading, setToolLoading] = React.useState(false)

  React.useEffect(() => {
    // Fetch demo JSON from server API to match homepage demos
    fetch("/api/demos")
      .then((r) => r.json())
      .then((d) => {
        setRenderers({
          weather: (
            <WeatherCard
              type="tool-weather"
              toolCallId="demo-weather"
              state="output-available"
              input={{
                location: d.weather.json.location,
                unit: d.weather.json.unit,
              }}
              output={d.weather.json}
            />
          ),
          news: (
            <NewsList
              type="tool-news"
              toolCallId="demo-news"
              state="output-available"
              input={{
                // best-effort reconstruction of input for demo purposes
                topic: d.news.json.topic,
                limit: Array.isArray(d.news.json.items)
                  ? d.news.json.items.length || 5
                  : 5,
              }}
              output={d.news.json}
            />
          ),
          websearch: (
            <WebSearchList
              type="tool-websearch"
              toolCallId="demo-websearch"
              state="output-available"
              input={{
                query: d.websearch.json.query,
                limit: Array.isArray(d.websearch.json.results)
                  ? d.websearch.json.results.length || 5
                  : 5,
              }}
              output={d.websearch.json}
            />
          ),
          markdown: (
            <MarkdownViewer
              type="tool-markdown"
              toolCallId="demo-markdown"
              state="output-available"
              input={{ markdown: d.markdown.json.markdown }}
              output={d.markdown.json}
            />
          ),
          stats: d.stats?.json ? (
            <StatsChart
              type="tool-stats"
              toolCallId="demo-stats"
              state="output-available"
              input={{ daysBack: 30, minMagnitude: 5 }}
              output={d.stats.json}
            />
          ) : (
            <StatsChart
              type="tool-stats"
              toolCallId="demo-stats"
              state="input-streaming"
              input={undefined}
            />
          ),
        })
      })
      .catch(() => {
        // If API fails, provide minimal renderers
        setRenderers({
          weather: (
            <WeatherCard
              type="tool-weather"
              toolCallId="demo-weather"
              state="output-available"
              input={{ location: "", unit: "C" }}
              output={{
                location: "",
                unit: "C",
                temperature: 0,
                condition: "",
                high: 0,
                low: 0,
                humidity: 0,
                windKph: 0,
              }}
            />
          ),
          news: (
            <NewsList
              type="tool-news"
              toolCallId="demo-news"
              state="output-available"
              input={{ topic: "", limit: 0 }}
              output={{ topic: "", items: [] }}
            />
          ),
          websearch: (
            <WebSearchList
              type="tool-websearch"
              toolCallId="demo-websearch"
              state="output-available"
              input={{ query: "", limit: 0 }}
              output={{ query: "", results: [] }}
            />
          ),
          markdown: (
            <MarkdownViewer
              type="tool-markdown"
              toolCallId="demo-markdown"
              state="output-available"
              input={{ markdown: "" }}
              output={{ markdown: "" }}
            />
          ),
          stats: (
            <StatsChart
              type="tool-stats"
              toolCallId="demo-stats"
              state="input-streaming"
              input={undefined}
            />
          ),
        })
      })
  }, [])

  const send = () => {
    if (!input.trim()) return
    setMessages((m) => [...m, { role: "user", content: input }])
    setInput("")
    // Mock assistant echo
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: "Got it!" }])
    }, 200)
  }

  const insertTool = () => {
    const renderer = renderers[tool]
    if (!renderer) return
    setToolLoading(true)
    // Simulate ChatGPT-like thinking before tool result arrives
    setTimeout(() => {
      setMessages((m) => [...m, { role: "tool", name: tool, renderer }])
      setToolLoading(false)
    }, 1200)
  }

  const areaRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const el = areaRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, toolLoading])

  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-4 flex-1 min-h-0">
      <h1 className="text-2xl font-semibold">Playground</h1>
      <p className="text-sm text-muted-foreground">
        Mock chat view for testing tool renderers. No AI key required.
      </p>

      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col">
          <ScrollArea
            ref={areaRef}
            className="flex-1 min-h-0 pr-2 mb-3"
            data-slot="scroll-area"
          >
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div key={i} className="flex">
                  {m.role === "user" && (
                    <div className="ml-auto rounded-lg bg-primary/10 px-3 py-2">
                      <div className="text-sm">{m.content}</div>
                    </div>
                  )}
                  {m.role === "assistant" && (
                    <div className="mr-auto rounded-lg bg-muted px-3 py-2">
                      <div className="text-sm">{m.content}</div>
                    </div>
                  )}
                  {m.role === "tool" && (
                    <div className="mr-auto rounded-lg border bg-card px-3 py-2 w-full max-w-xl">
                      <div className="text-xs text-muted-foreground mb-2">
                        Tool: {m.name}
                      </div>
                      <div>{m.renderer}</div>
                    </div>
                  )}
                </div>
              ))}
              {toolLoading && (
                <div className="flex">
                  <div className="mr-auto rounded-lg bg-muted px-3 py-2">
                    <div className="text-sm flex items-center gap-2">
                      <span className="inline-flex gap-1 items-end">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground/70 animate-bounce [animation-delay:-200ms]"></span>
                        <span className="h-2 w-2 rounded-full bg-foreground/70 animate-bounce [animation-delay:-100ms]"></span>
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground/70 animate-bounce"></span>
                      </span>
                      <span className="text-muted-foreground">Thinking…</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 mt-auto">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send()
              }}
            />
            <Button onClick={send}>Send</Button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <select
              className="border rounded-md px-2 py-1 bg-background text-sm"
              value={tool}
              onChange={(e) => setTool(e.target.value)}
            >
              <option value="weather">Weather</option>
              <option value="news">News</option>
              <option value="websearch">Web Search</option>
              <option value="markdown">Markdown</option>
              <option value="stats">Public Stats</option>
            </select>
            <Button
              variant="outline"
              onClick={insertTool}
              disabled={toolLoading}
            >
              {toolLoading ? (
                <span className="inline-flex items-center">
                  Inserting
                  <span className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                </span>
              ) : (
                "Insert Tool Result"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
