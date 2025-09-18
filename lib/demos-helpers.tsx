import * as React from "react"
import { promises as fs } from "fs"
import path from "path"

import { getItemFromRegistry } from "@/lib/registry"
import { resolveVariantRegistryName } from "@/lib/utils"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"
import type { UIToolInvocation, Tool, UITool } from "ai"

// Renderer modules are imported dynamically from registry item files.
// No static knowledge of specific tools here to keep this file generic.

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

type AnyUITool = Tool | UITool

type InvocationState = UIToolInvocation<AnyUITool>["state"]

type RendererComponent = React.ComponentType<{
  invocation: UIToolInvocation<AnyUITool>
}>

type PossibleModuleShape = {
  default?: unknown
  [exportName: string]: unknown
}

type RegistryFile = { path: string; content?: string }

type RegistryLikeItem = {
  name?: string
  title?: string
  description?: string
  toolMeta?: {
    isNew?: boolean
    demoHeading?: string
    demoSubheading?: string
  }
  files?: RegistryFile[]
}

function isRendererComponent(value: unknown): value is RendererComponent {
  return typeof value === "function"
}

async function importRendererFromItem(
  _item: RegistryLikeItem,
  name: string
): Promise<RendererComponent | undefined> {
  const selectCmp = (mod: unknown): RendererComponent | undefined => {
    if (!mod || typeof mod !== "object") return undefined
    const m = mod as PossibleModuleShape
    if (isRendererComponent(m.default)) return m.default
    const candidateKey = Object.keys(m).find((k) =>
      /^(?:[A-Z]|_)[A-Za-z0-9_]*$/.test(k)
    )
    const candidate = candidateKey ? (m[candidateKey] as unknown) : undefined
    return isRendererComponent(candidate) ? candidate : undefined
  }
  // Try importing the concrete component file; ensure bundling via webpackInclude
  try {
    const mod = (await import(
      /* webpackInclude: /registry\/ai-tools\/tools\/[^/]+\/component\.(tsx|jsx|js)$/ */
      `@/registry/ai-tools/tools/${name}/component.tsx`
    )) as unknown
    const Cmp = selectCmp(mod)
    if (Cmp) return Cmp
  } catch {}
  // Fallback: import the tool's index, then pick a React-looking export
  try {
    const mod = (await import(
      /* webpackInclude: /registry\/ai-tools\/tools\/[^/]+\/index\.(ts|js)$/ */
      `@/registry/ai-tools/tools/${name}`
    )) as unknown
    const Cmp = selectCmp(mod)
    if (Cmp) return Cmp
  } catch {}
  return undefined
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
    state: "output-available" as InvocationState,
    input: {},
    output,
  } as unknown as UIToolInvocation<AnyUITool>
}

async function codeFromItem(item: RegistryLikeItem, endsWith: string) {
  const f = item?.files?.find((x) => x.path.endsWith(endsWith))
  return f?.content ?? ""
}

async function codeFromVariantItem(
  variantItem: RegistryLikeItem,
  baseName: string
) {
  if (!variantItem?.files) return ""
  // Prefer any tool file inside the base tool directory
  const preferred = variantItem.files.find(
    (x) => x.path.includes(`/tools/${baseName}/`) && x.path.endsWith("tool.ts")
  )
  if (preferred?.content) return preferred.content
  // Fallback to any file ending in tool.ts
  const anyTool = variantItem.files.find((x) => x.path.endsWith("tool.ts"))
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
          { url: "https://avatars.githubusercontent.com/haydenbleasel" },
          { url: "https://avatars.githubusercontent.com/shadcn" },
          { url: "https://avatars.githubusercontent.com/nicoalbanese" },
          { url: "https://avatars.githubusercontent.com/rauchg" },
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
  const items = (await Promise.all(
    names.map((n) => getItemFromRegistry(n))
  )) as Array<ExtendedRegistryItem | null>

  const demosEntries = await Promise.all(
    names.map(async (name, idx) => {
      const item = items[idx] as ExtendedRegistryItem | null
      const itemLike = (item ?? {}) as RegistryLikeItem
      const json = await loadBaseFixture(name)
      const heading = itemLike?.toolMeta?.demoHeading || itemLike?.title || name
      const subheading =
        itemLike?.toolMeta?.demoSubheading || itemLike?.description
      const code = await codeFromItem(itemLike, `/tools/${name}/tool.ts`)
      const componentCode = await codeFromItem(
        itemLike,
        `/tools/${name}/component.tsx`
      )
      const RendererCmp = await importRendererFromItem(itemLike, name)
      const basePart = buildPart(name, json)
      const renderer = RendererCmp ? (
        <RendererCmp invocation={basePart} />
      ) : undefined

      const STATE_OPTIONS: ReadonlyArray<{
        key: string
        label: string
        state: InvocationState
      }> = [
        { key: "completed", label: "Completed", state: "output-available" },
        { key: "running", label: "Running", state: "input-available" },
        { key: "pending", label: "Pending", state: "input-streaming" },
        { key: "error", label: "Error", state: "output-error" },
      ]
      const states = RendererCmp
        ? STATE_OPTIONS.map((opt) => {
            const part = {
              ...basePart,
              state: opt.state,
              output: opt.state === "output-available" ? json : undefined,
              errorText:
                opt.state === "output-error" ? "Demo error" : undefined,
            } as unknown as UIToolInvocation<AnyUITool>
            return {
              key: opt.key,
              label: opt.label,
              renderer: <RendererCmp invocation={part} />,
            }
          })
        : undefined

      const discovered = await discoverVariants(name)
      const variantResults = await Promise.all(
        discovered.map(async ({ key, label }) => {
          const variantName = resolveVariantRegistryName(name, key)
          const variantItem = (await getItemFromRegistry(
            variantName
          )) as ExtendedRegistryItem | null
          const variantItemLike = (variantItem ?? {}) as RegistryLikeItem
          const variantCode = await codeFromVariantItem(variantItemLike, name)
          if (!variantCode) return null
          const part = {
            ...basePart,
            toolCallId: `tc_demo_${name}_${key}`,
          } as unknown as UIToolInvocation<AnyUITool>
          const variantRenderer = RendererCmp ? (
            <RendererCmp invocation={part} />
          ) : undefined
          const variantStates = RendererCmp
            ? STATE_OPTIONS.map((opt) => {
                const vpart = {
                  ...part,
                  state: opt.state,
                  output: opt.state === "output-available" ? json : undefined,
                  errorText:
                    opt.state === "output-error" ? "Demo error" : undefined,
                } as unknown as UIToolInvocation<AnyUITool>
                return {
                  key: opt.key,
                  label: opt.label,
                  renderer: <RendererCmp invocation={vpart} />,
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
        isNew: itemLike?.toolMeta?.isNew === true,
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
