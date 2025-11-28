// Search Handler for Plant Search
// This file handles the search bar functionality and displays results

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
});

function initializeSearch() {
    const searchInput = document.getElementById('plantSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchBtn || !searchResults) {
        console.log('Search elements not found on this page');
        return;
    }

    // Search on button click
    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // Show results when input is focused and has content
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() && searchResults.innerHTML) {
            searchResults.classList.add('active');
        }
    });

    // Debounced live search (optional)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 500); // Wait 500ms after user stops typing
        } else {
            searchResults.classList.remove('active');
        }
    });
}

async function performSearch(customQuery = null) {
    const searchInput = document.getElementById('plantSearch');
    const searchResults = document.getElementById('searchResults');
    const query = customQuery || searchInput.value.trim();

    if (!query || query.length < 2) {
        showError('Please enter at least 2 characters to search');
        return;
    }

    // Show loading state
    showLoading();
    searchResults.classList.add('active');

    try {
        // Perform search using the API
        const plants = await plantSearchAPI.searchPlants(query);

        console.log('Search completed. Results:', plants.length, 'plants found');
        console.log('Plant results:', plants);

        if (plants.length === 0) {
            showEmpty(query);
        } else {
            displayResults(plants, query);
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to search for plants. Please try again.');
    }
}

function displayResults(plants, query) {
    const searchResults = document.getElementById('searchResults');
    
    const resultsHTML = `
        <div class="search-results-header">
            <h3>🌿 Discover Your Next Green Companion</h3>
            <span class="results-count">${plants.length} plant${plants.length !== 1 ? 's' : ''} found for "${query}"</span>
        </div>
        <div class="results-grid">
            ${plants.map(plant => createPlantCard(plant)).join('')}
        </div>
    `;

    searchResults.innerHTML = resultsHTML;
    searchResults.classList.add('active');

    // Add click handlers to results
    document.querySelectorAll('.plant-card').forEach((item, index) => {
        item.addEventListener('click', () => {
            handlePlantClick(plants[index]);
        });
    });
}

function createPlantCard(plant) {
    // Use a better placeholder if no image
    const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23667eea" width="300" height="200"/%3E%3Ctext fill="white" font-family="Arial" font-size="18" x="50%25" y="45%25" text-anchor="middle"%3E🌿%3C/text%3E%3Ctext fill="white" font-family="Arial" font-size="14" x="50%25" y="60%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    const imageSrc = plant.image && plant.image.trim() !== '' ? plant.image : placeholderImage;
    
    return `
        <div class="plant-card" data-plant-id="${plant.id}">
            <div class="plant-card-image">
                <img src="${imageSrc}" 
                     alt="${plant.name}"
                     onerror="this.src='${placeholderImage}'">
            </div>
            <div class="plant-card-content">
                <h4 class="plant-card-title">${plant.name}</h4>
                ${plant.scientificName ? `<p class="plant-card-scientific">${plant.scientificName}</p>` : ''}
            </div>
        </div>
    `;
}

function showLoading() {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = `
        <div class="search-loading">
            <div class="loading-spinner"></div>
            <p>Searching for plants...</p>
        </div>
    `;
}

function showError(message) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = `
        <div class="search-error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>${message}</p>
        </div>
    `;
    searchResults.classList.add('active');
}

function showEmpty(query) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = `
        <div class="search-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No plants found</h3>
            <p>No results for "${query}". Try different keywords like "tomato", "basil", or "rose".</p>
        </div>
    `;
    searchResults.classList.add('active');
}

function handlePlantClick(plant) {
    console.log('Plant clicked:', plant);
    
    // Show detailed plant modal
    showPlantModal(plant);
    
    // Close search results
    document.getElementById('searchResults').classList.remove('active');
}

function showPlantModal(plant) {
    // Generate YouTube search query
    const youtubeQuery = encodeURIComponent(`how to grow ${plant.name} plant guide`);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${youtubeQuery}`;
    
    // Create modal HTML with comprehensive information
    const modalHTML = `
        <div class="modal-overlay plant-modal active" id="plantDetailModal">
            <div class="modal-dialog" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>🌱 ${plant.name}</h3>
                    <button class="modal-close" onclick="closePlantModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; gap: 24px;">
                        <!-- Plant Image -->
                        <img src="${plant.image || 'https://via.placeholder.com/600x300?text=Plant'}" 
                             alt="${plant.name}" 
                             style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px;"
                             onerror="this.src='https://via.placeholder.com/600x300?text=Plant'">
                        
                        ${plant.scientificName ? `<p style="font-style: italic; color: #6b7280; font-size: 1.1rem;"><strong>Scientific Name:</strong> ${plant.scientificName}</p>` : ''}
                        
                        <!-- Description Section -->
                        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border-left: 4px solid #4CAF50;">
                            <h4 style="margin: 0 0 12px 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">📖</span> Description
                            </h4>
                            <p style="line-height: 1.8; color: #4b5563; margin: 0;">${plant.description || 'No description available.'}</p>
                        </div>

                        <!-- Growing Conditions Grid -->
                        <div>
                            <h4 style="margin-bottom: 16px; color: #1f2937; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">🌤️</span> Growing Conditions & Requirements
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <div style="padding: 20px; background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-radius: 12px; border: 2px solid #fed7aa;">
                                    <div style="font-size: 2rem; margin-bottom: 8px;">☀️</div>
                                    <strong style="color: #374151; display: block; margin-bottom: 4px;">Sunlight</strong>
                                    <p style="margin: 0; color: #4b5563; font-size: 0.95rem;">${Array.isArray(plant.sunlight) && plant.sunlight.length > 0 ? plant.sunlight.join(', ') : 'Moderate sunlight'}</p>
                                </div>
                                <div style="padding: 20px; background: linear-gradient(135deg, #dbeafe 0%, #ffffff 100%); border-radius: 12px; border: 2px solid #93c5fd;">
                                    <div style="font-size: 2rem; margin-bottom: 8px;">💧</div>
                                    <strong style="color: #374151; display: block; margin-bottom: 4px;">Watering</strong>
                                    <p style="margin: 0; color: #4b5563; font-size: 0.95rem;">${plant.watering || 'Moderate'}</p>
                                </div>
                                <div style="padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-radius: 12px; border: 2px solid #86efac;">
                                    <div style="font-size: 2rem; margin-bottom: 8px;">🔄</div>
                                    <strong style="color: #374151; display: block; margin-bottom: 4px;">Life Cycle</strong>
                                    <p style="margin: 0; color: #4b5563; font-size: 0.95rem;">${plant.cycle || 'N/A'}</p>
                                </div>
                                <div style="padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #ffffff 100%); border-radius: 12px; border: 2px solid #fde047;">
                                    <div style="font-size: 2rem; margin-bottom: 8px;">🌿</div>
                                    <strong style="color: #374151; display: block; margin-bottom: 4px;">Plant Type</strong>
                                    <p style="margin: 0; color: #4b5563; font-size: 0.95rem;">${plant.type || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Weather & Climate Guidance -->
                        <div style="background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%); padding: 20px; border-radius: 12px; border: 2px solid #7dd3fc;">
                            <h4 style="margin: 0 0 12px 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">🌡️</span> Weather & Climate Guidelines
                            </h4>
                            <div style="display: grid; gap: 12px;">
                                <p style="margin: 0; line-height: 1.6; color: #4b5563;">
                                    <strong>☀️ Best Season:</strong> ${getIdealSeason(plant)}
                                </p>
                                <p style="margin: 0; line-height: 1.6; color: #4b5563;">
                                    <strong>🌡️ Temperature Range:</strong> ${getTemperatureRange(plant)}
                                </p>
                                <p style="margin: 0; line-height: 1.6; color: #4b5563;">
                                    <strong>💨 Wind Tolerance:</strong> ${getWindTolerance(plant)}
                                </p>
                                <p style="margin: 0; line-height: 1.6; color: #4b5563;">
                                    <strong>🌧️ Rainfall Needs:</strong> ${getRainfallNeeds(plant)}
                                </p>
                            </div>
                        </div>

                        <!-- Care Instructions -->
                        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <h4 style="margin: 0 0 12px 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">✨</span> Care Instructions
                            </h4>
                            <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #4b5563;">
                                ${getCareInstructions(plant)}
                            </ul>
                        </div>

                        <!-- Special Features -->
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            ${plant.edible ? '<span style="padding: 10px 20px; background: linear-gradient(135deg, #dcfce7, #f0fdf4); color: #16a34a; border-radius: 25px; font-size: 0.95rem; font-weight: 600; border: 2px solid #86efac; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">🍴</span> Edible Plant</span>' : ''}
                            ${plant.medicinal ? '<span style="padding: 10px 20px; background: linear-gradient(135deg, #dbeafe, #eff6ff); color: #0284c7; border-radius: 25px; font-size: 0.95rem; font-weight: 600; border: 2px solid #7dd3fc; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">💊</span> Medicinal Properties</span>' : ''}
                            ${plant.indoor ? '<span style="padding: 10px 20px; background: linear-gradient(135deg, #fef3c7, #fefce8); color: #d97706; border-radius: 25px; font-size: 0.95rem; font-weight: 600; border: 2px solid #fde047; display: flex; align-items: center; gap: 8px;"><span style="font-size: 1.2rem;">🏠</span> Indoor Suitable</span>' : ''}
                        </div>

                        <!-- YouTube Learning Section -->
                        <div style="background: linear-gradient(135deg, #fee2e2 0%, #ffffff 100%); padding: 20px; border-radius: 12px; border: 2px solid #fca5a5;">
                            <h4 style="margin: 0 0 12px 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">📺</span> Video Tutorials & Guides
                            </h4>
                            <p style="margin: 0 0 16px 0; color: #4b5563; line-height: 1.6;">
                                Learn how to grow and care for ${plant.name} with video tutorials from YouTube experts.
                            </p>
                            <a href="${youtubeSearchUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               style="display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);"
                               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(239, 68, 68, 0.4)';"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)';">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                Watch Growing Tutorials on YouTube
                            </a>
                        </div>
                    </div>

                    <div class="modal-actions" style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
                        <button class="btn-primary" onclick="addToGarden(${plant.id}, '${plant.name.replace(/'/g, "\\'")}')">
                            🌱 Add to My Garden
                        </button>
                        <button class="btn-cancel" onclick="closePlantModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('plantDetailModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close on overlay click
    document.getElementById('plantDetailModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closePlantModal();
        }
    });
}

// Helper function to get ideal growing season
function getIdealSeason(plant) {
    if (plant.cycle === 'Perennial') return 'Year-round (Spring planting recommended)';
    if (plant.cycle === 'Annual') return 'Spring to Summer';
    if (plant.cycle === 'Biennial') return 'Spring or Fall';
    return 'Spring to Summer (most suitable)';
}

// Helper function to get temperature range
function getTemperatureRange(plant) {
    if (plant.indoor) return '15-25°C (59-77°F) - Indoor friendly';
    if (plant.type === 'Cactus' || plant.type === 'Succulent') return '18-35°C (64-95°F) - Heat tolerant';
    return '15-30°C (59-86°F) - Moderate climate';
}

// Helper function to get wind tolerance
function getWindTolerance(plant) {
    if (plant.indoor) return 'Protected indoor environment preferred';
    if (plant.type === 'Tree' || plant.type === 'Shrub') return 'High wind tolerance';
    return 'Moderate - shelter from strong winds recommended';
}

// Helper function to get rainfall needs
function getRainfallNeeds(plant) {
    const watering = plant.watering?.toLowerCase() || 'moderate';
    if (watering.includes('frequent')) return 'High - consistent moisture needed (500-750mm annually)';
    if (watering.includes('minimum') || watering.includes('rare')) return 'Low - drought tolerant (200-400mm annually)';
    return 'Moderate - regular watering (400-600mm annually)';
}

// Helper function to get care instructions
function getCareInstructions(plant) {
    const instructions = [];
    
    // Watering instructions
    const watering = plant.watering?.toLowerCase() || 'moderate';
    if (watering.includes('frequent')) {
        instructions.push('<li><strong>💧 Watering:</strong> Water regularly, keep soil consistently moist but not waterlogged. Check soil daily.</li>');
    } else if (watering.includes('minimum')) {
        instructions.push('<li><strong>💧 Watering:</strong> Water sparingly, allow soil to dry between waterings. Once every 1-2 weeks.</li>');
    } else {
        instructions.push('<li><strong>💧 Watering:</strong> Water when top inch of soil feels dry. Usually 2-3 times per week.</li>');
    }
    
    // Sunlight instructions
    if (plant.sunlight && Array.isArray(plant.sunlight)) {
        const sunlightStr = plant.sunlight.join(', ');
        instructions.push(`<li><strong>☀️ Light Requirements:</strong> Provide ${sunlightStr} conditions. Rotate plant weekly for even growth.</li>`);
    }
    
    // Fertilizer
    instructions.push('<li><strong>🌱 Fertilizing:</strong> Feed with balanced fertilizer every 2-4 weeks during growing season (spring-summer).</li>');
    
    // Pruning
    instructions.push('<li><strong>✂️ Pruning:</strong> Remove dead or yellowing leaves regularly. Trim to maintain shape and encourage growth.</li>');
    
    // Pest control
    instructions.push('<li><strong>🐛 Pest Control:</strong> Inspect regularly for pests. Use neem oil or insecticidal soap if needed.</li>');
    
    // Soil
    if (plant.type === 'Cactus' || plant.type === 'Succulent') {
        instructions.push('<li><strong>🌍 Soil:</strong> Use well-draining cactus/succulent mix. Add perlite or sand for better drainage.</li>');
    } else {
        instructions.push('<li><strong>🌍 Soil:</strong> Use well-draining, nutrient-rich potting soil. Add compost for organic matter.</li>');
    }
    
    return instructions.join('');
}

function closePlantModal() {
    const modal = document.getElementById('plantDetailModal');
    if (modal) {
        modal.remove();
    }
}

function addToGarden(plantId, plantName) {
    // This will integrate with your database
    console.log('Adding plant to garden:', plantId, plantName);
    
    // Show success message
    showNotification(`${plantName} added to your garden! 🌱`, 'success');
    
    // Close modal
    closePlantModal();
    
    // TODO: Save to database using UrbanGardenDB
    // const db = new UrbanGardenDB();
    // db.add('userPlants', { name: plantName, plantId: plantId, ... });
}

function showNotification(message, type = 'info') {
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

// Make functions globally available
window.closePlantModal = closePlantModal;
window.addToGarden = addToGarden;

// API Key Configuration
// You can set your API key here or through the console
window.setPlantAPIKey = function(apiKey) {
    if (typeof plantSearchAPI !== 'undefined') {
        plantSearchAPI.setApiKey(apiKey);
        console.log('✅ Plant API key has been set!');
        showNotification('API key configured successfully!', 'success');
    }
};

// Instructions for setting API key
console.log('%c🌱 Urban Gardening Plant Search', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
console.log('%cTo use the Plant API, set your API key:', 'color: #666; font-size: 12px;');
console.log('%csetPlantAPIKey("sk-rvSg69245eee9c35b9917")', 'color: #2196F3; font-size: 14px; font-family: monospace;');
console.log('%c\nCurrently using mock data. Get a free API key from:', 'color: #666; font-size: 12px;');
console.log('%c- Perenual: https://perenual.com/docs/api', 'color: #4CAF50; font-size: 12px;');
console.log('%c- Trefle: https://trefle.io', 'color: #4CAF50; font-size: 12px;');
