import { z } from "zod"
import type { Tool } from "ai"

export const translateTool: Tool = {
  name: "translate",
  description: "Translate a given text into a target language.",
  inputSchema: z.object({
    text: z.string().min(1),
    targetLanguage: z.string().default("en"),
  }),
  execute: async ({
    text,
    targetLanguage,
  }: {
    text: string
    targetLanguage: string
  }): Promise<TranslateResult> => {
    throw new Error(
      "translate not implemented. Connect a translation provider and return { text, targetLanguage, translated }."
    )
  },
}

export interface TranslateResult {
  text: string
  targetLanguage: string
  translated: string
}

export default translateTool
