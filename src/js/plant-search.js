// Plant Search API Integration
// This module handles plant search using external plant API

class PlantSearchAPI {
    constructor(apiKey = 'sk-rvSg69245eee9c35b9917') {
        this.apiKey = apiKey;
        this.baseURL = 'https://perenual.com/api'; // Perenual Plant API
        // Alternative APIs:
        // - Trefle API: https://trefle.io/api/v1
        // - PlantNet API: https://my-api.plantnet.org/v2
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * Set or update API key
     * @param {string} key - Your API key
     */
    setApiKey(key) {
        this.apiKey = key;
    }

    /**
     * Search for plants by query
     * @param {string} query - Search query (plant name, type, etc.)
     * @returns {Promise<Array>} - Array of plant results
     */
    async searchPlants(query) {
        if (!query || query.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters');
        }

        // Check cache first
        const cacheKey = `search_${query.toLowerCase()}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('Returning cached results for:', query);
            return cached;
        }

        try {
            // If no API key is set, use mock data
            if (!this.apiKey) {
                console.warn('No API key set. Using mock data. Set API key with setApiKey()');
                return this.getMockPlantData(query);
            }

            // Perenual API endpoint
            const url = `${this.baseURL}/species-list?key=${this.apiKey}&q=${encodeURIComponent(query)}`;
            
            console.log('🔍 Fetching plants from API:', query);
            console.log('📡 API URL:', url);
            console.log('🔑 API Key:', this.apiKey);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            console.log('📥 Response Status:', response.status, response.statusText);

            if (!response.ok) {
                console.error('❌ API Response Status:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('❌ Error Response:', errorText);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ API Response:', data);
            console.log('📊 Number of plants found:', data.data ? data.data.length : 0);
            console.log('📈 Total available:', data.total || 'unknown');
            
            // Log first plant's image structure for debugging
            if (data.data && data.data.length > 0) {
                console.log('🖼️ First plant image data:', data.data[0].default_image);
            }
            
            // Transform API response to our format
            const plants = this.transformPerenualData(data.data || []);
            
            console.log('🌱 Transformed plants:', plants.length);
            console.log('🌿 Plant data:', plants);
            console.log('🖼️ First plant image URL:', plants.length > 0 ? plants[0].image : 'No plants');
            
            // Cache the results
            this.saveToCache(cacheKey, plants);
            
            return plants;

        } catch (error) {
            console.error('❌ Error fetching plant data:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error stack:', error.stack);
            
            // Fallback to mock data on error
            console.warn('⚠️ Falling back to mock data due to error');
            const mockResults = this.getMockPlantData(query);
            console.log('📝 Mock data results:', mockResults.length, 'plants');
            return mockResults;
        }
    }

    /**
     * Get detailed information about a specific plant
     * @param {number} plantId - Plant ID from search results
     * @returns {Promise<Object>} - Detailed plant information
     */
    async getPlantDetails(plantId) {
        const cacheKey = `details_${plantId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            if (!this.apiKey) {
                return this.getMockPlantDetails(plantId);
            }

            const url = `${this.baseURL}/species/details/${plantId}?key=${this.apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const details = this.transformPerenualDetails(data);
            
            this.saveToCache(cacheKey, details);
            return details;

        } catch (error) {
            console.error('Error fetching plant details:', error);
            return this.getMockPlantDetails(plantId);
        }
    }

    /**
     * Transform Perenual API data to our format
     */
    transformPerenualData(apiData) {
        return apiData.map(plant => {
            try {
                // Extract image with better fallback handling
                let imageUrl = '';
                if (plant.default_image) {
                    imageUrl = plant.default_image.regular_url || 
                               plant.default_image.medium_url || 
                               plant.default_image.small_url || 
                               plant.default_image.thumbnail || 
                               plant.default_image.original_url || '';
                }
                
                return {
                    id: plant.id,
                    name: plant.common_name || 'Unknown',
                    scientificName: plant.scientific_name?.[0] || '',
                    description: plant.description || this.generateDescription(plant),
                    image: imageUrl,
                    tags: this.extractTags(plant),
                    type: plant.type || 'Unknown',
                    cycle: plant.cycle || 'Unknown',
                    watering: plant.watering || 'Moderate',
                    sunlight: Array.isArray(plant.sunlight) ? plant.sunlight : (plant.sunlight ? [plant.sunlight] : []),
                    edible: plant.edible || false,
                    medicinal: plant.medicinal || false,
                    indoor: plant.indoor || false
                };
            } catch (error) {
                console.error('Error transforming plant:', plant, error);
                // Return a basic version if transformation fails
                return {
                    id: plant.id,
                    name: plant.common_name || 'Unknown Plant',
                    scientificName: plant.scientific_name?.[0] || '',
                    description: 'A plant species',
                    image: '',
                    tags: [],
                    type: plant.type || 'Unknown',
                    cycle: plant.cycle || 'Unknown',
                    watering: plant.watering || 'Moderate',
                    sunlight: [],
                    edible: false,
                    medicinal: false,
                    indoor: false
                };
            }
        });
    }

    /**
     * Transform detailed plant data
     */
    transformPerenualDetails(plant) {
        return {
            id: plant.id,
            name: plant.common_name,
            scientificName: plant.scientific_name,
            description: plant.description,
            image: plant.default_image?.regular_url || '',
            type: plant.type,
            cycle: plant.cycle,
            watering: plant.watering,
            watering_period: plant.watering_period,
            sunlight: plant.sunlight || [],
            maintenance: plant.maintenance,
            care_level: plant.care_level,
            growth_rate: plant.growth_rate,
            edible: plant.edible_fruit || plant.edible_leaf,
            medicinal: plant.medicinal,
            poisonous: plant.poisonous_to_humans || plant.poisonous_to_pets,
            drought_tolerant: plant.drought_tolerant,
            flowers: plant.flowers,
            flowering_season: plant.flowering_season,
            harvest_season: plant.harvest_season,
            dimensions: {
                min_height: plant.dimension?.min_value,
                max_height: plant.dimension?.max_value,
                unit: plant.dimension?.unit
            },
            propagation: plant.propagation || [],
            hardiness: {
                min: plant.hardiness?.min,
                max: plant.hardiness?.max
            },
            soil: plant.soil || []
        };
    }

    /**
     * Extract tags from plant data
     */
    extractTags(plant) {
        const tags = [];
        
        if (plant.cycle) tags.push(plant.cycle);
        if (plant.watering) tags.push(plant.watering);
        if (plant.edible) tags.push('Edible');
        if (plant.medicinal) tags.push('Medicinal');
        if (plant.indoor) tags.push('Indoor');
        if (plant.type) tags.push(plant.type);
        
        return tags.slice(0, 5); // Limit to 5 tags
    }

    /**
     * Generate description if not available
     */
    generateDescription(plant) {
        const parts = [];
        
        if (plant.common_name) {
            parts.push(`${plant.common_name} is a ${plant.type || 'plant'}`);
        }
        
        if (plant.cycle) {
            parts.push(`with a ${plant.cycle} life cycle`);
        }
        
        if (plant.watering) {
            parts.push(`requiring ${plant.watering.toLowerCase()} watering`);
        }
        
        if (plant.sunlight) {
            const sunlightStr = Array.isArray(plant.sunlight) 
                ? plant.sunlight.join(' or ') 
                : plant.sunlight;
            if (sunlightStr) {
                parts.push(`and prefers ${sunlightStr} sunlight`);
            }
        }
        
        return parts.join(' ') + '.';
    }

    /**
     * Cache management
     */
    saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        // Check if cache is expired
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * Mock data for testing without API key
     */
    getMockPlantData(query) {
        const mockDatabase = [
            {
                id: 1,
                name: 'Tomato',
                scientificName: 'Solanum lycopersicum',
                description: 'Tomato is a popular garden vegetable rich in vitamins and antioxidants. Perfect for containers or garden beds. Produces juicy, flavorful fruits ideal for salads, cooking, and sauces.',
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
                tags: ['Vegetable', 'Annual', 'Edible', 'Full Sun'],
                type: 'Vegetable',
                cycle: 'Annual',
                watering: 'Average',
                sunlight: ['Full sun'],
                edible: true,
                indoor: false
            },
            {
                id: 2,
                name: 'Basil',
                scientificName: 'Ocimum basilicum',
                description: 'Sweet basil is an aromatic herb widely used in cooking, especially Italian cuisine. Easy to grow indoors or outdoors. Features fragrant green leaves perfect for pesto and garnishes.',
                image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400',
                tags: ['Herb', 'Annual', 'Edible', 'Aromatic'],
                type: 'Herb',
                cycle: 'Annual',
                watering: 'Average',
                sunlight: ['Full sun', 'Part shade'],
                edible: true,
                indoor: true
            },
            {
                id: 3,
                name: 'Snake Plant',
                scientificName: 'Sansevieria trifasciata',
                description: 'Snake plant is an extremely hardy indoor plant known for air purification. Tolerates low light and infrequent watering. Features striking upright leaves with yellow edges.',
                image: 'https://images.unsplash.com/photo-1593482892290-2d1f89304a6a?w=400',
                tags: ['Houseplant', 'Succulent', 'Low Maintenance', 'Air Purifying'],
                type: 'Houseplant',
                cycle: 'Perennial',
                watering: 'Minimum',
                sunlight: ['Full shade', 'Part shade'],
                edible: false,
                indoor: true
            },
            {
                id: 4,
                name: 'Mint',
                scientificName: 'Mentha',
                description: 'Mint is a vigorous herb with refreshing aroma and flavor. Great for teas, cocktails, and cooking. Easy to grow but can be invasive, best in containers.',
                image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400',
                tags: ['Herb', 'Perennial', 'Edible', 'Aromatic'],
                type: 'Herb',
                cycle: 'Perennial',
                watering: 'Frequent',
                sunlight: ['Part shade', 'Full sun'],
                edible: true,
                medicinal: true,
                indoor: true
            },
            {
                id: 5,
                name: 'Pothos',
                scientificName: 'Epipremnum aureum',
                description: 'Pothos is a popular trailing houseplant known for its heart-shaped leaves and easy care. Excellent for beginners and helps purify indoor air. Thrives in various light conditions.',
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
                tags: ['Houseplant', 'Trailing', 'Air Purifying', 'Low Maintenance'],
                type: 'Houseplant',
                cycle: 'Perennial',
                watering: 'Average',
                sunlight: ['Part shade', 'Full shade'],
                edible: false,
                indoor: true
            },
            {
                id: 6,
                name: 'Lettuce',
                scientificName: 'Lactuca sativa',
                description: 'Lettuce is a fast-growing leafy vegetable perfect for salads. Ideal for small spaces and container gardens. Harvest outer leaves continuously for extended production.',
                image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
                tags: ['Vegetable', 'Annual', 'Edible', 'Cool Season'],
                type: 'Vegetable',
                cycle: 'Annual',
                watering: 'Frequent',
                sunlight: ['Part shade', 'Full sun'],
                edible: true,
                indoor: false
            },
            {
                id: 7,
                name: 'Rose',
                scientificName: 'Rosa',
                description: 'Roses are classic flowering plants admired for their beautiful blooms and fragrance. Available in countless varieties and colors. Requires regular care but rewards with stunning flowers.',
                image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400',
                tags: ['Flower', 'Perennial', 'Fragrant', 'Ornamental'],
                type: 'Flower',
                cycle: 'Perennial',
                watering: 'Average',
                sunlight: ['Full sun'],
                edible: false,
                indoor: false
            },
            {
                id: 8,
                name: 'Lavender',
                scientificName: 'Lavandula',
                description: 'Lavender is a fragrant herb with beautiful purple flowers. Known for its calming properties and aromatic oils. Drought-tolerant and attracts pollinators to your garden.',
                image: 'https://images.unsplash.com/photo-1611251185537-0c1f42d214b8?w=400',
                tags: ['Herb', 'Perennial', 'Fragrant', 'Medicinal'],
                type: 'Herb',
                cycle: 'Perennial',
                watering: 'Minimum',
                sunlight: ['Full sun'],
                edible: false,
                medicinal: true,
                indoor: false
            },
            {
                id: 9,
                name: 'Aloe Vera',
                scientificName: 'Aloe barbadensis',
                description: 'Aloe vera is a succulent plant known for its medicinal gel. Easy to care for and drought-tolerant. Perfect for beginners and useful for minor burns and skin care.',
                image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400',
                tags: ['Succulent', 'Medicinal', 'Low Maintenance', 'Indoor'],
                type: 'Succulent',
                cycle: 'Perennial',
                watering: 'Minimum',
                sunlight: ['Full sun', 'Part shade'],
                edible: false,
                medicinal: true,
                indoor: true
            },
            {
                id: 10,
                name: 'Strawberry',
                scientificName: 'Fragaria × ananassa',
                description: 'Strawberries are sweet, red fruits perfect for containers and small gardens. Produces runners for easy propagation. Enjoy fresh berries from your own garden!',
                image: 'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=400',
                tags: ['Fruit', 'Perennial', 'Edible', 'Container Friendly'],
                type: 'Fruit',
                cycle: 'Perennial',
                watering: 'Frequent',
                sunlight: ['Full sun'],
                edible: true,
                indoor: false
            }
        ];

        // Filter mock data based on query
        const lowerQuery = query.toLowerCase();
        return mockDatabase.filter(plant => 
            plant.name.toLowerCase().includes(lowerQuery) ||
            plant.scientificName.toLowerCase().includes(lowerQuery) ||
            plant.description.toLowerCase().includes(lowerQuery) ||
            plant.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    getMockPlantDetails(plantId) {
        const mockData = this.getMockPlantData('');
        return mockData.find(p => p.id === plantId) || mockData[0];
    }
}

// Initialize the search API
const plantSearchAPI = new PlantSearchAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlantSearchAPI;
}
