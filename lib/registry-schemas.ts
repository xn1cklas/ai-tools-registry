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
  const creators = creatorSchema.array().optional().safeParse((raw as any)?.creators).success
    ? ((raw as any)?.creators as Creator[])
    : undefined
  const toolMeta = toolMetaSchema.safeParse((raw as any)?.toolMeta).success
    ? ((raw as any)?.toolMeta as ToolMeta)
    : undefined
  return { ...base, creators, toolMeta }
}

