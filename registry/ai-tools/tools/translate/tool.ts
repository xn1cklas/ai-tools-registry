import { tool } from "ai"
import { z } from "zod"

export const translateTool = tool({
  description: "Translate a given text into a target language.",
  inputSchema: z.object({
    text: z.string().min(1),
    targetLanguage: z.string().default("en"),
  }),
  execute: async ({ text, targetLanguage }) => {
    // Demo translation - in real implementation, this would call a translation API
    const translations: Record<string, string> = {
      es: "¡Hola, mundo!",
      fr: "Bonjour, le monde !",
      de: "Hallo, Welt!",
      it: "Ciao, mondo!",
      pt: "Olá, mundo!",
      ja: "こんにちは、世界！",
      ko: "안녕하세요, 세계!",
      zh: "你好，世界！",
      ru: "Привет, мир!",
      ar: "مرحبا بالعالم!",
    }

    const translated =
      translations[targetLanguage] || `[${targetLanguage}] ${text}`
    return { text, targetLanguage, translated }
  },
})

export interface TranslateResult {
  text: string
  targetLanguage: string
  translated: string
}

export default translateTool
