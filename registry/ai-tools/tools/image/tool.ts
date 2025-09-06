import { tool } from "ai"

import {
  ImageResultSchema,
  ImageItem,
  ImageResult,
  ImageInputSchema,
} from "./schema"

export const imageTool = tool({
  name: "image",
  description:
    "Generate images from a text prompt. This is a generic entry — see provider-specific tools for actual generation.",
  inputSchema: ImageInputSchema,
  outputSchema: ImageResultSchema,
  execute: async ({ prompt, n, aspectRatio, seed }) => {
    const images: ImageItem[] = []
    const result: ImageResult = {
      provider: "none",
      prompt,
      images,
      aspectRatio,
      seed,
    }
    return result
  },
})

export default imageTool
