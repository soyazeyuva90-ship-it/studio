'use server';
/**
 * @fileOverview A Genkit flow that generates a summarized safety report for parents based on device activity logs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LogItemSchema = z.object({
  type: z.string(),
  content: z.string(),
  timestamp: z.string(),
  sender: z.string().optional(),
});

const SafetyReportInputSchema = z.object({
  deviceName: z.string(),
  recentLogs: z.array(LogItemSchema),
});
export type SafetyReportInput = z.infer<typeof SafetyReportInputSchema>;

const SafetyReportOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the recent activity.'),
  concerns: z.array(z.string()).describe('List of potential safety concerns found in the logs.'),
  safetyScore: z.number().min(0).max(100).describe('A safety score from 0-100 based on the content.'),
  recommendations: z.array(z.string()).describe('Actionable advice for the parent.'),
});
export type SafetyReportOutput = z.infer<typeof SafetyReportOutputSchema>;

export async function generateSafetyReport(input: SafetyReportInput): Promise<SafetyReportOutput> {
  return safetyReportFlow(input);
}

const safetyPrompt = ai.definePrompt({
  name: 'safetyReportPrompt',
  input: { schema: SafetyReportInputSchema },
  output: { schema: SafetyReportOutputSchema },
  prompt: `You are an AI Safety Assistant for the SafeGuard parental monitoring app.
Your goal is to analyze the following recent activity logs from a device named "{{deviceName}}" and provide a structured safety report for the parent.

Focus on:
- Identifying cyberbullying, predatory behavior, or inappropriate content in messages.
- Flagging unusual communication patterns (e.g., late-night activity).
- Providing a calm, objective safety score.

Recent Logs:
{{#each recentLogs}}
- [{{type}}] at {{timestamp}}: {{content}} (User/Contact: {{sender}})
{{/each}}

Analyze these logs and provide the summary, concerns, safetyScore, and recommendations.`,
});

const safetyReportFlow = ai.defineFlow(
  {
    name: 'safetyReportFlow',
    inputSchema: SafetyReportInputSchema,
    outputSchema: SafetyReportOutputSchema,
  },
  async (input) => {
    const { output } = await safetyPrompt(input);
    return output!;
  }
);
