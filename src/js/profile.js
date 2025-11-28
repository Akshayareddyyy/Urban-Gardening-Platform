// Profile/My Garden Page JavaScript

// Import database and AI engine
import { UrbanGardenDB } from './database.js';
import { PlantAIEngine } from './ai-engine.js';

// Initialize instances
const db = new UrbanGardenDB();
const aiEngine = new PlantAIEngine();

// Global state
let currentUser = null;
let userPlants = [];
let aiHistory = [];
let updateInterval = null;
let statsUpdateInterval = null;

// Real-time update configuration
const REAL_TIME_CONFIG = {
    statsUpdateInterval: 5000,      // Update stats every 5 seconds
    plantHealthCheck: 10000,        // Check plant health every 10 seconds
    autoSaveInterval: 30000,        // Auto-save every 30 seconds
    notificationCheck: 15000        // Check for notifications every 15 seconds
};

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌱 Initializing My Garden (Real-time Mode)...');
    await db.init();
    await loadUserData();
    initializeTabs();
    initializeModals();
    await loadUserPlants();
    await loadAnalytics();
    await loadAIHistory();
    
    // Start real-time updates
    startRealTimeUpdates();
    startStatsMonitoring();
    startPlantHealthMonitoring();
    
    console.log('✅ My Garden initialized with real-time updates');
});

// Start real-time updates
function startRealTimeUpdates() {
    // Update stats in real-time
    statsUpdateInterval = setInterval(async () => {
        await updateLiveStats();
    }, REAL_TIME_CONFIG.statsUpdateInterval);
    
    // Check for plant care notifications
    setInterval(() => {
        checkPlantCareNotifications();
    }, REAL_TIME_CONFIG.notificationCheck);
    
    // Auto-save user changes
    setInterval(() => {
        autoSaveUserData();
    }, REAL_TIME_CONFIG.autoSaveInterval);
    
    console.log('⚡ Real-time updates started');
}

// Update live stats
async function updateLiveStats() {
    if (!currentUser) return;
    
    try {
        // Recalculate stats from database
        const plants = await db.getAll('userPlants');
        const showcases = await db.getAll('showcases');
        const activities = await db.getAll('activities');
        const aiInteractions = await db.getAll('aiHistory');
        
        const newStats = {
            activePlants: plants.filter(p => p.status === 'active').length,
            showcases: showcases.length,
            careActions: activities.length,
            aiSuggestions: aiInteractions.length
        };
        
        // Update if changed
        if (JSON.stringify(currentUser.stats) !== JSON.stringify(newStats)) {
            currentUser.stats = newStats;
            updateStatsDisplay(newStats);
            animateStatChange();
        }
    } catch (error) {
        console.error('Error updating live stats:', error);
    }
}

// Update stats display with animation
function updateStatsDisplay(stats) {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues[0]) {
        animateNumber(statValues[0], parseInt(statValues[0].textContent) || 0, stats.activePlants || 0);
    }
    if (statValues[1]) {
        animateNumber(statValues[1], parseInt(statValues[1].textContent) || 0, stats.showcases || 0);
    }
    if (statValues[2]) {
        animateNumber(statValues[2], parseInt(statValues[2].textContent) || 0, stats.careActions || 0);
    }
    if (statValues[3]) {
        animateNumber(statValues[3], parseInt(statValues[3].textContent) || 0, stats.aiSuggestions || 0);
    }
}

// Animate number changes
function animateNumber(element, from, to) {
    if (from === to) return;
    
    const duration = 500;
    const steps = 20;
    const increment = (to - from) / steps;
    let current = from;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            element.textContent = to;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, duration / steps);
}

// Animate stat card on change
function animateStatChange() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'pulse 0.5s ease-out';
        }, 10);
    });
}

// Start stats monitoring
function startStatsMonitoring() {
    console.log('📊 Stats monitoring started');
    
    // Monitor database changes
    if (db.db) {
        // Listen for IndexedDB changes (using periodic checks)
        setInterval(async () => {
            await loadAnalytics();
        }, 20000); // Update analytics every 20 seconds
    }
}

// Start plant health monitoring
function startPlantHealthMonitoring() {
    console.log('🌡️ Plant health monitoring started');
    
    setInterval(async () => {
        await checkPlantHealth();
    }, REAL_TIME_CONFIG.plantHealthCheck);
}

// Check plant health
async function checkPlantHealth() {
    if (!userPlants || userPlants.length === 0) return;
    
    const now = new Date();
    
    for (const plant of userPlants) {
        if (!plant.careSchedule) continue;
        
        const lastWatered = plant.careSchedule.lastWatered ? new Date(plant.careSchedule.lastWatered) : null;
        const wateringFrequency = plant.careSchedule.wateringFrequency || 3; // days
        
        if (lastWatered) {
            const daysSinceWatering = (now - lastWatered) / (1000 * 60 * 60 * 24);
            
            if (daysSinceWatering >= wateringFrequency) {
                showPlantCareAlert(plant, 'watering');
            }
        }
    }
}

// Show plant care alert
function showPlantCareAlert(plant, careType) {
    const message = `💧 Time to water ${plant.name}!`;
    showNotification(message, 'info');
    
    // Update plant card with alert indicator
    const plantCard = document.querySelector(`[data-plant-id="${plant.id}"]`);
    if (plantCard && !plantCard.querySelector('.care-alert')) {
        const alert = document.createElement('div');
        alert.className = 'care-alert';
        alert.innerHTML = '💧';
        alert.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff9800;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            animation: pulse 1s infinite;
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.5);
        `;
        plantCard.style.position = 'relative';
        plantCard.appendChild(alert);
    }
}

// Check for plant care notifications
function checkPlantCareNotifications() {
    // Check if any plants need attention
    const careNeeded = userPlants.filter(plant => {
        if (!plant.careSchedule) return false;
        
        const lastWatered = plant.careSchedule.lastWatered ? new Date(plant.careSchedule.lastWatered) : null;
        if (!lastWatered) return true;
        
        const daysSince = (new Date() - lastWatered) / (1000 * 60 * 60 * 24);
        return daysSince >= (plant.careSchedule.wateringFrequency || 3);
    });
    
    // Update notification badge
    updateNotificationBadge(careNeeded.length);
}

// Update notification badge
function updateNotificationBadge(count) {
    let badge = document.querySelector('.notification-badge');
    
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #f44336;
                color: white;
                border-radius: 10px;
                padding: 2px 8px;
                font-size: 0.75rem;
                font-weight: 700;
                min-width: 20px;
                text-align: center;
                animation: bounce 0.5s ease-out;
            `;
            
            const profileAvatar = document.querySelector('.profile-avatar');
            if (profileAvatar) {
                profileAvatar.style.position = 'relative';
                profileAvatar.appendChild(badge);
            }
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}

// Auto-save user data
async function autoSaveUserData() {
    if (!currentUser) return;
    
    try {
        await db.update('users', currentUser.id, currentUser);
        console.log('💾 Auto-saved user data');
    } catch (error) {
        console.error('Auto-save error:', error);
    }
}

// Load user data
async function loadUserData() {
    // For demo, get or create user
    const users = await db.getAll('users');
    if (users.length > 0) {
        currentUser = users[0];
    } else {
        // Create demo user
        currentUser = await db.createUser({
            email: 'gardener@urban.com',
            name: 'Urban Gardener',
            bio: '🌱 Passionate urban gardener | 🌿 Growing green in the city',
            avatar: 'U',
            preferences: {
                notifications: true,
                autoWatering: false,
                publicProfile: true
            }
        });
    }

    updateUserInterface();
}

// Update user interface
function updateUserInterface() {
    if (!currentUser) return;

    // Update header
    document.querySelector('.avatar-letter').textContent = currentUser.avatar || currentUser.name.charAt(0).toUpperCase();
    document.querySelector('.profile-hero h1').textContent = currentUser.name;
    document.querySelector('.user-bio').textContent = currentUser.bio || '';

    // Update stats
    document.querySelectorAll('.stat-value')[0].textContent = currentUser.stats?.activePlants || 0;
    document.querySelectorAll('.stat-value')[1].textContent = currentUser.stats?.showcases || 0;
    document.querySelectorAll('.stat-value')[2].textContent = currentUser.stats?.careActions || 0;
    document.querySelectorAll('.stat-value')[3].textContent = currentUser.stats?.aiSuggestions || 0;
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Load user plants
async function loadUserPlants() {
    if (!currentUser) return;

    userPlants = await db.query('userPlants', { userId: currentUser.id });
    renderPlants();
}

// Render plants grid with real-time updates
function renderPlants() {
    const container = document.getElementById('plantsContainer');
    
    if (userPlants.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C12 2 8 4 8 8c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-6-4-6z"/>
                    <path d="M12 12c-4 0-7 3-7 7h14c0-4-3-7-7-7z"/>
                </svg>
                <h3>No plants yet</h3>
                <p>Start your urban garden by adding your first plant!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = userPlants.map(plant => {
        const careCountdown = calculateCareCountdown(plant);
        const healthStatus = getPlantHealthStatus(plant);
        
        return `
        <div class="plant-card ${healthStatus.urgency}" data-plant-id="${plant.id}">
            <div class="plant-card-header">
                <div class="plant-info">
                    <h3>${plant.name}</h3>
                    <p class="plant-type">${plant.type}</p>
                </div>
                <span class="plant-status ${plant.status}">${plant.status}</span>
            </div>
            
            ${careCountdown.overdue ? `
            <div class="care-alert-banner">
                ⚠️ Care needed: ${careCountdown.message}
            </div>
            ` : ''}
            
            <div class="plant-details">
                <div class="plant-detail-item">
                    <span>📅</span>
                    <span>Added: ${formatDate(plant.dateAdded)}</span>
                </div>
                <div class="plant-detail-item">
                    <span>💧</span>
                    <span class="watering-countdown" data-plant-id="${plant.id}">
                        ${careCountdown.overdue ? '⚠️ Overdue!' : `Next: ${careCountdown.formatted}`}
                    </span>
                </div>
                <div class="plant-detail-item">
                    <span>🌱</span>
                    <span>Stage: ${plant.growthStage || 'Seedling'}</span>
                </div>
                <div class="plant-detail-item">
                    <span>💚</span>
                    <span class="health-indicator ${healthStatus.class}">
                        ${healthStatus.label}
                    </span>
                </div>
            </div>
            <div class="plant-actions">
                <button class="action-btn primary" onclick="waterPlant('${plant.id}')">💧 Water Now</button>
                <button class="action-btn" onclick="updatePlant('${plant.id}')">✏️ Update</button>
                <button class="action-btn" onclick="deletePlant('${plant.id}')">🗑️ Remove</button>
            </div>
        </div>
    `}).join('');
    
    // Start countdown timers
    startCountdownTimers();
}

// Calculate care countdown
function calculateCareCountdown(plant) {
    if (!plant.careSchedule || !plant.careSchedule.lastWatered) {
        return {
            overdue: true,
            message: 'Never watered',
            formatted: 'N/A'
        };
    }
    
    const lastWatered = new Date(plant.careSchedule.lastWatered);
    const wateringFrequency = plant.careSchedule.wateringFrequency || 3; // days
    const nextWatering = new Date(lastWatered.getTime() + (wateringFrequency * 24 * 60 * 60 * 1000));
    const now = new Date();
    const timeDiff = nextWatering - now;
    
    if (timeDiff <= 0) {
        const overdueDays = Math.abs(Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
        return {
            overdue: true,
            message: `${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue`,
            formatted: 'Overdue'
        };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    let formatted = '';
    if (days > 0) formatted += `${days}d `;
    if (hours > 0 || days > 0) formatted += `${hours}h `;
    formatted += `${minutes}m`;
    
    return {
        overdue: false,
        message: '',
        formatted: formatted.trim(),
        milliseconds: timeDiff
    };
}

// Get plant health status
function getPlantHealthStatus(plant) {
    const countdown = calculateCareCountdown(plant);
    
    if (countdown.overdue) {
        return {
            label: 'Needs Care',
            class: 'needs-care',
            urgency: 'urgent'
        };
    }
    
    if (countdown.milliseconds < 24 * 60 * 60 * 1000) { // Less than 1 day
        return {
            label: 'Care Soon',
            class: 'care-soon',
            urgency: 'warning'
        };
    }
    
    return {
        label: 'Healthy',
        class: 'healthy',
        urgency: ''
    };
}

// Start countdown timers
function startCountdownTimers() {
    // Update every minute
    if (updateInterval) clearInterval(updateInterval);
    
    updateInterval = setInterval(() => {
        document.querySelectorAll('.watering-countdown').forEach(countdown => {
            const plantId = countdown.dataset.plantId;
            const plant = userPlants.find(p => p.id === plantId);
            
            if (plant) {
                const careCountdown = calculateCareCountdown(plant);
                countdown.textContent = careCountdown.overdue ? '⚠️ Overdue!' : `Next: ${careCountdown.formatted}`;
                countdown.className = `watering-countdown ${careCountdown.overdue ? 'overdue' : ''}`;
            }
        });
    }, 60000); // Update every minute
    
    console.log('⏰ Countdown timers started');
}

// Load analytics
async function loadAnalytics() {
    if (!currentUser) return;

    const analytics = await db.getUserAnalytics(currentUser.id);
    renderAnalytics(analytics);
}

// Render analytics
function renderAnalytics(analytics) {
    // Render care activity timeline
    const timeline = document.getElementById('activityTimeline');
    if (timeline) {
        const activities = analytics.recentCare || [];
        
        if (activities.length === 0) {
            timeline.innerHTML = `
                <div class="empty-state">
                    <p>No care activities yet</p>
                </div>
            `;
        } else {
            timeline.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">${getActivityIcon(activity.action)}</div>
                    <div class="activity-content">
                        <h4>${activity.plantName} - ${activity.action}</h4>
                        <p class="activity-time">${formatDate(activity.timestamp)}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // TODO: Render charts using Chart.js or similar library
    // For now, show placeholders
    const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
    chartPlaceholders.forEach(placeholder => {
        placeholder.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-bottom: 10px;">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <polyline points="17 6 12 1 7 6"></polyline>
                    <polyline points="7 18 12 23 17 18"></polyline>
                </svg>
                <p>Chart visualization coming soon</p>
            </div>
        `;
    });
}

// Load AI history
async function loadAIHistory() {
    if (!currentUser) return;

    aiHistory = await db.query('aiInteractions', { userId: currentUser.id });
    renderAIHistory();
}

// Render AI history
function renderAIHistory() {
    const container = document.getElementById('aiHistoryContainer');
    
    if (aiHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <h3>No AI interactions yet</h3>
                <p>Get personalized plant suggestions and care tips!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = aiHistory.slice().reverse().map(interaction => `
        <div class="ai-history-item">
            <div class="ai-history-header">
                <div class="ai-history-type">
                    <span>${getAIIcon(interaction.type)}</span>
                    <span>${formatAIType(interaction.type)}</span>
                </div>
                <span class="ai-history-time">${formatDate(interaction.timestamp)}</span>
            </div>
            <div class="ai-history-content">
                ${formatAIContent(interaction)}
            </div>
        </div>
    `).join('');
}

// Modal functionality
function initializeModals() {
    // Add plant modal
    const addPlantBtn = document.getElementById('addPlantBtn');
    const addPlantModal = document.getElementById('addPlantModal');
    const closeModalBtns = document.querySelectorAll('.modal-close, .btn-cancel');

    if (addPlantBtn) {
        addPlantBtn.addEventListener('click', () => {
            addPlantModal.classList.add('active');
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Add plant form submission
    const addPlantForm = document.getElementById('addPlantForm');
    if (addPlantForm) {
        addPlantForm.addEventListener('submit', handleAddPlant);
    }
}

// Handle add plant
async function handleAddPlant(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const plantData = {
        userId: currentUser.id,
        name: formData.get('plantName'),
        type: formData.get('plantType'),
        location: formData.get('plantLocation'),
        notes: formData.get('plantNotes'),
        dateAdded: new Date().toISOString(),
        status: 'active',
        growthStage: 'Seedling'
    };

    try {
        const plantId = await db.add('userPlants', plantData);
        
        // Update user stats
        await db.updateUserStats(currentUser.id, { activePlants: (currentUser.stats?.activePlants || 0) + 1 });
        
        // Reload data
        await loadUserData();
        await loadUserPlants();
        
        // Close modal and reset form
        document.getElementById('addPlantModal').classList.remove('active');
        e.target.reset();
        
        showNotification('Plant added successfully! 🌱', 'success');
    } catch (error) {
        console.error('Error adding plant:', error);
        showNotification('Failed to add plant. Please try again.', 'error');
    }
}

// Water plant
window.waterPlant = async function(plantId) {
    try {
        const plant = userPlants.find(p => p.id === parseInt(plantId));
        if (!plant) return;

        // Update plant
        await db.update('userPlants', plantId, {
            ...plant,
            lastWatered: new Date().toISOString()
        });

        // Add care log
        await db.add('careLogs', {
            userId: currentUser.id,
            plantId: parseInt(plantId),
            plantName: plant.name,
            action: 'Watering',
            timestamp: new Date().toISOString()
        });

        // Update user stats
        await db.updateUserStats(currentUser.id, { 
            careActions: (currentUser.stats?.careActions || 0) + 1 
        });

        // Reload data
        await loadUserData();
        await loadUserPlants();
        await loadAnalytics();

        showNotification('Plant watered successfully! 💧', 'success');
    } catch (error) {
        console.error('Error watering plant:', error);
        showNotification('Failed to water plant. Please try again.', 'error');
    }
};

// Update plant
window.updatePlant = function(plantId) {
    // TODO: Implement edit plant modal
    showNotification('Edit functionality coming soon!', 'info');
};

// Delete plant
window.deletePlant = async function(plantId) {
    if (!confirm('Are you sure you want to remove this plant from your garden?')) {
        return;
    }

    try {
        await db.delete('userPlants', plantId);
        
        // Update user stats
        await db.updateUserStats(currentUser.id, { 
            activePlants: Math.max(0, (currentUser.stats?.activePlants || 1) - 1) 
        });

        // Reload data
        await loadUserData();
        await loadUserPlants();

        showNotification('Plant removed from your garden.', 'success');
    } catch (error) {
        console.error('Error deleting plant:', error);
        showNotification('Failed to remove plant. Please try again.', 'error');
    }
};

// Settings form handlers
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                await db.update('users', currentUser.id, {
                    ...currentUser,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    bio: formData.get('bio')
                });

                await loadUserData();
                showNotification('Profile updated successfully!', 'success');
            } catch (error) {
                console.error('Error updating profile:', error);
                showNotification('Failed to update profile.', 'error');
            }
        });
    }

    // Preference toggles
    const notificationToggle = document.getElementById('notificationToggle');
    const autoWateringToggle = document.getElementById('autoWateringToggle');
    const publicProfileToggle = document.getElementById('publicProfileToggle');

    if (notificationToggle) {
        notificationToggle.addEventListener('change', async (e) => {
            await updatePreference('notifications', e.target.checked);
        });
    }

    if (autoWateringToggle) {
        autoWateringToggle.addEventListener('change', async (e) => {
            await updatePreference('autoWatering', e.target.checked);
        });
    }

    if (publicProfileToggle) {
        publicProfileToggle.addEventListener('change', async (e) => {
            await updatePreference('publicProfile', e.target.checked);
        });
    }
});

// Update preference
async function updatePreference(key, value) {
    try {
        const preferences = { ...currentUser.preferences, [key]: value };
        await db.update('users', currentUser.id, {
            ...currentUser,
            preferences
        });

        currentUser.preferences = preferences;
        showNotification('Preference updated!', 'success');
    } catch (error) {
        console.error('Error updating preference:', error);
        showNotification('Failed to update preference.', 'error');
    }
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function getActivityIcon(action) {
    const icons = {
        'Watering': '💧',
        'Fertilizing': '🌿',
        'Pruning': '✂️',
        'Repotting': '🪴',
        'Harvesting': '🌾'
    };
    return icons[action] || '📝';
}

function getAIIcon(type) {
    const icons = {
        'suggestion': '💡',
        'fertilizer': '🌿',
        'care': '🌱',
        'troubleshooting': '🔧'
    };
    return icons[type] || '🤖';
}

function formatAIType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Recommendation';
}

function formatAIContent(interaction) {
    if (interaction.recommendations && Array.isArray(interaction.recommendations)) {
        return `
            <p><strong>Top Suggestions:</strong></p>
            <ul style="margin-top: 10px; padding-left: 20px;">
                ${interaction.recommendations.slice(0, 3).map(rec => 
                    `<li>${rec.name} - ${rec.scientificName} (Score: ${rec.score}%)</li>`
                ).join('')}
            </ul>
        `;
    }
    return interaction.query || 'AI recommendation generated';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    console.log('🧹 Cleaning up real-time updates...');
    
    // Clear all intervals
    if (updateInterval) clearInterval(updateInterval);
    if (statsUpdateInterval) clearInterval(statsUpdateInterval);
    
    console.log('✅ Cleanup complete');
});

// Make functions global for onclick handlers
window.waterPlant = waterPlant;
window.updatePlant = updatePlant;
window.deletePlant = deletePlant;
