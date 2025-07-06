'use server';

import { generateReportFromPrompt } from "@/ai/flows/generate-report-from-prompt";
import { detectFinancialAnomalies } from "@/ai/flows/detect-financial-anomalies";
import { forecastFinancials } from "@/ai/flows/forecast-financials";

function getAiErrorMessage(e: any): string {
  console.error(e);
  if (e.message?.includes('API key')) {
    return "Missing Gemini API Key. Please add GEMINI_API_KEY to your .env file and restart the server. You can get a free key from Google AI Studio.";
  }
  return e.message || "An unexpected error occurred while contacting the AI.";
}

export async function handleGenerateReport(prompt: string, availableData: string) {
  try {
    const result = await generateReportFromPrompt({ prompt, availableData });
    return { report: result.report, error: null };
  } catch (e: any) {
    return { report: null, error: getAiErrorMessage(e) };
  }
}

export async function handleDetectAnomalies(financialData: string) {
  try {
    // Basic JSON validation
    JSON.parse(financialData);
  } catch (e) {
    return { anomalies: null, error: "Invalid JSON format. Please check your data." };
  }

  try {
    const result = await detectFinancialAnomalies({ financialData });
    return { anomalies: result.anomalies, error: null };
  } catch (e: any) {
    return { anomalies: null, error: getAiErrorMessage(e) };
  }
}

export async function handleForecastFinancials(historicalData: string) {
    try {
      JSON.parse(historicalData);
    } catch (e) {
      return { forecast: null, error: "Invalid JSON format. Please check your data." };
    }
  
    try {
      const result = await forecastFinancials({ historicalData });
      return { forecast: result.forecast, error: null };
    } catch (e: any) {
      return { forecast: null, error: getAiErrorMessage(e) };
    }
}
