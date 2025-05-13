'use server';
/**
 * @fileOverview Retrieves detailed information about a plant using an AI model.
 *
 * - getPlantInfo - A function that fetches plant details.
 * - GetPlantInfoInput - The input type for the getPlantInfo function.
 * - GetPlantInfoOutput - The return type for the getPlantInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPlantInfoInputSchema = z.object({
  plantQuery: z.string().describe('The name or query for the plant to find information about. This can be a common name or a slug-like identifier (e.g., "snake plant" or "snake-plant").'),
});
export type GetPlantInfoInput = z.infer<typeof GetPlantInfoInputSchema>;

const GetPlantInfoOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether the query resulted in a recognized plant.'),
  commonName: z.string().optional().describe('The common name of the plant.'),
  scientificName: z.array(z.string()).optional().describe('The scientific name(s) of the plant.'),
  description: z.string().optional().describe('A detailed description of the plant.'),
  watering: z.string().optional().describe('Watering requirements (e.g., Average, Minimum, Frequent).'),
  sunlight: z.union([z.string(), z.array(z.string())]).optional().describe('Sunlight requirements (e.g., "Full sun", ["Low sun", "Indirect light"]).'),
  cycle: z.string().optional().describe('The life cycle of the plant (e.g., Annual, Perennial).'),
  plantType: z.string().optional().describe('The type of plant (e.g., Herb, Shrub, Houseplant).'),
  careLevel: z.string().optional().describe('The care level required (e.g., Easy, Moderate, Hard).'),
  growthRate: z.string().optional().describe('The typical growth rate (e.g., Slow, Moderate, Fast).'),
  imagePrompt: z.string().optional().describe('A descriptive prompt suitable for generating an image of this plant, focusing on its visual characteristics.'),
});
export type GetPlantInfoOutput = z.infer<typeof GetPlantInfoOutputSchema>;

export async function getPlantInfo(input: GetPlantInfoInput): Promise<GetPlantInfoOutput> {
  return getPlantInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPlantInfoPrompt',
  input: {schema: GetPlantInfoInputSchema},
  output: {schema: GetPlantInfoOutputSchema},
  prompt: `You are a botanical expert AI. Given a plant query: "{{plantQuery}}", provide detailed information.

If the query does not seem to be a plant, set "isPlant" to false and omit other fields.
Otherwise, set "isPlant" to true and provide the following details:
- commonName: The most common name.
- scientificName: An array of scientific names. If multiple, list them. If only one, put it in an array.
- description: A comprehensive description covering appearance, typical use, and interesting facts.
- watering: General watering needs (e.g., Minimum, Average, Frequent, Keep moist).
- sunlight: Sunlight exposure needs (e.g., "Full sun", or an array like ["Low sun", "Indirect light"]).
- cycle: The plant's life cycle (e.g., Annual, Perennial, Biennial).
- plantType: The type of plant (e.g., Herb, Shrub, Tree, Houseplant, Succulent, Fern).
- careLevel: General care difficulty (e.g., Easy, Moderate, Hard).
- growthRate: Typical growth rate (e.g., Slow, Moderate, Fast).
- imagePrompt: A concise, visually descriptive phrase for generating an image of the plant. Example: "A vibrant green basil plant with lush leaves in a terracotta pot."

Return the information in the specified JSON format.
Example for "isPlant": false:
{ "isPlant": false }

Example for a plant:
{
  "isPlant": true,
  "commonName": "Swiss Cheese Plant",
  "scientificName": ["Monstera deliciosa"],
  "description": "Monstera deliciosa, commonly called the Swiss cheese plant, is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands. It is a popular houseplant known for its large, glossy, heart-shaped leaves that develop characteristic splits or holes (fenestrations) as they mature.",
  "watering": "Average",
  "sunlight": ["Bright indirect light", "Partial shade"],
  "cycle": "Perennial",
  "plantType": "Houseplant",
  "careLevel": "Easy",
  "growthRate": "Moderate",
  "imagePrompt": "A healthy Swiss Cheese Plant (Monstera deliciosa) with large, fenestrated green leaves in an indoor setting."
}
`,
});

const getPlantInfoFlow = ai.defineFlow(
  {
    name: 'getPlantInfoFlow',
    inputSchema: GetPlantInfoInputSchema,
    outputSchema: GetPlantInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback if AI fails to produce structured output, though definePrompt should handle this.
      return { isPlant: false };
    }
    return output;
  }
);
