import {
  tool,
  experimental_generateImage as generateImage,
  type UIToolInvocation,
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
      model: runware.image(Flux.Flux11Pro),
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
      provider: "runware",
      prompt,
      images: out,
      aspectRatio,
      seed,
    }
    return result
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

export type ImageRunwareToolType = UIToolInvocation<typeof imageRunwareTool>
