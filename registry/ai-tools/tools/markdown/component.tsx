"use client"

import * as React from "react"
import type { MarkdownResult } from "./tool"
import { ToolUIPart } from "ai"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { Response } from "@/registry/ai-elements/response"

export function MarkdownViewer(part: ToolUIPart) {
  if (part.type !== "tool-markdown") return <div>Invalid tool type</div>
  const { markdown } = part.output as MarkdownResult
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Markdown</CardTitle>
        <CardDescription>Rendered with react-markdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {/* <Response> */}
          {markdown}
          {/* </Response> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default MarkdownViewer
