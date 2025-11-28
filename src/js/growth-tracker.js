// Growth tracker functionality
class GrowthTracker {
    constructor() {
        this.growthData = [];
        this.plants = [];
        this.selectedPlant = null;
    }

    init(growthData, plants) {
        this.growthData = growthData || [];
        this.plants = plants || [];
        
        this.setupPlantSelector();
        this.setupAddEntryButton();
        this.renderGrowthLog();
    }

    setupPlantSelector() {
        const select = document.getElementById('tracked-plant');
        if (!select) return;

        // Get plants that are actually in the user's garden
        const userPlants = window.urbanGardenApp?.userGardens?.reduce((all, garden) => {
            return all.concat(garden.plants.map(p => p.plantId));
        }, []) || [];

        const availablePlants = this.plants.filter(plant => 
            userPlants.includes(plant.id)
        );

        select.innerHTML = '<option value="">Select a plant to track</option>' +
            availablePlants.map(plant => 
                `<option value="${plant.id}">${plant.name}</option>`
            ).join('');

        select.addEventListener('change', (e) => {
            this.selectedPlant = e.target.value;
            this.renderGrowthChart();
            this.renderGrowthLog();
        });
    }

    setupAddEntryButton() {
        const addBtn = document.getElementById('add-entry-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (!this.selectedPlant) {
                    alert('Please select a plant first');
                    return;
                }
                this.showAddEntryModal();
            });
        }
    }

    renderGrowthChart() {
        const canvas = document.getElementById('growth-chart-canvas');
        if (!canvas || !this.selectedPlant) return;

        const ctx = canvas.getContext('2d');
        const plantData = this.growthData.filter(entry => entry.plantId === this.selectedPlant)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (plantData.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No growth data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Simple chart drawing
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Find min/max values
        const heights = plantData.map(d => d.height || 0);
        const minHeight = Math.min(...heights);
        const maxHeight = Math.max(...heights);
        const heightRange = maxHeight - minHeight || 1;

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw data points and lines
        if (plantData.length > 1) {
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();

            plantData.forEach((entry, index) => {
                const x = padding + (index / (plantData.length - 1)) * chartWidth;
                const y = canvas.height - padding - ((entry.height - minHeight) / heightRange) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                // Draw point
                ctx.fillStyle = '#4CAF50';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });

            ctx.stroke();
        }

        // Draw labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Height (cm)', 0, 0);
        ctx.restore();

        // X-axis label
        ctx.fillText('Time', canvas.width / 2, canvas.height - 10);
    }

    renderGrowthLog() {
        const logContainer = document.getElementById('growth-entries');
        if (!logContainer) return;

        let entries;
        if (this.selectedPlant) {
            entries = this.growthData.filter(entry => entry.plantId === this.selectedPlant)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            entries = this.growthData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (entries.length === 0) {
            logContainer.innerHTML = '<div class="no-entries">No growth entries found</div>';
            return;
        }

        logContainer.innerHTML = entries.map(entry => {
            const plant = this.plants.find(p => p.id === entry.plantId);
            const plantName = plant ? plant.name : 'Unknown Plant';
            const date = new Date(entry.date).toLocaleDateString();

            return `
                <div class="growth-entry">
                    <div class="entry-header">
                        <span class="plant-name">${plantName}</span>
                        <span class="entry-date">${date}</span>
                    </div>
                    <div class="entry-details">
                        ${entry.height ? `<span class="height">📏 ${entry.height}cm</span>` : ''}
                        ${entry.stage ? `<span class="stage">🌱 ${entry.stage}</span>` : ''}
                    </div>
                    ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
                    <button class="delete-entry" onclick="window.growthTracker.deleteEntry('${entry.id || entry.date + entry.plantId}')">
                        Delete
                    </button>
                </div>
            `;
        }).join('');
    }

    showAddEntryModal() {
        const plant = this.plants.find(p => p.id === this.selectedPlant);
        if (!plant) return;

        const modalContent = `
            <div class="add-entry-modal">
                <h3>Add Growth Entry for ${plant.name}</h3>
                <form id="add-entry-form">
                    <div class="form-group">
                        <label for="entry-date">Date:</label>
                        <input type="date" id="entry-date" required 
                               value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label for="entry-height">Height (cm):</label>
                        <input type="number" id="entry-height" step="0.1" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="entry-stage">Growth Stage:</label>
                        <select id="entry-stage">
                            <option value="">Select stage</option>
                            <option value="seed">🌱 Seed/Seedling</option>
                            <option value="vegetative">🌿 Vegetative Growth</option>
                            <option value="flowering">🌼 Flowering</option>
                            <option value="fruiting">🍅 Fruiting/Harvest</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="entry-notes">Notes:</label>
                        <textarea id="entry-notes" rows="3" 
                                  placeholder="Observations, changes, care provided..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Entry</button>
                        <button type="button" class="btn-secondary" 
                                onclick="document.getElementById('modal').style.display='none'">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        window.urbanGardenApp.showModal(modalContent);

        document.getElementById('add-entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEntry();
        });
    }

    addEntry() {
        const date = document.getElementById('entry-date').value;
        const height = document.getElementById('entry-height').value;
        const stage = document.getElementById('entry-stage').value;
        const notes = document.getElementById('entry-notes').value;

        if (!date) {
            alert('Please enter a date');
            return;
        }

        const newEntry = {
            id: Date.now().toString(),
            plantId: this.selectedPlant,
            date: new Date(date).toISOString(),
            height: height ? parseFloat(height) : null,
            stage: stage,
            notes: notes
        };

        this.growthData.push(newEntry);
        this.saveGrowthData();
        this.renderGrowthChart();
        this.renderGrowthLog();

        document.getElementById('modal').style.display = 'none';
    }

    deleteEntry(entryId) {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.growthData = this.growthData.filter(entry => 
                (entry.id || entry.date + entry.plantId) !== entryId
            );
            this.saveGrowthData();
            this.renderGrowthChart();
            this.renderGrowthLog();
        }
    }

    saveGrowthData() {
        if (window.urbanGardenApp) {
            window.urbanGardenApp.userGrowthData = this.growthData;
            window.urbanGardenApp.saveUserData();
        }
    }
}

// Initialize growth tracker
window.growthTracker = new GrowthTracker();