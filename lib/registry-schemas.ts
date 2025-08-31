import { z } from "zod"
import { registryItemSchema as baseRegistryItemSchema } from "shadcn/schema"

export const creatorSchema = z.object({
  name: z.string(),
  handle: z.string().optional(),
  url: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["author", "maintainer"]).optional(),
})

export const toolMetaSchema = z
  .object({
    kind: z.literal("tool"),
    hasRenderer: z.boolean().optional(),
  })
  .optional()

export type Creator = z.infer<typeof creatorSchema>
export type ToolMeta = z.infer<typeof toolMetaSchema>

export type ExtendedRegistryItem = z.infer<typeof baseRegistryItemSchema> & {
  creators?: Creator[]
  toolMeta?: ToolMeta
}

export function parseExtendedRegistryItem(raw: unknown): ExtendedRegistryItem | null {
  const parsed = baseRegistryItemSchema.safeParse(raw)
  if (!parsed.success) return null
  const base = parsed.data
  const rawObj: { creators?: unknown; toolMeta?: unknown } =
    typeof raw === "object" && raw !== null ? (raw as { creators?: unknown; toolMeta?: unknown }) : {}

  const creatorsParse = creatorSchema.array().optional().safeParse(rawObj.creators)
  const creators = creatorsParse.success ? creatorsParse.data : undefined

  const toolMetaParse = toolMetaSchema.safeParse(rawObj.toolMeta)
  const toolMeta = toolMetaParse.success ? toolMetaParse.data : undefined
  return { ...base, creators, toolMeta }
}
