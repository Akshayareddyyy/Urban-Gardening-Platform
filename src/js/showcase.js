// Showcase Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initShowcaseForm();
    loadShowcasePosts();
    initFileUpload();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
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

// File upload functionality
function initFileUpload() {
    const fileInput = document.getElementById('plantImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (fileInput && imagePreview) {
        // Click to upload
        imagePreview.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.innerHTML = `
                            <img src="${e.target.result}" alt="Plant preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                            <button type="button" class="remove-image" onclick="removeImage()" style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 20px; line-height: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">×</button>
                        `;
                        imagePreview.style.position = 'relative';
                    };
                    reader.readAsDataURL(file);
                } else {
                    showToast('errorToast', 'Invalid File', 'Please select a valid image file.');
                    fileInput.value = '';
                }
            }
        });
        
        // Drag and drop
        imagePreview.addEventListener('dragover', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = '#4CAF50';
            imagePreview.style.backgroundColor = 'rgba(76, 175, 80, 0.05)';
        });
        
        imagePreview.addEventListener('dragleave', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = '';
            imagePreview.style.backgroundColor = '';
        });
        
        imagePreview.addEventListener('drop', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = '';
            imagePreview.style.backgroundColor = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }
}

// Remove image preview
function removeImage() {
    const fileInput = document.getElementById('plantImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (fileInput) fileInput.value = '';
    if (imagePreview) {
        imagePreview.innerHTML = `
            <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            <span>Click to upload or drag and drop</span>
        `;
        imagePreview.style.position = '';
    }
}

// Showcase form functionality
function initShowcaseForm() {
    const form = document.getElementById('showcaseForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateShowcaseForm()) return;
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            const post = createPostFromForm();
            addPostToStorage(post);
            
            // Simply add the new post to the top without reloading all posts
            const postsGrid = document.getElementById('postsGrid');
            const galleryLoading = document.getElementById('galleryLoading');
            const emptyState = document.getElementById('emptyState');
            
            if (postsGrid) {
                postsGrid.style.display = 'grid';
            }
            if (galleryLoading) galleryLoading.style.display = 'none';
            if (emptyState) emptyState.style.display = 'none';
            
            // Add only the new post
            displayPost(post);
            
            form.reset();
            removeImage();
            
            showToast('successToast', 'Post Shared!', 'Your plant showcase has been shared with the community.');
            
            btnText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
            
            // Scroll to the new post
            setTimeout(() => {
                const newPostElement = postsGrid.querySelector(`[data-post-id="${post.id}"]`);
                if (newPostElement) {
                    newPostElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }, 1000);
    });
}

// Validate showcase form
function validateShowcaseForm() {
    let isValid = true;
    
    const plantName = document.getElementById('plantName');
    const plantNameError = document.getElementById('plantNameError');
    if (!plantName.value.trim()) {
        showFormError(plantNameError, 'Plant name is required.');
        isValid = false;
    } else {
        hideFormError(plantNameError);
    }
    
    const plantImage = document.getElementById('plantImage');
    const imageError = document.getElementById('imageError');
    if (!plantImage.files || plantImage.files.length === 0) {
        showFormError(imageError, 'Please upload a plant photo.');
        isValid = false;
    } else {
        hideFormError(imageError);
    }
    
    const description = document.getElementById('description');
    const descriptionError = document.getElementById('descriptionError');
    if (!description.value.trim()) {
        showFormError(descriptionError, 'Success story is required.');
        isValid = false;
    } else if (description.value.trim().length < 10) {
        showFormError(descriptionError, 'Success story must be at least 10 characters long.');
        isValid = false;
    } else {
        hideFormError(descriptionError);
    }
    
    return isValid;
}

// Create post from form data
function createPostFromForm() {
    const plantName = document.getElementById('plantName').value.trim();
    const description = document.getElementById('description').value.trim();
    const imagePreview = document.getElementById('imagePreview');
    
    let imageUrl = null;
    const img = imagePreview.querySelector('img');
    if (img) {
        imageUrl = img.src;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    return {
        id: Date.now(),
        plantName,
        description,
        imageUrl,
        author: currentUser.name || 'Anonymous Gardener',
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
}

// Add post to storage
function addPostToStorage(post) {
    const posts = JSON.parse(localStorage.getItem('showcasePosts') || '[]');
    posts.unshift(post);
    localStorage.setItem('showcasePosts', JSON.stringify(posts));
}

// Load showcase posts
function loadShowcasePosts() {
    const posts = getShowcasePosts();
    const postsGrid = document.getElementById('postsGrid');
    const galleryLoading = document.getElementById('galleryLoading');
    const emptyState = document.getElementById('emptyState');
    
    // Hide loading
    if (galleryLoading) galleryLoading.style.display = 'none';
    
    if (posts.length === 0) {
        // Show empty state
        if (emptyState) emptyState.style.display = 'flex';
        if (postsGrid) postsGrid.style.display = 'none';
    } else {
        // Show posts grid
        if (emptyState) emptyState.style.display = 'none';
        if (postsGrid) {
            postsGrid.style.display = 'grid';
            // Only clear and reload if grid is empty
            if (postsGrid.innerHTML.trim() === '') {
                posts.forEach(post => displayPost(post));
            }
        }
    }
}

// Get showcase posts from storage
function getShowcasePosts() {
    return JSON.parse(localStorage.getItem('showcasePosts') || '[]');
}

// Display a post
function displayPost(post) {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    // Check if post already exists
    const existingPost = postsGrid.querySelector(`[data-post-id="${post.id}"]`);
    if (existingPost) {
        return; // Don't add duplicate
    }
    
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.dataset.postId = post.id;
    postElement.innerHTML = `
        <div class="post-header">
            <div class="author-info">
                <div class="author-avatar">🌱</div>
                <div class="author-details">
                    <h4 class="author-name">${post.author}</h4>
                    <span class="post-time">${formatTimeAgo(post.timestamp)}</span>
                </div>
            </div>
        </div>
        
        ${post.imageUrl ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.plantName}"></div>` : ''}
        
        <div class="post-content">
            <h3 class="plant-name">${post.plantName}</h3>
            <p class="plant-description">${post.description}</p>
        </div>
        
        <div class="post-actions">
            <button class="action-btn like-btn" onclick="likePost(${post.id})">
                <span class="action-icon">❤️</span>
                <span class="action-count">${post.likes}</span>
            </button>
            <button class="action-btn comment-btn" onclick="showComments(${post.id})">
                <span class="action-icon">💬</span>
                <span class="action-count">${post.comments.length}</span>
            </button>
            <button class="action-btn share-btn" onclick="sharePost(${post.id})">
                <span class="action-icon">📤</span>
                <span class="action-text">Share</span>
            </button>
        </div>
    `;
    
    // Add with animation
    postElement.style.opacity = '0';
    postElement.style.transform = 'translateY(20px)';
    postsGrid.insertBefore(postElement, postsGrid.firstChild);
    
    setTimeout(() => {
        postElement.style.transition = 'all 0.5s ease';
        postElement.style.opacity = '1';
        postElement.style.transform = 'translateY(0)';
    }, 10);
}

// Create sample posts
function createSamplePosts() {
    return [
        {
            id: 1001,
            plantName: 'Cherry Tomatoes',
            description: 'My first successful tomato harvest! Started from seeds 3 months ago and now enjoying fresh tomatoes daily.',
            plantAge: '3 months',
            difficulty: 'intermediate',
            tips: 'Regular watering and support stakes are key for heavy fruit production.',
            imageUrl: null,
            author: 'Sarah Green',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 12,
            comments: []
        },
        {
            id: 1002,
            plantName: 'Snake Plant',
            description: 'This resilient beauty has been thriving in my low-light apartment for over a year. Perfect for beginners!',
            plantAge: '1 year',
            difficulty: 'beginner',
            tips: 'Water only when soil is completely dry. Less is more with snake plants!',
            imageUrl: null,
            author: 'Mike Chen',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes: 8,
            comments: []
        },
        {
            id: 1003,
            plantName: 'Basil Garden',
            description: 'Started a small herb garden on my balcony. The basil is growing so fast I can barely keep up with harvesting!',
            plantAge: '6 weeks',
            difficulty: 'beginner',
            tips: 'Pinch flowers to keep leaves tender and encourage bushier growth.',
            imageUrl: null,
            author: 'Emma Rodriguez',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            likes: 15,
            comments: []
        }
    ];
}

// Like post
function likePost(postId) {
    const posts = getShowcasePosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.likes += 1;
        localStorage.setItem('showcasePosts', JSON.stringify(posts));
        
        // Update the display
        const likeBtn = event.target.closest('.like-btn');
        const countElement = likeBtn.querySelector('.action-count');
        if (countElement) {
            countElement.textContent = post.likes;
        }
        
        // Add animation
        likeBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

// Show comments (placeholder)
function showComments(postId) {
    showToast('infoToast', 'Coming Soon', 'Comment functionality will be available in the next update!');
}

// Share post (placeholder)
function sharePost(postId) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this plant showcase!',
            text: 'Look at this amazing plant growth story.',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('successToast', 'Link Copied!', 'Share link has been copied to your clipboard.');
    }
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
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
    // Create toast if it doesn't exist
    let toast = document.getElementById(toastId);
    if (!toast) {
        toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<strong>${title}</strong><br>${message}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}