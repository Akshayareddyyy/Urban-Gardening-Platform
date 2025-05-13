// src/ai/flows/suggest-plants.ts
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
  climate: z.string().describe('The climate of the user, e.g., temperate, tropical, arid.'),
  availableSpace: z.string().describe('The available space for plants, e.g., small balcony, large garden.'),
});
export type SuggestPlantsInput = z.infer<typeof SuggestPlantsInputSchema>;

const SuggestPlantsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The common name of the plant.'),
      description: z.string().describe('A brief description of the plant and why it is suitable.'),
    })
  ).describe('A list of plant suggestions.'),
});
export type SuggestPlantsOutput = z.infer<typeof SuggestPlantsOutputSchema>;

export async function suggestPlants(input: SuggestPlantsInput): Promise<SuggestPlantsOutput> {
  return suggestPlantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlantsPrompt',
  input: {schema: SuggestPlantsInputSchema},
  output: {schema: SuggestPlantsOutputSchema},
  prompt: `You are a gardening expert. A user is looking for plant suggestions based on their climate and available space.

Climate: {{{climate}}}
Available Space: {{{availableSpace}}}

Suggest plants that are well-suited to the user's environment. Provide a brief description of each plant and why it is a good choice for the user.

Format your response as a JSON array of plant suggestions, each with a name and description.`, 
});

const suggestPlantsFlow = ai.defineFlow(
  {
    name: 'suggestPlantsFlow',
    inputSchema: SuggestPlantsInputSchema,
    outputSchema: SuggestPlantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
