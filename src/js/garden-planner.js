// Garden planner functionality
class GardenPlanner {
    constructor() {
        this.selectedTool = null;
        this.gridSize = { width: 8, height: 6 };
        this.gardenItems = [];
    }

    init() {
        this.setupTools();
        this.createGrid();
        this.setupGridInteraction();
    }

    setupTools() {
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.dataset.tool);
                
                // Update button states
                toolButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    selectTool(tool) {
        this.selectedTool = tool;
        const grid = document.getElementById('garden-grid');
        grid.className = `grid-container tool-${tool}`;
    }

    createGrid() {
        const grid = document.getElementById('garden-grid');
        if (!grid) return;

        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${this.gridSize.width}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.gridSize.height}, 1fr)`;

        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                grid.appendChild(cell);
            }
        }
    }

    setupGridInteraction() {
        const grid = document.getElementById('garden-grid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('grid-cell')) {
                this.handleCellClick(e.target);
            }
        });
    }

    handleCellClick(cell) {
        if (!this.selectedTool) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // Check if cell already has an item
        if (cell.querySelector('.garden-item')) {
            this.removeItem(cell, x, y);
        } else {
            this.addItem(cell, x, y, this.selectedTool);
        }
    }

    addItem(cell, x, y, tool) {
        const item = document.createElement('div');
        item.className = `garden-item item-${tool}`;
        
        const icons = {
            plant: '🌱',
            container: '🪴',
            light: '💡',
            water: '💧'
        };

        item.innerHTML = `
            <span class="item-icon">${icons[tool] || '📦'}</span>
            <span class="item-label">${tool}</span>
        `;

        cell.appendChild(item);

        // Save to garden items
        this.gardenItems.push({ x, y, type: tool, id: Date.now() });
        this.saveGarden();
    }

    removeItem(cell, x, y) {
        const item = cell.querySelector('.garden-item');
        if (item) {
            item.remove();
            
            // Remove from garden items
            this.gardenItems = this.gardenItems.filter(item => 
                !(item.x === x && item.y === y)
            );
            this.saveGarden();
        }
    }

    saveGarden() {
        const gardenData = {
            items: this.gardenItems,
            gridSize: this.gridSize,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('gardenPlan', JSON.stringify(gardenData));
    }

    loadGarden() {
        const saved = localStorage.getItem('gardenPlan');
        if (saved) {
            const data = JSON.parse(saved);
            this.gardenItems = data.items || [];
            this.gridSize = data.gridSize || { width: 8, height: 6 };
            
            this.createGrid();
            this.renderSavedItems();
        }
    }

    renderSavedItems() {
        this.gardenItems.forEach(item => {
            const cell = document.querySelector(`[data-x="${item.x}"][data-y="${item.y}"]`);
            if (cell) {
                this.addItem(cell, item.x, item.y, item.type);
            }
        });
    }
}

// Initialize garden planner
window.gardenPlanner = new GardenPlanner();