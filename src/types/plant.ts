export interface PlantImage {
  thumbnail?: string;
  regular_url?: string;
  original_url?: string;
  medium_url?: string; // Added for Perenual
  small_url?: string; // Added for Perenual
  license?: number; // Added for Perenual
  license_name?: string;
  license_url?: string;
  imageDataUri?: string | null; // Kept for potential future use with other sources
}

export interface Plant {
  id: number; // Changed to number for Perenual API
  common_name: string;
  scientific_name: string[]; // Perenual provides an array
  other_name?: string[];
  cycle: string;
  watering?: string; // Perenual provides this as a string (e.g., "Average")
  sunlight: string[]; // Perenual provides an array (e.g., ["full sun", "part shade"])
  type?: string; // e.g., 'Perennial', 'Herb', 'Shrub'
  description?: string;
  default_image?: PlantImage | null;
  care_level?: string; // Perenual provides this
  growth_rate?: string; // Perenual provides this
  // Perenual specific or commonly useful fields
  dimensions?: {
    type?: string | null;
    min_value?: number;
    max_value?: number;
    unit?: string;
  };
  hardiness?: {
    min: string; // Usually a number string like "7"
    max: string; // Usually a number string like "10"
  };
  watering_general_benchmark?: { // More detailed watering info
    value: string; // e.g., "5-7"
    unit: string; // e.g., "days"
  };
  maintenance?: string; // From Perenual
  medicinal?: boolean; // From Perenual
  poisonous_to_humans?: number; // 0 or 1 from Perenual
  poisonous_to_pets?: number; // 0 or 1 from Perenual
  drought_tolerant?: boolean;
  indoor?: boolean;
}

export interface PlantSummary extends Pick<Plant, 'id' | 'common_name' | 'scientific_name' | 'cycle' | 'watering' | 'sunlight' | 'default_image'> {}

// For the GenAI suggestions (from suggest-plants.ts flow)
export interface PlantSuggestion {
  name: string;
  description: string;
}
