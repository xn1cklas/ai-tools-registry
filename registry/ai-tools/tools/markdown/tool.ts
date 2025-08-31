import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tool } from "ai"

export interface MarkdownResult {
  markdown: string
}

export const markdownTool: /* Tool */ any = {
  name: "markdown",
  description: "Render Markdown content (recommended in UI).",
  inputSchema: z.object({
    markdown: z.string().min(1),
  }),
  execute: async ({
    markdown,
  }: {
    markdown: string
  }): Promise<MarkdownResult> => {
    throw new Error(
      "markdown not implemented. Use this tool to transport markdown; render with a UI component. Return { markdown }."
    )
  },
}

export default markdownTool
