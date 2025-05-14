
'use server';
/**
 * @fileOverview Personalized plant suggestions based on climate and available space.
 *
 * - suggestPlants - A function that provides plant suggestions.
 * - SuggestPlantsInput - The input type for the suggestPlants function.
 * - SuggestPlantsOutput - The return type for the suggestPlants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlantsInputSchema = z.object({
  climate: z.string().describe('The climate of the user, e.g., temperate, tropical, arid, continental with cold winters and hot summers.'),
  availableSpace: z.string().describe('The available space for plants, e.g., small sunny balcony, large shady garden, indoor windowsill with indirect light.'),
});
export type SuggestPlantsInput = z.infer<typeof SuggestPlantsInputSchema>;

const PlantSuggestionSchema = z.object({
  name: z.string().describe('The common name of the suggested plant.'),
  description: z.string().describe('A brief description of the plant (2-3 sentences) highlighting why it is suitable for the user\'s conditions, its key characteristics, and basic care tips if concise.'),
});

const SuggestPlantsOutputSchema = z.object({
  suggestions: z.array(PlantSuggestionSchema)
  .min(1, "At least one suggestion should be provided.")
  .max(6, "No more than 6 suggestions should be provided.")
  .describe('A list of 3 to 5 plant suggestions.'),
});
export type SuggestPlantsOutput = z.infer<typeof SuggestPlantsOutputSchema>;

export async function suggestPlants(input: SuggestPlantsInput): Promise<SuggestPlantsOutput> {
  return suggestPlantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlantsPrompt',
  input: {schema: SuggestPlantsInputSchema},
  output: {schema: SuggestPlantsOutputSchema},
  prompt: `You are an expert horticulturist and urban gardening advisor. A user is looking for plant suggestions.

User's Climate: {{{climate}}}
User's Available Space: {{{availableSpace}}}

Please provide 3 to 5 plant suggestions that are well-suited to the user's environment. For each plant, give its common name and a concise, helpful description (2-3 sentences). The description should explain why the plant is a good choice for the specified climate and space, mention any unique features, and if possible, a very brief care tip (e.g., "prefers moist soil", "drought-tolerant once established").

Focus on plants that are generally accessible and suitable for urban environments. Avoid overly rare or difficult-to-grow plants unless specifically implied by the user's input.

Format your response strictly as a JSON object matching the output schema.
`,
});

const suggestPlantsFlow = ai.defineFlow(
  {
    name: 'suggestPlantsFlow',
    inputSchema: SuggestPlantsInputSchema,
    outputSchema: SuggestPlantsOutputSchema,
  },
  async (input) => {
    console.log('SuggestPlantsFlow input:', input);

    try {
      const {output, usage} = await prompt(input);
      console.log('SuggestPlantsFlow output:', output);
      console.log('SuggestPlantsFlow usage:', usage);
      
      if (!output || !output.suggestions || output.suggestions.length === 0) {
        console.warn('LLM returned no suggestions. Sending a default helpful message.');
        return {
          suggestions: [
            {
              name: "No specific matches found",
              description: "We couldn't find specific plant matches for your exact criteria with our current model. Try rephrasing your climate or space description, or be a bit more general."
            }
          ]
        };
      }
      return output;
    } catch (error) {
      console.error('Error in suggestPlantsFlow calling prompt:', error);
      // Return a structured error response that matches SuggestPlantsOutputSchema
      return {
        suggestions: [
          {
            name: "Error Generating Suggestions",
            description: "Sorry, we encountered an error while trying to generate plant suggestions. Please try again later."
          }
        ]
      };
    }
  }
);

