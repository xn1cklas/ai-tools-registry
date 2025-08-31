"use client"

import * as React from "react"
import { highlight as sh } from "sugar-high"
import { cn } from "@/lib/utils"

export function CodeBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const html = React.useMemo(() => sh(code), [code])
  return (
    <pre
      className={cn(
        "text-xs overflow-auto whitespace-pre-wrap font-mono",
        className
      )}
    >
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}

export default CodeBlock
