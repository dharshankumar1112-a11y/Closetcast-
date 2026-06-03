// Navbar JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
});

function initializeNavbar() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        // Close mobile menu if clicking outside
        if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
        
        // Close all dropdowns if clicking outside
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('open');
            }
        });
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
            closeAllDropdowns();
        }
    });
    
    // Prevent body scroll when mobile menu is open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (mobileMenu.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        observer.observe(mobileMenu, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        
        // Add animation delay for menu items
        const menuItems = mobileMenu.querySelectorAll('.mobile-nav-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'slideInRight 0.3s ease-out forwards';
        });
        
        // Focus management
        const firstMenuItem = mobileMenu.querySelector('.mobile-nav-item');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 300);
        }
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        
        // Clear animations
        const menuItems = mobileMenu.querySelectorAll('.mobile-nav-item');
        menuItems.forEach(item => {
            item.style.animation = '';
            item.style.animationDelay = '';
        });
    }
}

function toggleUserMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenu = document.getElementById('user-menu');
    
    if (userDropdown && userMenu) {
        const isOpen = userDropdown.classList.contains('open');
        
        if (isOpen) {
            closeUserMenu();
        } else {
            openUserMenu();
        }
    }
}

function openUserMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdown) {
        userDropdown.classList.add('open');
        
        // Focus management
        const firstMenuItem = userDropdown.querySelector('.menu-item');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }
}

function closeUserMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdown) {
        userDropdown.classList.remove('open');
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const parentDropdown = dropdown ? dropdown.closest('.nav-dropdown') : null;
    
    if (parentDropdown) {
        // Close all other dropdowns first
        const allDropdowns = document.querySelectorAll('.nav-dropdown');
        allDropdowns.forEach(dd => {
            if (dd !== parentDropdown) {
                dd.classList.remove('open');
            }
        });
        
        // Toggle current dropdown
        parentDropdown.classList.toggle('open');
        
        // Focus management
        if (parentDropdown.classList.contains('open')) {
            const firstItem = dropdown.querySelector('.dropdown-item');
            if (firstItem) {
                setTimeout(() => firstItem.focus(), 100);
            }
        }
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
    });
}

// Smooth scrolling for anchor links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.main-navbar').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Add active state to navigation items based on current page
function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath === href) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Handle navbar scroll behavior
function handleNavbarScroll() {
    const navbar = document.querySelector('.main-navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize scroll behavior (optional - uncomment if you want auto-hide navbar)
// handleNavbarScroll();

// Update active nav item on page load
document.addEventListener('DOMContentLoaded', updateActiveNavItem);

// Handle keyboard navigation
document.addEventListener('keydown', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (event.key === 'Tab') {
        // Handle tab navigation in mobile menu
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const focusableElements = mobileMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
        
        // Handle tab navigation in user dropdown
        if (userMenu && userMenu.parentElement.classList.contains('open')) {
            const focusableElements = userMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    document.querySelector('.user-button').focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    closeUserMenu();
                    document.querySelector('.user-button').focus();
                }
            }
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .main-navbar {
        transition: transform 0.3s ease;
    }
    
    .mobile-nav-item {
        opacity: 0;
        transform: translateX(30px);
    }
    
    .mobile-menu.active .mobile-nav-item {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(style);

// Export functions for global use
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.toggleDropdown = toggleDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.smoothScrollTo = smoothScrollTo;
