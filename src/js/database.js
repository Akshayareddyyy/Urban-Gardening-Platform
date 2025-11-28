// Advanced IndexedDB Database Manager for Urban Gardening Platform

class UrbanGardenDB {
    constructor() {
        this.dbName = 'UrbanGardeningDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database with all object stores
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject('Database failed to open');
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                // Users Store
                if (!this.db.objectStoreNames.contains('users')) {
                    const userStore = this.db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Plant Suggestions Store
                if (!this.db.objectStoreNames.contains('plantSuggestions')) {
                    const suggestionsStore = this.db.createObjectStore('plantSuggestions', { keyPath: 'id', autoIncrement: true });
                    suggestionsStore.createIndex('userId', 'userId', { unique: false });
                    suggestionsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    suggestionsStore.createIndex('plantType', 'plantType', { unique: false });
                }

                // User Plants Store (User's Garden)
                if (!this.db.objectStoreNames.contains('userPlants')) {
                    const plantsStore = this.db.createObjectStore('userPlants', { keyPath: 'id', autoIncrement: true });
                    plantsStore.createIndex('userId', 'userId', { unique: false });
                    plantsStore.createIndex('plantName', 'plantName', { unique: false });
                    plantsStore.createIndex('addedDate', 'addedDate', { unique: false });
                    plantsStore.createIndex('status', 'status', { unique: false });
                }

                // Showcase Posts Store
                if (!this.db.objectStoreNames.contains('showcasePosts')) {
                    const showcaseStore = this.db.createObjectStore('showcasePosts', { keyPath: 'id', autoIncrement: true });
                    showcaseStore.createIndex('userId', 'userId', { unique: false });
                    showcaseStore.createIndex('plantName', 'plantName', { unique: false });
                    showcaseStore.createIndex('timestamp', 'timestamp', { unique: false });
                    showcaseStore.createIndex('likes', 'likes', { unique: false });
                }

                // Fertilizer Recommendations Store
                if (!this.db.objectStoreNames.contains('fertilizerRecommendations')) {
                    const fertilizerStore = this.db.createObjectStore('fertilizerRecommendations', { keyPath: 'id', autoIncrement: true });
                    fertilizerStore.createIndex('userId', 'userId', { unique: false });
                    fertilizerStore.createIndex('plantType', 'plantType', { unique: false });
                    fertilizerStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Care Log Store (Watering, Fertilizing, etc.)
                if (!this.db.objectStoreNames.contains('careLogs')) {
                    const careLogStore = this.db.createObjectStore('careLogs', { keyPath: 'id', autoIncrement: true });
                    careLogStore.createIndex('userId', 'userId', { unique: false });
                    careLogStore.createIndex('plantId', 'plantId', { unique: false });
                    careLogStore.createIndex('careType', 'careType', { unique: false });
                    careLogStore.createIndex('date', 'date', { unique: false });
                }

                // AI Interaction History Store
                if (!this.db.objectStoreNames.contains('aiInteractions')) {
                    const aiStore = this.db.createObjectStore('aiInteractions', { keyPath: 'id', autoIncrement: true });
                    aiStore.createIndex('userId', 'userId', { unique: false });
                    aiStore.createIndex('interactionType', 'interactionType', { unique: false });
                    aiStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Plant Knowledge Base Store
                if (!this.db.objectStoreNames.contains('plantKnowledge')) {
                    const knowledgeStore = this.db.createObjectStore('plantKnowledge', { keyPath: 'plantName' });
                    knowledgeStore.createIndex('category', 'category', { unique: false });
                    knowledgeStore.createIndex('difficulty', 'difficulty', { unique: false });
                }

                console.log('Database schema created/updated');
            };
        });
    }

    // Generic add method
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic get by ID method
    async getById(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic get all method
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get by index
    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic update method
    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic delete method
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Clear all data from a store
    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Advanced query with filters
    async query(storeName, filter = null, limit = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const results = [];
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const value = cursor.value;
                    if (!filter || filter(value)) {
                        results.push(value);
                        if (limit && results.length >= limit) {
                            resolve(results);
                            return;
                        }
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    // User-specific methods
    async createUser(userData) {
        const user = {
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            settings: {
                notifications: true,
                theme: 'light',
                measurementSystem: 'metric'
            },
            stats: {
                plantsGrown: 0,
                postsShared: 0,
                aiInteractions: 0
            }
        };
        return await this.add('users', user);
    }

    async getUserByEmail(email) {
        const users = await this.getByIndex('users', 'email', email);
        return users[0] || null;
    }

    async updateUserStats(userId, statsUpdate) {
        const user = await this.getById('users', userId);
        if (user) {
            user.stats = { ...user.stats, ...statsUpdate };
            return await this.update('users', user);
        }
    }

    // Plant suggestion methods
    async savePlantSuggestion(userId, suggestionData) {
        const suggestion = {
            userId,
            ...suggestionData,
            timestamp: new Date().toISOString()
        };
        return await this.add('plantSuggestions', suggestion);
    }

    async getUserSuggestionHistory(userId, limit = 10) {
        const suggestions = await this.getByIndex('plantSuggestions', 'userId', userId);
        return suggestions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
    }

    // User plants methods
    async addUserPlant(userId, plantData) {
        const plant = {
            userId,
            ...plantData,
            addedDate: new Date().toISOString(),
            status: 'active',
            careHistory: [],
            healthScore: 100
        };
        return await this.add('userPlants', plant);
    }

    async getUserPlants(userId) {
        return await this.getByIndex('userPlants', 'userId', userId);
    }

    // Care log methods
    async logCareActivity(userId, plantId, careData) {
        const log = {
            userId,
            plantId,
            ...careData,
            date: new Date().toISOString()
        };
        return await this.add('careLogs', log);
    }

    async getPlantCareHistory(plantId, limit = 30) {
        const logs = await this.getByIndex('careLogs', 'plantId', plantId);
        return logs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    // Analytics methods
    async getUserAnalytics(userId) {
        const [plants, suggestions, careLogs, showcases] = await Promise.all([
            this.getByIndex('userPlants', 'userId', userId),
            this.getByIndex('plantSuggestions', 'userId', userId),
            this.getByIndex('careLogs', 'userId', userId),
            this.getByIndex('showcasePosts', 'userId', userId)
        ]);

        return {
            totalPlants: plants.length,
            activePlants: plants.filter(p => p.status === 'active').length,
            totalSuggestions: suggestions.length,
            totalCareActivities: careLogs.length,
            totalShowcases: showcases.length,
            plants,
            recentActivity: careLogs.slice(-10).reverse()
        };
    }
}

// Export singleton instance
const gardenDB = new UrbanGardenDB();

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            await gardenDB.init();
            console.log('🌱 Urban Garden Database Ready!');
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    });
}
