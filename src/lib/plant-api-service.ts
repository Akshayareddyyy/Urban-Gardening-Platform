'use server';
import type { Plant, PlantSummary } from '@/types/plant';
import { getPlantInfo, type GetPlantInfoOutput } from '@/ai/flows/get-plant-info-flow';
import { generatePlantImage } from '@/ai/flows/generate-plant-image-flow';

// Helper function to create a slug from a name
function slugify(name: string): string {
  if (!name) return 'unknown-plant';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function searchPlants(query: string): Promise<PlantSummary[]> {
  if (!query) {
    // Optionally, return some popular/default plants or an empty array.
    // For now, an empty query returns no results.
    return [];
  }

  const plantInfo = await getPlantInfo({ plantQuery: query });

  if (!plantInfo.isPlant || !plantInfo.commonName) {
    return [];
  }
  
  let imageDataUri: string | undefined;
  if (plantInfo.imagePrompt) {
    const imageResult = await generatePlantImage({ prompt: plantInfo.imagePrompt });
    if (imageResult.imageDataUri) {
      imageDataUri = imageResult.imageDataUri;
    } else if (imageResult.error) {
      console.warn(`Image generation failed for "${plantInfo.commonName}": ${imageResult.error}`);
    }
  }

  const plantId = slugify(plantInfo.commonName);

  const summary: PlantSummary = {
    id: plantId,
    common_name: plantInfo.commonName,
    scientific_name: plantInfo.scientificName || ['N/A'],
    cycle: plantInfo.cycle || 'N/A',
    watering: plantInfo.watering || 'N/A',
    sunlight: plantInfo.sunlight || 'N/A',
    default_image: imageDataUri ? { imageDataUri } : null,
  };

  return [summary]; // Return a single result based on the query
}

export async function getPlantDetails(plantIdOrQuery: string): Promise<Plant | null> {
  // plantIdOrQuery is expected to be the slug, but GenAI will use it as a query term.
  const plantInfo = await getPlantInfo({ plantQuery: plantIdOrQuery.replace(/-/g, ' ') }); // De-slugify for better query

  if (!plantInfo.isPlant || !plantInfo.commonName) {
    return null;
  }

  let imageDataUri: string | undefined;
  if (plantInfo.imagePrompt) {
    const imageResult = await generatePlantImage({ prompt: plantInfo.imagePrompt });
     if (imageResult.imageDataUri) {
      imageDataUri = imageResult.imageDataUri;
    } else if (imageResult.error) {
      console.warn(`Image generation failed for "${plantInfo.commonName}" during details fetch: ${imageResult.error}`);
    }
  }
  
  const id = slugify(plantInfo.commonName);

  const plantDetails: Plant = {
    id: id,
    common_name: plantInfo.commonName,
    scientific_name: plantInfo.scientificName || [],
    other_name: [], // Gemini might not provide this consistently, can be added if schema supports
    cycle: plantInfo.cycle || 'N/A',
    watering: plantInfo.watering || 'N/A',
    sunlight: plantInfo.sunlight || 'N/A',
    type: plantInfo.plantType || 'N/A',
    description: plantInfo.description || 'No description available.',
    default_image: imageDataUri ? { imageDataUri } : null,
    care_level: plantInfo.careLevel || 'N/A',
    growth_rate: plantInfo.growthRate || 'N/A',
    image_prompt: plantInfo.imagePrompt
  };

  return plantDetails;
}
