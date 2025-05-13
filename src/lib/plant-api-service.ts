'use server';
import type { Plant, PlantSummary, PlantImage } from '@/types/plant';

const OPENFARM_API_BASE_URL = 'https://openfarm.cc/api/v1';
const OPENFARM_BASE_URL = 'https://openfarm.cc';

interface OpenFarmCropAttributes {
  name: string;
  slug: string;
  binomial_name: string | null;
  common_names: string[] | null;
  description: string | null;
  sun_requirements: string | null;
  sowing_method: string | null; // Contains general care info
  main_image_path: string | null;
  tags_array: string[] | null;
  svg_icon?: string | null;
  // other fields from OpenFarm
  [key: string]: any; // Allow other attributes
}

interface OpenFarmPictureAttributes {
  image_url: string;
  thumbnail_url: string;
  small_url: string;
  large_url: string;
  // ... any other picture attributes
}

interface OpenFarmApiObject<TAttributes> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: {
    pictures?: {
      data: Array<{ id: string, type: 'pictures' }>;
    };
  };
}

interface OpenFarmListResponse<TAttributes> {
  data: OpenFarmApiObject<TAttributes>[];
  included?: OpenFarmApiObject<any>[]; // For related data like pictures
  links?: {
    self: string;
    next?: string;
    prev?: string;
  };
}

interface OpenFarmDetailResponse<TAttributes> {
  data: OpenFarmApiObject<TAttributes>;
  included?: OpenFarmApiObject<any>[];
}

// Helper to construct full image URLs
function getFullImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${OPENFARM_BASE_URL}${path}`;
}

// Helper to infer plant cycle from tags
function inferCycle(tags: string[] | null | undefined): string {
  if (tags) {
    if (tags.includes('perennial')) return 'Perennial';
    if (tags.includes('annual')) return 'Annual';
    if (tags.includes('biennial')) return 'Biennial';
  }
  return 'N/A';
}

// Helper to map OpenFarm crop data to PlantSummary
function mapToPlantSummary(crop: OpenFarmApiObject<OpenFarmCropAttributes>): PlantSummary {
  const imageUrl = getFullImageUrl(crop.attributes.main_image_path);
  return {
    id: crop.attributes.slug, // Use slug as ID
    common_name: crop.attributes.name,
    scientific_name: crop.attributes.binomial_name ? [crop.attributes.binomial_name] : ['N/A'],
    cycle: inferCycle(crop.attributes.tags_array),
    watering: crop.attributes.sowing_method ? 'Check details' : 'N/A', // Watering info often in sowing_method/description
    sunlight: crop.attributes.sun_requirements || 'N/A',
    default_image: imageUrl ? { regular_url: imageUrl, original_url: imageUrl } : null,
  };
}

// Helper to map OpenFarm crop data to Plant (detailed)
function mapToPlantDetail(
  cropData: OpenFarmApiObject<OpenFarmCropAttributes>,
  includedData?: OpenFarmApiObject<any>[]
): Plant {
  let mainImage: PlantImage | null = null;
  if (cropData.attributes.main_image_path) {
    const imgUrl = getFullImageUrl(cropData.attributes.main_image_path);
    if (imgUrl) {
      mainImage = { regular_url: imgUrl, original_url: imgUrl };
    }
  }

  // Attempt to find better images from included pictures if available
  if (cropData.relationships?.pictures?.data && cropData.relationships.pictures.data.length > 0 && includedData) {
    const picId = cropData.relationships.pictures.data[0].id;
    const picture = includedData.find(item => item.type === 'pictures' && item.id === picId);
    if (picture && picture.attributes) {
      const picAttrs = picture.attributes as OpenFarmPictureAttributes;
      mainImage = {
        thumbnail: picAttrs.thumbnail_url,
        regular_url: picAttrs.image_url, // or large_url
        original_url: picAttrs.image_url,
      };
    }
  }


  return {
    id: cropData.attributes.slug,
    common_name: cropData.attributes.name,
    scientific_name: cropData.attributes.binomial_name ? [cropData.attributes.binomial_name] : ['N/A'],
    other_name: cropData.attributes.common_names || [],
    cycle: inferCycle(cropData.attributes.tags_array),
    watering: cropData.attributes.sowing_method || cropData.attributes.description || 'N/A', // More detailed watering info attempt
    sunlight: cropData.attributes.sun_requirements || 'N/A',
    type: cropData.attributes.tags_array?.find(tag => ['herb', 'vegetable', 'fruit', 'flower', 'shrub', 'tree'].includes(tag.toLowerCase())) || 'N/A',
    description: cropData.attributes.description || 'No description available.',
    default_image: mainImage,
    care_level: 'N/A', // OpenFarm doesn't have a direct care_level field
    growth_rate: 'N/A', // OpenFarm doesn't have a direct growth_rate field
    svg_icon: cropData.attributes.svg_icon ? getFullImageUrl(cropData.attributes.svg_icon) : null,
    tags_array: cropData.attributes.tags_array,
  };
}


export async function searchPlants(query: string): Promise<PlantSummary[]> {
  if (!query.trim()) {
    return [];
  }
  try {
    // Using 'query' for full-text search as 'filter[common_names]' might be too restrictive
    const response = await fetch(`${OPENFARM_API_BASE_URL}/crops?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error(`OpenFarm API error (searchPlants): ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      return [];
    }
    const result = await response.json() as OpenFarmListResponse<OpenFarmCropAttributes>;
    return result.data.map(mapToPlantSummary);
  } catch (error) {
    console.error('Failed to search plants from OpenFarm:', error);
    return [];
  }
}

export async function getPlantDetails(plantSlug: string): Promise<Plant | null> {
  if (!plantSlug) {
    return null;
  }
  try {
    // Request to include pictures for better image quality
    const response = await fetch(`${OPENFARM_API_BASE_URL}/crops/${plantSlug}?include=pictures`);
    if (!response.ok) {
      console.error(`OpenFarm API error (getPlantDetails for ${plantSlug}): ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      return null;
    }
    const result = await response.json() as OpenFarmDetailResponse<OpenFarmCropAttributes>;
    return mapToPlantDetail(result.data, result.included);
  } catch (error) {
    console.error(`Failed to get plant details for "${plantSlug}" from OpenFarm:`, error);
    return null;
  }
}
