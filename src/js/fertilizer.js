// Fertilizer Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFertilizerForm();
    initCalculators();
});

// Validate fertilizer form
function validateFertilizerForm() {
    const plantType = document.getElementById('plantType');
    const plantTypeError = document.getElementById('plantTypeError');
    
    // Clear previous errors
    if (plantTypeError) {
        hideFormError(plantTypeError);
    }
    
    // Validate plant type
    if (!plantType || !plantType.value.trim()) {
        if (plantTypeError) {
            showFormError(plantTypeError, 'Please enter a plant type');
        }
        if (plantType) {
            plantType.focus();
        }
        return false;
    }
    
    return true;
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = '../../landing.html';
            }
        });
    }
}

// Fertilizer form functionality
function initFertilizerForm() {
    const form = document.getElementById('fertilizerForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateFertilizerForm()) return;
        
        const submitBtn = document.getElementById('fertilizerSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading
        showElement(document.getElementById('fertilizerLoading'));
        hideElement(document.getElementById('fertilizerError'));
        hideElement(document.getElementById('fertilizerResults'));
        hideElement(document.getElementById('emptyFertilizer'));
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        
        try {
            await simulateAnalysis();
            const recommendations = generateFertilizerRecommendations();
            displayRecommendations(recommendations);
            showToast('successToast', 'Recommendations Ready!', 'Your fertilizer analysis is complete.');
        } catch (error) {
            showError('fertilizerError', error.message);
        } finally {
            hideElement(document.getElementById('fertilizerLoading'));
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
}

// Initialize NPK calculator
function initCalculators() {
    const npkCalculator = document.getElementById('npkCalculator');
    const npkResults = document.getElementById('npkResults');
    
    if (npkCalculator) {
        npkCalculator.addEventListener('click', function() {
            const plantType = document.getElementById('plantType').value;
            const growthStage = document.getElementById('growthStage').value;
            
            if (plantType && growthStage) {
                const npkRatio = calculateNPKRatio(plantType, growthStage);
                displayNPKResults(npkRatio);
                showElement(npkResults);
            } else {
                hideElement(npkResults);
            }
        });
    }
    
    // Auto-calculate when inputs change
    const plantTypeSelect = document.getElementById('plantType');
    const growthStageSelect = document.getElementById('growthStage');
    
    if (plantTypeSelect && growthStageSelect) {
        [plantTypeSelect, growthStageSelect].forEach(select => {
            select.addEventListener('change', function() {
                if (plantTypeSelect.value && growthStageSelect.value) {
                    const npkRatio = calculateNPKRatio(plantTypeSelect.value, growthStageSelect.value);
                    displayNPKResults(npkRatio);
                    showElement(npkResults);
                }
            });
        });
    }
}

// Calculate NPK ratio
function calculateNPKRatio(plantType, growthStage) {
    // Determine category from plant type
    let category = 'vegetables'; // default
    
    const plantTypeLower = plantType.toLowerCase();
    
    if (plantTypeLower.includes('tomato') || plantTypeLower.includes('pepper') || 
        plantTypeLower.includes('cucumber') || plantTypeLower.includes('lettuce') ||
        plantTypeLower.includes('vegetable') || plantTypeLower.includes('carrot') ||
        plantTypeLower.includes('broccoli') || plantTypeLower.includes('cabbage')) {
        category = 'vegetables';
    } else if (plantTypeLower.includes('basil') || plantTypeLower.includes('mint') ||
               plantTypeLower.includes('herb') || plantTypeLower.includes('parsley') ||
               plantTypeLower.includes('cilantro') || plantTypeLower.includes('thyme') ||
               plantTypeLower.includes('rosemary') || plantTypeLower.includes('oregano')) {
        category = 'herbs';
    } else if (plantTypeLower.includes('rose') || plantTypeLower.includes('flower') ||
               plantTypeLower.includes('daisy') || plantTypeLower.includes('tulip') ||
               plantTypeLower.includes('orchid') || plantTypeLower.includes('lily') ||
               plantTypeLower.includes('sunflower') || plantTypeLower.includes('petunia')) {
        category = 'flowers';
    } else if (plantTypeLower.includes('strawberry') || plantTypeLower.includes('fruit') ||
               plantTypeLower.includes('blueberry') || plantTypeLower.includes('apple') ||
               plantTypeLower.includes('grape') || plantTypeLower.includes('citrus')) {
        category = 'fruits';
    } else if (plantTypeLower.includes('monstera') || plantTypeLower.includes('pothos') ||
               plantTypeLower.includes('snake') || plantTypeLower.includes('spider') ||
               plantTypeLower.includes('fern') || plantTypeLower.includes('philodendron') ||
               plantTypeLower.includes('succulent') || plantTypeLower.includes('cactus') ||
               plantTypeLower.includes('indoor')) {
        category = 'indoor';
    }
    
    const npkRatios = {
        'vegetables': {
            'seedling': { n: 15, p: 15, k: 15 },
            'vegetative': { n: 20, p: 10, k: 20 },
            'flowering': { n: 10, p: 20, k: 20 },
            'fruiting': { n: 5, p: 10, k: 15 },
            'maintenance': { n: 15, p: 10, k: 15 }
        },
        'herbs': {
            'seedling': { n: 10, p: 10, k: 10 },
            'vegetative': { n: 15, p: 8, k: 12 },
            'flowering': { n: 8, p: 12, k: 15 },
            'fruiting': { n: 5, p: 8, k: 10 },
            'maintenance': { n: 12, p: 8, k: 10 }
        },
        'flowers': {
            'seedling': { n: 12, p: 12, k: 12 },
            'vegetative': { n: 18, p: 12, k: 16 },
            'flowering': { n: 12, p: 18, k: 20 },
            'fruiting': { n: 8, p: 15, k: 18 },
            'maintenance': { n: 10, p: 15, k: 15 }
        },
        'fruits': {
            'seedling': { n: 12, p: 15, k: 12 },
            'vegetative': { n: 20, p: 12, k: 18 },
            'flowering': { n: 8, p: 20, k: 25 },
            'fruiting': { n: 5, p: 15, k: 30 },
            'maintenance': { n: 10, p: 15, k: 20 }
        },
        'indoor': {
            'seedling': { n: 8, p: 8, k: 8 },
            'vegetative': { n: 12, p: 6, k: 10 },
            'flowering': { n: 6, p: 12, k: 12 },
            'fruiting': { n: 4, p: 8, k: 10 },
            'maintenance': { n: 10, p: 6, k: 8 }
        }
    };
    
    return npkRatios[category] && npkRatios[category][growthStage] 
        ? npkRatios[category][growthStage] 
        : { n: 10, p: 10, k: 10 };
}

// Display NPK results
function displayNPKResults(npkRatio) {
    const npkDisplay = document.getElementById('npkDisplay');
    const npkExplanation = document.getElementById('npkExplanation');
    
    if (npkDisplay) {
        npkDisplay.innerHTML = `
            <div class="npk-values">
                <div class="npk-value nitrogen">
                    <span class="npk-number">${npkRatio.n}</span>
                    <span class="npk-label">N</span>
                </div>
                <div class="npk-separator">-</div>
                <div class="npk-value phosphorus">
                    <span class="npk-number">${npkRatio.p}</span>
                    <span class="npk-label">P</span>
                </div>
                <div class="npk-separator">-</div>
                <div class="npk-value potassium">
                    <span class="npk-number">${npkRatio.k}</span>
                    <span class="npk-label">K</span>
                </div>
            </div>
        `;
    }
    
    if (npkExplanation) {
        npkExplanation.innerHTML = `
            <p><strong>Recommended NPK Ratio:</strong> ${npkRatio.n}-${npkRatio.p}-${npkRatio.k}</p>
            <ul>
                <li><strong>Nitrogen (N):</strong> Promotes leaf and stem growth</li>
                <li><strong>Phosphorus (P):</strong> Supports root development and flowering</li>
                <li><strong>Potassium (K):</strong> Enhances disease resistance and fruit quality</li>
            </ul>
        `;
    }
}

// Generate fertilizer recommendations
function generateFertilizerRecommendations() {
    const plantType = document.getElementById('plantType').value.toLowerCase();
    const growthStage = document.getElementById('growthStage').value;
    const growingMedium = document.getElementById('growingMedium').value;
    const plantSize = document.getElementById('plantSize').value;
    const fertilizerPreference = document.getElementById('fertilizerPreference').value;
    
    const npkRatio = calculateNPKRatio(plantType, growthStage);
    
    return [
        {
            name: 'Organic Compost Blend',
            type: 'Organic',
            npk: `${Math.max(5, npkRatio.n - 5)}-${Math.max(3, npkRatio.p - 5)}-${Math.max(5, npkRatio.k - 5)}`,
            frequency: 'Every 4-6 weeks',
            amount: '2-3 tablespoons per plant',
            benefits: [
                'Improves soil structure',
                'Slow-release nutrients',
                'Enhances beneficial microorganisms'
            ],
            bestFor: 'Long-term soil health',
            price: '$12-18',
            sustainability: 'High'
        },
        {
            name: 'Balanced Liquid Fertilizer',
            type: 'Synthetic',
            npk: `${npkRatio.n}-${npkRatio.p}-${npkRatio.k}`,
            frequency: 'Every 2-3 weeks',
            amount: '1 tsp per gallon of water',
            benefits: [
                'Fast nutrient absorption',
                'Precise nutrient control',
                'Quick results visible'
            ],
            bestFor: 'Rapid growth phases',
            price: '$8-15',
            sustainability: 'Medium'
        },
        {
            name: 'Slow-Release Granules',
            type: 'Controlled Release',
            npk: `${npkRatio.n + 2}-${npkRatio.p + 1}-${npkRatio.k + 3}`,
            frequency: 'Every 3-4 months',
            amount: '1-2 tablespoons per plant',
            benefits: [
                'Long-lasting nutrition',
                'Reduced application frequency',
                'Weather-resistant coating'
            ],
            bestFor: 'Busy gardeners',
            price: '$15-25',
            sustainability: 'Medium'
        }
    ];
}

// Display recommendations
function displayRecommendations(recommendations) {
    const recommendationsGrid = document.getElementById('fertilizerGrid');
    const recommendationsContainer = document.getElementById('fertilizerResults');
    
    if (recommendations.length > 0) {
        recommendationsGrid.innerHTML = recommendations.map((rec, index) => `
            <div class="recommendation-card">
                <div class="rec-header">
                    <h3 class="rec-name">${rec.name}</h3>
                    <span class="rec-type ${rec.type.toLowerCase().replace(' ', '-')}">${rec.type}</span>
                </div>
                
                <div class="npk-ratio">
                    <span class="npk-label">NPK Ratio:</span>
                    <span class="npk-values">${rec.npk}</span>
                </div>
                
                <div class="rec-details">
                    <div class="detail-row">
                        <span class="detail-icon">📅</span>
                        <span class="detail-text">${rec.frequency}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">🥄</span>
                        <span class="detail-text">${rec.amount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">💰</span>
                        <span class="detail-text">${rec.price}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">🌱</span>
                        <span class="detail-text">Sustainability: ${rec.sustainability}</span>
                    </div>
                </div>
                
                <div class="rec-benefits">
                    <h4>Key Benefits:</h4>
                    <ul>
                        ${rec.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="rec-best-for">
                    <strong>Best For:</strong> ${rec.bestFor}
                </div>
                
                <button class="btn btn-primary select-fertilizer" data-index="${index}">
                    Select This Fertilizer
                </button>
            </div>
        `).join('');
        
        showElement(recommendationsContainer);
        
        // Add click handlers for selection
        const selectBtns = document.querySelectorAll('.select-fertilizer');
        selectBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                selectFertilizer(recommendations[index]);
            });
        });
    }
}

// Select fertilizer
function selectFertilizer(fertilizer) {
    showToast('successToast', 'Fertilizer Selected!', `You've chosen ${fertilizer.name}. Check your email for detailed application instructions.`);
    
    // Remove selection from other cards
    document.querySelectorAll('.recommendation-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.recommendation-card').classList.add('selected');
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Simulate analysis
function simulateAnalysis() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.05) {
                resolve();
            } else {
                reject(new Error('Analysis service temporarily unavailable'));
            }
        }, 2500);
    });
}

// Show error
function showError(errorId, message) {
    const errorContainer = document.getElementById(errorId);
    const errorMessage = document.getElementById(errorId + 'Message');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    showElement(errorContainer);
}

// Form error functions
function showFormError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideFormError(errorElement) {
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Toast functionality
function showToast(toastId, title, message) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    const titleElement = document.getElementById('successTitle') || toast.querySelector('strong');
    const messageElement = document.getElementById('successMessage') || toast.querySelector('span');
    
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;
    
    toast.style.display = 'flex';
    
    setTimeout(() => {
        hideToast(toastId);
    }, 5000);
}

function hideToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.display = 'none';
    }
}

// Utility functions
function showElement(element) {
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}