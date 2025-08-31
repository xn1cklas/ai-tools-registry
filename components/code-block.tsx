"use client"

import * as React from "react"
import { highlight as sh } from "sugar-high"

export function CodeBlock({ code }: { code: string }) {
  const html = React.useMemo(() => sh(code), [code])
  return (
    <pre className="text-xs overflow-auto whitespace-pre-wrap">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}

export default CodeBlock
