// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Setup real-time updates (if needed)
    setupRealTimeUpdates();
});

function initDashboard() {
    // Animate stat cards on load
    animateStatCards();
    
    // Setup action card interactions
    setupActionCards();
    
    // Initialize activity feed
    initActivityFeed();
}

function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Animate stat values counting up
        const statValue = card.querySelector('.stat-value');
        if (statValue) {
            animateCountUp(statValue);
        }
    });
}

function animateCountUp(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const isTime = finalValue.includes('s');
    const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = numericValue / 50; // 50 steps
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 50;
    
    element.textContent = '0';
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue * 10) / 10;
        
        if (isPercentage) {
            element.textContent = displayValue + '%';
        } else if (isTime) {
            element.textContent = displayValue + 's';
        } else {
            element.textContent = Math.floor(displayValue).toLocaleString();
        }
    }, stepTime);
}

function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(102, 126, 234, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - card.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - card.offsetTop) + 'px';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.marginLeft = ripple.style.marginTop = '-10px';
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Add hover effects to activity items
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.transform = 'translateX(0)';
        });
    });
}

function addInteractiveFeatures() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            closeAllModals();
        }
    });
    
    // Add smooth scrolling to action cards
    const actionCards = document.querySelectorAll('.action-card[href]');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add loading state
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            // Reset after navigation
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
}

function setupRealTimeUpdates() {
    // Simulate real-time updates (in a real app, this would connect to WebSocket or polling)
    setInterval(() => {
        updateActivityFeed();
    }, 30000); // Update every 30 seconds
    
    // Update timestamp displays
    setInterval(() => {
        updateTimestamps();
    }, 60000); // Update every minute
}

function updateActivityFeed() {
    // This would typically fetch new data from the server
    // For demo purposes, we'll just add a subtle animation to show "freshness"
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            activityList.style.animation = '';
        }, 500);
    }
}

function updateTimestamps() {
    // Update relative timestamps (e.g., "2 minutes ago" -> "3 minutes ago")
    const timestamps = document.querySelectorAll('.activity-content p');
    timestamps.forEach(timestamp => {
        const text = timestamp.textContent;
        if (text.includes('minutes ago')) {
            const minutes = parseInt(text.match(/\d+/)[0]);
            timestamp.textContent = text.replace(/\d+/, minutes + 1);
        }
    });
}

function closeAllModals() {
    // Close any open modals or dropdowns
    const modals = document.querySelectorAll('.modal, .dropdown');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility functions
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
    `;
    
    if (type === 'success') {
        notification.style.borderLeft = '4px solid #16a34a';
    } else if (type === 'error') {
        notification.style.borderLeft = '4px solid #dc2626';
    } else {
        notification.style.borderLeft = '4px solid #667eea';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(notificationStyle);

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime > 3000) {
                console.warn('Dashboard loaded slowly:', loadTime + 'ms');
            }
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Export functions for external use
window.dashboardUtils = {
    showNotification,
    animateCountUp,
    closeAllModals
};
