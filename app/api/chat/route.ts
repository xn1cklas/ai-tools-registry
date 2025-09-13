import {
  getWeatherTool,
  newsSearchTool,
  webSearchTool,
  markdownTool,
  calculatorTool,
  translateTool,
  timeNowTool,
  publicStatsTool,
  qrCodeTool,
} from "@/registry/ai-tools/tools"
import webSearchDDGTool from "@/registry/ai-tools/tools/websearch/websearch-duckduckgo-tool"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { notFound } from "next/navigation"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return notFound()
  }

  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json()

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
    tools: {
      // Prefer keys matching tool name for clarity; the tool name is also embedded in each tool.
      weather: getWeatherTool,
      news: newsSearchTool,
      websearch: webSearchTool,
      "websearch-ddg": webSearchDDGTool,
      markdown: markdownTool,
      calculator: calculatorTool,
      translate: translateTool,
      time: timeNowTool,
      stats: publicStatsTool,
      qrcode: qrCodeTool,
    },
  })

  return result.toUIMessageStreamResponse()
}
