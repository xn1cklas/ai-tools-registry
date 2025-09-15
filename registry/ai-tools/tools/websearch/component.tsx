"use client"

import * as React from "react"
import type { WebSearchItem } from "./schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import type { WebSearchToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import {
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
} from "@/registry/ai-elements/inline-citation"
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source as SourcesItem,
} from "@/registry/ai-elements/sources"

export function WebSearchList(part: WebSearchToolType) {
  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Web Search</CardTitle>
          <CardDescription>Waiting for query…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader /> Preparing search
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Web Search</CardTitle>
          <CardDescription>Searching…</CardDescription>
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
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Web Search</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
            {part.errorText || "An error occurred while searching the web."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (part.output === undefined) return null
  const { query, results } = part.output
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Web Search</CardTitle>
        <CardDescription>Query: {query}</CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-sm text-muted-foreground">No results.</div>
        ) : null}
        <ul className="space-y-3">
          {results.map((r: WebSearchItem, idx: number) => {
            const hostname = (() => {
              try {
                return new URL(r.url).hostname
              } catch {
                return r.source ?? "source"
              }
            })()
            return (
              <li key={r.url || idx} className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2">
                  <a
                    href={r.url}
                    className="font-medium hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {r.title}
                  </a>
                  <InlineCitationCard>
                    <InlineCitationCardTrigger sources={[r.url]} />
                    <InlineCitationCardBody>
                      <InlineCitationCarousel>
                        <InlineCitationCarouselHeader>
                          <InlineCitationCarouselPrev />
                          <InlineCitationCarouselIndex />
                          <InlineCitationCarouselNext />
                        </InlineCitationCarouselHeader>
                        <InlineCitationCarouselContent>
                          <InlineCitationCarouselItem>
                            <InlineCitationSource
                              title={r.title}
                              url={r.url}
                              description={r.snippet}
                            />
                          </InlineCitationCarouselItem>
                        </InlineCitationCarouselContent>
                      </InlineCitationCarousel>
                    </InlineCitationCardBody>
                  </InlineCitationCard>
                </div>
                {r.snippet ? (
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.snippet}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>

        {results.length > 0 ? (
          <div className="mt-4">
            <Sources>
              <SourcesTrigger count={results.length} />
              <SourcesContent>
                {results.map((r: WebSearchItem, idx: number) => (
                  <SourcesItem
                    key={r.url || idx}
                    href={r.url}
                    title={r.title}
                  />
                ))}
              </SourcesContent>
            </Sources>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default WebSearchList
