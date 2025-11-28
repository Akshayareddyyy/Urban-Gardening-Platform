// Enhanced Plant Ideas Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSuggestionForm();
    initCultivationForm();
    initProgressSteps();
    initFormAnimations();
});

// Enhanced Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    // Mobile menu toggle with enhanced animation
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Add ripple effect
            createRippleEffect(hamburger);
        });
    }
    
    // Scroll effect for navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });
    
    // Enhanced nav link interactions
    navLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', function() {
            this.style.animationDelay = '0s';
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'linkHover 0.3s ease-out forwards';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.animation = 'linkLeave 0.3s ease-out forwards';
        });
        
        link.addEventListener('click', function(e) {
            // Add click ripple effect
            createRippleEffect(this);
        });
    });
    
    // Logo hover effect
    const logo = document.querySelector('.nav-brand h2');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animation = 'logoWobble 0.6s ease-in-out';
        });
        
        logo.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    }
    
    // Logout functionality with enhanced confirmation
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showEnhancedConfirm('Are you sure you want to logout?', function() {
                localStorage.removeItem('currentUser');
                window.location.href = '../../landing.html';
            });
        });
    }
}

// Create ripple effect for interactive elements
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(76, 175, 80, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    // Ensure element has relative position
    const originalPosition = element.style.position;
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
        element.style.position = originalPosition;
    }, 600);
}

// Enhanced confirmation dialog
function showEnhancedConfirm(message, callback) {
    // Create custom modal instead of browser confirm
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-overlay"></div>
        <div class="confirm-dialog">
            <div class="confirm-content">
                <div class="confirm-icon">⚠️</div>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn cancel">Cancel</button>
                    <button class="confirm-btn confirm">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        .confirm-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        .confirm-dialog {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            animation: modalSlideIn 0.3s ease-out forwards;
        }
        .confirm-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
            min-width: 300px;
        }
        .confirm-icon {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        .confirm-content p {
            margin-bottom: 20px;
            color: #374151;
            font-size: 1.1rem;
        }
        .confirm-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .confirm-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .confirm-btn.cancel {
            background: #e5e7eb;
            color: #374151;
        }
        .confirm-btn.cancel:hover {
            background: #d1d5db;
        }
        .confirm-btn.confirm {
            background: #4CAF50;
            color: white;
        }
        .confirm-btn.confirm:hover {
            background: #45a049;
            transform: translateY(-1px);
        }
        @keyframes modalSlideIn {
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Handle button clicks
    modal.querySelector('.cancel').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.confirm').addEventListener('click', () => {
        modal.remove();
        style.remove();
        callback();
    });
    
    // Close on overlay click
    modal.querySelector('.confirm-overlay').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
}

// Progress steps functionality
function initProgressSteps() {
    updateProgressStep(1); // Start with step 1 active
}

function updateProgressStep(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Form animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .select-wrapper select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add floating label effect
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Suggestion form functionality
function initSuggestionForm() {
    const form = document.getElementById('suggestionForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateSuggestionForm()) return;
        
        const submitBtn = document.getElementById('suggestionSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading
        setLoadingState(true);
        submitBtn.disabled = true;
        
        // Update progress to step 2
        updateProgressStep(2);
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        
        try {
            await simulateAIResponse();
            const suggestions = generateMockSuggestions();
            displaySuggestions(suggestions);
            showToast('successToast', 'Plant Suggestions Ready!', `We found ${suggestions.length} plant ideas for you.`);
            showCultivationSection();
        } catch (error) {
            showError('suggestionError', error.message);
        } finally {
            setLoadingState(false);
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
    
    // Refresh suggestions
    const refreshBtn = document.getElementById('refreshSuggestions');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const suggestions = generateMockSuggestions();
            displaySuggestions(suggestions);
        });
    }
}

// Cultivation form functionality
function initCultivationForm() {
    const form = document.getElementById('cultivationForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const plantName = document.getElementById('plantName').value.trim();
        if (!plantName) {
            showFormError(document.getElementById('plantNameError'), 'Plant name is required.');
            return;
        }
        
        const submitBtn = document.getElementById('cultivationSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading
        showElement(document.getElementById('cultivationLoading'));
        hideElement(document.getElementById('cultivationError'));
        hideElement(document.getElementById('cultivationGuide'));
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        
        try {
            await simulateAIResponse();
            const guide = generateMockCultivationGuide(plantName);
            displayCultivationGuide(guide);
            showToast('successToast', 'Cultivation Guide Ready!', `Displaying guide for ${plantName}.`);
        } catch (error) {
            showError('cultivationError', error.message);
        } finally {
            hideElement(document.getElementById('cultivationLoading'));
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
}

// Validate suggestion form
function validateSuggestionForm() {
    let isValid = true;
    
    const spaceDescription = document.getElementById('spaceDescription');
    const spaceError = document.getElementById('spaceError');
    if (!spaceDescription.value.trim()) {
        showFormError(spaceError, 'Space description is required.');
        isValid = false;
    } else {
        hideFormError(spaceError);
    }
    
    const climateDescription = document.getElementById('climateDescription');
    const climateError = document.getElementById('climateError');
    if (!climateDescription.value.trim()) {
        showFormError(climateError, 'Climate description is required.');
        isValid = false;
    } else {
        hideFormError(climateError);
    }
    
    return isValid;
}

// Generate mock suggestions
function generateMockSuggestions() {
    const suggestions = [
        {
            name: 'Basil',
            emoji: '🌿',
            description: 'Perfect for sunny windowsills and beginner gardeners. Grows quickly and provides fresh herbs for cooking.',
            difficulty: 'Beginner',
            sunlight: 'Full Sun',
            water: 'Moderate',
            space: 'Small Pot'
        },
        {
            name: 'Cherry Tomatoes',
            emoji: '🍅',
            description: 'Compact variety ideal for containers. Produces abundant small, sweet tomatoes throughout the growing season.',
            difficulty: 'Intermediate',
            sunlight: 'Full Sun',
            water: 'Regular',
            space: 'Medium Pot'
        },
        {
            name: 'Pothos',
            emoji: '🌱',
            description: 'Low-maintenance houseplant that thrives in various light conditions. Great air purifier and very forgiving.',
            difficulty: 'Beginner',
            sunlight: 'Low to Bright',
            water: 'Low',
            space: 'Hanging Basket'
        },
        {
            name: 'Lettuce',
            emoji: '🥬',
            description: 'Fast-growing leafy green perfect for continuous harvesting. Ideal for hydroponic systems or containers.',
            difficulty: 'Beginner',
            sunlight: 'Partial Sun',
            water: 'Regular',
            space: 'Wide Pot'
        }
    ];
    
    // Randomize order
    return suggestions.sort(() => Math.random() - 0.5);
}

// Display suggestions
function displaySuggestions(suggestions) {
    const suggestionsGrid = document.getElementById('suggestionsGrid');
    const suggestionsResults = document.getElementById('suggestionsResults');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (suggestions.length > 0) {
        suggestionsGrid.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-card">
                <div class="plant-name">
                    <span class="plant-emoji">${suggestion.emoji}</span>
                    ${suggestion.name}
                </div>
                <p class="plant-description">${suggestion.description}</p>
                <div class="plant-details">
                    <div class="detail-item">
                        <span class="detail-icon">📊</span>
                        ${suggestion.difficulty}
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">☀️</span>
                        ${suggestion.sunlight}
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">💧</span>
                        ${suggestion.water}
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🏺</span>
                        ${suggestion.space}
                    </div>
                </div>
            </div>
        `).join('');
        
        showElement(suggestionsResults);
        hideElement(welcomeMessage);
        
        // Update progress to step 3 - results shown
        updateProgressStep(3);
        
        // Pre-fill first suggestion in cultivation form
        if (suggestions[0]) {
            document.getElementById('plantName').value = suggestions[0].name;
        }
    }
}

// Generate mock cultivation guide
function generateMockCultivationGuide(plantName) {
    return {
        plantName: plantName,
        description: `Complete growing guide for ${plantName}`,
        sections: [
            {
                title: 'Getting Started',
                icon: '🌱',
                content: `Start ${plantName} from seeds or seedlings in well-draining soil. Choose a location with appropriate lighting conditions.`
            },
            {
                title: 'Light Requirements',
                icon: '☀️',
                content: `${plantName} thrives in bright, indirect light. Avoid direct harsh sunlight which can scorch the leaves.`
            },
            {
                title: 'Watering Schedule',
                icon: '💧',
                content: `Water when the top inch of soil feels dry. Ensure good drainage to prevent root rot.`
            },
            {
                title: 'Fertilizing',
                icon: '🌿',
                content: `Feed with balanced liquid fertilizer every 2-4 weeks during growing season.`
            },
            {
                title: 'Common Issues',
                icon: '🔧',
                content: `Watch for yellowing leaves (overwatering) or brown tips (underwatering or low humidity).`
            }
        ]
    };
}

// Display cultivation guide
function displayCultivationGuide(guide) {
    const cultivationGuide = document.getElementById('cultivationGuide');
    
    cultivationGuide.innerHTML = `
        <div class="guide-header">
            <h3 class="guide-plant-name">${guide.plantName}</h3>
            <p class="guide-plant-description">${guide.description}</p>
        </div>
        <div class="guide-sections">
            ${guide.sections.map(section => `
                <div class="guide-section">
                    <h3>
                        <span class="guide-section-icon">${section.icon}</span>
                        ${section.title}
                    </h3>
                    <p>${section.content}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    showElement(cultivationGuide);
}

// Show cultivation section
function showCultivationSection() {
    const cultivationSection = document.getElementById('cultivationSection');
    showElement(cultivationSection);
}

// Set loading state
function setLoadingState(isLoading) {
    const elements = {
        loading: document.getElementById('suggestionLoading'),
        error: document.getElementById('suggestionError'),
        results: document.getElementById('suggestionsResults'),
        empty: document.getElementById('emptySuggestions'),
        welcome: document.getElementById('welcomeMessage')
    };
    
    if (isLoading) {
        showElement(elements.loading);
        hideElement(elements.error);
        hideElement(elements.results);
        hideElement(elements.empty);
        hideElement(elements.welcome);
    } else {
        hideElement(elements.loading);
    }
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

// Simulate AI response
function simulateAIResponse() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('AI service temporarily unavailable'));
            }
        }, 2000);
    });
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
    }, 4000);
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
        element.style.display = 'flex';
    }
}

function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}