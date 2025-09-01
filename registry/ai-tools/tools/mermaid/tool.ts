import { tool } from "ai"
import { z } from "zod"

export const mermaidTool = tool({
  description: "Generate Mermaid diagrams from text definitions.",
  inputSchema: z.object({
    diagram: z
      .string()
      .min(1)
      .describe(
        "The Mermaid diagram definition (e.g., 'graph TD; A-->B; B-->C;')"
      ),
    theme: z
      .enum(["default", "dark", "forest", "neutral"])
      .default("default")
      .describe("The Mermaid theme to use"),
  }),
  execute: async ({ diagram, theme }) => {
    // Validate basic diagram syntax
    const trimmed = diagram.trim()
    if (!trimmed) {
      throw new Error("Diagram definition cannot be empty")
    }

    const result: MermaidResult = {
      diagram,
      theme,
    }

    return result
  },
})

export interface MermaidResult {
  diagram: string
  theme: "default" | "dark" | "forest" | "neutral"
}

export default mermaidTool
