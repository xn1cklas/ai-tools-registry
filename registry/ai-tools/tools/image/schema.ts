import { z } from "zod"

export const ImageInputSchema = z
  .object({
    prompt: z.string().min(1).describe("The text prompt to guide generation."),
    referenceImageUrl: z
      .string()
      .url()
      .optional()
      .describe("Optional URL of an input/reference image for image-to-image."),
    n: z
      .number()
      .int()
      .min(1)
      .max(8)
      .default(1)
      .describe("Number of images to generate (1–8)."),
    aspectRatio: z
      .string()
      .regex(/^\d+:\d+$/, 'Expected format "<number>:<number>", e.g., 1:1')
      .optional()
      .describe('Aspect ratio such as "1:1", "16:9", "4:3".'),
    negativePrompt: z
      .string()
      .optional()
      .describe("Optional negative prompt to avoid undesired features."),
    seed: z
      .number()
      .optional()
      .describe("Optional random seed for repeatability."),
  })
  .describe("Inputs for image generation across providers.")

export const ImageItemSchema = z
  .object({
    url: z
      .string()
      .url()
      .optional()
      .describe("Public URL to the generated image, if available."),
    base64: z
      .string()
      .optional()
      .describe("Base64-encoded image data if no URL is provided."),
    mimeType: z
      .string()
      .optional()
      .describe("MIME type of the image, e.g., image/png."),
    width: z.number().optional().describe("Image width in pixels."),
    height: z.number().optional().describe("Image height in pixels."),
  })
  .describe("A single generated image in URL or base64 form.")

export const ImageResultSchema = z
  .object({
    provider: z
      .string()
      .describe("Provider used for generation: openai, fal, runware, etc."),
    prompt: z.string().describe("The original text prompt used."),
    images: z
      .array(ImageItemSchema)
      .describe("List of generated images in normalized format."),
    aspectRatio: z
      .string()
      .optional()
      .describe("Aspect ratio that was applied, when applicable."),
    seed: z
      .number()
      .optional()
      .describe("Seed used, if the provider supports it."),
  })
  .describe("Normalized output returned by image generation tools.")

export type ImageItem = z.infer<typeof ImageItemSchema>
export type ImageResult = z.infer<typeof ImageResultSchema>
export type ImageInput = z.infer<typeof ImageInputSchema>
