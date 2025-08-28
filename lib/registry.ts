import path from "path"
import { promises as fs } from "fs"
import { registryItemSchema } from "shadcn/schema"

export async function getItemFromRegistry(name: string) {
  const registryData = await import("@/registry.json")
  const registry = registryData.default

  if (name === "registry") {
    return registry
  }

  const component = registry.items.find((c) => c.name === name)

  if (!component) {
    return null
  }

  const parsed = registryItemSchema.parse(component)

  if (!parsed) {
    return null
  }

  if (!parsed.files?.length) {
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
