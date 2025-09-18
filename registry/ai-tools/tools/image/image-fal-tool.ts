import { fal } from "@ai-sdk/fal"
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

export const imageFalTool = tool({
  name: "image-fal",
  description: "Generate images using FAL.ai via Vercel AI SDK (flux/schnell).",
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
      model: fal.image("fal-ai/flux/schnell"),
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
      provider: "fal",
      prompt,
      images: out,
      aspectRatio,
      seed,
    }
    return result
  },
})

export type ImageFalToolType = UIToolInvocation<typeof imageFalTool>
