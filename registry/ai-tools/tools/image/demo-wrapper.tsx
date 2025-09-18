"use client"

import * as React from "react"
import { ImageGrid } from "./component"
import type { ImageToolType } from "./tool"

export function DemoImageGrid({ invocation }: { invocation: ImageToolType }) {
  // Stable shuffle: only recompute when the images list actually changes (not on AR changes)
  const imagesSignature = React.useMemo(() => {
    const list = invocation.output?.images ?? []
    return list
      .map(
        (img, idx) => `${img.url ?? `b64:${img.base64?.slice(0, 12) || idx}`}`
      )
      .join("|")
  }, [invocation.output?.images])
  const imgs = React.useMemo(() => {
    const base = invocation.output?.images ? [...invocation.output.images] : []
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = base[i]
      base[i] = base[j]
      base[j] = tmp
    }
    return base
  }, [imagesSignature])

  let derivedInvocation: ImageToolType
  if (invocation.state === "output-available" && invocation.output) {
    // Preserve the original input (n, aspectRatio, etc.) used for this invocation
    // to keep aspect ratio sticky per message. Only shuffle images for nicer layout.
    derivedInvocation = {
      ...invocation,
      state: "output-available",
      output: {
        ...invocation.output,
        images: imgs,
      },
    }
  } else {
    // For pre-output states, rely solely on the invocation input
    // (provided by the tool-input-available event) for placeholders.
    derivedInvocation = { ...invocation }
  }

  return <ImageGrid invocation={derivedInvocation} />
}

export default DemoImageGrid
