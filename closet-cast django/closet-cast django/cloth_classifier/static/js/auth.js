// Authentication JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const submitButton = document.querySelector('.auth-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Form submission handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Add loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Basic client-side validation
            if (!validateForm()) {
                e.preventDefault();
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                return false;
            }
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Reset previous error states
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');
        
        // Validate username
        if (!usernameInput.value.trim()) {
            usernameInput.classList.add('error');
            showFieldError(usernameInput, 'Username is required');
            isValid = false;
        }
        
        // Validate password
        if (!passwordInput.value.trim()) {
            passwordInput.classList.add('error');
            showFieldError(passwordInput, 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }

    // Show field-specific error
    function showFieldError(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#dc2626';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.animation = 'fadeIn 0.3s ease-out';
        errorDiv.textContent = message;
        
        // Insert after the input field
        field.parentNode.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Real-time validation feedback
    usernameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.field-error');
            if (errorMsg) errorMsg.remove();
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.field-error');
            if (errorMsg) errorMsg.remove();
        }
    });

    // Auto-dismiss messages after 5 seconds
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.animation = 'slideOutUp 0.5s ease-out forwards';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 500);
        }, 5000);
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key on username field focuses password field
        if (e.key === 'Enter' && e.target === usernameInput) {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    // Add focus management
    usernameInput.addEventListener('focus', function() {
        this.parentNode.style.transform = 'scale(1.02)';
        this.parentNode.style.transition = 'transform 0.2s ease';
    });

    usernameInput.addEventListener('blur', function() {
        this.parentNode.style.transform = 'scale(1)';
    });

    passwordInput.addEventListener('focus', function() {
        this.parentNode.style.transform = 'scale(1.02)';
        this.parentNode.style.transition = 'transform 0.2s ease';
    });

    passwordInput.addEventListener('blur', function() {
        this.parentNode.style.transform = 'scale(1)';
    });
});

// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideOutUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    .field-error {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `message message-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.maxWidth = '300px';
    
    notification.innerHTML = `
        <div class="message-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
        </div>
        <span class="message-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.5s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 3000);
}

// Handle network errors
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Connection lost. Please check your internet.', 'error');
});
