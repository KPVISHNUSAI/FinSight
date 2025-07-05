"use server";

import { generateReportFromPrompt } from "@/ai/flows/generate-report-from-prompt";
import { detectFinancialAnomalies } from "@/ai/flows/detect-financial-anomalies";
import { forecastFinancials } from "@/ai/flows/forecast-financials";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
      console.error(e);
      return { forecast: null, error: e.message || "An unexpected error occurred." };
    }
}

function getFirebaseAuthErrorMessage(error: any): string {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return error.message || "An unexpected error occurred.";
    }
    switch (error.code) {
        case "auth/invalid-email":
            return "The email address is not valid.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "The password is too weak. It must be at least 6 characters long.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}

export async function signInWithEmail(prevState: any, data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
  
    if (!email || !password) {
      return { error: "Email and password are required." };
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error: getFirebaseAuthErrorMessage(error) };
    }
}
  
export async function signUpWithEmail(prevState: any, data: FormData) {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
  
    if (!email || !password) {
      return { error: "Email and password are required." };
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
        return { error: getFirebaseAuthErrorMessage(error) };
    }
}

export async function signOutAction() {
    await auth.signOut();
}
