"use client"

import * as React from "react"
import type { WebSearchItem } from "./schema"
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
import { WebSearchToolInvocation } from "./tool"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function WebSearchList({
  invocation,
}: {
  invocation: WebSearchToolInvocation
}) {
  const part = invocation
  const cardBaseClass =
    "not-prose flex w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background/95 py-0 text-foreground shadow-sm"
  const headerBaseClass =
    "flex flex-col gap-2 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
  const contentBaseClass = "px-6 py-5"
  const renderHeader = (
    title: React.ReactNode,
    description?: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const descriptionNode =
      typeof description === "string" ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : (
        (description ?? null)
      )

    return (
      <CardHeader className={headerBaseClass}>
        {(title || descriptionNode) && (
          <div className="space-y-1">
            {title ? (
              <h3 className="text-sm font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
            ) : null}
            {descriptionNode}
          </div>
        )}
        {actions ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {actions}
          </div>
        ) : null}
      </CardHeader>
    )
  }
  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Web Search", "Waiting for query…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Preparing search
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Web Search", "Searching…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          {part.input ? (
            <div className="rounded-md border border-border/40 bg-muted/40">
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
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("Web Search", "Error")}
        <CardContent className={contentBaseClass}>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText || "An error occurred while searching the web."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (part.output === undefined) return null
  const { query, results } = part.output
  return (
    <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
      {renderHeader(
        "Web Search",
        <span className="text-xs text-muted-foreground">
          Query <span className="font-medium text-foreground">{query}</span>
        </span>
      )}
      <CardContent className={cn(contentBaseClass, "space-y-4")}>
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
              <li
                key={r.url || idx}
                className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3 transition-colors hover:border-border/60"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <a
                    href={r.url}
                    className="font-medium text-sm leading-tight text-foreground hover:underline"
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
                  <div className="mt-1 text-xs text-muted-foreground">
                    {r.snippet}
                  </div>
                ) : null}
                <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {hostname}
                </div>
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
