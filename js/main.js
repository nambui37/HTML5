/**
 * TechViet - Main JavaScript File
 * Handles core functionality, navigation, and user interactions
 * Supports HTML5 features and modern JavaScript (ES6+)
 */

// Strict mode for better error handling
'use strict';

// Global namespace to avoid conflicts
const TechViet = {
    // Configuration
    config: {
        animationDuration: 300,
        debounceDelay: 250,
        scrollOffset: 80,
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280
        }
    },

    // Utility functions
    utils: {
        // Debounce function to limit function calls
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        scrollTo: function(element, offset = 0) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },

        // Get current viewport width
        getViewportWidth: function() {
            return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        },

        // Check if device supports touch
        isTouchDevice: function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        // Format number with commas
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Validate email format
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Validate phone number (Vietnamese format)
        isValidPhone: function(phone) {
            const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }
    },

    // Core initialization
    init: function() {
        console.log('TechViet website initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupComponents();
            });
        } else {
            this.setupComponents();
        }
    },

    // Setup all components
    setupComponents: function() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupStatCounters();
        this.setupFilterTabs();
        this.setupFAQ();
        this.setupFormValidation();
        this.setupSearch();
        this.setupLazyLoading();
        this.setupAccessibility();
        
        console.log('TechViet website initialized successfully');
    },

    // Navigation functionality
    setupNavigation: function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-list a');

        // Mobile menu toggle
        if (mobileMenuToggle && navList) {
            mobileMenuToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Animate hamburger menu
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = navList.classList.contains('active') 
                        ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? -100 : 0}px, ${index === 0 ? 6 : index === 2 ? -6 : 0}px)`
                        : 'none';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navList.contains(e.target)) {
                    navList.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        }

        // Active navigation highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Smooth scroll for anchor links
        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        this.utils.scrollTo(targetElement, this.config.scrollOffset);
                    }
                });
            }
        });
    },

    // Scroll effects and header behavior
    setupScrollEffects: function() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;

        const handleScroll = this.utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow to header when scrolling
            if (scrollTop > 0) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }

            // Hide/show header on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header?.classList.add('hidden');
            } else {
                header?.classList.remove('hidden');
            }

            lastScrollTop = scrollTop;

            // Trigger scroll animations
            this.handleScrollAnimations();
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    },

    // Handle scroll-based animations
    handleScrollAnimations: function() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            if (this.utils.isInViewport(element) && !element.classList.contains('animated')) {
                const animationType = element.getAttribute('data-animate');
                element.classList.add('animated', `animate-${animationType}`);
            }
        });
    },

    // Setup general animations
    setupAnimations: function() {
        // Add scroll reveal animations to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll('.feature-card, .service-card, .product-card, .blog-card, .team-member');
        elementsToAnimate.forEach(el => observer.observe(el));
    },

    // Statistics counter animation
    setupStatCounters: function() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const start = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                element.textContent = this.utils.formatNumber(current);
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = this.utils.formatNumber(target);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        // Intersection Observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => counterObserver.observe(stat));
    },

    // Filter tabs functionality
    setupFilterTabs: function() {
        const filterTabs = document.querySelectorAll('.filter-btn, .filter-tab');
        const filterableItems = document.querySelectorAll('[data-category]');

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetCategory = tab.getAttribute('data-category');
                
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter items
                filterableItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (targetCategory === 'all' || itemCategory === targetCategory) {
                        item.style.display = 'block';
                        item.classList.add('animate-fadeInUp');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('animate-fadeInUp');
                    }
                });
            });
        });
    },

    // FAQ accordion functionality
    setupFAQ: function() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(faq => {
                        faq.classList.remove('active');
                        const faqAnswer = faq.querySelector('.faq-answer');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = '0';
                        }
                    });

                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    },

    // Form validation
    setupFormValidation: function() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                // Validate on blur
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                // Clear errors on input
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });

            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    },

    // Validate individual field
    validateField: function(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        }
        // Email validation
        else if (fieldType === 'email' && value && !this.utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Vui lòng nhập email hợp lệ';
        }
        // Phone validation
        else if (fieldType === 'tel' && value && !this.utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Vui lòng nhập số điện thoại hợp lệ';
        }
        // Checkbox validation
        else if (field.type === 'checkbox' && isRequired && !field.checked) {
            isValid = false;
            errorMessage = 'Vui lòng đồng ý với điều khoản';
        }

        // Display error if invalid
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Show field error
    showFieldError: function(field, message) {
        field.classList.add('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    // Clear field error
    clearFieldError: function(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    },

    // Handle form submission
    handleFormSubmission: function(form) {
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading"></span> Đang gửi...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                this.showFormStatus(form, 'success', 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                form.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        } else {
            this.showFormStatus(form, 'error', 'Vui lòng kiểm tra lại thông tin và thử lại.');
        }
    },

    // Show form status message
    showFormStatus: function(form, type, message) {
        const statusElement = form.parentNode.querySelector('.form-status') || 
                             document.getElementById('formStatus');
        
        if (statusElement) {
            statusElement.className = `form-status ${type}`;
            statusElement.textContent = message;
            statusElement.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    },

    // Search functionality
    setupSearch: function() {
        const searchInputs = document.querySelectorAll('#blogSearch, .search-input');

        searchInputs.forEach(input => {
            const searchHandler = this.utils.debounce((query) => {
                this.performSearch(query, input);
            }, this.config.debounceDelay);

            input.addEventListener('input', (e) => {
                searchHandler(e.target.value);
            });
        });
    },

    // Perform search
    performSearch: function(query, inputElement) {
        const searchableItems = document.querySelectorAll('.blog-card, .product-card');
        const normalizedQuery = query.toLowerCase().trim();

        if (normalizedQuery === '') {
            // Show all items
            searchableItems.forEach(item => {
                item.style.display = 'block';
            });
            return;
        }

        searchableItems.forEach(item => {
            const searchableText = item.textContent.toLowerCase();
            const isMatch = searchableText.includes(normalizedQuery);
            
            item.style.display = isMatch ? 'block' : 'none';
            
            if (isMatch) {
                item.classList.add('search-highlight');
                setTimeout(() => {
                    item.classList.remove('search-highlight');
                }, 1000);
            }
        });
    },

    // Lazy loading for images and content
    setupLazyLoading: function() {
        const lazyElements = document.querySelectorAll('[data-lazy]');

        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const lazySrc = element.getAttribute('data-lazy');
                    
                    if (element.tagName === 'IMG') {
                        element.src = lazySrc;
                    } else {
                        element.style.backgroundImage = `url(${lazySrc})`;
                    }
                    
                    element.classList.add('lazy-loaded');
                    lazyObserver.unobserve(element);
                }
            });
        }, { rootMargin: '50px' });

        lazyElements.forEach(el => lazyObserver.observe(el));
    },

    // Accessibility enhancements
    setupAccessibility: function() {
        // Skip to main content link
        this.createSkipLink();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA updates
        this.setupARIAUpdates();
    },

    // Create skip to main content link
    createSkipLink: function() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only focus:not-sr-only';
        skipLink.textContent = 'Chuyển đến nội dung chính';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            z-index: 9999;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    // Setup keyboard navigation
    setupKeyboardNavigation: function() {
        // ESC key to close modals/menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu
                const navList = document.querySelector('.nav-list.active');
                if (navList) {
                    navList.classList.remove('active');
                }
                
                // Close any open dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });

        // Arrow key navigation for tabs
        const tabLists = document.querySelectorAll('[role="tablist"]');
        tabLists.forEach(tabList => {
            const tabs = tabList.querySelectorAll('[role="tab"]');
            
            tabList.addEventListener('keydown', (e) => {
                const currentIndex = Array.from(tabs).indexOf(e.target);
                let nextIndex;

                switch (e.key) {
                    case 'ArrowRight':
                        nextIndex = (currentIndex + 1) % tabs.length;
                        break;
                    case 'ArrowLeft':
                        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = tabs.length - 1;
                        break;
                    default:
                        return;
                }

                e.preventDefault();
                tabs[nextIndex].focus();
                tabs[nextIndex].click();
            });
        });
    },

    // Setup focus management
    setupFocusManagement: function() {
        // Focus trap for modals (if any)
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        });
    },

    // Setup ARIA updates
    setupARIAUpdates: function() {
        // Update ARIA expanded states
        const expandableButtons = document.querySelectorAll('[aria-expanded]');
        expandableButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
            });
        });

        // Live region updates
        this.createLiveRegion();
    },

    // Create live region for screen reader announcements
    createLiveRegion: function() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    },

    // Announce to screen readers
    announce: function(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    },

    // Utility functions for external use
    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    console.log(`User location: ${lat}, ${lng}`);
                    
                    // Store in localStorage
                    if (typeof Storage !== 'undefined') {
                        localStorage.setItem('userLocation', JSON.stringify({
                            latitude: lat,
                            longitude: lng,
                            timestamp: Date.now()
                        }));
                    }
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                }
            );
        }
    },

    // Get user preferences from localStorage
    getUserPreferences: function() {
        if (typeof Storage !== 'undefined') {
            const preferences = localStorage.getItem('userPreferences');
            return preferences ? JSON.parse(preferences) : {};
        }
        return {};
    },

    // Save user preferences to localStorage
    saveUserPreferences: function(preferences) {
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
        }
    }
};

// Global utility functions
window.getDirections = function() {
    TechViet.announce('Mở ứng dụng bản đồ để chỉ đường');
    // Open maps application
    if (window.location.protocol === 'https:') {
        window.open('https://maps.google.com/?q=123+Đường+ABC,+Quận+1,+TP.HCM', '_blank');
    }
};

window.shareLocation = function() {
    if (navigator.share) {
        navigator.share({
            title: 'Văn phòng TechViet',
            text: 'Địa chỉ văn phòng TechViet',
            url: window.location.href
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            TechViet.announce('Đã sao chép địa chỉ trang web');
        });
    }
};

// Initialize when DOM is ready
TechViet.init();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechViet;
}
