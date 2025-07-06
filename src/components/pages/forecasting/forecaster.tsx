"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { handleForecastFinancials } from "@/lib/actions";
import { AlertCircle, Loader2, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

// This now represents the "database" of historical transactions
const historicalData = [
    { "month": "2023-01", "revenue": 4000, "expenses": 2400 },
    { "month": "2023-02", "revenue": 3000, "expenses": 1398 },
    { "month": "2023-03", "revenue": 5000, "expenses": 3200 },
    { "month": "2023-04", "revenue": 4780, "expenses": 2908 },
    { "month": "2023-05", "revenue": 3890, "expenses": 4100 },
    { "month": "2023-06", "revenue": 4390, "expenses": 3800 },
    { "month": "2023-07", "revenue": 5490, "expenses": 4300 },
    { "month": "2023-08", "revenue": 6100, "expenses": 5100 },
    { "month": "2023-09", "revenue": 5800, "expenses": 4900 },
    { "month": "2023-10", "revenue": 7200, "expenses": 5300 },
    { "month": "2023-11", "revenue": 7500, "expenses": 5500 },
    { "month": "2023-12", "revenue": 8100, "expenses": 6100 },
];

type ForecastData = {
  month: string;
  revenue?: number;
  expenses?: number;
  forecasted_revenue?: number;
  forecasted_expenses?: number;
};

const chartConfig = {
  revenue: { label: "Historical Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Historical Expenses", color: "hsl(var(--chart-2))" },
  forecasted_revenue: { label: "Forecasted Revenue", color: "hsl(var(--chart-1))" },
  forecasted_expenses: { label: "Forecasted Expenses", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export function Forecaster() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ForecastData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateForecast = () => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      const historicalDataString = JSON.stringify(historicalData);
      const { forecast, error } = await handleForecastFinancials(historicalDataString);
      if (error) {
        setError(error);
      } else if (forecast) {
        setResult([...historicalData, ...forecast]);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
            <CardTitle className="font-headline">Automated Financial Forecasting</CardTitle>
            <CardDescription>
              Click the button below to generate a 6-month financial forecast. The system automatically uses the company's historical data to predict future revenue and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button onClick={handleGenerateForecast} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forecasting...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Automated Forecast
                </>
              )}
            </Button>
          </CardContent>
      </Card>

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
            <CardDescription>A 6-month financial forecast based on historical data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
              <ResponsiveContainer>
                <LineChart data={result}>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tickFormatter={(value) => {
                        try {
                            const date = new Date(`${value}-02`);
                            return date.toLocaleString('default', { month: 'short' });
                        } catch (e) {
                            return value;
                        }
                    }}
                  />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent 
                        formatter={(value, name) => {
                            const configKey = Object.keys(chartConfig).find(key => chartConfig[key as keyof typeof chartConfig].label === name);
                            const config = configKey ? chartConfig[configKey as keyof typeof chartConfig] : null;
                            return (
                                <div className="flex items-center gap-2">
                                    {config && <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: config.color}}/>}
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">{name}</span>
                                        <span className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}</span>
                                    </div>
                                </div>
                            )
                        }}
                    />} 
                  />
                  <Legend />
                  <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} name="Historical Revenue" />
                  <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={true} name="Historical Expenses" />
                  <Line dataKey="forecasted_revenue" type="monotone" stroke="var(--color-revenue)" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: 'var(--color-revenue)' }} name="Forecasted Revenue" />
                  <Line dataKey="forecasted_expenses" type="monotone" stroke="var(--color-expenses)" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: 'var(--color-expenses)' }} name="Forecasted Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
