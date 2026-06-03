// Home page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

function initializeHomePage() {
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize popularity bars animation
    animatePopularityBars();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Initialize intersection observer for animations
    initializeScrollAnimations();
}

function initializeFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const outfitCards = document.querySelectorAll('.outfit-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            filterCards(outfitCards, filter);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function filterCards(cards, filter) {
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update gallery grid layout
    setTimeout(() => {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            galleryGrid.style.animation = 'fadeInUp 0.4s ease-out';
        }
    }, 100);
}

function animatePopularityBars() {
    const popularityFills = document.querySelectorAll('.popularity-fill[data-width]');
    
    // Use Intersection Observer to animate when bars come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                
                // Animate the width
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 200);
                
                observer.unobserve(fill);
            }
        });
    }, {
        threshold: 0.5
    });
    
    popularityFills.forEach(fill => {
        observer.observe(fill);
    });
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('.outfit-image[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.addEventListener('load', function() {
                        this.style.opacity = '1';
                        this.style.transform = 'scale(1)';
                    });
                    
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.95)';
                    img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.outfit-card, .stat-item, .filter-btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function openModal(outfitId) {
    // Create modal for outfit details
    const modal = createOutfitModal(outfitId);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function createOutfitModal(outfitId) {
    const modal = document.createElement('div');
    modal.className = 'outfit-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Outfit Details</h3>
                <button class="modal-close" onclick="closeModal(this.closest('.outfit-modal'))">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Loading outfit details for ID: ${outfitId}</p>
                <div class="modal-actions">
                    <button class="classify-modal-btn" onclick="classifyOutfit('${outfitId}')">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Classify This Outfit
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function classifyOutfit(outfitId) {
    // Show loading notification
    showNotification('Classifying outfit...', 'info');
    
    // Simulate classification process
    setTimeout(() => {
        const categories = ['Casual', 'Formal', 'Ethnic', 'Traditional'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const confidence = (85 + Math.random() * 10).toFixed(1);
        
        showNotification(`Classification: ${randomCategory} (${confidence}% confidence)`, 'success');
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '📢';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Handle keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.querySelector('.outfit-modal.active');
        if (modal) {
            closeModal(modal);
        }
    }
});

// Add required CSS for modals and notifications
const style = document.createElement('style');
style.textContent = `
    .outfit-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .outfit-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 20px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        border-bottom: 1px solid #e5e7eb;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 600;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        transition: background 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .modal-close svg {
        width: 20px;
        height: 20px;
    }
    
    .modal-body {
        padding: 30px;
    }
    
    .modal-actions {
        margin-top: 25px;
        display: flex;
        justify-content: center;
    }
    
    .classify-modal-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .classify-modal-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    
    .classify-modal-btn svg {
        width: 16px;
        height: 16px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #667eea;
    }
    
    .notification-info .notification-content {
        border-left-color: #667eea;
    }
    
    .notification-success .notification-content {
        border-left-color: #16a34a;
    }
    
    .notification-error .notification-content {
        border-left-color: #dc2626;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
        color: #2c3e50;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 2px;
        border-radius: 4px;
        transition: color 0.3s ease;
    }
    
    .notification-close:hover {
        color: #ef4444;
    }
    
    .notification-close svg {
        width: 16px;
        height: 16px;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
        }
        
        .modal-header {
            padding: 20px;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// Export functions for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.classifyOutfit = classifyOutfit;
