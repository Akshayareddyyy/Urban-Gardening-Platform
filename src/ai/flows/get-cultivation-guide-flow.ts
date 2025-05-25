
'use server';
/**
 * @fileOverview AI-powered cultivation guide generation for specific plants.
 *
 * - getCultivationGuide - A function that provides a detailed cultivation guide.
 * - GetCultivationGuideInput - The input type for the getCultivationGuide function.
 * - GetCultivationGuideOutput - The return type for the getCultivationGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCultivationGuideInputSchema = z.object({
  plantName: z.string().min(2, {message: "Plant name must be at least 2 characters."}).describe('The common name of the plant for which to generate a cultivation guide (e.g., "Tomato", "Basil", "Peace Lily").'),
});
export type GetCultivationGuideInput = z.infer<typeof GetCultivationGuideInputSchema>;

const CultivationStepSchema = z.object({
  stepNumber: z.number().describe("The sequential number of the cultivation step."),
  title: z.string().describe("A concise title for this step (e.g., 'Seed Starting', 'Transplanting', 'Daily Care')."),
  description: z.string().describe("Detailed instructions or information for this cultivation step."),
});

const GetCultivationGuideOutputSchema = z.object({
  plantName: z.string().describe("The common name of the plant for which the guide is generated."),
  introduction: z.string().optional().describe("A brief introduction to growing this plant, highlighting its key characteristics or benefits for urban gardeners."),
  sunlightNeeds: z.string().describe("Detailed sunlight requirements (e.g., 'Requires full sun, at least 6-8 hours of direct sunlight per day.')."),
  wateringNeeds: z.string().describe("Detailed watering requirements (e.g., 'Water deeply when the top inch of soil feels dry. Avoid overwatering.')."),
  soilNeeds: z.string().describe("Specific soil requirements (e.g., 'Prefers well-draining potting mix rich in organic matter. pH 6.0-7.0.')."),
  plantingSteps: z.array(CultivationStepSchema).min(3).max(7).describe("A list of 3 to 7 key steps to plant and grow the plant, from seed/seedling to ongoing care."),
  estimatedTimeToHarvestOrBloom: z.string().optional().describe("Estimated time from planting to harvest (for edibles) or bloom (for ornamentals), if applicable (e.g., '60-80 days from transplanting', 'Blooms in spring')."),
  commonPestsAndDiseases: z.string().optional().describe("Brief notes on 2-3 common pests or diseases affecting this plant and simple organic management tips."),
  additionalTips: z.string().optional().describe("Any other useful tips for successfully growing this plant in an urban environment, such as container suitability or specific urban challenges."),
});
export type GetCultivationGuideOutput = z.infer<typeof GetCultivationGuideOutputSchema>;


export async function getCultivationGuide(input: GetCultivationGuideInput): Promise<GetCultivationGuideOutput> {
  return getCultivationGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCultivationGuidePrompt',
  input: {schema: GetCultivationGuideInputSchema},
  output: {schema: GetCultivationGuideOutputSchema},
  prompt: `You are an expert horticulturalist and urban gardening advisor with a knack for providing clear, actionable advice.
A user wants a detailed cultivation guide for the following plant: {{{plantName}}}.

Please generate a comprehensive guide covering:
1.  'plantName': Confirm the plant name.
2.  'introduction': A brief, engaging introduction to growing this plant, especially for urban settings if applicable.
3.  'sunlightNeeds': Specific sunlight requirements (hours, type of light).
4.  'wateringNeeds': Detailed watering advice (frequency, method, how to check).
5.  'soilNeeds': Ideal soil type, pH, and composition.
6.  'plantingSteps': A list of 3-7 clear, actionable steps. Each step should have a 'stepNumber', a 'title' (e.g., "Choosing a Container", "Sowing Seeds", "Hardening Off", "Fertilizing Schedule"), and a 'description'.
7.  'estimatedTimeToHarvestOrBloom': Time to harvest for edibles, or bloom time for ornamentals. Be specific if possible.
8.  'commonPestsAndDiseases': Mention 2-3 common issues and simple, preferably organic, control methods.
9.  'additionalTips': Any other crucial tips for urban success, container growing, or unique aspects of this plant.

Focus on practical advice suitable for home gardeners, potentially in urban environments with limited space.
Format your response strictly as a JSON object matching the output schema.
`,
});

const getCultivationGuideFlow = ai.defineFlow(
  {
    name: 'getCultivationGuideFlow',
    inputSchema: GetCultivationGuideInputSchema,
    outputSchema: GetCultivationGuideOutputSchema,
  },
  async (input) => {
    console.log('getCultivationGuideFlow input:', input);
    try {
      const {output, usage} = await prompt(input);
      console.log('getCultivationGuideFlow output:', output);
      console.log('getCultivationGuideFlow usage:', usage);

      if (!output || !output.plantName) {
        console.warn('LLM returned no cultivation guide. Returning a default error structure.');
        // Ensure the return matches the Zod schema, even for errors handled here
        return {
          plantName: input.plantName,
          introduction: "Could not generate a guide for this plant at the moment.",
          sunlightNeeds: "N/A",
          wateringNeeds: "N/A",
          soilNeeds: "N/A",
          plantingSteps: [{stepNumber: 1, title: "Error", description: "Failed to retrieve cultivation steps."}],
        };
      }
      return output;
    } catch (error) {
      console.error('Error in getCultivationGuideFlow calling prompt:', error);
      return { // Match schema on error
        plantName: input.plantName,
        introduction: "An error occurred while generating the guide.",
        sunlightNeeds: "N/A",
        wateringNeeds: "N/A",
        soilNeeds: "N/A",
        plantingSteps: [{stepNumber: 1, title: "Error", description: "System error during guide generation."}],
      };
    }
  }
);

