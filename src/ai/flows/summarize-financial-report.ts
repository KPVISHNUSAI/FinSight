'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing financial reports using GenAI.
 *
 * - summarizeFinancialReport - A function that takes a financial report as input and returns a summary of key findings and potential risks.
 * - SummarizeFinancialReportInput - The input type for the summarizeFinancialReport function.
 * - SummarizeFinancialReportOutput - The return type for the summarizeFinancialReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFinancialReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "A financial report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeFinancialReportInput = z.infer<typeof SummarizeFinancialReportInputSchema>;

const SummarizeFinancialReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the key findings in the financial report.'),
  potentialRisks: z
    .string()
    .describe('An analysis of potential risks identified in the financial report.'),
});
export type SummarizeFinancialReportOutput = z.infer<typeof SummarizeFinancialReportOutputSchema>;

export async function summarizeFinancialReport(
  input: SummarizeFinancialReportInput
): Promise<SummarizeFinancialReportOutput> {
  return summarizeFinancialReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFinancialReportPrompt',
  input: {schema: SummarizeFinancialReportInputSchema},
  output: {schema: SummarizeFinancialReportOutputSchema},
  prompt: `You are a financial expert. Summarize the key findings and potential risks in the following financial report.

Report: {{media url=reportDataUri}}

Key Findings:
Potential Risks: `,
});

const summarizeFinancialReportFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialReportFlow',
    inputSchema: SummarizeFinancialReportInputSchema,
    outputSchema: SummarizeFinancialReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
