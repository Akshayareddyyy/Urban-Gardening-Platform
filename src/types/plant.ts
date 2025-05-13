export interface PlantImage {
  thumbnail?: string;
  regular_url?: string; // Can be placeholder or data URI
  original_url?: string; // Can be placeholder or data URI
  imageDataUri?: string; // For GenAI generated images
  license_name?: string;
  license_url?: string;
}

export interface Plant {
  id: string; // Slugified common_name
  common_name: string;
  scientific_name: string[]; // Gemini might return a single string, adapt in service layer
  other_name?: string[];
  cycle: string;
  watering: string;
  sunlight: string[] | string;
  type?: string;
  description?: string;
  default_image?: PlantImage | null;
  care_level?: string;
  growth_rate?: string;
  // Fields like hardiness, soil, propagation are harder for GenAI to provide consistently structured.
  // Keep core fields.
  image_prompt?: string; // For generating an image if not directly provided
}

export interface PlantSummary extends Pick<Plant, 'id' | 'common_name' | 'scientific_name' | 'cycle' | 'watering' | 'sunlight' | 'default_image'> {}

// For the GenAI suggestions (from suggest-plants.ts flow)
// This type definition is specific to the suggestPlants flow and should ideally live with it or be imported if truly shared.
// For now, keeping it here as it was, but noting that the main Plant/PlantSummary are changing.
export interface PlantSuggestion {
  name: string;
  description: string;
}
