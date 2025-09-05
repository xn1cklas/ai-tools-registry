import { tool } from "ai"
import { z } from "zod"

export const MarkdownSchema = z.object({ markdown: z.string() })
export type MarkdownResult = z.infer<typeof MarkdownSchema>

export const markdownTool = tool({
  name: "markdown",
  description: "Render Markdown content (recommended in UI).",
  inputSchema: z.object({
    markdown: z.string().min(1),
  }),
  outputSchema: MarkdownSchema,
  execute: async ({ markdown }) => {
    return { markdown }
  },
})

export default markdownTool
