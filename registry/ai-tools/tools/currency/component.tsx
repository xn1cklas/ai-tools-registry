"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { CurrencyConverterToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

const CURRENCY_OPTIONS = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}
interface Props {
  invocation: CurrencyConverterToolType
}

export function CurrencyDisplay({ invocation }: Props) {
  const part = invocation

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        ...CURRENCY_OPTIONS,
      }).format(amount)
    } catch (error) {
      // Fallback to number format if currency code is invalid
      return new Intl.NumberFormat("en-US", CURRENCY_OPTIONS).format(amount)
    }
  }

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat("en-US", CURRENCY_OPTIONS).format(rate)
  }

  if (part.state === "input-streaming") {
    return (
      <Card className="w-full max-w-md animate-in fade-in-50">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Waiting for data…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Loader /> Preparing request
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className="w-full max-w-md animate-in fade-in-50">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Converting…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className="w-full max-w-md animate-in fade-in-50">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText || "An error occurred while converting currency."}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.output === undefined) return null

  const data = part.output

  return (
    <Card className="w-full max-w-md animate-in fade-in-50">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          {data.from} to {data.to}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {formatCurrency(data.amount, data.from)}
          </div>
          <div className="text-muted-foreground text-sm">equals</div>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(data.converted, data.to)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-md bg-muted p-3">
            <div className="text-muted-foreground">Exchange Rate</div>
            <div className="font-medium">
              1 {data.from} = {formatRate(data.rate)} {data.to}
            </div>
          </div>
          <div className="rounded-md bg-muted p-3">
            <div className="text-muted-foreground">Date</div>
            <div className="font-medium">
              {new Date(data.date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Rates updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrencyDisplay
