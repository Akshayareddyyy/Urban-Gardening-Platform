export interface PlantImage {
  thumbnail?: string; // From OpenFarm: e.g., picture.attributes.thumbnail_url
  regular_url?: string; // From OpenFarm: e.g., crop.attributes.main_image_path or picture.attributes.image_url
  original_url?: string; // From OpenFarm: e.g., crop.attributes.main_image_path or picture.attributes.image_url
  imageDataUri?: string | null; // Kept for potential future use, but OpenFarm is primary
  license_name?: string;
  license_url?: string;
}

export interface Plant {
  id: string; // OpenFarm slug
  common_name: string; // OpenFarm attributes.name
  scientific_name: string[]; // OpenFarm attributes.binomial_name (singular, adapt to array)
  other_name?: string[]; // OpenFarm attributes.common_names
  cycle: string; // Inferred from OpenFarm tags_array or default
  watering: string; // Inferred from OpenFarm description/sowing_method or default
  sunlight: string[] | string; // OpenFarm attributes.sun_requirements
  type?: string; // Inferred from OpenFarm tags_array (e.g., 'Herb', 'Vegetable') or taxon
  description?: string; // OpenFarm attributes.description
  default_image?: PlantImage | null; // Derived from OpenFarm attributes.main_image_path or pictures relationship
  care_level?: string; // Not directly in OpenFarm, default to 'N/A' or infer
  growth_rate?: string; // Not directly in OpenFarm, default to 'N/A' or infer
  // OpenFarm specific fields that might be useful
  svg_icon?: string | null; // OpenFarm attributes.svg_icon
  tags_array?: string[] | null; // OpenFarm attributes.tags_array, useful for inferences
}

export interface PlantSummary extends Pick<Plant, 'id' | 'common_name' | 'scientific_name' | 'cycle' | 'watering' | 'sunlight' | 'default_image'> {}

// For the GenAI suggestions (from suggest-plants.ts flow)
export interface PlantSuggestion {
  name: string;
  description: string;
}
