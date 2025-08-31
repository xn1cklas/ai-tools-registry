"use client"

import * as React from "react"
import { highlight as sh } from "sugar-high"
import { cn } from "@/lib/utils"

export function CodeBlock({
  code,
  className,
  disableOverflow = false,
}: {
  code: string
  className?: string
  disableOverflow?: boolean
}) {
  const html = React.useMemo(() => sh(code), [code])
  return (
    <pre
      className={cn(
        "text-xs whitespace-pre-wrap font-mono",
        !disableOverflow && "overflow-auto",
        className
      )}
    >
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}

export default CodeBlock
