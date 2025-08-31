"use client"

import * as React from "react"
import type { WebSearchResult } from "./tool"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/alpine/ui/card"

export function WebSearchList({ data }: { data: WebSearchResult }) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Web Search</CardTitle>
        <CardDescription>Query: {data.query}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.results.map((r) => (
            <li key={r.url} className="rounded-md bg-muted p-3">
              <a href={r.url} className="font-medium hover:underline" target="_blank" rel="noreferrer">
                {r.title}
              </a>
              {r.source ? (
                <span className="ml-2 text-xs text-muted-foreground">({r.source})</span>
              ) : null}
              {r.snippet ? (
                <div className="text-xs text-muted-foreground mt-1">{r.snippet}</div>
              ) : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default WebSearchList

