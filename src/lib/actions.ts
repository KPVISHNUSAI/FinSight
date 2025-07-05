"use server";

import { generateReportFromPrompt } from "@/ai/flows/generate-report-from-prompt";
import { detectFinancialAnomalies } from "@/ai/flows/detect-financial-anomalies";

export async function handleGenerateReport(prompt: string, availableData: string) {
  try {
    const result = await generateReportFromPrompt({ prompt, availableData });
    return { report: result.report, error: null };
  } catch (e: any) {
    console.error(e);
    return { report: null, error: e.message || "An unexpected error occurred." };
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
    console.error(e);
    return { anomalies: null, error: e.message || "An unexpected error occurred." };
  }
}
