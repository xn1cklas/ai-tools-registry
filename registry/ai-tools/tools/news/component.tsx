"use client"

import * as React from "react"
import type { NewsItem, NewsSearchResult, NewsToolType } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source as SourcesItem,
} from "@/registry/ai-elements/sources"

export function NewsList({ invocation }: { invocation: NewsToolType }) {
  const part = invocation
  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>Waiting for topic…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader /> Preparing request
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>Fetching…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
            {part.errorText || "An error occurred while fetching news."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (part.output === undefined) return null
  const { topic, items } = part.output
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>News</CardTitle>
        <CardDescription>Topic: {topic}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item: NewsItem) => (
            <li key={item.id} className="rounded-md bg-muted px-3 py-2">
              {item.url ? (
                <a
                  href={item.url}
                  className="font-medium hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              ) : (
                <span className="font-medium">{item.title}</span>
              )}
              {item.publishedAt && (
                <div className="text-xs text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
        {items.some((i) => i.url) ? (
          <div className="mt-3">
            <Sources>
              <SourcesTrigger count={items.filter((i) => i.url).length} />
              <SourcesContent>
                {items
                  .filter((i) => i.url)
                  .map((i) => (
                    <SourcesItem key={i.id} href={i.url!} title={i.title} />
                  ))}
              </SourcesContent>
            </Sources>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default NewsList
