"use client"

import * as React from "react"
import { ImageToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import { Badge } from "@/registry/ai-tools/ui/badge"
import { cn } from "@/lib/utils"

import { useImageDemoControls } from "./demo-controls"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"

export function ImageGrid({ invocation }: { invocation: ImageToolType }) {
  const part = invocation
  const controls = useImageDemoControls()
  const desiredCount = Math.max(1, Math.min(4, controls?.count ?? 3))
  const desiredAR = controls?.aspectRatio ?? "1:1"

  const cardBaseClass =
    "not-prose flex w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background/95 py-0 text-foreground shadow-sm"
  const headerBaseClass =
    "flex flex-col gap-2 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
  const contentBaseClass = "px-6 py-5"

  const toAspectRatio = (s: string) => {
    const parts = s.split(":")
    if (parts.length === 2) return `${parts[0]} / ${parts[1]}`
    return "1 / 1"
  }

  const gridColsForCount = (count: number) => {
    if (count <= 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-1 sm:grid-cols-2"
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
  }

  const renderPlaceholderTiles = (count: number, aspect: string) => {
    const ratio = toAspectRatio(aspect)

    return Array.from({ length: count }).map((_, i) => (
      <div
        key={`placeholder-${i}`}
        className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-background"
        style={{ aspectRatio: ratio as any }}
      >
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent" />
      </div>
    ))
  }

  const renderHeader = (
    title: React.ReactNode,
    description?: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const descriptionNode =
      typeof description === "string" ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : (
        (description ?? null)
      )

    return (
      <CardHeader className={headerBaseClass}>
        {(title || descriptionNode) && (
          <div className="space-y-1">
            {title ? (
              <h3 className="text-sm font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
            ) : null}
            {descriptionNode}
          </div>
        )}
        {actions ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {actions}
          </div>
        ) : null}
      </CardHeader>
    )
  }

  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-lg animate-in fade-in-50")}>
        {renderHeader("Generated Images", "Waiting for prompt…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className={`grid gap-4 ${gridColsForCount(desiredCount)}`}>
            {renderPlaceholderTiles(desiredCount, desiredAR)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Preparing generation
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Generated Images", "Generating…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className={`grid gap-4 ${gridColsForCount(desiredCount)}`}>
            {renderPlaceholderTiles(desiredCount, desiredAR)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          {part.input ? (
            <div className="rounded-md border border-border/40 bg-muted/40">
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
      <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
        {renderHeader("Generated Images", "Error")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className={`grid gap-4 ${gridColsForCount(desiredCount)}`}>
            {renderPlaceholderTiles(desiredCount, desiredAR)}
          </div>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
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
  const gridCols = gridColsForCount(displayCount)

  return (
    <Card className={cn(cardBaseClass, "max-w-3xl animate-in fade-in-50")}>
      {renderHeader(
        "Generated Images",
        prompt ? `“${prompt}”` : undefined,
        <Badge variant="secondary" className="rounded-full">
          {provider}
        </Badge>
      )}
      <CardContent className={cn(contentBaseClass, "pb-6")}>
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
                className="w-full overflow-hidden rounded-xl border border-border/50 bg-background"
                style={{ aspectRatio: toAspectRatio(ar) as any }}
              >
                <img
                  src={src}
                  alt={prompt ?? "Generated image"}
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
