"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleForecastFinancials } from "@/lib/actions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const placeholderData = JSON.stringify(
  [
    { "month": "2023-01", "revenue": 4000, "expenses": 2400 },
    { "month": "2023-02", "revenue": 3000, "expenses": 1398 },
    { "month": "2023-03", "revenue": 2000, "expenses": 9800 },
    { "month": "2023-04", "revenue": 2780, "expenses": 3908 },
    { "month": "2023-05", "revenue": 1890, "expenses": 4800 },
    { "month": "2023-06", "revenue": 2390, "expenses": 3800 }
  ],
  null,
  2
);

type ForecastData = {
  month: string;
  revenue?: number;
  expenses?: number;
  forecasted_revenue?: number;
  forecasted_expenses?: number;
};

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  forecasted_revenue: { label: "Forecasted Revenue", color: "hsl(var(--chart-1))", dash: "5 5" },
  forecasted_expenses: { label: "Forecasted Expenses", color: "hsl(var(--chart-2))", dash: "5 5" },
} satisfies ChartConfig;

export function Forecaster() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ForecastData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const { forecast, error } = await handleForecastFinancials(data);
      if (error) {
        setError(error);
      } else {
        const historicalData = JSON.parse(data);
        setResult([...historicalData, ...forecast]);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-1">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Historical Data Input</CardTitle>
            <CardDescription>
              Provide historical financial data in JSON format to generate a forecast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={placeholderData}
              className="min-h-[250px] resize-y font-code text-xs"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={isPending}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !data}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forecasting...
                </>
              ) : (
                "Generate Forecast"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="md:col-span-1 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Generating Forecast</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Forecast Result</CardTitle>
              <CardDescription>A 6-month financial forecast based on your data.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={result}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                    <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={true} />
                    <Line dataKey="forecasted_revenue" type="monotone" stroke="var(--color-revenue)" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: 'var(--color-revenue)' }} />
                    <Line dataKey="forecasted_expenses" type="monotone" stroke="var(--color-expenses)" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: 'var(--color-expenses)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
