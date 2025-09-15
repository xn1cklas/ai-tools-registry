import { tool, experimental_generateImage as generateImage } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

import {
  ImageResultSchema,
  ImageResult,
  ImageItem,
  ImageInputSchema,
} from "./schema"

// NOTE:
// We use the OpenAI provider configured to point at Vercel AI Gateway.
// This assumes the Gateway supports OpenAI-compatible image generation for
// the model id `google/gemini-2.5-flash-image-preview`.
//
// Required env:
// - AI_GATEWAY_API_KEY (Gateway API key)
// Optional env:
// - AI_GATEWAY_BASE_URL (override base URL; defaults to Gateway)

const gatewayBaseURL =
  process.env.AI_GATEWAY_BASE_URL || "https://ai-gateway.vercel.sh/v1/ai"

const gatewayOpenAI = createOpenAI({
  baseURL: gatewayBaseURL,
  apiKey: process.env.AI_GATEWAY_API_KEY,
  // Set a custom name to make it clear in metadata/logs.
  name: "gateway",
})

export const imageGatewayGeminiTool = tool({
  name: "image-gemini",
  description:
    "Generate images using Google Gemini via Vercel AI Gateway (gemini-2.5-flash-image-preview).",
  inputSchema: ImageInputSchema,
  outputSchema: ImageResultSchema,
  execute: async ({
    prompt,
    referenceImageUrl,
    n,
    aspectRatio,
    seed,
    negativePrompt,
  }) => {
    type GeneratedImage = {
      url?: string
      base64?: string
      mimeType?: string
      contentType?: string
      width?: number
      height?: number
    }

    const ar =
      aspectRatio && /^\d+:\d+$/.test(aspectRatio)
        ? (aspectRatio as `${number}:${number}`)
        : undefined

    // Important: this relies on Gateway exposing OpenAI-compatible image generation
    // for the Gemini image model id below. If it is not available in your Gateway
    // project, this call will fail and you may need to switch once
    // `@ai-sdk/gateway` exposes an image model helper.
    const { images }: { images: GeneratedImage[] } = await generateImage({
      model: gatewayOpenAI.image("google/gemini-2.5-flash-image-preview"),
      prompt,
      ...(ar ? { aspectRatio: ar } : {}),
      ...(typeof seed === "number" ? { seed } : {}),
      ...(typeof n === "number" ? { n } : {}),
      ...(negativePrompt ? { negativePrompt } : {}),
      ...(referenceImageUrl
        ? {
            images: [
              { type: "inputImage", image: referenceImageUrl },
            ] as Array<{ type: "inputImage"; image: string }>,
          }
        : {}),
    })

    const out: ImageItem[] = (images || []).map((img) => ({
      url: img.url,
      base64: img.base64,
      mimeType: img.mimeType || img.contentType,
      width: img.width,
      height: img.height,
    }))

    const result: ImageResult = {
      provider: "gateway-gemini",
      prompt,
      images: out,
      aspectRatio,
      seed,
    }
    return result
  },
})

export default imageGatewayGeminiTool
