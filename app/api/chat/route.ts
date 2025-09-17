import { streamText, UIMessage, convertToModelMessages } from "ai"
import * as Tools from "@/registry/ai-tools/tools"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    activeToolName,
    activeToolParams,
    activeToolProviderName,
  }: {
    messages: UIMessage[]
    activeToolName?:
      | "weather"
      | "news"
      | "websearch"
      | "stats"
      | "qrcode"
      | "image"
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
      websearch: (websearchToolToUse as any)?.name,
      image: (imageToolToUse as any)?.name,
    },
  })

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
