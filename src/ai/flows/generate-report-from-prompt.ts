'use server';
/**
 * @fileOverview An AI agent for generating custom financial reports from natural language prompts.
 *
 * - generateReportFromPrompt - A function that generates a financial report based on a user's natural language prompt.
 * - GenerateReportFromPromptInput - The input type for the generateReportFromPrompt function.
 * - GenerateReportFromPromptOutput - The return type for the generateReportFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired financial report.'),
  availableData: z.string().describe('Description of available financial data sources and their structure.'),
});
export type GenerateReportFromPromptInput = z.infer<
  typeof GenerateReportFromPromptInputSchema
>;

const GenerateReportFromPromptOutputSchema = z.object({
  report: z.string().describe('The generated financial report in a suitable format (e.g., Markdown, JSON).'),
});
export type GenerateReportFromPromptOutput = z.infer<
  typeof GenerateReportFromPromptOutputSchema
>;

export async function generateReportFromPrompt(
  input: GenerateReportFromPromptInput
): Promise<GenerateReportFromPromptOutput> {
  return generateReportFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromPromptPrompt',
  input: {schema: GenerateReportFromPromptInputSchema},
  output: {schema: GenerateReportFromPromptOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to generate a financial report based on the user's prompt.

  The following data sources are available:
  {{{availableData}}}

  User Prompt: {{{prompt}}}

  Please generate the financial report.  The report should be well-formatted and easy to understand. If the prompt requests a specific format, use that format. Otherwise, use Markdown.
`,
});

const generateReportFromPromptFlow = ai.defineFlow(
  {
    name: 'generateReportFromPromptFlow',
    inputSchema: GenerateReportFromPromptInputSchema,
    outputSchema: GenerateReportFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
