export interface PlantImage {
  thumbnail: string;
  regular_url: string;
  original_url: string;
  license_name?: string;
  license_url?: string;
}

export interface Plant {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  cycle: string; // e.g., Perennial, Annual, Biennial
  watering: string; // e.g., Average, Minimum, Frequent
  sunlight: string[] | string; // e.g., ["full sun", "part shade"] or "Full sun"
  type?: string; // e.g. Tree, Shrub, Herb
  hardiness?: { min: string; max: string }; // Temperature related
  soil?: string[]; // e.g. Loamy, Sandy
  propagation?: string[];
  flowers?: boolean;
  flower_color?: string;
  flower_season?: string; // Custom field, may need to infer
  fruiting_season?: string; // Custom field
  description?: string;
  default_image?: PlantImage | null;
  care_level?: string;
  growth_rate?: string;
  maintenance?: string;
  problem?: string; // pests/diseases
  dimension?: string; // e.g. "Height: 10-15 feet"
}

export interface PlantSummary extends Pick<Plant, 'id' | 'common_name' | 'scientific_name' | 'cycle' | 'watering' | 'sunlight' | 'default_image'> {}

// For the GenAI suggestions
export interface PlantSuggestion {
  name: string;
  description: string;
}
