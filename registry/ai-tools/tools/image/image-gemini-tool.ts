import {
  tool,
  experimental_generateImage as generateImage,
  type UIToolInvocation,
} from "ai"

import {
  ImageResultSchema,
  ImageResult,
  ImageItem,
  ImageInputSchema,
} from "./schema"
import { google } from "@ai-sdk/google"

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

    const { images }: { images: GeneratedImage[] } = await generateImage({
      model: google.image("imagen-3.0-generate-002"),
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

export type ImageGatewayGeminiToolType = UIToolInvocation<
  typeof imageGatewayGeminiTool
>
