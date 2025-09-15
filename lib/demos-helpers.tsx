import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

import { getItemFromRegistry } from "@/lib/registry"
import { resolveVariantRegistryName } from "@/lib/utils"

// Renderer modules are imported dynamically from registry item files
// Also import base renderers as a fallback to ensure bundling
import WeatherCard from "@/registry/ai-tools/tools/weather/component"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import { QRCodeDisplay } from "@/registry/ai-tools/tools/qrcode/component"
import { ImageGrid } from "@/registry/ai-tools/tools/image/component"

// Tools used for server-side demo generation where needed
import { qrCodeTool } from "@/registry/ai-tools/tools/qrcode/tool"

export type DemoEntry = {
  name: string
  heading: string
  subheading?: string
  json: unknown
  code: string
  componentCode?: string
  renderer?: React.ReactNode
  states?: Array<{ key: string; label: string; renderer: React.ReactNode }>
  variants?: Array<{
    key: string
    label: string
    json: unknown
    code: string
    renderer?: React.ReactNode
    states?: Array<{ key: string; label: string; renderer: React.ReactNode }>
  }>
  isNew?: boolean
}

async function importRendererFromItem(item: any, name: string) {
  const file = item?.files?.find((x: any) =>
    x.path.endsWith(`/tools/${name}/component.tsx`)
  )
  const importPath = file
    ? `@/${file.path}`
    : `@/registry/ai-tools/tools/${name}/component.tsx`
  try {
    const mod = await import(importPath)
    const Cmp = mod.default as React.ComponentType<any>
    return Cmp
  } catch {
    const fallback: Record<string, React.ComponentType<any> | undefined> = {
      weather: WeatherCard,
      news: NewsList,
      websearch: WebSearchList,
      stats: StatsChart,
      qrcode: QRCodeDisplay,
      image: ImageGrid,
    }
    return fallback[name]
  }
}

async function readJson<T>(p: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(path.join(process.cwd(), p), "utf8")
    return JSON.parse(data) as T
  } catch {
    return fallback
  }
}

function buildPart(name: string, output: unknown) {
  return {
    toolCallId: `tc_demo_${name}`,
    state: "output-available",
    input: {},
    output,
  }
}

async function codeFromItem(item: any, endsWith: string) {
  const f = item?.files?.find((x: any) => x.path.endsWith(endsWith))
  return f?.content ?? ""
}

async function codeFromVariantItem(variantItem: any, baseName: string) {
  if (!variantItem?.files) return ""
  // Prefer any tool file inside the base tool directory
  const preferred = variantItem.files.find(
    (x: any) =>
      x.path.includes(`/tools/${baseName}/`) && x.path.endsWith("tool.ts")
  )
  if (preferred?.content) return preferred.content
  // Fallback to any file ending in tool.ts
  const anyTool = variantItem.files.find((x: any) => x.path.endsWith("tool.ts"))
  return anyTool?.content ?? ""
}

async function loadBaseFixture(name: string) {
  const basePath = `registry/ai-tools/tools/${name}/fixtures/demo.json`
  switch (name) {
    case "weather":
      return readJson(basePath, {
        location: "San Francisco",
        unit: "C",
        temperature: 21,
        condition: "Sunny",
        high: 24,
        low: 18,
        humidity: 0.45,
        windKph: 8,
        icon: "weather-sun",
      })
    case "news":
      return readJson(basePath, {
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
      })
    case "websearch":
      return readJson(basePath, { query: "chatgpt", results: [] })
    case "stats":
      return readJson(basePath, { title: "Public Stats", series: [] })
    case "qrcode": {
      // Try server-side generation; fallback to fixture
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          "https://ai-tools-registry.vercel.app"
        // @ts-expect-error - not typed here
        return await qrCodeTool.execute({ data: baseUrl, size: 300 })
      } catch {
        return readJson(basePath, {
          data: "https://ai-tools-registry.vercel.app",
          size: 300,
          output:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABr1J7mAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAAHaTzTgAAAANSURBVHicY2AAAAACAAHiIbwzAAAAAElFTkSuQmCC",
        })
      }
    }
    case "image":
      return readJson(basePath, {
        provider: "demo",
        prompt: "A serene landscape with mountains at sunrise",
        images: [
          { url: "https://picsum.photos/seed/ai-tools-1/640/640" },
          { url: "https://picsum.photos/seed/ai-tools-2/640/640" },
        ],
        aspectRatio: "1:1",
      })
    default:
      return readJson(basePath, {})
  }
}

async function discoverVariants(baseName: string) {
  // Discover variant registry items by prefix (e.g., websearch-*, image-*)
  const reg = (await import("@/registry.json")).default as {
    items: Array<{ name: string; title?: string }>
  }
  const pref = `${baseName}-`
  const PROVIDER_LABELS: Record<string, string> = {
    ddg: "DuckDuckGo",
    brave: "Brave",
    exa: "EXA",
    perplexity: "Perplexity",
    openai: "OpenAI",
    fal: "FAL.ai",
    runware: "Runware",
  }
  return reg.items
    .filter((it) => it.name.startsWith(pref))
    .map((it) => {
      const key = it.name.slice(pref.length)
      const fallback = key.charAt(0).toUpperCase() + key.slice(1)
      return { key, label: PROVIDER_LABELS[key] || fallback }
    })
}

export async function buildDemos(names: string[]) {
  const items = await Promise.all(names.map((n) => getItemFromRegistry(n)))

  const demosEntries = await Promise.all(
    names.map(async (name, idx) => {
      const item = items[idx]
      const json = await loadBaseFixture(name)
      const heading =
        (item as any)?.toolMeta?.demoHeading || (item as any)?.title || name
      const subheading =
        (item as any)?.toolMeta?.demoSubheading || (item as any)?.description
      const code = await codeFromItem(item, `/tools/${name}/tool.ts`)
      const componentCode = await codeFromItem(
        item,
        `/tools/${name}/component.tsx`
      )
      const RendererCmp = await importRendererFromItem(item, name)
      const basePart = buildPart(name, json)
      const renderer = RendererCmp ? <RendererCmp {...basePart} /> : undefined

      const STATE_OPTIONS = [
        { key: "completed", label: "Completed", state: "output-available" },
        { key: "running", label: "Running", state: "input-available" },
        { key: "pending", label: "Pending", state: "input-streaming" },
        { key: "error", label: "Error", state: "output-error" },
      ] as const
      const states = RendererCmp
        ? STATE_OPTIONS.map((opt) => {
            const part = {
              ...basePart,
              state: opt.state,
              output: opt.state === "output-available" ? json : undefined,
              errorText:
                opt.state === "output-error" ? "Demo error" : undefined,
            }
            return {
              key: opt.key,
              label: opt.label,
              renderer: <RendererCmp {...part} />,
            }
          })
        : undefined

      const discovered = await discoverVariants(name)
      const variantResults = await Promise.all(
        discovered.map(async ({ key, label }) => {
          const variantName = resolveVariantRegistryName(name, key)
          const variantItem = await getItemFromRegistry(variantName)
          const variantCode = await codeFromVariantItem(variantItem, name)
          if (!variantCode) return null
          const part = { ...basePart, toolCallId: `tc_demo_${name}_${key}` }
          const variantRenderer = RendererCmp ? (
            <RendererCmp {...part} />
          ) : undefined
          const variantStates = RendererCmp
            ? STATE_OPTIONS.map((opt) => {
                const vpart = {
                  ...part,
                  state: opt.state,
                  output: opt.state === "output-available" ? json : undefined,
                  errorText:
                    opt.state === "output-error" ? "Demo error" : undefined,
                }
                return {
                  key: opt.key,
                  label: opt.label,
                  renderer: <RendererCmp {...vpart} />,
                }
              })
            : undefined
          return {
            key,
            label,
            json,
            code: variantCode,
            renderer: variantRenderer,
            states: variantStates,
          }
        })
      )
      const variants = variantResults.filter(Boolean) as NonNullable<
        (typeof variantResults)[number]
      >[]

      const entry: DemoEntry = {
        name,
        heading,
        subheading,
        json,
        code,
        componentCode,
        renderer,
        states,
        variants: variants.length ? variants : undefined,
        isNew: (item as any)?.toolMeta?.isNew === true,
      }
      return entry
    })
  )

  const demos = Object.fromEntries(
    demosEntries.map((e) => [e.name, e])
  ) as Record<string, DemoEntry>
  const entries = [...names].sort(
    (a, b) => (demos[b]?.isNew ? 1 : 0) - (demos[a]?.isNew ? 1 : 0)
  )

  return { ...demos, entries }
}

export async function loadDemosFromRegistry() {
  // Discover base tools dynamically by scanning registry files under registry/ai-tools/tools/<base>/
  const reg = (await import("@/registry.json")).default as {
    items: Array<{ name: string; files?: Array<{ path: string }> }>
  }
  const baseNames = new Set<string>()
  for (const item of reg.items) {
    for (const f of item.files || []) {
      const m = f.path.match(/^registry\/ai-tools\/tools\/([^/]+)\//)
      if (m && m[1]) baseNames.add(m[1])
    }
  }
  return buildDemos(Array.from(baseNames))
}
