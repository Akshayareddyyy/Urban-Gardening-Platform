
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-plants.ts';
import '@/ai/flows/suggest-fertilizers.ts';
import '@/ai/flows/get-cultivation-guide-flow.ts'; // Added new flow
// Removed: import '@/ai/flows/get-plant-info-flow.ts';
// Removed: import '@/ai/flows/generate-plant-image-flow.ts';

