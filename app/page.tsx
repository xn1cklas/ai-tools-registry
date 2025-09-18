import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import { Button } from "@/registry/ai-tools/ui/button"
import { ToolDemoCard } from "@/components/tool-demo-card"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"
import PageWideScrollMask from "@/components/page-wide-adaptive-mask"
import { resolveVariantRegistryName } from "@/lib/utils"
import { loadDemosFromRegistry, type DemoEntry } from "@/lib/demos-helpers"
import { cache } from "react"

type RegistryJson = {
  items: Array<ExtendedRegistryItem & { toolMeta?: { kind?: string } }>
}

const getRegistryData = cache(async (): Promise<RegistryJson> => {
  return (await import("@/registry.json")).default as RegistryJson
})

export const getRegistryItemFromJson = cache(
  async (name: string): Promise<ExtendedRegistryItem | null> => {
    const registry = await getRegistryData()
    const match = registry.items.find((item) => item.name === name)
    return (match ?? null) as ExtendedRegistryItem | null
  }
)

export default async function Home() {
  const [demosRecord, registryData] = await Promise.all([
    loadDemosFromRegistry(),
    getRegistryData(),
  ])

  const registryMap = new Map<string, ExtendedRegistryItem>()
  for (const raw of registryData.items) {
    if (raw?.name) {
      registryMap.set(raw.name, raw)
    }
  }

  const demoOrder = demosRecord.entries ?? []
  const demos = demosRecord as unknown as Record<string, DemoEntry>

  const preparedDemos = demoOrder
    .map((name) => {
      const entry = demos[name]
      if (!entry) return null
      const item = registryMap.get(entry.name)
      if (!item) return null

      const variantRegistryItems = entry.variants
        ? (Object.fromEntries(
            entry.variants.map((variant) => {
              const targetName = resolveVariantRegistryName(
                entry.name,
                variant.key
              )
              return [variant.key, registryMap.get(targetName)] as const
            })
          ) as Record<string, ExtendedRegistryItem | undefined>)
        : undefined

      return { entry, item, variantRegistryItems }
    })
    .filter(Boolean) as Array<{
    entry: DemoEntry
    item: ExtendedRegistryItem
    variantRegistryItems?: Record<string, ExtendedRegistryItem | undefined>
  }>

  const tools = registryData.items
    .filter((tool) => tool.toolMeta?.kind === "tool" && tool.name)
    .map((tool) => registryMap.get(tool.name))
    .filter((item): item is ExtendedRegistryItem => Boolean(item))

  const pack = registryMap.get("tool-pack") ?? null

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
        {preparedDemos.map(({ entry, item, variantRegistryItems }) => (
          <ToolDemoCard
            key={item.name}
            registryItem={item}
            json={entry.json}
            code={entry.code}
            componentCode={entry.componentCode}
            renderer={entry.renderer}
            states={entry.states}
            heading={entry.heading}
            subheading={entry.subheading}
            variants={entry.variants}
            variantRegistryItems={variantRegistryItems}
            isNew={Boolean(entry.isNew)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-sm font-medium">All Tools</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((item) => (
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
      <PageWideScrollMask />
    </main>
  )
}
