import { getWeatherTool } from "@/registry/ai-tools/tools"
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
    model: model,
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherTool,
      webSearchDDGTool,
    },
  })

  return result.toUIMessageStreamResponse()
}
