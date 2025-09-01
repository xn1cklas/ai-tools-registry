"use client"

import * as React from "react"
import type { CurrencyResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"

export function CurrencyDisplay({ data }: { data: CurrencyResult }) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount)
  }

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(rate)
  }

  return (
    <Card className="w-full max-w-md">
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

        <div className="text-xs text-muted-foreground text-center">
          Rates updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrencyDisplay
