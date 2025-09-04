"use client"

import * as React from "react"
import type { NewsItem, NewsSearchResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { ToolUIPart } from "ai"

export function NewsList(part: ToolUIPart) {
  if (part.type === "tool-news") {
    const { topic, items } = part.output as NewsSearchResult
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
        </CardContent>
      </Card>
    )
  } else {
    return <div>Invalid tool type</div>
  }
}

export default NewsList
