// Signup Form JavaScript
class SignupHandler {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.termsCheckbox = document.getElementById('terms');
        this.submitBtn = document.querySelector('.signup-btn');
        this.googleBtn = document.querySelector('.google-btn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addPasswordStrengthIndicator();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.googleBtn.addEventListener('click', () => this.handleGoogleSignup());
        
        // Add input validation
        this.firstNameInput.addEventListener('blur', () => this.validateFirstName());
        this.lastNameInput.addEventListener('blur', () => this.validateLastName());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        this.termsCheckbox.addEventListener('change', () => this.validateTerms());
        
        // Real-time validation
        this.passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        this.confirmPasswordInput.addEventListener('input', () => this.checkPasswordMatch());
    }

    validateFirstName() {
        const firstName = this.firstNameInput.value.trim();
        
        if (!firstName) {
            this.showFieldError(this.firstNameInput, 'First name is required');
            return false;
        }
        
        if (firstName.length < 2) {
            this.showFieldError(this.firstNameInput, 'First name must be at least 2 characters');
            return false;
        }
        
        this.clearFieldError(this.firstNameInput);
        return true;
    }

    validateLastName() {
        const lastName = this.lastNameInput.value.trim();
        
        if (!lastName) {
            this.showFieldError(this.lastNameInput, 'Last name is required');
            return false;
        }
        
        if (lastName.length < 2) {
            this.showFieldError(this.lastNameInput, 'Last name must be at least 2 characters');
            return false;
        }
        
        this.clearFieldError(this.lastNameInput);
        return true;
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
        
        if (password.length < 8) {
            this.showFieldError(this.passwordInput, 'Password must be at least 8 characters');
            return false;
        }
        
        // Check for at least one uppercase, one lowercase, and one number
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        if (!hasUpper || !hasLower || !hasNumber) {
            this.showFieldError(this.passwordInput, 'Password must contain uppercase, lowercase, and number');
            return false;
        }
        
        this.clearFieldError(this.passwordInput);
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (!confirmPassword) {
            this.showFieldError(this.confirmPasswordInput, 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showFieldError(this.confirmPasswordInput, 'Passwords do not match');
            return false;
        }
        
        this.clearFieldError(this.confirmPasswordInput);
        return true;
    }

    validateTerms() {
        if (!this.termsCheckbox.checked) {
            this.showFieldError(this.termsCheckbox, 'You must agree to the terms and conditions');
            return false;
        }
        
        this.clearFieldError(this.termsCheckbox);
        return true;
    }

    checkPasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError(this.confirmPasswordInput, 'Passwords do not match');
        } else if (confirmPassword && password === confirmPassword) {
            this.clearFieldError(this.confirmPasswordInput);
        }
    }

    updatePasswordStrength() {
        const password = this.passwordInput.value;
        const strengthIndicator = document.querySelector('.password-strength');
        
        if (!strengthIndicator) return;

        if (!password) {
            strengthIndicator.textContent = '';
            return;
        }

        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score++;
        else feedback.push('at least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) score++;
        else feedback.push('lowercase letter');

        // Number check
        if (/\d/.test(password)) score++;
        else feedback.push('number');

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        else feedback.push('special character');

        // Update indicator
        if (score < 2) {
            strengthIndicator.className = 'password-strength strength-weak';
            strengthIndicator.textContent = `Weak - Add: ${feedback.join(', ')}`;
        } else if (score < 4) {
            strengthIndicator.className = 'password-strength strength-medium';
            strengthIndicator.textContent = `Medium - Add: ${feedback.join(', ')}`;
        } else {
            strengthIndicator.className = 'password-strength strength-strong';
            strengthIndicator.textContent = 'Strong password ✓';
        }
    }

    addPasswordStrengthIndicator() {
        const passwordGroup = this.passwordInput.closest('.form-group');
        const strengthDiv = document.createElement('div');
        strengthDiv.className = 'password-strength';
        passwordGroup.appendChild(strengthDiv);
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.checkbox-group');
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
        const formGroup = input.closest('.form-group') || input.closest('.checkbox-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const validations = [
            this.validateFirstName(),
            this.validateLastName(),
            this.validateEmail(),
            this.validatePassword(),
            this.validateConfirmPassword(),
            this.validateTerms()
        ];
        
        const isValid = validations.every(validation => validation);
        
        if (!isValid) {
            this.showError('Please fix all errors before submitting');
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call
            await this.simulateSignup();
            
            // Show success and redirect
            this.showSuccess('Account created successfully! Redirecting to login...');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            this.showError('Failed to create account. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateSignup() {
        const name = `${this.firstNameInput.value.trim()} ${this.lastNameInput.value.trim()}`;
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Call backend API
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Signup failed');
        }
        
        return data.user;
    }

    handleGoogleSignup() {
        // In a real app, this would integrate with Google OAuth
        this.showInfo('Google signup would be implemented here with OAuth integration.');
        
        // For demo purposes, simulate successful Google signup
        setTimeout(() => {
            this.showSuccess('Google signup successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 1000);
    }

    setLoadingState(isLoading) {
        this.submitBtn.disabled = isLoading;
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.textContent = 'Creating Account...';
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Create Account';
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
            max-width: 350px;
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
}

// Add CSS for animations and validation
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
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupHandler();
});