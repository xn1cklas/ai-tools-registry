"use client"

import * as React from "react"
import type { ChartsResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/ai-tools/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts"

export function DataChart({ data }: { data: ChartsResult }) {
  const config: ChartConfig = React.useMemo(() => {
    const chartConfig: ChartConfig = {}
    data.yKeys.forEach((key, index) => {
      chartConfig[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: data.colors[index],
      }
    })
    return chartConfig
  }, [data.yKeys, data.colors])

  const renderChart = () => {
    const commonProps = {
      data: data.data,
      margin: { left: 12, right: 12, top: 12, bottom: 12 },
    }

    switch (data.chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={data.xKey}
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <ChartTooltip content={ChartTooltipContent} />
            <ChartLegend content={ChartLegendContent} />
            {data.yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={data.colors[index]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={data.xKey}
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <ChartTooltip content={ChartTooltipContent} />
            <ChartLegend content={ChartLegendContent} />
            {data.yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={data.colors[index]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={data.xKey}
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <ChartTooltip content={ChartTooltipContent} />
            <ChartLegend content={ChartLegendContent} />
            {data.yKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={data.colors[index]}
                fill={data.colors[index]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        )

      case "pie":
        return (
          <PieChart>
            <ChartTooltip content={ChartTooltipContent} />
            <Pie
              data={data.data}
              dataKey={data.yKeys[0]}
              nameKey={data.xKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data.data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={data.colors[index % data.colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        )

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={data.xKey}
              type="number"
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <YAxis
              dataKey={data.yKeys[0]}
              type="number"
              tick={{ fontSize: 12 }}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <ChartTooltip content={ChartTooltipContent} />
            <ChartLegend content={ChartLegendContent} />
            <Scatter
              name={data.yKeys[0]}
              data={data.data}
              fill={data.colors[0]}
            />
          </ScatterChart>
        )

      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>
          {data.chartType.charAt(0).toUpperCase() + data.chartType.slice(1)}{" "}
          Chart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="aspect-auto h-[400px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DataChart
