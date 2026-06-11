'use server';
/**
 * @fileOverview An AI-powered tool that acts as a collaborative partner, using project descriptions to suggest specific 2026 design trends and layout configurations for new client requests.
 *
 * - aiDesignerAssistant - A function that handles the AI designer assistant process.
 * - AIDesignerAssistantInput - The input type for the aiDesignerAssistant function.
 * - AIDesignerAssistantOutput - The return type for the aiDesignerAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDesignerAssistantInputSchema = z.object({
  projectDescription: z
    .string()
    .describe("A detailed description of the client's website design project."),
});
export type AIDesignerAssistantInput = z.infer<
  typeof AIDesignerAssistantInputSchema
>;

const SuggestedTrendSchema = z.object({
  name: z.string().describe('The name of the design trend.'),
  description: z
    .string()
    .describe('A brief explanation of how this trend applies to the project.'),
});

const AIDesignerAssistantOutputSchema = z.object({
  suggestedTrends:
    z.array(SuggestedTrendSchema).describe('A list of 2026 web design trends relevant to the project.'),
  layoutConfigurations:
    z.string().describe('A description of initial layout configuration suggestions for the website, considering OOBy UI style guidelines.'),
});
export type AIDesignerAssistantOutput = z.infer<
  typeof AIDesignerAssistantOutputSchema
>;

export async function aiDesignerAssistant(
  input: AIDesignerAssistantInput
): Promise<AIDesignerAssistantOutput> {
  return aiDesignerAssistantFlow(input);
}

const aiDesignerAssistantPrompt = ai.definePrompt({
  name: 'aiDesignerAssistantPrompt',
  input: {schema: AIDesignerAssistantInputSchema},
  output: {schema: AIDesignerAssistantOutputSchema},
  prompt: `You are an expert AI-powered Design Project Architect for a website design company called OOBy.
Your task is to analyze a client's website project description and suggest relevant 2026 design trends and initial layout configurations.
Consider modern design principles and OOBy's brand new user interface style guidelines.

OOBy UI Style Guidelines:
- Primary Color: Electric Indigo (#8B5CF6)
- Background Color: Obsidian Void (#110E1B)
- Accent Color: Azure Flux (#6088FA)
- Font pairing: 'Space Grotesk' (sans-serif) for tech-forward headlines and 'Inter' (sans-serif) for high-readability body copy.
- Iconography: Ultra-thin line icons with glowing neon effects, inspired by futuristic schematics and HUD interfaces.
- Layout: A wide-screen bento-box grid with asymmetric modules that creates a sense of organic movement during scrolling.
- Animation: Kinetic typography and slow-motion Z-axis parallax effects on hero sections to create a deep immersive feeling.

Client Project Description:
{{{projectDescription}}}

Based on the project description and OOBy's UI Style Guidelines, provide:
1.  **Relevant 2026 Design Trends**: List specific design trends that align with the project, explaining how they apply.
2.  **Initial Layout Configurations**: Describe a recommended layout approach, incorporating OOBy's UI style principles.
`,
});

const aiDesignerAssistantFlow = ai.defineFlow(
  {
    name: 'aiDesignerAssistantFlow',
    inputSchema: AIDesignerAssistantInputSchema,
    outputSchema: AIDesignerAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await aiDesignerAssistantPrompt(input);
    return output!;
  }
);
