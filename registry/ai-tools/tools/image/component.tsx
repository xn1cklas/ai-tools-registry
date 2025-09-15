"use client"

import type { ImageInput, ImageResult } from "./schema"
import type { ToolUIPart } from "ai"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { ImageToolType } from "./tool"

export function ImageGrid(part: ImageToolType) {
  if (!part.output) return null
  const { images, provider, prompt, aspectRatio } = part.output

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Generated Images</CardTitle>
        <CardDescription>
          Provider: {provider}
          {aspectRatio ? ` · AR ${aspectRatio}` : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => {
            const src = img.url
              ? img.url
              : img.base64
                ? `data:${img.mimeType || "image/png"};base64,${img.base64}`
                : ""
            return (
              <div
                key={src}
                className="overflow-hidden rounded-md border bg-background"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={prompt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ImageGrid
