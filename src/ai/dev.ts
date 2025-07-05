import { config } from 'dotenv';
config();

import '@/ai/flows/detect-financial-anomalies.ts';
import '@/ai/flows/summarize-financial-report.ts';
import '@/ai/flows/generate-report-from-prompt.ts';