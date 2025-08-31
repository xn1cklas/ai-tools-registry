import path from "path"
import { promises as fs } from "fs"
import { registryItemSchema } from "shadcn/schema"
import { parseExtendedRegistryItem } from "@/lib/registry-schemas"

export async function getItemFromRegistry(name: string) {
  const registryData = await import("@/registry.json")
  const registry = registryData.default

  if (name === "registry") {
    return registry
  }

  const raw = registry.items.find((c) => c.name === name)

  if (!raw) {
    return null
  }

  // Parse with base schema, then attach any extended fields (creators, toolMeta).
  const parsedBase = registryItemSchema.parse(raw)
  const extended = parseExtendedRegistryItem(raw)
  const parsed = { ...(extended ?? parsedBase) }

  if (!parsed) {
    return null
  }

  // Allow returning "block" items (e.g. packs) that intentionally have no files
  // but do define `registryDependencies`. These are valid registry entries that
  // v0 can consume to install dependent tools.
  const isPackLike =
    parsed.type === "registry:block" ||
    (Array.isArray((parsed as any).registryDependencies) &&
      (parsed as any).registryDependencies.length > 0)

  if (!parsed.files?.length) {
    if (isPackLike) {
      return parsed
    }
    return null
  }

  const filesWithContent = await Promise.all(
    parsed.files.map(async (file) => {
      const filePath = path.join(process.cwd(), file.path)
      const content = await fs.readFile(filePath, "utf8")
      return { ...file, content }
    })
  )

  return { ...parsed, files: filesWithContent }
}
