"use client"

import * as React from "react"
import type { MarkdownResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownViewer({ data }: { data: MarkdownResult }) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Markdown</CardTitle>
        <CardDescription>Rendered with react-markdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.markdown}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

export default MarkdownViewer
