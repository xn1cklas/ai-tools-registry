"use client"

import type { ImageInput, ImageResult } from "./schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { ImageToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import { Badge } from "@/registry/ai-tools/ui/badge"

import { useImageDemoControls } from "./demo-controls"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function ImageGrid({ invocation }: { invocation: ImageToolType }) {
  const part = invocation
  const controls = useImageDemoControls()
  const desiredCount = Math.max(1, Math.min(4, controls?.count ?? 3))
  const desiredAR = controls?.aspectRatio ?? "1:1"

  const toAspectRatio = (s: string) => {
    const parts = s.split(":")
    if (parts.length === 2) return `${parts[0]} / ${parts[1]}`
    return "1 / 1"
  }

  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Generated Images</CardTitle>
          <CardDescription>Waiting for prompt…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: desiredCount }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-md border bg-background w-full"
                style={{ aspectRatio: toAspectRatio(desiredAR) as any }}
              >
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Preparing generation
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Generated Images</CardTitle>
          <CardDescription>Generating…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: desiredCount }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-md border bg-background w-full"
                style={{ aspectRatio: toAspectRatio(desiredAR) as any }}
              >
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          {part.input ? (
            <div className="rounded-md bg-muted/50">
              <CodeBlock
                code={JSON.stringify(part.input, null, 2)}
                language="json"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Generated Images</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
            {part.errorText || "An error occurred while generating images."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (!part.output) return null
  const { images, provider, prompt, aspectRatio } = part.output
  const ar = controls?.aspectRatio ?? aspectRatio ?? "1:1"
  // Render exactly the number of generated images, capped by desiredCount
  const displayCount = Math.min(images.length, desiredCount)
  const gridCols =
    displayCount === 1
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <Card className={`w-fit-content max-w-3xl`}>
      <CardHeader>
        <CardTitle>Generated Images</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              {provider}
            </Badge>
            {prompt ? (
              <span className="text-muted-foreground">“{prompt}”</span>
            ) : null}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid ${gridCols} gap-4`}>
          {Array.from({ length: displayCount }).map((_, i) => {
            const img = images[i]
            const src = img?.url
              ? img.url
              : img?.base64
                ? `data:${img.mimeType || "image/png"};base64,${img.base64}`
                : ""
            return (
              <div
                key={src || `ph-${i}`}
                className="overflow-hidden rounded-md border bg-background w-full"
                style={{ aspectRatio: toAspectRatio(ar) as any }}
              >
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
