// Main application controller
class UrbanGardenApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.plants = [];
        this.gardens = [];
        this.schedule = [];
        this.growthData = [];
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupNavigation();
        this.setupModal();
        this.renderDashboard();
        this.setupMobileMenu();
    }

    async loadData() {
        try {
            // Load plant database
            const plantsResponse = await fetch('../../data/plants.json');
            const plantsData = await plantsResponse.json();
            this.plants = plantsData.plants;
            this.categories = plantsData.categories;
            
            // Load garden layouts
            const layoutsResponse = await fetch('../../data/garden-layouts.json');
            const layoutsData = await layoutsResponse.json();
            this.gardenLayouts = layoutsData.layouts;
            this.containers = layoutsData.containers;
            
            // Load user data from localStorage
            this.loadUserData();
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to sample data if files can't be loaded
            this.createSampleData();
        }
    }

    loadUserData() {
        const userData = localStorage.getItem('urbanGardenData');
        if (userData) {
            const data = JSON.parse(userData);
            this.userGardens = data.gardens || [];
            this.userSchedule = data.schedule || [];
            this.userGrowthData = data.growthData || [];
        } else {
            this.createSampleUserData();
        }
    }

    saveUserData() {
        const userData = {
            gardens: this.userGardens,
            schedule: this.userSchedule,
            growthData: this.userGrowthData
        };
        localStorage.setItem('urbanGardenData', JSON.stringify(userData));
    }

    createSampleUserData() {
        this.userGardens = [
            {
                id: 'my-balcony',
                name: 'My Balcony Garden',
                plants: [
                    { plantId: 'tomato-cherry', planted: '2025-09-01', container: 'large-pot', status: 'flowering' },
                    { plantId: 'basil-sweet', planted: '2025-09-10', container: 'medium-pot', status: 'vegetative' },
                    { plantId: 'lettuce-buttercrunch', planted: '2025-09-15', container: 'window-box', status: 'harvest' }
                ]
            }
        ];

        this.userSchedule = [
            { id: 1, plantId: 'tomato-cherry', task: 'water', date: new Date().toISOString(), completed: false },
            { id: 2, plantId: 'basil-sweet', task: 'water', date: new Date(Date.now() + 86400000).toISOString(), completed: false },
            { id: 3, plantId: 'lettuce-buttercrunch', task: 'harvest', date: new Date().toISOString(), completed: false }
        ];

        this.userGrowthData = [
            { plantId: 'tomato-cherry', date: '2025-09-01', height: 2, notes: 'Planted seedling' },
            { plantId: 'tomato-cherry', date: '2025-09-08', height: 8, notes: 'First true leaves' },
            { plantId: 'tomato-cherry', date: '2025-09-15', height: 15, notes: 'Growing strong' },
            { plantId: 'tomato-cherry', date: '2025-09-22', height: 25, notes: 'First flower buds' }
        ];

        this.saveUserData();
    }

    createSampleData() {
        this.plants = [
            {
                id: 'tomato-cherry',
                name: 'Cherry Tomato',
                category: 'vegetables',
                difficulty: 'beginner',
                growthTime: '65-75 days',
                description: 'Perfect for containers and small spaces.'
            },
            {
                id: 'basil-sweet',
                name: 'Sweet Basil',
                category: 'herbs',
                difficulty: 'beginner',
                growthTime: '60-90 days',
                description: 'Classic culinary herb with aromatic leaves.'
            }
        ];
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Handle logout
                if (link.id === 'logoutBtn') {
                    this.handleLogout();
                    return;
                }
                
                const href = link.getAttribute('href');
                
                // Handle external links (new pages)
                if (href && !href.startsWith('#')) {
                    window.location.href = href;
                    return;
                }
                
                // Handle internal sections
                const section = href.substring(1);
                this.showSection(section);
            });
        });
    }

    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear user session
            localStorage.removeItem('currentUser');
            
            // Redirect to landing page
            window.location.href = '../../landing.html';
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

            // Load section-specific content
            this.loadSectionContent(sectionName);
        }
    }

    loadSectionContent(section) {
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'planner':
                window.gardenPlanner?.init();
                break;
            case 'plants':
                window.plantDatabase?.init(this.plants, this.categories);
                break;
            case 'schedule':
                window.scheduler?.init(this.userSchedule, this.plants);
                break;
            case 'tracker':
                window.growthTracker?.init(this.userGrowthData, this.plants);
                break;
        }
    }

    renderDashboard() {
        // Update stats
        const totalPlants = this.userGardens.reduce((total, garden) => total + garden.plants.length, 0);
        const readyToHarvest = this.userGardens.reduce((total, garden) => 
            total + garden.plants.filter(plant => plant.status === 'harvest').length, 0);
        const needWater = this.userSchedule.filter(task => 
            task.task === 'water' && !task.completed && new Date(task.date) <= new Date()).length;

        // Update stat numbers
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers[0]) statNumbers[0].textContent = totalPlants;
        if (statNumbers[1]) statNumbers[1].textContent = readyToHarvest;
        if (statNumbers[2]) statNumbers[2].textContent = needWater;

        // Update recent activity
        this.renderRecentActivity();
    }

    renderRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // Get recent activities from schedule and growth data
        const recentActivities = [
            ...this.userSchedule.filter(task => task.completed)
                .map(task => ({
                    text: `${task.task === 'water' ? 'Watered' : 'Cared for'} ${this.getPlantName(task.plantId)}`,
                    date: new Date(task.date)
                })),
            ...this.userGrowthData.slice(-3).map(entry => ({
                text: `Updated ${this.getPlantName(entry.plantId)} growth log`,
                date: new Date(entry.date)
            }))
        ]
        .sort((a, b) => b.date - a.date)
        .slice(0, 3);

        activityList.innerHTML = recentActivities.map(activity => 
            `<li>${activity.text} - ${this.formatRelativeTime(activity.date)}</li>`
        ).join('');
    }

    getPlantName(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        return plant ? plant.name : 'Unknown Plant';
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    }

    setupModal() {
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showModal(content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.urbanGardenApp = new UrbanGardenApp();
});