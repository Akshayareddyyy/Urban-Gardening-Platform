
export interface FertilizerSuggestion {
  fertilizerName: string;
  suitability: string;
  applicationNotes: string;
}

export interface SuggestFertilizersInput {
  plantType: string;
  growthFocus: string; // e.g., "Leafy growth", "More flowers", "Fruit development", "General maintenance"
  soilDescription?: string; // Optional
}

export interface SuggestFertilizersOutput {
  suggestions: FertilizerSuggestion[];
}
