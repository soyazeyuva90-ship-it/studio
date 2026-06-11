'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing unstructured website design requests.
 *
 * - projectBriefSummarizer - A function that handles the project brief summarization process.
 * - ProjectBriefSummarizerInput - The input type for the projectBriefSummarizer function.
 * - ProjectBriefSummarizerOutput - The return type for the projectBriefSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectBriefSummarizerInputSchema = z.object({
  unstructuredRequest: z.string().describe('The raw, unstructured description of a website design request from a client.'),
});
export type ProjectBriefSummarizerInput = z.infer<typeof ProjectBriefSummarizerInputSchema>;

const ProjectBriefSummarizerOutputSchema = z.object({
  projectName: z.string().describe('A concise, descriptive name for the website design project.'),
  clientCompanyName: z.string().describe('The name of the client company submitting the request.'),
  projectOverview: z.string().describe('A brief, high-level summary of the client\'s main goal and purpose for the new website.'),
  keyFeatures: z.array(z.string()).describe('A list of essential functionalities, sections, or user stories the website must support.'),
  designStylePreferences: z.object({
    overallAesthetic: z.string().describe('A general description of the desired visual style (e.g., modern, minimalist, futuristic, corporate, elegant, playful).'),
    colorPaletteSuggestions: z.array(z.string()).describe('Suggested primary, secondary, and accent colors. Include HEX codes if explicitly mentioned or clearly implied.'),
    typographyPreferences: z.string().describe('Preferred fonts or font styles (e.g., sans-serif for headlines, serif for body, specific font names like "Space Grotesk" or "Inter").'),
    layoutStyle: z.string().describe('Description of the desired layout characteristics (e.g., grid-based, fluid, asymmetric, bento-box, full-width).'),
    animationPreferences: z.string().describe('Desired animations or interactive elements (e.g., parallax scrolling, micro-interactions, 3D elements, kinetic typography).'),
    iconographyStyle: z.string().describe('Preferred style for icons (e.g., line icons, solid icons, glowing effects, illustrative).'),
    targetAudience: z.string().optional().describe('The primary audience the website is intended for, if mentioned or inferable.'),
    competitorAnalysisNotes: z.string().optional().describe('Any mention of competitors, inspirational websites, or websites the client dislikes.'),
  }).describe('Categorized preferences for the website\'s visual and interactive design.'),
  additionalNotes: z.string().optional().describe('Any other important details, constraints, or unstructured requests from the client that don\'t fit into other categories.'),
});
export type ProjectBriefSummarizerOutput = z.infer<typeof ProjectBriefSummarizerOutputSchema>;

export async function projectBriefSummarizer(input: ProjectBriefSummarizerInput): Promise<ProjectBriefSummarizerOutput> {
  return projectBriefSummarizerFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizeProjectBriefPrompt',
  input: { schema: ProjectBriefSummarizerInputSchema },
  output: { schema: ProjectBriefSummarizerOutputSchema },
  prompt: `You are an AI-powered "Design Project Architect" for a web design company named OOBy.
Your task is to analyze an unstructured website design request from a client and generate a structured project brief summary.
Focus on extracting key requirements and categorizing design preferences.
Your goal is to quickly understand the project scope and allow the design team to begin work efficiently.
Consider current and emerging 2026 web design trends when categorizing design preferences, even if not explicitly stated, inferring based on the general tone or implicit needs of the client, or providing examples of what kind of information fits in each category.

Client Request:
{{{unstructuredRequest}}}

Please provide the output in JSON format, adhering strictly to the ProjectBriefSummarizerOutputSchema.`,
});

const projectBriefSummarizerFlow = ai.defineFlow(
  {
    name: 'projectBriefSummarizerFlow',
    inputSchema: ProjectBriefSummarizerInputSchema,
    outputSchema: ProjectBriefSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await summarizePrompt(input);
    return output!;
  }
);
