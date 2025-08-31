import { tool } from "ai"
import { z } from "zod"

export interface MarkdownResult {
  markdown: string
}

export const markdownTool = tool({
  description: "Render Markdown content (recommended in UI).",
  inputSchema: z.object({
    markdown: z.string().min(1),
  }),
  execute: async ({ markdown }) => {
    return { markdown }
  },
})

export default markdownTool
