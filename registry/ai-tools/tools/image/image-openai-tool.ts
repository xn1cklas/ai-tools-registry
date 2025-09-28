import { openai } from "@ai-sdk/openai"
import {
  tool,
  experimental_generateImage as generateImage,
  type UIToolInvocation,
  type JSONValue,
} from "ai"

import { ImageResultSchema, ImageInputSchema } from "./schema"
import type { ImageResult, ImageItem } from "./schema"

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
  }): Promise<ImageResult> => {
    type GenerateImageReturn = Awaited<ReturnType<typeof generateImage>>
    type BaseGenerated = NonNullable<GenerateImageReturn["images"]>[number]
    type EnhancedGenerated = BaseGenerated & {
      url?: string
      base64?: string
      contentType?: string
      width?: number
      height?: number
    }
    type ProviderOptions = NonNullable<
      Parameters<typeof generateImage>[0]["providerOptions"]
    >
    const coerceAspectRatio = (
      ar?: string
    ): `${number}:${number}` | undefined =>
      ar && /^\d+:\d+$/.test(ar) ? (ar as `${number}:${number}`) : undefined

    const buildProviderOptions = (
      np?: unknown
    ): ProviderOptions | undefined => {
      if (typeof np === "string")
        return {
          negativePrompt: { value: np } as Record<string, JSONValue>,
        } as ProviderOptions
      if (np && typeof np === "object")
        return {
          negativePrompt: np as Record<string, JSONValue>,
        } as ProviderOptions
      return undefined
    }

    const normalizeImages = (images?: BaseGenerated[] | null): ImageItem[] =>
      images?.map((img) => {
        const x = img as EnhancedGenerated
        return {
          url: x.url,
          base64: x.base64,
          mimeType: (x as { mimeType?: string }).mimeType || x.contentType,
          width: x.width,
          height: x.height,
        }
      }) ?? []

    const buildImageResult = (params: {
      provider: string
      prompt: string
      images: ImageItem[]
      aspectRatio?: string
      seed?: number
    }): ImageResult => params as ImageResult

    const ar = coerceAspectRatio(aspectRatio)
    const providerOptions = buildProviderOptions(negativePrompt)
    const { images } = await generateImage({
      model: openai.image("openai/gpt-image-1"),
      prompt,
      aspectRatio: ar,
      seed,
      n,
      ...(providerOptions ? { providerOptions } : {}),
    })

    const out = normalizeImages(images)
    return buildImageResult({
      provider: "openai",
      prompt,
      images: out,
      aspectRatio,
      seed,
    })
  },
})

export type ImageToolType = UIToolInvocation<typeof imageOpenAITool>
