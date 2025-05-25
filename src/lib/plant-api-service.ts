
'use server';

import type { Plant, PlantSummary } from '@/types/plant';
import { MissingApiKeyError } from '@/lib/errors'; // Import from the new location

const PERENUAL_API_KEY = process.env.NEXT_PUBLIC_PERENUAL_API_KEY;
const PERENUAL_API_URL = 'https://perenual.com/api/v2';

interface PerenualPlantListItem {
  id: number;
  common_name: string;
  scientific_name: string[];
  cycle: string;
  watering: string; 
  sunlight: string[] | string; 
  default_image?: {
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
}

interface PerenualPlantListResponse {
  data: PerenualPlantListItem[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

interface PerenualPlantDetailResponse extends PerenualPlantListItem {
    description?: string;
    type?: string;
    care_level?: string;
    growth_rate?: string;
    dimensions?: {
        type?: string | null;
        min_value?: number;
        max_value?: number;
        unit?: string;
    };
    hardiness?: {
        min: string;
        max: string;
    };
    watering_general_benchmark?: {
        value: string;
        unit: string;
    };
    maintenance?: string;
    medicinal?: boolean | number;
    poisonous_to_humans?: number | boolean;
    poisonous_to_pets?: number | boolean;
    drought_tolerant?: boolean | number;
    indoor?: boolean | number;
    other_name?: string[];
}


function mapToPlantSummary(item: PerenualPlantListItem): PlantSummary {
  return {
    id: item.id,
    common_name: item.common_name,
    scientific_name: item.scientific_name,
    cycle: item.cycle,
    watering: item.watering,
    sunlight: Array.isArray(item.sunlight) ? item.sunlight : (item.sunlight ? [item.sunlight] : []),
    default_image: item.default_image ? {
      thumbnail: item.default_image.thumbnail,
      small_url: item.default_image.small_url,
      medium_url: item.default_image.medium_url,
      regular_url: item.default_image.regular_url,
      original_url: item.default_image.original_url,
    } : undefined,
  };
}

function mapToPlantDetail(item: PerenualPlantDetailResponse): Plant {
    const numOrBoolToBool = (val: number | boolean | undefined): boolean | undefined => {
        if (typeof val === 'boolean') return val;
        if (val === 1) return true;
        if (val === 0) return false;
        return undefined;
    };
    
    const numOrBoolToNum = (val: number | boolean | undefined): number | undefined => {
        if (typeof val === 'number') return val;
        if (val === true) return 1;
        if (val === false) return 0;
        return undefined;
    };


    return {
        id: item.id,
        common_name: item.common_name,
        scientific_name: item.scientific_name,
        other_name: item.other_name,
        cycle: item.cycle,
        watering: item.watering,
        sunlight: Array.isArray(item.sunlight) ? item.sunlight : (item.sunlight ? [item.sunlight] : []),
        type: item.type,
        description: item.description,
        default_image: item.default_image ? {
            license: item.default_image.license,
            license_name: item.default_image.license_name,
            license_url: item.default_image.license_url,
            original_url: item.default_image.original_url,
            regular_url: item.default_image.regular_url,
            medium_url: item.default_image.medium_url,
            small_url: item.default_image.small_url,
            thumbnail: item.default_image.thumbnail,
        } : undefined,
        care_level: item.care_level,
        growth_rate: item.growth_rate,
        dimensions: item.dimensions,
        hardiness: item.hardiness,
        watering_general_benchmark: item.watering_general_benchmark,
        maintenance: item.maintenance,
        medicinal: numOrBoolToBool(item.medicinal),
        poisonous_to_humans: numOrBoolToNum(item.poisonous_to_humans), 
        poisonous_to_pets: numOrBoolToNum(item.poisonous_to_pets),
        drought_tolerant: numOrBoolToBool(item.drought_tolerant),
        indoor: numOrBoolToBool(item.indoor),
    };
}


export async function searchPlants(query: string): Promise<PlantSummary[]> {
  console.log("Plant API Service: Initiating plant search with Perenual API. Key:", PERENUAL_API_KEY ? PERENUAL_API_KEY.substring(0, 10) + "..." : "Not found/undefined");
  if (!PERENUAL_API_KEY) {
    const errorMsg = 'Perenual API key (NEXT_PUBLIC_PERENUAL_API_KEY) is not configured. Please set it in your .env file and restart the server.';
    console.error(errorMsg);
    throw new MissingApiKeyError(errorMsg);
  }
  if (!query || query.trim() === '') {
    return [];
  }

  const url = `${PERENUAL_API_URL}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}`;
  console.log(`Plant API Service: Fetching from Perenual URL: ${url.replace(PERENUAL_API_KEY, '[REDACTED_API_KEY]')}`);

  try {
    const response = await fetch(url, { cache: 'no-store' }); 
    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `Failed to fetch plants from Perenual API: ${response.status} ${response.statusText}. Response: ${errorBody}`;
      console.error(errorMsg);
      throw new Error(`Perenual API request failed with status ${response.status}.`);
    }
    const result = await response.json() as PerenualPlantListResponse;
    console.log(`Plant API Service: Received ${result.data?.length || 0} items from Perenual for query "${query}".`);
    return result.data ? result.data.map(mapToPlantSummary) : [];
  } catch (error) {
    if (error instanceof MissingApiKeyError) { 
        throw error;
    }
    console.error('Error during Perenual API call or JSON parsing in searchPlants:', error);
    throw new Error('An unexpected error occurred while searching for plants.');
  }
}

export async function getPlantDetails(plantId: number): Promise<Plant | null> {
  console.log("Plant API Service: Using Perenual API Key for details:", PERENUAL_API_KEY ? PERENUAL_API_KEY.substring(0, 10) + "..." : "Not found/undefined");
  try {
    if (!PERENUAL_API_KEY) {
      const errorMsg = 'Perenual API key (NEXT_PUBLIC_PERENUAL_API_KEY) is not configured. Plant details cannot be fetched.';
      console.error(errorMsg);
      throw new MissingApiKeyError(errorMsg);
    }

    if (isNaN(plantId) || plantId <= 0) {
      console.error('Invalid plantId provided to getPlantDetails:', plantId);
      return null; 
    }
    
    const url = `${PERENUAL_API_URL}/species/details/${plantId}?key=${PERENUAL_API_KEY}`;
    console.log(`Plant API Service: Fetching details from Perenual URL: ${url.replace(PERENUAL_API_KEY, '[REDACTED_API_KEY]')}`);

    const response = await fetch(url, { cache: 'no-store' }); 
    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `Failed to fetch plant details for ID ${plantId} from Perenual API: ${response.status} ${response.statusText}. Response: ${errorBody}`;
      console.error(errorMsg);
      return null;
    }
    const result = await response.json() as PerenualPlantDetailResponse;
    return mapToPlantDetail(result);
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
        throw error;
    }
    console.error(`Unexpected error in getPlantDetails for ID ${plantId} using Perenual API:`, error);
    throw new Error('An unexpected error occurred while fetching plant details.');
  }
}
