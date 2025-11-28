// Advanced AI Plant Suggestion Engine with Machine Learning-like Features

class PlantAIEngine {
    constructor() {
        this.plantDatabase = this.initializePlantDatabase();
        this.climaticZones = this.initializeClimaticZones();
        this.userPreferences = null;
    }

    // Comprehensive plant database with detailed characteristics
    initializePlantDatabase() {
        return {
            'Tomato': {
                name: 'Tomato',
                scientificName: 'Solanum lycopersicum',
                category: 'Vegetable',
                difficulty: 'Medium',
                sunlight: ['full-sun', 'partial-sun'],
                water: 'moderate',
                temperature: { min: 15, max: 30, ideal: 22 },
                space: ['balcony', 'backyard', 'patio', 'rooftop'],
                growthTime: '60-85 days',
                height: '1-2 meters',
                benefits: ['edible', 'nutritious', 'versatile'],
                climate: ['tropical', 'subtropical', 'temperate'],
                season: ['spring', 'summer'],
                npk: '5-10-10',
                companions: ['Basil', 'Marigold', 'Carrots'],
                pests: ['Aphids', 'Whiteflies', 'Hornworms'],
                tips: ['Stake tall varieties', 'Prune suckers', 'Deep watering'],
                yield: 'High',
                score: 0
            },
            'Basil': {
                name: 'Basil',
                scientificName: 'Ocimum basilicum',
                category: 'Herb',
                difficulty: 'Easy',
                sunlight: ['full-sun', 'partial-sun'],
                water: 'moderate',
                temperature: { min: 18, max: 32, ideal: 25 },
                space: ['windowsill', 'balcony', 'indoor', 'patio'],
                growthTime: '3-4 weeks',
                height: '30-60 cm',
                benefits: ['culinary', 'aromatic', 'medicinal'],
                climate: ['tropical', 'subtropical', 'temperate'],
                season: ['spring', 'summer', 'fall'],
                npk: '5-5-5',
                companions: ['Tomato', 'Peppers'],
                pests: ['Aphids', 'Japanese beetles'],
                tips: ['Pinch flowers', 'Harvest regularly', 'Morning watering'],
                yield: 'Medium',
                score: 0
            },
            'Snake Plant': {
                name: 'Snake Plant',
                scientificName: 'Sansevieria trifasciata',
                category: 'Indoor Plant',
                difficulty: 'Very Easy',
                sunlight: ['full-shade', 'partial-shade', 'partial-sun'],
                water: 'low',
                temperature: { min: 15, max: 35, ideal: 24 },
                space: ['indoor', 'windowsill'],
                growthTime: 'Slow',
                height: '30-120 cm',
                benefits: ['air-purifying', 'low-maintenance', 'decorative'],
                climate: ['all'],
                season: ['year-round'],
                npk: '10-10-10 (diluted)',
                companions: ['Most indoor plants'],
                pests: ['Mealybugs (rare)', 'Spider mites (rare)'],
                tips: ['Avoid overwatering', 'Well-draining soil', 'Low fertilizer'],
                yield: 'N/A',
                score: 0
            },
            'Mint': {
                name: 'Mint',
                scientificName: 'Mentha',
                category: 'Herb',
                difficulty: 'Very Easy',
                sunlight: ['partial-sun', 'partial-shade'],
                water: 'moderate-high',
                temperature: { min: 13, max: 30, ideal: 21 },
                space: ['balcony', 'windowsill', 'indoor', 'patio', 'backyard'],
                growthTime: '4-6 weeks',
                height: '30-60 cm',
                benefits: ['culinary', 'aromatic', 'medicinal', 'tea'],
                climate: ['temperate', 'subtropical', 'tropical'],
                season: ['spring', 'summer', 'fall'],
                npk: '10-6-4',
                companions: ['Cabbage', 'Tomato'],
                pests: ['Aphids', 'Spider mites'],
                tips: ['Contain roots', 'Regular harvesting', 'Moist soil'],
                yield: 'High',
                score: 0
            },
            'Pothos': {
                name: 'Pothos',
                scientificName: 'Epipremnum aureum',
                category: 'Indoor Plant',
                difficulty: 'Very Easy',
                sunlight: ['partial-shade', 'full-shade'],
                water: 'low-moderate',
                temperature: { min: 15, max: 30, ideal: 22 },
                space: ['indoor', 'windowsill'],
                growthTime: 'Fast',
                height: 'Trailing: 2-3 meters',
                benefits: ['air-purifying', 'decorative', 'easy-propagation'],
                climate: ['all'],
                season: ['year-round'],
                npk: '10-10-10 (diluted)',
                companions: ['Most indoor plants'],
                pests: ['Mealybugs', 'Scale'],
                tips: ['Allow soil to dry', 'Wipe leaves', 'Easy propagation in water'],
                yield: 'N/A',
                score: 0
            },
            'Lettuce': {
                name: 'Lettuce',
                scientificName: 'Lactuca sativa',
                category: 'Vegetable',
                difficulty: 'Easy',
                sunlight: ['partial-sun', 'partial-shade'],
                water: 'moderate',
                temperature: { min: 7, max: 24, ideal: 18 },
                space: ['balcony', 'windowsill', 'patio', 'backyard'],
                growthTime: '30-60 days',
                height: '15-30 cm',
                benefits: ['edible', 'fast-growing', 'nutritious'],
                climate: ['temperate', 'cool'],
                season: ['spring', 'fall', 'winter (mild)'],
                npk: '5-5-5',
                companions: ['Carrots', 'Radishes', 'Strawberries'],
                pests: ['Aphids', 'Slugs', 'Snails'],
                tips: ['Cool weather', 'Succession planting', 'Harvest outer leaves'],
                yield: 'Medium',
                score: 0
            },
            'Chili Pepper': {
                name: 'Chili Pepper',
                scientificName: 'Capsicum annuum',
                category: 'Vegetable',
                difficulty: 'Medium',
                sunlight: ['full-sun'],
                water: 'moderate',
                temperature: { min: 18, max: 35, ideal: 26 },
                space: ['balcony', 'patio', 'backyard', 'rooftop'],
                growthTime: '60-90 days',
                height: '30-90 cm',
                benefits: ['edible', 'ornamental', 'preservable'],
                climate: ['tropical', 'subtropical', 'warm-temperate'],
                season: ['spring', 'summer'],
                npk: '5-10-10',
                companions: ['Basil', 'Onions', 'Spinach'],
                pests: ['Aphids', 'Spider mites'],
                tips: ['Full sun essential', 'Support heavy fruiting', 'Consistent watering'],
                yield: 'High',
                score: 0
            },
            'Rosemary': {
                name: 'Rosemary',
                scientificName: 'Rosmarinus officinalis',
                category: 'Herb',
                difficulty: 'Easy',
                sunlight: ['full-sun'],
                water: 'low',
                temperature: { min: 10, max: 30, ideal: 20 },
                space: ['balcony', 'patio', 'backyard', 'windowsill'],
                growthTime: 'Slow',
                height: '60-120 cm',
                benefits: ['culinary', 'aromatic', 'medicinal', 'ornamental'],
                climate: ['Mediterranean', 'temperate', 'subtropical'],
                season: ['year-round'],
                npk: '5-5-5',
                companions: ['Sage', 'Thyme', 'Lavender'],
                pests: ['Spider mites', 'Aphids'],
                tips: ['Well-drained soil', 'Prune regularly', 'Drought tolerant'],
                yield: 'Medium',
                score: 0
            },
            'Spider Plant': {
                name: 'Spider Plant',
                scientificName: 'Chlorophytum comosum',
                category: 'Indoor Plant',
                difficulty: 'Very Easy',
                sunlight: ['partial-shade', 'partial-sun'],
                water: 'moderate',
                temperature: { min: 15, max: 30, ideal: 22 },
                space: ['indoor', 'windowsill'],
                growthTime: 'Fast',
                height: '30-60 cm (trailing)',
                benefits: ['air-purifying', 'decorative', 'easy-propagation', 'pet-safe'],
                climate: ['all'],
                season: ['year-round'],
                npk: '10-10-10 (diluted)',
                companions: ['Most indoor plants'],
                pests: ['Aphids (rare)', 'Spider mites (rare)'],
                tips: ['Moderate watering', 'Propagate plantlets', 'Tolerates neglect'],
                yield: 'N/A',
                score: 0
            },
            'Strawberry': {
                name: 'Strawberry',
                scientificName: 'Fragaria × ananassa',
                category: 'Fruit',
                difficulty: 'Medium',
                sunlight: ['full-sun', 'partial-sun'],
                water: 'moderate-high',
                temperature: { min: 15, max: 26, ideal: 20 },
                space: ['balcony', 'patio', 'backyard', 'windowsill'],
                growthTime: '4-6 weeks (flowering to fruit)',
                height: '15-30 cm',
                benefits: ['edible', 'decorative', 'continuous-bearing'],
                climate: ['temperate', 'cool'],
                season: ['spring', 'summer', 'fall'],
                npk: '10-10-10',
                companions: ['Lettuce', 'Spinach', 'Beans'],
                pests: ['Slugs', 'Birds', 'Aphids'],
                tips: ['Mulch well', 'Remove runners', 'Bird netting'],
                yield: 'Medium-High',
                score: 0
            }
        };
    }

    initializeClimaticZones() {
        return {
            tropical: { keywords: ['hot', 'humid', 'warm', 'tropical', 'equatorial'], tempRange: [20, 35] },
            subtropical: { keywords: ['warm', 'mild', 'subtropical'], tempRange: [15, 30] },
            temperate: { keywords: ['moderate', 'temperate', 'cool summers', 'mild'], tempRange: [10, 25] },
            cool: { keywords: ['cool', 'cold', 'crisp', 'chilly'], tempRange: [5, 20] },
            Mediterranean: { keywords: ['mediterranean', 'dry summers', 'wet winters'], tempRange: [15, 28] },
            all: { keywords: ['all', 'any', 'various'], tempRange: [15, 30] }
        };
    }

    // Advanced scoring algorithm with multiple factors
    calculatePlantScore(plant, userInput) {
        let score = 0;
        const weights = {
            sunlight: 25,
            space: 20,
            climate: 20,
            difficulty: 15,
            water: 10,
            benefits: 10
        };

        // Sunlight compatibility
        if (userInput.sunlight) {
            if (plant.sunlight.includes(userInput.sunlight)) {
                score += weights.sunlight;
            }
        }

        // Space compatibility
        if (userInput.spaceType) {
            if (plant.space.includes(userInput.spaceType.toLowerCase())) {
                score += weights.space;
            }
        }

        // Climate analysis
        const detectedClimate = this.detectClimate(userInput.climateDescription || '');
        if (plant.climate.includes(detectedClimate) || plant.climate.includes('all')) {
            score += weights.climate;
        }

        // Experience level matching
        const experienceScore = this.matchExperience(plant.difficulty, userInput.experienceLevel);
        score += (experienceScore / 100) * weights.difficulty;

        // Water needs analysis
        if (userInput.waterAvailability) {
            const waterMatch = this.matchWaterNeeds(plant.water, userInput.waterAvailability);
            score += (waterMatch / 100) * weights.water;
        }

        // Benefits matching
        if (userInput.preferences) {
            const benefitsMatch = this.matchBenefits(plant.benefits, userInput.preferences);
            score += (benefitsMatch / 100) * weights.benefits;
        }

        // Bonus points for specific keywords
        score += this.keywordBonus(plant, userInput);

        return Math.min(score, 100);
    }

    detectClimate(climateText) {
        climateText = climateText.toLowerCase();
        for (const [climate, data] of Object.entries(this.climaticZones)) {
            for (const keyword of data.keywords) {
                if (climateText.includes(keyword)) {
                    return climate;
                }
            }
        }
        return 'temperate'; // Default
    }

    matchExperience(plantDifficulty, userExperience) {
        const difficultyMap = {
            'Very Easy': 1,
            'Easy': 2,
            'Medium': 3,
            'Hard': 4
        };

        const experienceMap = {
            'beginner': 2,
            'intermediate': 3,
            'advanced': 4
        };

        const plantLevel = difficultyMap[plantDifficulty] || 2;
        const userLevel = experienceMap[userExperience] || 2;

        if (userLevel >= plantLevel) return 100;
        if (userLevel === plantLevel - 1) return 70;
        return 40;
    }

    matchWaterNeeds(plantWater, userWater) {
        const waterMap = {
            'low': 1,
            'low-moderate': 2,
            'moderate': 3,
            'moderate-high': 4,
            'high': 5
        };

        const plantLevel = waterMap[plantWater] || 3;
        const userLevel = waterMap[userWater] || 3;

        const difference = Math.abs(plantLevel - userLevel);
        return Math.max(0, 100 - (difference * 25));
    }

    matchBenefits(plantBenefits, userPreferences) {
        const preferenceWords = userPreferences.toLowerCase().split(/\s+/);
        let matches = 0;

        for (const benefit of plantBenefits) {
            for (const word of preferenceWords) {
                if (benefit.toLowerCase().includes(word) || word.includes(benefit.toLowerCase())) {
                    matches++;
                }
            }
        }

        return Math.min((matches / Math.max(plantBenefits.length, 1)) * 100, 100);
    }

    keywordBonus(plant, userInput) {
        let bonus = 0;
        const fullText = `${userInput.spaceDescription} ${userInput.climateDescription} ${userInput.preferences || ''}`.toLowerCase();

        // Category keywords
        if (fullText.includes('vegetable') && plant.category === 'Vegetable') bonus += 5;
        if (fullText.includes('herb') && plant.category === 'Herb') bonus += 5;
        if (fullText.includes('fruit') && plant.category === 'Fruit') bonus += 5;
        if (fullText.includes('indoor') && plant.category === 'Indoor Plant') bonus += 5;

        // Specific plant name mentioned
        if (fullText.includes(plant.name.toLowerCase())) bonus += 15;

        // Growth speed
        if (fullText.includes('fast') && plant.growthTime.toLowerCase().includes('fast')) bonus += 5;
        if (fullText.includes('quick') && plant.growthTime.includes('week')) bonus += 5;

        return bonus;
    }

    // Main suggestion method
    async getSuggestions(userInput, count = 5) {
        // Analyze user input
        const analysis = this.analyzeUserInput(userInput);

        // Score all plants
        const scoredPlants = Object.values(this.plantDatabase).map(plant => ({
            ...plant,
            score: this.calculatePlantScore(plant, analysis),
            matchReasons: this.getMatchReasons(plant, analysis)
        }));

        // Sort by score and return top matches
        const topSuggestions = scoredPlants
            .sort((a, b) => b.score - a.score)
            .slice(0, count);

        // Add diversity if all scores are similar
        if (topSuggestions.length > 0 && topSuggestions[topSuggestions.length - 1].score > 60) {
            return this.diversifySuggestions(topSuggestions, count);
        }

        return topSuggestions;
    }

    analyzeUserInput(input) {
        return {
            spaceDescription: input.spaceDescription || '',
            climateDescription: input.climateDescription || '',
            spaceType: input.spaceType || '',
            experienceLevel: input.experienceLevel || 'beginner',
            sunlight: this.detectSunlight(input.spaceDescription || ''),
            waterAvailability: this.detectWaterAvailability(input.spaceDescription || ''),
            preferences: input.preferences || ''
        };
    }

    detectSunlight(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('full sun') || lowerText.includes('direct sun') || lowerText.includes('sunny')) return 'full-sun';
        if (lowerText.includes('partial sun') || lowerText.includes('morning sun')) return 'partial-sun';
        if (lowerText.includes('shade') || lowerText.includes('indirect')) return 'partial-shade';
        if (lowerText.includes('dark') || lowerText.includes('low light')) return 'full-shade';
        return 'partial-sun';
    }

    detectWaterAvailability(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('dry') || lowerText.includes('drought')) return 'low';
        if (lowerText.includes('humid') || lowerText.includes('moist')) return 'high';
        return 'moderate';
    }

    getMatchReasons(plant, analysis) {
        const reasons = [];

        if (plant.difficulty === 'Very Easy' || plant.difficulty === 'Easy') {
            reasons.push(`${plant.difficulty} to grow - perfect for ${analysis.experienceLevel}s`);
        }

        if (analysis.spaceType && plant.space.includes(analysis.spaceType.toLowerCase())) {
            reasons.push(`Ideal for ${analysis.spaceType} spaces`);
        }

        if (plant.benefits.includes('edible')) {
            reasons.push('Provides fresh produce');
        }

        if (plant.category === 'Herb') {
            reasons.push('Fresh herbs for cooking');
        }

        if (plant.benefits.includes('air-purifying')) {
            reasons.push('Purifies indoor air');
        }

        return reasons.slice(0, 3);
    }

    diversifySuggestions(suggestions, count) {
        const categories = new Set();
        const diversified = [];

        // First pass: add one from each category
        for (const plant of suggestions) {
            if (!categories.has(plant.category) && diversified.length < count) {
                diversified.push(plant);
                categories.add(plant.category);
            }
        }

        // Second pass: fill remaining slots with highest scores
        for (const plant of suggestions) {
            if (!diversified.includes(plant) && diversified.length < count) {
                diversified.push(plant);
            }
        }

        return diversified;
    }

    // Get cultivation guide for a specific plant
    getCultivationGuide(plantName) {
        const plant = this.plantDatabase[plantName];
        if (!plant) return null;

        return {
            plant: plant.name,
            scientificName: plant.scientificName,
            steps: this.generateCultivationSteps(plant),
            careCalendar: this.generateCareCalendar(plant),
            troubleshooting: this.generateTroubleshooting(plant)
        };
    }

    generateCultivationSteps(plant) {
        return [
            {
                step: 1,
                title: 'Preparation',
                description: `Prepare well-draining soil mix. For ${plant.name}, ensure good drainage and organic matter.`,
                duration: '1-2 days'
            },
            {
                step: 2,
                title: 'Planting',
                description: `Plant seeds or seedlings at appropriate depth. Space according to expected ${plant.height} growth.`,
                duration: '1 day'
            },
            {
                step: 3,
                title: 'Initial Care',
                description: `Provide ${plant.sunlight.join(' or ')} sunlight. Water ${plant.water === 'low' ? 'sparingly' : 'regularly'}.`,
                duration: plant.growthTime
            },
            {
                step: 4,
                title: 'Maintenance',
                description: `Fertilize with ${plant.npk} NPK ratio. Monitor for ${plant.pests.slice(0, 2).join(', ')}.`,
                duration: 'Ongoing'
            },
            {
                step: 5,
                title: 'Harvest/Enjoy',
                description: plant.category === 'Indoor Plant' 
                    ? `Enjoy your thriving ${plant.name}! ${plant.tips[0]}.`
                    : `Harvest when ready. Expected yield: ${plant.yield}.`,
                duration: plant.growthTime
            }
        ];
    }

    generateCareCalendar(plant) {
        return {
            watering: plant.water === 'low' ? 'Once every 1-2 weeks' : plant.water === 'high' ? 'Every 2-3 days' : 'Twice per week',
            fertilizing: 'Every 2-4 weeks during growing season',
            pruning: plant.tips.some(t => t.toLowerCase().includes('prune')) ? 'Monthly' : 'As needed',
            repotting: plant.category === 'Indoor Plant' ? 'Every 1-2 years' : 'Annual for containers'
        };
    }

    generateTroubleshooting(plant) {
        return [
            {
                issue: 'Yellowing Leaves',
                cause: 'Overwatering or nutrient deficiency',
                solution: 'Reduce watering frequency and apply balanced fertilizer'
            },
            {
                issue: plant.pests[0],
                cause: `Common pest for ${plant.name}`,
                solution: 'Use organic pest control or neem oil spray'
            },
            {
                issue: 'Slow Growth',
                cause: 'Insufficient light or nutrients',
                solution: `Ensure ${plant.sunlight[0]} exposure and proper feeding`
            }
        ];
    }
}

// Export singleton instance
const plantAI = new PlantAIEngine();
