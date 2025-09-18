"use client"

import * as React from "react"
import { ImageGrid } from "./component"
import type { ImageToolType } from "./tool"
import { useImageDemoControls } from "./demo-controls"

export function DemoImageGrid({ invocation }: { invocation: ImageToolType }) {
  const controls = useImageDemoControls()

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
    derivedInvocation = {
      ...invocation,
      state: "output-available",
      input: {
        ...(invocation.input || {}),
        ...(controls?.count ? { n: controls.count } : {}),
        ...(controls?.aspectRatio ? { aspectRatio: controls.aspectRatio } : {}),
      },
      output: {
        ...invocation.output,
        images: imgs,
        aspectRatio:
          controls?.aspectRatio ||
          invocation.output.aspectRatio ||
          invocation.input?.aspectRatio,
      },
    }
  } else {
    derivedInvocation = {
      ...invocation,
      input: {
        ...(invocation.input || {}),
        ...(controls?.count ? { n: controls.count } : {}),
        ...(controls?.aspectRatio ? { aspectRatio: controls.aspectRatio } : {}),
      },
    } as ImageToolType
  }

  return <ImageGrid invocation={derivedInvocation} />
}

export default DemoImageGrid
