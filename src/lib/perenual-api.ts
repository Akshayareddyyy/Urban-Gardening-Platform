// MOCK API - In a real app, this would use process.env.PERENUAL_API_KEY and fetch from the actual API
import type { Plant, PlantSummary } from '@/types/plant';

const MOCK_PLANTS: Plant[] = [
  {
    id: 1,
    common_name: 'Basil',
    scientific_name: ['Ocimum basilicum'],
    other_name: ['Sweet Basil', 'Italian Basil'],
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['Full sun'],
    type: 'Herb',
    description: 'Basil is a popular culinary herb known for its aromatic leaves. It thrives in warm weather and well-drained soil. Perfect for a sunny spot in your garden or on a balcony. Susceptible to aphids and downy mildew if overcrowded.',
    hardiness: { min: '10', max: '10' }, // USDA zones, basil is tender
    propagation: ['Seed', 'Stem cuttings'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/basil-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/basil-reg/600/400',
      original_url: 'https://picsum.photos/seed/basil-orig/1024/768',
    },
    flower_season: 'Summer',
    fruiting_season: 'N/A', // Typically not grown for fruit
    soil: ['Loamy', 'Well-drained'],
    care_level: 'Moderate',
    growth_rate: 'Fast',
    maintenance: 'Regular pinching of tips encourages bushier growth.',
    problem: 'Aphids, Downey Mildew, Slugs',
    dimension: 'Height: 12-24 inches, Width: 12-18 inches',
  },
  {
    id: 2,
    common_name: 'Snake Plant',
    scientific_name: ['Dracaena trifasciata', 'Sansevieria trifasciata'],
    other_name: ["Mother-in-Law's Tongue", "Viper's Bowstring Hemp"],
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['Low sun', 'Indirect light', 'Bright indirect light'],
    type: 'Houseplant',
    description: "Snake Plant, also known as Mother-in-Law's Tongue, is a hardy and low-maintenance houseplant. It tolerates low light and infrequent watering, making it ideal for beginners. Known for its air-purifying qualities.",
    hardiness: { min: '9', max: '11' }, // Typically grown indoors in cooler climates
    propagation: ['Division', 'Leaf cuttings'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/snakeplant-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/snakeplant-reg/600/400',
      original_url: 'https://picsum.photos/seed/snakeplant-orig/1024/768',
    },
    flower_season: 'Rarely flowers indoors',
    fruiting_season: 'N/A',
    care_level: 'Easy',
    growth_rate: 'Slow',
    maintenance: 'Minimal, avoid overwatering.',
    problem: 'Root rot from overwatering, Mealybugs',
    dimension: 'Height: 6 inches to 8 feet (depending on variety), Width: 6-36 inches',
    soil: ['Well-draining potting mix', 'Sandy'],
  },
  {
    id: 3,
    common_name: 'Rose',
    scientific_name: ['Rosa'],
    other_name: ['Rosaceae family flower'],
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['Full sun'],
    type: 'Shrub',
    description: 'Roses are classic garden flowers admired for their beauty and fragrance. They require at least six hours of sunlight per day and well-drained, fertile soil. Many varieties exist, from miniature to climbing roses.',
    hardiness: { min: '3', max: '11' }, // Varies greatly by cultivar
    propagation: ['Cuttings', 'Grafting', 'Budding'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/rose-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/rose-reg/600/400',
      original_url: 'https://picsum.photos/seed/rose-orig/1024/768',
    },
    flower_season: 'Spring to Fall',
    fruiting_season: 'Late Summer to Fall (Rose Hips)',
    soil: ['Loamy', 'Clay', 'Well-drained', 'Rich in organic matter'],
    care_level: 'Moderate to High (depending on variety)',
    growth_rate: 'Moderate to Fast',
    maintenance: 'Regular pruning, deadheading, and fertilizing.',
    problem: 'Black spot, powdery mildew, aphids, Japanese beetles',
    dimension: 'Varies widely by type (e.g., Shrub: 3-6 feet, Climber: up to 20 feet)',
  },
  {
    id: 4,
    common_name: 'Mint',
    scientific_name: ['Mentha'],
    other_name: ['Peppermint', 'Spearmint'],
    cycle: 'Perennial',
    watering: 'Average to Frequent',
    sunlight: ['Full sun', 'Part shade'],
    type: 'Herb',
    description: "Mint is a fast-growing herb known for its refreshing aroma and flavor. It can be invasive, so it's often best grown in containers. Prefers moist soil and spreads vigorously through runners.",
    hardiness: { min: '3', max: '8' }, // Varies by species
    propagation: ['Cuttings', 'Runners', 'Division'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/mint-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/mint-reg/600/400',
      original_url: 'https://picsum.photos/seed/mint-orig/1024/768',
    },
    flower_season: 'Summer to Fall',
    fruiting_season: 'N/A',
    soil: ['Moist', 'Rich', 'Well-drained'],
    care_level: 'Easy',
    growth_rate: 'Fast',
    maintenance: 'Contain spread, regular harvesting.',
    problem: 'Rust, powdery mildew, spider mites',
    dimension: 'Height: 12-18 inches, Spread: Indefinite if not contained',
  },
  {
    id: 5,
    common_name: 'Lavender',
    scientific_name: ['Lavandula'],
    other_name: ['English Lavender', 'French Lavender'],
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['Full sun'],
    type: 'Shrub',
    description: 'Lavender is a fragrant herb prized for its beautiful purple flowers and calming scent. It thrives in sunny, dry conditions and well-drained soil. Drought-tolerant once established. Attracts pollinators.',
    hardiness: { min: '5', max: '9' },
    propagation: ['Cuttings', 'Seeds'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/lavender-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/lavender-reg/600/400',
      original_url: 'https://picsum.photos/seed/lavender-orig/1024/768',
    },
    flower_season: 'Summer',
    fruiting_season: 'N/A',
    soil: ['Sandy', 'Well-drained', 'Alkaline', 'Poor'],
    care_level: 'Easy',
    growth_rate: 'Moderate',
    maintenance: 'Prune after flowering to maintain shape.',
    problem: 'Root rot in wet soils, fungal diseases',
    dimension: 'Height: 1-3 feet, Width: 1-3 feet',
  },
  {
    id: 6,
    common_name: 'Tomato Plant',
    scientific_name: ['Solanum lycopersicum'],
    other_name: ['Love Apple'],
    cycle: 'Annual (often grown as)',
    watering: 'Consistent, deep watering',
    sunlight: ['Full sun'],
    type: 'Vegetable',
    description: 'Tomatoes are a popular garden vegetable, grown for their edible fruits. They require plenty of sun, support for vining varieties, and consistent watering. Many cultivars exist offering different fruit sizes, shapes, and colors.',
    hardiness: { min: '2', max: '11' }, // As an annual, zones are less critical
    propagation: ['Seeds', 'Cuttings'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/tomato-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/tomato-reg/600/400',
      original_url: 'https://picsum.photos/seed/tomato-orig/1024/768',
    },
    flower_season: 'Late Spring to Summer',
    fruiting_season: 'Summer to Fall',
    soil: ['Rich', 'Well-drained', 'Loamy', 'Slightly acidic (pH 6.0-6.8)'],
    care_level: 'Moderate',
    growth_rate: 'Fast',
    maintenance: 'Staking or caging, regular fertilizing, pruning suckers (for indeterminate types).',
    problem: 'Blight (early and late), blossom end rot, hornworms, aphids',
    dimension: 'Height: 3-10 feet (indeterminate) or 1-3 feet (determinate), Width: 1.5-3 feet',
  },
  {
    id: 7,
    common_name: 'Spider Plant',
    scientific_name: ['Chlorophytum comosum'],
    other_name: ['Airplane Plant', 'Ribbon Plant', "St. Bernard's Lily"],
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['Bright indirect light', 'Part shade'],
    type: 'Houseplant',
    description: 'Spider plants are popular, easy-to-grow houseplants known for their arching leaves and "spiderettes" (baby plants) that dangle from the mother plant. They are adaptable and help purify indoor air.',
    hardiness: { min: '9', max: '11' }, // Usually grown indoors
    propagation: ['Plantlets (spiderettes)', 'Division'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/spiderplant-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/spiderplant-reg/600/400',
      original_url: 'https://picsum.photos/seed/spiderplant-orig/1024/768',
    },
    flower_season: 'Occasionally (small white flowers)',
    fruiting_season: 'N/A',
    soil: ['Well-draining potting mix'],
    care_level: 'Easy',
    growth_rate: 'Fast',
    maintenance: 'Minimal; repot when root-bound. Brown tips can occur from fluoride in water.',
    problem: 'Brown leaf tips, root rot (if overwatered), scale insects, spider mites',
    dimension: 'Height: 6-12 inches, Spread: 6-24 inches (mother plant); plantlets can extend further',
  },
  {
    id: 8,
    common_name: 'Boston Fern',
    scientific_name: ["Nephrolepis exaltata 'Bostoniensis'"],
    other_name: ['Sword Fern'],
    cycle: 'Perennial (tender)',
    watering: 'Frequent, keep soil moist',
    sunlight: ['Indirect light', 'Shade', 'Filtered sunlight'],
    type: 'Houseplant',
    description: 'Boston Ferns are classic houseplants with feathery, arching fronds. They thrive in high humidity and indirect light, making them suitable for bathrooms or kitchens. They are non-toxic to pets.',
    hardiness: { min: '9', max: '11' }, // Typically grown as a houseplant
    propagation: ['Division', 'Runners (stolons)'],
    default_image: {
      thumbnail: 'https://picsum.photos/seed/bostonfern-thumb/200/200',
      regular_url: 'https://picsum.photos/seed/bostonfern-reg/600/400',
      original_url: 'https://picsum.photos/seed/bostonfern-orig/1024/768',
    },
    flower_season: 'N/A (non-flowering)',
    fruiting_season: 'N/A (reproduces by spores)',
    soil: ['Rich', 'Peat-based potting mix', 'Well-drained but moisture-retentive'],
    care_level: 'Moderate',
    growth_rate: 'Moderate to Fast',
    maintenance: 'Requires high humidity, regular misting or a humidifier. Remove dead fronds.',
    problem: 'Dry air (causes brown fronds), spider mites, scale, mealybugs',
    dimension: 'Height: 1-3 feet, Spread: 2-3 feet',
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
    plant.scientific_name.some(name => name.toLowerCase().includes(lowerQuery)) ||
    (plant.other_name && plant.other_name.some(name => name.toLowerCase().includes(lowerQuery)))
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
