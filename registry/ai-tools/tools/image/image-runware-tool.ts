import {
  tool,
  experimental_generateImage as generateImage,
  type UIToolInvocation,
  type JSONValue,
} from "ai"
import { runware } from "@runware/ai-sdk-provider"

import { ImageResultSchema, ImageInputSchema } from "./schema"
import type { ImageResult, ImageItem } from "./schema"

export const imageRunwareTool = tool({
  name: "image-runware",
  description: "Generate images using Runware via Vercel AI SDK (Flux models).",
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
      model: runware.image(Flux.Flux11Pro),
      prompt,
      aspectRatio: ar,
      seed,
      n,
      ...(providerOptions ? { providerOptions } : {}),
    })

    const out = normalizeImages(images)
    return buildImageResult({
      provider: "runware",
      prompt,
      images: out,
      aspectRatio,
      seed,
    })
  },
})

const Flux = {
  Flux1KreaDev: "runware:107@1",
  Flux1KontextDev: "runware:106@1",
  Flux1KontextPro: "bfl:3@1",
  Flux1KontextMax: "bfl:4@1",
  Flux11Pro: "bfl:2@1",
  Flux11ProUltra: "bfl:2@2",
} as const

export type ImageToolType = UIToolInvocation<typeof imageRunwareTool>
