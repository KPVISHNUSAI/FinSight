"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


const chartData = [
  { category: "Salaries", amount: 12200, fill: "var(--color-salaries)" },
  { category: "Marketing", amount: 6500, fill: "var(--color-marketing)" },
  { category: "Operations", amount: 8300, fill: "var(--color-operations)" },
  { category: "Software", amount: 4107, fill: "var(--color-software)" },
  { category: "Travel", amount: 2000, fill: "var(--color-travel)" },
]

const chartConfig = {
  amount: {
    label: "Amount (USD)",
  },
  salaries: {
    label: "Salaries",
    color: "hsl(var(--chart-1))",
  },
  marketing: {
    label: "Marketing",
    color: "hsl(var(--chart-2))",
  },
  operations: {
    label: "Operations",
    color: "hsl(var(--chart-3))",
  },
  software: {
    label: "Software",
    color: "hsl(var(--chart-4))",
  },
  travel: {
    label: "Travel",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ExpensesChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
        <ResponsiveContainer>
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                />
                <ChartLegend
                    content={<ChartLegendContent nameKey="category" />}
                    className="-mt-4"
                />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
