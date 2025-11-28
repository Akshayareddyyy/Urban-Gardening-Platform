// Login Form JavaScript
class LoginHandler {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitBtn = document.querySelector('.sign-in-btn');
        this.googleBtn = document.querySelector('.google-btn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedEmail();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.googleBtn.addEventListener('click', () => this.handleGoogleLogin());
        
        // Add input validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        
        // Show/hide password functionality
        this.addPasswordToggle();
    }

    loadSavedEmail() {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            this.emailInput.value = savedEmail;
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(this.emailInput, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(this.emailInput);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showFieldError(this.passwordInput, 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showFieldError(this.passwordInput, 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearFieldError(this.passwordInput);
        return true;
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call
            await this.simulateLogin();
            
            // Save email for next time
            localStorage.setItem('rememberedEmail', this.emailInput.value.trim());
            
            // Redirect to dashboard
            this.redirectToDashboard();
            
        } catch (error) {
            this.showError('Invalid email or password. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Call backend API
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Save user session with token
        localStorage.setItem('userSession', JSON.stringify({
            email: data.user.email,
            name: data.user.name,
            userId: data.user.id,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        }));
        
        // Save auth token
        localStorage.setItem('authToken', data.token);
        
        return true;
    }

    handleGoogleLogin() {
        // In a real app, this would integrate with Google OAuth
        this.showInfo('Google login would be implemented here with OAuth integration.');
        
        // For demo purposes, simulate successful Google login
        setTimeout(() => {
            localStorage.setItem('userSession', JSON.stringify({
                email: 'user@gmail.com',
                loginTime: new Date().toISOString(),
                isLoggedIn: true,
                provider: 'google'
            }));
            this.redirectToDashboard();
        }, 1000);
    }

    redirectToDashboard() {
        // Show success message
        this.showSuccess('Login successful! Redirecting...');
        
        // Redirect after a brief delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    setLoadingState(isLoading) {
        this.submitBtn.disabled = isLoading;
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.textContent = 'Signing In...';
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Sign In';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        // Set background color based on type
        switch (type) {
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#3b82f6';
                break;
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    addPasswordToggle() {
        const passwordGroup = this.passwordInput.closest('.form-group');
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            opacity: 0.6;
        `;

        // Make password input container relative
        passwordGroup.style.position = 'relative';
        this.passwordInput.style.paddingRight = '45px';
        
        passwordGroup.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            if (this.passwordInput.type === 'password') {
                this.passwordInput.type = 'text';
                toggleBtn.innerHTML = '🙈';
            } else {
                this.passwordInput.type = 'password';
                toggleBtn.innerHTML = '👁️';
            }
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-group.error input {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 4px;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginHandler();
});