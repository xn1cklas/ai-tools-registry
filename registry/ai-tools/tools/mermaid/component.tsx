"use client"

import * as React from "react"
import type { MermaidResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import mermaid from "mermaid"

export function MermaidDiagram({ data }: { data: MermaidResult }) {
  const [svg, setSvg] = React.useState<string>("")
  const [error, setError] = React.useState<string>("")
  const id = React.useId()

  React.useEffect(() => {
    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          theme: data.theme,
          startOnLoad: false,
          securityLevel: "strict",
        })

        const { svg } = await mermaid.render(`mermaid-${id}`, data.diagram)
        setSvg(svg)
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        )
        setSvg("")
      }
    }

    renderDiagram()
  }, [data.diagram, data.theme, id])

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Mermaid Diagram</CardTitle>
        <CardDescription>Theme: {data.theme}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-sm text-destructive">Error: {error}</div>
        ) : svg ? (
          <div
            className="flex justify-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            Rendering diagram...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MermaidDiagram
