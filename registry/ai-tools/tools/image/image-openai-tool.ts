import { openai } from "@ai-sdk/openai"
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

export const imageOpenAITool = tool({
  name: "image-openai",
  description: "Generate images using OpenAI via Vercel AI SDK (gpt-image-1).",
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
      model: openai.image("openai/gpt-image-1"),
      prompt,
      aspectRatio: ar,
      seed,
      n,
      providerOptions: {
        negativePrompt:
          typeof negativePrompt === "string"
            ? { value: negativePrompt }
            : negativePrompt || {},
      },
    })

    const out: ImageItem[] = (images || []).map((img) => ({
      url: img.url,
      base64: img.base64,
      mimeType: img.mimeType || img.contentType,
      width: img.width,
      height: img.height,
    }))

    const result: ImageResult = {
      provider: "openai",
      prompt,
      images: out,
      aspectRatio,
      seed,
    }
    return result
  },
})

export type ImageOpenAIToolType = UIToolInvocation<typeof imageOpenAITool>
