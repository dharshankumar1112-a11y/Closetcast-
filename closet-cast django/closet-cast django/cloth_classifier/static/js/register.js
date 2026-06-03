// Registration form JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const submitButton = document.querySelector('.auth-button');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const password1Input = document.getElementById('password1');
    const password2Input = document.getElementById('password2');

    // Initialize form validation
    initFormValidation();
    
    // Setup password strength checker
    setupPasswordStrength();
    
    // Setup password confirmation checker
    setupPasswordConfirmation();
    
    // Setup form submission
    setupFormSubmission();
});

function initFormValidation() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous validation states
    clearFieldValidation(field);

    switch(fieldName) {
        case 'username':
            if (!value) {
                errorMessage = 'Username is required';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = 'Username must be at least 3 characters';
                isValid = false;
            } else if (value.length > 50) {
                errorMessage = 'Username must be less than 50 characters';
                isValid = false;
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                errorMessage = 'Username can only contain letters, numbers, and underscores';
                isValid = false;
            }
            break;

        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'password1':
            const strength = checkPasswordStrength(value);
            if (!value) {
                errorMessage = 'Password is required';
                isValid = false;
            } else if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters';
                isValid = false;
            } else if (strength.score < 2) {
                errorMessage = 'Password is too weak. Please use a stronger password.';
                isValid = false;
            }
            break;

        case 'password2':
            const password1 = document.getElementById('password1').value;
            if (!value) {
                errorMessage = 'Please confirm your password';
                isValid = false;
            } else if (value !== password1) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
            break;
    }

    if (isValid) {
        setFieldValid(field);
    } else {
        setFieldInvalid(field, errorMessage);
    }

    return isValid;
}

function clearFieldValidation(field) {
    field.classList.remove('valid', 'invalid', 'error', 'success');
    field.parentNode.parentNode.classList.remove('has-success', 'has-error');
    
    const existingError = field.parentNode.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function setFieldValid(field) {
    field.classList.add('valid', 'success');
    field.parentNode.parentNode.classList.add('has-success');
}

function setFieldInvalid(field, message) {
    field.classList.add('invalid', 'error');
    field.parentNode.parentNode.classList.add('has-error');
    showFieldError(field, message);
}

function clearFieldError(field) {
    if (field.classList.contains('error')) {
        field.classList.remove('error', 'invalid');
        field.parentNode.parentNode.classList.remove('has-error');
        
        const errorMsg = field.parentNode.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
}

function showFieldError(field, message) {
    const existingError = field.parentNode.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.85rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    errorDiv.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        ${message}
    `;
    
    field.parentNode.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function setupPasswordStrength() {
    const password1Input = document.getElementById('password1');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    password1Input.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        updatePasswordStrengthUI(strength, strengthFill, strengthText);
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (!password) {
        return { score: 0, level: 'none', feedback: [] };
    }

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Include numbers');

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    else feedback.push('Include special characters');

    // Determine strength level
    let level;
    if (score <= 1) level = 'weak';
    else if (score <= 2) level = 'fair';
    else if (score <= 3) level = 'good';
    else level = 'strong';

    return { score, level, feedback };
}

function updatePasswordStrengthUI(strength, strengthFill, strengthText) {
    // Clear previous classes
    strengthFill.className = 'strength-fill';
    strengthText.className = 'strength-text';

    if (strength.score === 0) {
        strengthText.textContent = 'Password strength';
        return;
    }

    // Add strength level class
    strengthFill.classList.add(strength.level);
    strengthText.classList.add(strength.level);

    // Update text
    const levelTexts = {
        weak: 'Weak password',
        fair: 'Fair password',
        good: 'Good password',
        strong: 'Strong password'
    };

    strengthText.textContent = levelTexts[strength.level];
}

function setupPasswordConfirmation() {
    const password1Input = document.getElementById('password1');
    const password2Input = document.getElementById('password2');
    const passwordMatch = document.getElementById('password-match');

    function checkPasswordMatch() {
        const password1 = password1Input.value;
        const password2 = password2Input.value;

        if (!password2) {
            passwordMatch.textContent = '';
            passwordMatch.className = 'password-match';
            return;
        }

        if (password1 === password2) {
            passwordMatch.textContent = 'Passwords match';
            passwordMatch.className = 'password-match match';
        } else {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.className = 'password-match no-match';
        }
    }

    password1Input.addEventListener('input', checkPasswordMatch);
    password2Input.addEventListener('input', checkPasswordMatch);
}

function setupFormSubmission() {
    const registerForm = document.getElementById('register-form');
    const submitButton = document.querySelector('.auth-button');

    registerForm.addEventListener('submit', function(e) {
        // Validate all fields
        const inputs = document.querySelectorAll('.form-input');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Add loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <div class="spinner"></div>
            Creating Account...
        `;
    });
}

// Enhanced password toggle function for registration
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleButton = passwordInput.parentNode.querySelector('.password-toggle');
    const eyeIcon = toggleButton.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.415-1.414M14.12 14.12l1.415 1.415M14.12 14.12L15.535 15.535M14.12 14.12l1.414 1.414M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        `;
        eyeIcon.setAttribute('fill', 'none');
        eyeIcon.setAttribute('stroke', 'currentColor');
        eyeIcon.setAttribute('stroke-width', '2');
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
        `;
        eyeIcon.setAttribute('fill', 'currentColor');
        eyeIcon.removeAttribute('stroke');
        eyeIcon.removeAttribute('stroke-width');
    }
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    if (type === 'success') {
        notification.style.borderLeft = '4px solid #16a34a';
    } else if (type === 'error') {
        notification.style.borderLeft = '4px solid #dc2626';
    } else {
        notification.style.borderLeft = '4px solid #667eea';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .spinner {
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.togglePassword = togglePassword;
