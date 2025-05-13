// MOCK API - In a real app, this would use process.env.PERENUAL_API_KEY and fetch from the actual API
import type { Plant, PlantSummary } from '@/types/plant';

const MOCK_PLANTS: Plant[] = [
  {
    id: 1,
    common_name: 'Basil',
    scientific_name: ['Ocimum basilicum'],
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['Full sun'],
    type: 'Herb',
    description: 'Basil is a popular culinary herb known for its aromatic leaves. It thrives in warm weather and well-drained soil. Perfect for a sunny spot in your garden or on a balcony.',
    default_image: {
      thumbnail: 'https://picsum.photos/seed/basil-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/basil-reg/600/400',
      original_url: 'https://picsum.photos/seed/basil-orig/1024/768',
    },
    flower_season: 'Summer',
    soil: ['Loamy', 'Well-drained'],
  },
  {
    id: 2,
    common_name: 'Snake Plant',
    scientific_name: ['Dracaena trifasciata', 'Sansevieria trifasciata'],
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['Low sun', 'Indirect light'],
    type: 'Houseplant',
    description: 'Snake Plant, also known as Mother-in-Law\'s Tongue, is a hardy and low-maintenance houseplant. It tolerates low light and infrequent watering, making it ideal for beginners.',
    default_image: {
      thumbnail: 'https://picsum.photos/seed/snakeplant-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/snakeplant-reg/600/400',
      original_url: 'https://picsum.photos/seed/snakeplant-orig/1024/768',
    },
    care_level: 'Easy',
    soil: ['Well-draining potting mix'],
  },
  {
    id: 3,
    common_name: 'Rose',
    scientific_name: ['Rosa'],
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['Full sun'],
    type: 'Shrub',
    description: 'Roses are classic garden flowers admired for their beauty and fragrance. They require at least six hours of sunlight per day and well-drained, fertile soil.',
    default_image: {
      thumbnail: 'https://picsum.photos/seed/rose-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/rose-reg/600/400',
      original_url: 'https://picsum.photos/seed/rose-orig/1024/768',
    },
    flower_season: 'Spring to Fall',
    soil: ['Loamy', 'Clay', 'Well-drained'],
  },
  {
    id: 4,
    common_name: 'Mint',
    scientific_name: ['Mentha'],
    cycle: 'Perennial',
    watering: 'Average to Frequent',
    sunlight: ['Full sun', 'Part shade'],
    type: 'Herb',
    description: 'Mint is a fast-growing herb known for its refreshing aroma and flavor. It can be invasive, so it\'s often best grown in containers. Prefers moist soil.',
    default_image: {
      thumbnail: 'https://picsum.photos/seed/mint-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/mint-reg/600/400',
      original_url: 'https://picsum.photos/seed/mint-orig/1024/768',
    },
    soil: ['Moist', 'Rich'],
  },
  {
    id: 5,
    common_name: 'Lavender',
    scientific_name: ['Lavandula'],
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['Full sun'],
    type: 'Shrub',
    description: 'Lavender is a fragrant herb prized for its beautiful purple flowers and calming scent. It thrives in sunny, dry conditions and well-drained soil. Drought-tolerant once established.',
    default_image: {
      thumbnail: 'https://picsum.photos/seed/lavender-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/lavender-reg/600/400',
      original_url: 'https://picsum.photos/seed/lavender-orig/1024/768',
    },
    flower_season: 'Summer',
    soil: ['Sandy', 'Well-drained', 'Alkaline'],
  }
];

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchPlants(query: string): Promise<PlantSummary[]> {
  await apiDelay(500);
  if (!query) {
    return MOCK_PLANTS.map(p => ({
      id: p.id,
      common_name: p.common_name,
      scientific_name: p.scientific_name,
      cycle: p.cycle,
      watering: p.watering,
      sunlight: p.sunlight,
      default_image: p.default_image,
    }));
  }
  const lowerQuery = query.toLowerCase();
  const results = MOCK_PLANTS.filter(plant =>
    plant.common_name.toLowerCase().includes(lowerQuery) ||
    plant.scientific_name.some(name => name.toLowerCase().includes(lowerQuery))
  ).map(p => ({
    id: p.id,
    common_name: p.common_name,
    scientific_name: p.scientific_name,
    cycle: p.cycle,
    watering: p.watering,
    sunlight: p.sunlight,
    default_image: p.default_image,
  }));
  return results;
}

export async function getPlantDetails(id: number): Promise<Plant | null> {
  await apiDelay(300);
  const plant = MOCK_PLANTS.find(p => p.id === id);
  return plant || null;
}

// Simplified fields as requested by user for details display:
// name, type, temperature, soil, sunlight, watering, seasonality, flower/fruit time

// Temperature is complex in Perenual. We can use 'hardiness' or simplify.
// Seasonality, flower/fruit time can be inferred or use custom fields.
// For mock data, I've added flower_season and soil to some plants.
// `type` is also added.
// Let's ensure these fields are present in the mock data where applicable.
