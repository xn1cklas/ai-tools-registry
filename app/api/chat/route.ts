import {
  streamText,
  UIMessage,
  convertToModelMessages,
  simulateReadableStream,
} from "ai"
import * as Tools from "@/registry/ai-tools/tools"
import websearchFixture from "@/registry/ai-tools/tools/websearch/fixtures/demo.json"
import imageFixture from "@/registry/ai-tools/tools/image/fixtures/demo.json"
import newsFixture from "@/registry/ai-tools/tools/news/fixtures/demo.json"
import qrcodeFixture from "@/registry/ai-tools/tools/qrcode/fixtures/demo.json"
import statsFixture from "@/registry/ai-tools/tools/stats/fixtures/demo.json"
import weatherFixture from "@/registry/ai-tools/tools/weather/fixtures/demo.json"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    activeToolName,
    activeToolParams,
    activeToolProviderName,
    isLivemode,
  }: {
    messages: UIMessage[]
    activeToolName?:
      | "weather"
      | "news"
      | "websearch"
      | "stats"
      | "qrcode"
      | "image"
    isLivemode?: boolean
    activeToolParams?: unknown
    activeToolProviderName?:
      | "image-openai"
      | "image-fal"
      | "image-runware"
      | "image-gemini"
      | "websearch-ddg"
      | "websearch-brave"
      | "websearch-exa"
      | "websearch-perplexity"
      | "websearch-firecrawl"
  } = await req.json()

  const websearchToolToUse =
    activeToolProviderName === "websearch-ddg"
      ? Tools.webSearchDDGTool
      : activeToolProviderName === "websearch-brave"
        ? Tools.webSearchBraveTool
        : activeToolProviderName === "websearch-exa"
          ? Tools.webSearchExaTool
          : activeToolProviderName === "websearch-perplexity"
            ? Tools.webSearchPerplexityTool
            : activeToolProviderName === "websearch-firecrawl"
              ? Tools.webSearchFirecrawlTool
              : Tools.webSearchTool

  const imageToolToUse =
    activeToolProviderName === "image-openai"
      ? Tools.imageOpenAITool
      : activeToolProviderName === "image-fal"
        ? Tools.imageFalTool
        : activeToolProviderName === "image-runware"
          ? Tools.imageRunwareTool
          : activeToolProviderName === "image-gemini"
            ? Tools.imageGatewayGeminiTool
            : Tools.imageTool

  console.info("[api/chat] request", {
    activeToolName,
    activeToolProviderName,
    hasParams: Boolean(activeToolParams),
    model: "openai/gpt-5",
    mappedTools: {
      websearch: "websearch",
      image: "image",
    },
  })

  // Simulated streaming using fixtures when not in live mode
  if (isLivemode === false) {
    const toolCallId =
      "tool-call-" + Math.random().toString(36).substring(2, 15)
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
    }

    if (activeToolName) {
      const output =
        activeToolName === "websearch"
          ? websearchFixture
          : activeToolName === "image"
            ? imageFixture
            : activeToolName === "news"
              ? newsFixture
              : activeToolName === "qrcode"
                ? qrcodeFixture
                : activeToolName === "stats"
                  ? statsFixture
                  : activeToolName === "weather"
                    ? weatherFixture
                    : undefined

      const chunks: string[] = []
      chunks.push(`data: ${JSON.stringify({ type: "start" })}\n\n`)
      chunks.push(
        `data: ${JSON.stringify({
          type: "tool-input-available",
          toolCallId,
          toolName: activeToolName,
          input: activeToolParams ?? {},
        })}\n\n`
      )
      if (output !== undefined) {
        chunks.push(
          `data: ${JSON.stringify({
            type: "tool-output-available",
            toolCallId,
            output,
          })}\n\n`
        )
      }
      chunks.push(`data: ${JSON.stringify({ type: "finish" })}\n\n`)
      chunks.push(`data: [DONE]\n\n`)

      return new Response(
        simulateReadableStream({
          // Add a small delay so tool loading states are visible
          initialDelayInMs: 300,
          chunkDelayInMs: 900,
          chunks,
        }).pipeThrough(new TextEncoderStream()),
        { status: 200, headers }
      )
    }

    // No tool selected: stream a simple assistant text response
    const textId = "text-1"
    const textChunks: string[] = [
      `data: ${JSON.stringify({ type: "start" })}\n\n`,
      `data: ${JSON.stringify({ type: "text-start", id: textId })}\n\n`,
      `data: ${JSON.stringify({ type: "text-delta", id: textId, delta: "Using demo mode. " })}\n\n`,
      `data: ${JSON.stringify({ type: "text-delta", id: textId, delta: "No live providers called." })}\n\n`,
      `data: ${JSON.stringify({ type: "text-end", id: textId })}\n\n`,
      `data: ${JSON.stringify({ type: "finish" })}\n\n`,
      `data: [DONE]\n\n`,
    ]

    return new Response(
      simulateReadableStream({
        initialDelayInMs: 200,
        chunkDelayInMs: 120,
        chunks: textChunks,
      }).pipeThrough(new TextEncoderStream()),
      {
        status: 200,
        headers,
      }
    )
  }

  const result = streamText({
    model: "openai/gpt-5",
    messages: convertToModelMessages(messages),
    tools: {
      weather: Tools.getWeatherTool,
      news: Tools.newsSearchTool,
      websearch: websearchToolToUse,
      stats: Tools.publicStatsTool,
      qrcode: Tools.qrCodeTool,
      image: imageToolToUse,
    },
    toolChoice: activeToolName
      ? { type: "tool", toolName: activeToolName }
      : "auto",
    // Provide a hint via system when forcing a specific tool with params
    system:
      activeToolName && activeToolParams
        ? `Use the ${activeToolName} tool with these parameters if appropriate: ${JSON.stringify(
            activeToolParams
          )}`
        : undefined,
  })

  return result.toUIMessageStreamResponse()
}
