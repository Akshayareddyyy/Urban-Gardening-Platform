'use server';
/**
 * @fileOverview Generates an image of a plant based on a descriptive prompt.
 *
 * - generatePlantImage - A function that generates a plant image.
 * - GeneratePlantImageInput - The input type for the generatePlantImage function.
 * - GeneratePlantImageOutput - The return type for the generatePlantImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlantImageInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt to generate an image of a plant.'),
});
export type GeneratePlantImageInput = z.infer<typeof GeneratePlantImageInputSchema>;

const GeneratePlantImageOutputSchema = z.object({
  imageDataUri: z.string().optional().describe("The generated image as a data URI (e.g., 'data:image/png;base64,...')."),
  error: z.string().optional().describe('Error message if image generation failed.'),
});
export type GeneratePlantImageOutput = z.infer<typeof GeneratePlantImageOutputSchema>;

export async function generatePlantImage(input: GeneratePlantImageInput): Promise<GeneratePlantImageOutput> {
  return generatePlantImageFlow(input);
}

const generatePlantImageFlow = ai.defineFlow(
  {
    name: 'generatePlantImageFlow',
    inputSchema: GeneratePlantImageInputSchema,
    outputSchema: GeneratePlantImageOutputSchema,
  },
  async (input) => {
    try {
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images.
      const {media, text} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
          // Optional: Adjust safety settings if needed, though defaults are generally fine.
          // safetySettings: [
          //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'}
          // ]
        },
      });

      if (media && media.url) {
        return { imageDataUri: media.url };
      } else {
        console.warn('Image generation did not return media URL. Text response:', text);
        return { error: 'Image generation succeeded but no image URL was returned. ' + (text || '') };
      }
    } catch (e: any) {
      console.error('Error generating plant image:', e);
      return { error: e.message || 'Failed to generate image.' };
    }
  }
);
