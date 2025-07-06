'use server';
/**
 * @fileOverview This file defines a Genkit flow for a conversational assistant.
 *
 * - askAssistant - A function that handles a turn in a conversation.
 * - ConversationInput - The input type for the askAssistant function.
 * - ConversationOutput - The return type for the askAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Message} from 'genkit';

const ConversationInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  message: z.string().describe("The user's latest message."),
});
export type ConversationInput = z.infer<typeof ConversationInputSchema>;

export type ConversationOutput = string;

export async function askAssistant(
  input: ConversationInput
): Promise<ConversationOutput> {
  const systemPrompt = `You are a sophisticated and helpful AI assistant for Relanto, a financial analysis platform. Your name is Insight.
Your persona is professional, knowledgeable, and slightly empathetic. You should be concise unless asked for detail.
You are an expert in financial analysis, anomaly detection, forecasting, and reporting.
Your goal is to assist users by answering their questions about the platform's features, interpreting data, or providing general financial insights.
Do not make up features that don't exist. The platform features are: Dashboard, Reports, Anomalies, and Forecasting.`;

  // Correctly format messages for Genkit, which expects content to be an array of parts.
  const messages: Message[] = [
    {role: 'system', content: [{text: systemPrompt}]},
    ...input.history.map((msg) => ({
      role: msg.role,
      content: [{text: msg.content}],
    })),
    {role: 'user', content: [{text: input.message}]},
  ];

  const {output} = await ai.generate({
    messages,
    output: {format: 'text'},
  });

  return output || 'I am sorry, I could not generate a response.';
}
