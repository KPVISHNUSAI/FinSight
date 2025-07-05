'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting financial anomalies.
 *
 * - detectFinancialAnomalies - A function that initiates the anomaly detection process.
 * - DetectFinancialAnomaliesInput - The input type for the detectFinancialAnomalies function.
 * - DetectFinancialAnomaliesOutput - The return type for the detectFinancialAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFinancialAnomaliesInputSchema = z.object({
  financialData: z.string().describe('Financial data in JSON format.'),
});
export type DetectFinancialAnomaliesInput = z.infer<
  typeof DetectFinancialAnomaliesInputSchema
>;

const DetectFinancialAnomaliesOutputSchema = z.object({
  anomalies: z
    .string()
    .describe('A description of any anomalies detected in the financial data.'),
});
export type DetectFinancialAnomaliesOutput = z.infer<
  typeof DetectFinancialAnomaliesOutputSchema
>;

export async function detectFinancialAnomalies(
  input: DetectFinancialAnomaliesInput
): Promise<DetectFinancialAnomaliesOutput> {
  return detectFinancialAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFinancialAnomaliesPrompt',
  input: {schema: DetectFinancialAnomaliesInputSchema},
  output: {schema: DetectFinancialAnomaliesOutputSchema},
  prompt: `You are an expert financial analyst. Review the following financial data and identify any anomalies, suspicious transactions, or unexpected budget deviations. Explain the anomalies in detail.

Financial Data: {{{financialData}}}`,
});

const detectFinancialAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectFinancialAnomaliesFlow',
    inputSchema: DetectFinancialAnomaliesInputSchema,
    outputSchema: DetectFinancialAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
