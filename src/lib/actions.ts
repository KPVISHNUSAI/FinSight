'use server';

import {
  generateReportFromPrompt,
  type GenerateReportFromPromptOutput,
} from '@/ai/flows/generate-report-from-prompt';
import {
  detectFinancialAnomalies,
  type DetectFinancialAnomaliesOutput,
} from '@/ai/flows/detect-financial-anomalies';
import {
  forecastFinancials,
  type ForecastFinancialsOutput,
} from '@/ai/flows/forecast-financials';
import {
  askAssistant,
  type ConversationInput,
} from '@/ai/flows/conversational-assistant';

function getAiErrorMessage(e: any): string {
  console.error(e);
  if (e.message?.includes('GEMINI_API_KEY')) {
    return 'Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file and restart the server. You can get a free key from Google AI Studio.';
  }
  return e.message || 'An unexpected error occurred while contacting the AI.';
}

export async function handleGenerateReport(
  prompt: string,
  availableData: string
): Promise<{report: GenerateReportFromPromptOutput['report'] | null; error: string | null}> {
  try {
    const result = await generateReportFromPrompt({prompt, availableData});
    return {report: result.report, error: null};
  } catch (e: any) {
    return {report: null, error: getAiErrorMessage(e)};
  }
}

export async function handleDetectAnomalies(
  financialData: string
): Promise<{anomalies: DetectFinancialAnomaliesOutput | null; error: string | null}> {
  try {
    // Basic JSON validation
    JSON.parse(financialData);
  } catch (e) {
    return {
      anomalies: null,
      error: 'Invalid JSON format. Please check your data.',
    };
  }

  try {
    const result = await detectFinancialAnomalies({financialData});
    return {anomalies: result, error: null};
  } catch (e: any) {
    return {anomalies: null, error: getAiErrorMessage(e)};
  }
}

export async function handleForecastFinancials(
  historicalData: string
): Promise<{forecast: ForecastFinancialsOutput['forecast'] | null; error: string | null}> {
  try {
    JSON.parse(historicalData);
  } catch (e) {
    return {
      forecast: null,
      error: 'Invalid JSON format. Please check your data.',
    };
  }

  try {
    const result = await forecastFinancials({historicalData});
    return {forecast: result.forecast, error: null};
  } catch (e: any) {
    return {forecast: null, error: getAiErrorMessage(e)};
  }
}

export async function handleChat(
  input: ConversationInput
): Promise<{response: string | null; error: string | null}> {
  try {
    const result = await askAssistant(input);
    return {response: result, error: null};
  } catch (e: any) {
    return {response: null, error: getAiErrorMessage(e)};
  }
}
