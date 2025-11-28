// Plant database functionality
class PlantDatabase {
    constructor() {
        this.plants = [];
        this.categories = {};
        this.filteredPlants = [];
    }

    init(plants, categories) {
        this.plants = plants || [];
        this.categories = categories || {};
        this.filteredPlants = [...this.plants];
        
        this.setupSearchAndFilters();
        this.renderPlants();
    }

    setupSearchAndFilters() {
        const searchInput = document.getElementById('plant-search');
        const categorySelect = document.getElementById('plant-category');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterPlants(e.target.value, categorySelect?.value || '');
            });
        }

        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.filterPlants(searchInput?.value || '', e.target.value);
            });
        }
    }

    filterPlants(searchTerm, category) {
        this.filteredPlants = this.plants.filter(plant => {
            const matchesSearch = !searchTerm || 
                plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plant.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !category || plant.category === category;
            
            return matchesSearch && matchesCategory;
        });

        this.renderPlants();
    }

    renderPlants() {
        const plantGrid = document.getElementById('plant-grid');
        if (!plantGrid) return;

        if (this.filteredPlants.length === 0) {
            plantGrid.innerHTML = '<div class="no-results">No plants found matching your criteria.</div>';
            return;
        }

        plantGrid.innerHTML = this.filteredPlants.map(plant => 
            this.createPlantCard(plant)
        ).join('');

        // Add click listeners to plant cards
        plantGrid.querySelectorAll('.plant-card').forEach(card => {
            card.addEventListener('click', () => {
                const plantId = card.dataset.plantId;
                this.showPlantDetails(plantId);
            });
        });
    }

    createPlantCard(plant) {
        const categoryInfo = this.categories[plant.category] || { icon: '🌱', color: '#4CAF50' };
        
        return `
            <div class="plant-card" data-plant-id="${plant.id}">
                <div class="plant-image">
                    <img src="../../assets/images/${plant.image || 'placeholder-plant.jpg'}" 
                         alt="${plant.name}" 
                         onerror="this.src='../../assets/images/placeholder-plant.jpg'">
                </div>
                <div class="plant-info">
                    <h3>${plant.name}</h3>
                    <div class="plant-category" style="color: ${categoryInfo.color}">
                        ${categoryInfo.icon} ${categoryInfo.name}
                    </div>
                    <div class="plant-difficulty difficulty-${plant.difficulty}">
                        ${this.getDifficultyIcon(plant.difficulty)} ${plant.difficulty}
                    </div>
                    <p class="plant-description">${plant.description}</p>
                    <div class="plant-details">
                        <span class="growth-time">🕐 ${plant.growthTime}</span>
                        <span class="sunlight">☀️ ${plant.sunlight}</span>
                        <span class="water">💧 ${plant.water}</span>
                    </div>
                </div>
                <div class="plant-actions">
                    <button class="btn-secondary add-to-garden" data-plant-id="${plant.id}">
                        Add to Garden
                    </button>
                </div>
            </div>
        `;
    }

    getDifficultyIcon(difficulty) {
        switch(difficulty) {
            case 'beginner': return '🟢';
            case 'intermediate': return '🟡';
            case 'advanced': return '🔴';
            default: return '⚪';
        }
    }

    showPlantDetails(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (!plant) return;

        const categoryInfo = this.categories[plant.category] || { icon: '🌱', name: 'Unknown' };

        const modalContent = `
            <div class="plant-details-modal">
                <div class="plant-header">
                    <img src="../../assets/images/${plant.image || 'placeholder-plant.jpg'}" 
                         alt="${plant.name}" 
                         class="plant-detail-image"
                         onerror="this.src='../../assets/images/placeholder-plant.jpg'">
                    <div class="plant-title">
                        <h2>${plant.name}</h2>
                        <div class="plant-category">${categoryInfo.icon} ${categoryInfo.name}</div>
                        <div class="plant-difficulty difficulty-${plant.difficulty}">
                            ${this.getDifficultyIcon(plant.difficulty)} ${plant.difficulty}
                        </div>
                    </div>
                </div>
                
                <div class="plant-specs">
                    <div class="spec">
                        <strong>Growth Time:</strong> ${plant.growthTime}
                    </div>
                    <div class="spec">
                        <strong>Spacing:</strong> ${plant.spacing}
                    </div>
                    <div class="spec">
                        <strong>Sunlight:</strong> ${plant.sunlight}
                    </div>
                    <div class="spec">
                        <strong>Water:</strong> ${plant.water}
                    </div>
                    <div class="spec">
                        <strong>Harvest Season:</strong> ${plant.harvestSeason}
                    </div>
                </div>

                <div class="plant-description">
                    <h3>Description</h3>
                    <p>${plant.description}</p>
                </div>

                ${plant.tips ? `
                    <div class="plant-tips">
                        <h3>Growing Tips</h3>
                        <ul>
                            ${plant.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${plant.companion ? `
                    <div class="companion-plants">
                        <h3>Companion Plants</h3>
                        <div class="companions">
                            ${plant.companion.map(companionId => {
                                const companion = this.plants.find(p => p.id === companionId);
                                return companion ? `<span class="companion-tag">${companion.name}</span>` : '';
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="modal-actions">
                    <button class="btn-primary add-to-garden-btn" data-plant-id="${plant.id}">
                        Add to My Garden
                    </button>
                    <button class="btn-secondary create-schedule-btn" data-plant-id="${plant.id}">
                        Create Care Schedule
                    </button>
                </div>
            </div>
        `;

        window.urbanGardenApp.showModal(modalContent);

        // Add event listeners for modal buttons
        document.querySelector('.add-to-garden-btn')?.addEventListener('click', () => {
            this.addPlantToGarden(plantId);
        });

        document.querySelector('.create-schedule-btn')?.addEventListener('click', () => {
            this.createPlantSchedule(plantId);
        });
    }

    addPlantToGarden(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (!plant) return;

        // Add to user's garden (simplified - you might want a more sophisticated garden selection)
        const app = window.urbanGardenApp;
        if (!app.userGardens[0]) {
            app.userGardens.push({
                id: 'default-garden',
                name: 'My Garden',
                plants: []
            });
        }

        const newPlant = {
            plantId: plantId,
            planted: new Date().toISOString(),
            container: 'medium-pot',
            status: 'seed'
        };

        app.userGardens[0].plants.push(newPlant);
        app.saveUserData();

        // Close modal and show success message
        document.getElementById('modal').style.display = 'none';
        this.showSuccessMessage(`${plant.name} added to your garden!`);
    }

    createPlantSchedule(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (!plant) return;

        // Create basic care schedule
        const app = window.urbanGardenApp;
        const today = new Date();
        
        // Add watering schedule (every 2-3 days based on plant water needs)
        const waterInterval = plant.water === 'high' ? 1 : plant.water === 'regular' ? 2 : 3;
        
        for (let i = 0; i < 7; i++) {
            if (i % waterInterval === 0) {
                const scheduleDate = new Date(today);
                scheduleDate.setDate(today.getDate() + i);
                
                app.userSchedule.push({
                    id: Date.now() + i,
                    plantId: plantId,
                    task: 'water',
                    date: scheduleDate.toISOString(),
                    completed: false
                });
            }
        }

        app.saveUserData();

        // Close modal and show success message
        document.getElementById('modal').style.display = 'none';
        this.showSuccessMessage(`Care schedule created for ${plant.name}!`);
    }

    showSuccessMessage(message) {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize plant database
window.plantDatabase = new PlantDatabase();