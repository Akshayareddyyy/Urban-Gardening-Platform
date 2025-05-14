
'use server';
/**
 * @fileOverview AI-powered fertilizer suggestion flow.
 *
 * - suggestFertilizers - A function that provides fertilizer suggestions.
 * - SuggestFertilizersInput - The input type for the suggestFertilizers function.
 * - SuggestFertilizersOutput - The return type for the suggestFertilizers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SuggestFertilizersInput as InputType, SuggestFertilizersOutput as OutputType } from '@/types/fertilizer';

const SuggestFertilizersInputSchema = z.object({
  plantType: z.string().min(3).describe('The type or name of the plant (e.g., "Tomatoes", "Roses", "Indoor Ferns", "Vegetable Garden").'),
  growthFocus: z.string().min(3).describe('The primary goal for fertilizing (e.g., "Leafy growth", "More flowers", "Bigger fruits", "Root development", "General health boost", "Seedling stage").'),
  soilDescription: z.string().optional().describe('A brief description of the soil, if known (e.g., "sandy and drains quickly", "heavy clay", "using standard potting mix", "unknown garden soil").'),
});

const FertilizerSuggestionSchema = z.object({
  fertilizerName: z.string().describe('The common name or type of the suggested fertilizer (e.g., "Balanced All-Purpose Fertilizer (10-10-10)", "High Potassium Tomato Food (5-10-15)", "Organic Fish Emulsion").'),
  suitability: z.string().describe('A brief explanation (2-3 sentences) of why this fertilizer is suitable for the given plant type and growth focus, and how it addresses the user\'s needs.'),
  applicationNotes: z.string().describe('Concise notes on how and when to apply the fertilizer, including any important precautions (e.g., "Apply every 4-6 weeks during growing season. Dilute as per package. Water plant well before and after application." ).'),
});

const SuggestFertilizersOutputSchema = z.object({
  suggestions: z.array(FertilizerSuggestionSchema)
  .min(1, "At least one fertilizer suggestion should be provided.")
  .max(4, "No more than 4 fertilizer suggestions should be provided.")
  .describe('A list of 2 to 3 tailored fertilizer suggestions.'),
});

export type SuggestFertilizersInput = z.infer<typeof SuggestFertilizersInputSchema>;
export type SuggestFertilizersOutput = z.infer<typeof SuggestFertilizersOutputSchema>;


// Exported wrapper function
export async function suggestFertilizers(input: InputType): Promise<OutputType> {
  return suggestFertilizersFlow(input as SuggestFertilizersInput);
}

const prompt = ai.definePrompt({
  name: 'suggestFertilizersPrompt',
  input: {schema: SuggestFertilizersInputSchema},
  output: {schema: SuggestFertilizersOutputSchema},
  prompt: `You are an expert gardening advisor specializing in plant nutrition and fertilizers. A user needs fertilizer recommendations.

User's Plant Type: {{{plantType}}}
User's Desired Growth Focus: {{{growthFocus}}}
{{#if soilDescription}}User's Soil Description: {{{soilDescription}}}{{/if}}

Based on this information, please provide 2 to 3 specific fertilizer suggestions. For each suggestion, include:
1.  'fertilizerName': The common name or type (e.g., "Balanced NPK (10-10-10)", "Organic Blood Meal").
2.  'suitability': Why it's a good choice for the plant and focus (2-3 sentences).
3.  'applicationNotes': Key tips on application (how, when, precautions).

Prioritize practical, commonly available options. If organic options are suitable, include at least one.
If the soil description is provided, consider its impact on nutrient availability or fertilizer choice. For example, sandy soils might need more frequent, smaller applications.

Format your response strictly as a JSON object matching the output schema.
`,
});

const suggestFertilizersFlow = ai.defineFlow(
  {
    name: 'suggestFertilizersFlow',
    inputSchema: SuggestFertilizersInputSchema,
    outputSchema: SuggestFertilizersOutputSchema,
  },
  async (input) => {
    console.log('SuggestFertilizersFlow input:', input);
    try {
      const {output, usage} = await prompt(input);
      console.log('SuggestFertilizersFlow output:', output);
      console.log('SuggestFertilizersFlow usage:', usage);

      if (!output || !output.suggestions || output.suggestions.length === 0) {
        console.warn('LLM returned no fertilizer suggestions. Sending a default helpful message.');
        return {
          suggestions: [
            {
              fertilizerName: "No specific matches found",
              suitability: "We couldn't find specific fertilizer matches for your exact criteria. Try rephrasing your plant type or growth focus.",
              applicationNotes: "For general guidance, a balanced all-purpose fertilizer is often a good starting point for many plants. Always follow product label instructions."
            }
          ]
        };
      }
      return output;
    } catch (error) {
      console.error('Error in suggestFertilizersFlow calling prompt:', error);
      return {
        suggestions: [
          {
            fertilizerName: "Error Generating Suggestions",
            suitability: "Sorry, we encountered an error while trying to generate fertilizer suggestions. Please try again later.",
            applicationNotes: "If the problem persists, please contact support."
          }
        ]
      };
    }
  }
);
