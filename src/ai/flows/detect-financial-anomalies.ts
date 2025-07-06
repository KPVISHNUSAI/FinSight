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
  financialData: z
    .string()
    .describe('A JSON-formatted string containing various financial and operational logs.'),
});
export type DetectFinancialAnomaliesInput = z.infer<
  typeof DetectFinancialAnomaliesInputSchema
>;

const AnomalyItemSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the specific anomaly detected.'),
  severity: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('The severity level of the anomaly.'),
  recommendation: z
    .string()
    .describe(
      'A recommended action to mitigate the risk associated with the anomaly.'
    ),
});

const DetectFinancialAnomaliesOutputSchema = z.object({
  summary: z.string().describe('A brief, one-paragraph natural language summary of the most critical findings. If no anomalies are found, state that the system appears to be operating normally.'),
  transactionalAnomalies: z
    .array(AnomalyItemSchema)
    .describe('Anomalies related to financial transactions.'),
  accessAnomalies: z
    .array(AnomalyItemSchema)
    .describe('Anomalies related to data access and user permissions.'),
  securityAnomalies: z
    .array(AnomalyItemSchema)
    .describe('Anomalies related to security threats and compliance.'),
  reportingAnomalies: z
    .array(AnomalyItemSchema)
    .describe('Anomalies related to report generation and data modification.'),
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
  prompt: `You are an expert financial compliance and security officer. Your task is to analyze the provided data logs and identify a wide range of anomalies.

First, provide a brief, one-paragraph natural language summary of your findings. This should highlight the most critical risks identified. If no anomalies are found, the summary should state that everything appears to be operating within normal parameters.

Then, for each anomaly found, provide a clear description, assign a severity level (Low, Medium, High, Critical), and suggest a concrete recommendation in the appropriate category.

Analyze the following categories:

1.  **Transactional Anomalies**:
    *   Unusual transaction amounts (e.g., significant spikes, round numbers like $5,000.00).
    *   Transactions occurring at unusual times (e.g., after-hours, weekends).
    *   Budget overruns or transactions approaching budget limits.
    *   Duplicate payments or suspicious payment patterns to the same vendor.

2.  **Access & Permission Anomalies**:
    *   Abnormal data access patterns (e.g., access at unusual times, bulk data downloads).
    *   Unauthorized changes to user roles or permissions.
    *   Reactivation of dormant user accounts.
    *   Attempts at privilege escalation.

3.  **Security & Compliance Anomalies**:
    *   High rates of failed login attempts or suspected brute-force attacks.
    *   Bypassed Multi-Factor Authentication (MFA).
    *   Gaps in audit trails or logs.
    *   Backdated financial entries or unauthorized data modifications.

4.  **Reporting Irregularities**:
    *   Excessive generation of sensitive financial reports.
    *   Last-minute edits to reports just before submission deadlines.

Review the following data and populate the output schema. If no anomalies are found in a category, return an empty array for it.

Financial & Operational Data:
{{{financialData}}}`,
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
