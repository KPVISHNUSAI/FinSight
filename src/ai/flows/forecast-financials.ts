'use server';
/**
 * @fileOverview This file defines a Genkit flow for forecasting financial data.
 *
 * - forecastFinancials - A function that initiates the financial forecasting process.
 * - ForecastFinancialsInput - The input type for the forecastFinancials function.
 * - ForecastFinancialsOutput - The return type for the forecastFinancials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastFinancialsInputSchema = z.object({
  historicalData: z.string().describe('Historical financial data in JSON format. It should be an array of objects with keys like "month", "revenue", "expenses".'),
});
export type ForecastFinancialsInput = z.infer<
  typeof ForecastFinancialsInputSchema
>;

const ForecastItemSchema = z.object({
    month: z.string().describe("The forecasted month in 'YYYY-MM' format."),
    forecasted_revenue: z.number().describe("The forecasted revenue for the month."),
    forecasted_expenses: z.number().describe("The forecasted expenses for the month."),
    reasoning: z.string().describe("The reasoning behind the forecast.")
});

const ForecastFinancialsOutputSchema = z.object({
  forecast: z.array(ForecastItemSchema).describe('An array of forecasted financial data for the next 6 months.'),
});
export type ForecastFinancialsOutput = z.infer<
  typeof ForecastFinancialsOutputSchema
>;

export async function forecastFinancials(
  input: ForecastFinancialsInput
): Promise<ForecastFinancialsOutput> {
  return forecastFinancialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastFinancialsPrompt',
  input: {schema: ForecastFinancialsInputSchema},
  output: {schema: ForecastFinancialsOutputSchema},
  prompt: `You are an expert financial analyst. Based on the historical data provided, generate a realistic 6-month financial forecast. Analyze trends, seasonality, and other patterns to inform your forecast.

Historical Data:
{{{historicalData}}}

Provide a forecast for the next 6 months following the last month in the historical data. Explain your reasoning for each forecasted value.
`,
});

const forecastFinancialsFlow = ai.defineFlow(
  {
    name: 'forecastFinancialsFlow',
    inputSchema: ForecastFinancialsInputSchema,
    outputSchema: ForecastFinancialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
