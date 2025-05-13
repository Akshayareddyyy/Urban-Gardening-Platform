
'use server';
import type { Plant, PlantSummary, PlantImage } from '@/types/plant';

const PERENUAL_API_BASE_URL = 'https://perenual.com/api';

interface PerenualPlantSpecies {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  cycle: string;
  watering?: string; // e.g. "Average"
  sunlight: string[]; // e.g. ["full sun", "part shade"]
  default_image?: PerenualRawImage | null;
  // Details specific fields
  description?: string;
  type?: string; // From details endpoint
  care_level?: string; // From details endpoint
  growth_rate?: string; // From details endpoint
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
  medicinal?: boolean;
  poisonous_to_humans?: number; // 0 or 1
  poisonous_to_pets?: number; // 0 or 1
  drought_tolerant?: boolean;
  indoor?: boolean;
}

interface PerenualRawImage {
  license?: number;
  license_name?: string;
  license_url?: string;
  original_url?: string;
  regular_url?: string;
  medium_url?: string;
  small_url?: string;
  thumbnail?: string;
}

interface PerenualListResponse {
  data: PerenualPlantSpecies[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

// Helper to map Perenual image object to our PlantImage type
function mapPerenualImage(rawImage?: PerenualRawImage | null): PlantImage | null {
  if (!rawImage) return null;
  return {
    thumbnail: rawImage.thumbnail,
    small_url: rawImage.small_url,
    medium_url: rawImage.medium_url,
    regular_url: rawImage.regular_url,
    original_url: rawImage.original_url,
    license: rawImage.license,
    license_name: rawImage.license_name,
    license_url: rawImage.license_url,
  };
}

// Helper to map Perenual plant data to PlantSummary
function mapToPlantSummary(species: PerenualPlantSpecies): PlantSummary {
  return {
    id: species.id,
    common_name: species.common_name || 'N/A',
    scientific_name: species.scientific_name && species.scientific_name.length > 0 ? species.scientific_name : ['N/A'],
    cycle: species.cycle || 'N/A',
    watering: species.watering || 'N/A', // Perenual provides a general string, e.g. "Average"
    sunlight: species.sunlight && species.sunlight.length > 0 ? species.sunlight : ['N/A'],
    default_image: mapPerenualImage(species.default_image),
  };
}

// Helper to map Perenual plant data to Plant (detailed)
function mapToPlantDetail(species: PerenualPlantSpecies): Plant {
  return {
    id: species.id,
    common_name: species.common_name || 'N/A',
    scientific_name: species.scientific_name && species.scientific_name.length > 0 ? species.scientific_name : ['N/A'],
    other_name: species.other_name || [],
    cycle: species.cycle || 'N/A',
    watering: species.watering || 'N/A',
    sunlight: species.sunlight && species.sunlight.length > 0 ? species.sunlight : ['N/A'],
    type: species.type,
    description: species.description || 'No description available.',
    default_image: mapPerenualImage(species.default_image),
    care_level: species.care_level,
    growth_rate: species.growth_rate,
    dimensions: species.dimensions,
    hardiness: species.hardiness,
    watering_general_benchmark: species.watering_general_benchmark,
    maintenance: species.maintenance,
    medicinal: species.medicinal,
    poisonous_to_humans: species.poisonous_to_humans,
    poisonous_to_pets: species.poisonous_to_pets,
    drought_tolerant: species.drought_tolerant,
    indoor: species.indoor,
  };
}

async function fetchFromPerenual<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.PERENUAL_API_KEY;
  if (!apiKey || apiKey === 'your_perenual_api_key_here') {
    console.error('Perenual API key is missing or not configured. Please set PERENUAL_API_KEY in your .env file.');
    return null;
  }

  const url = `${PERENUAL_API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Perenual API error (${endpoint}): ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body (Perenual API non-ok response):", errorBody);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Perenual API error (${endpoint}): Expected JSON, but got ${contentType}`);
      const textBody = await response.text();
      console.error("Unexpected response body (Perenual API HTML/text):", textBody);
      return null;
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Failed to fetch from Perenual endpoint "${endpoint}":`, error);
    return null;
  }
}


export async function searchPlants(query: string): Promise<PlantSummary[]> {
  if (!query.trim()) {
    return [];
  }
  const result = await fetchFromPerenual<PerenualListResponse>(`/species-list?q=${encodeURIComponent(query)}`);
  if (!result || !result.data) {
    return [];
  }
  return result.data.map(mapToPlantSummary);
}

export async function getPlantDetails(plantId: number): Promise<Plant | null> {
  if (!plantId || isNaN(plantId)) {
    return null;
  }
  const result = await fetchFromPerenual<PerenualPlantSpecies>(`/species/details/${plantId}`);
  if (!result) {
    return null;
  }
  return mapToPlantDetail(result);
}
