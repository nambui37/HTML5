/**
 * TechViet - File JavaScript chính
 * Xử lý chức năng cốt lõi, điều hướng và tương tác người dùng
 * Hỗ trợ các tính năng HTML5 và JavaScript hiện đại (ES6+)
 */

// Chế độ nghiêm ngặt giúp kiểm soát lỗi tốt hơn
'use strict';

// Không gian tên toàn cục để tránh xung đột
const TechViet = {
    // Cấu hình
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

    // Các hàm tiện ích
    utils: {
        // Hàm debounce để giới hạn số lần gọi hàm
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

        // Hàm throttle cho sự kiện cuộn
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

        // Kiểm tra xem phần tử có nằm trong viewport không
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Cuộn mượt đến phần tử
        scrollTo: function(element, offset = 0) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },

        // Lấy chiều rộng viewport hiện tại
        getViewportWidth: function() {
            return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        },

        // Kiểm tra xem thiết bị có hỗ trợ cảm ứng không
        isTouchDevice: function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        // Định dạng số với dấu phẩy
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Xác thực định dạng email
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Xác thực số điện thoại (định dạng Việt Nam)
        isValidPhone: function(phone) {
            const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }
    },

    // Khởi tạo cốt lõi
    init: function() {
        console.log('TechViet website initializing...');
        
        // Chờ DOM sẵn sàng
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupComponents();
            });
        } else {
            this.setupComponents();
        }
    },

    // Thiết lập tất cả các thành phần
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

    // Chức năng điều hướng
    setupNavigation: function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-list a');

        // Chuyển đổi menu di động
        if (mobileMenuToggle && navList) {
            mobileMenuToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Hoạt ảnh cho menu hamburger
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = navList.classList.contains('active') 
                        ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? -100 : 0}px, ${index === 0 ? 6 : index === 2 ? -6 : 0}px)`
                        : 'none';
                });
            });

            // Đóng menu di động khi nhấp ra ngoài
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navList.contains(e.target)) {
                    navList.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        }

        // Đánh dấu điều hướng hiện tại
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Cuộn mượt cho các liên kết anchor
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

    // Hiệu ứng cuộn và hành vi của tiêu đề
    setupScrollEffects: function() {
        const header = document.querySelector('.header');

        const handleScroll = this.utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Thêm bóng cho tiêu đề khi cuộn
            if (scrollTop > 0) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }

            // Loại bỏ logic ẩn/hiện header khi cuộn
            // if (scrollTop > lastScrollTop && scrollTop > 100) {
            //     header?.classList.add('hidden');
            // } else {
            //     header?.classList.remove('hidden');
            // }

            // lastScrollTop = scrollTop;

            // Kích hoạt hoạt ảnh cuộn
            this.handleScrollAnimations();
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    },

    // Xử lý hoạt ảnh dựa trên cuộn
    handleScrollAnimations: function() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            if (this.utils.isInViewport(element) && !element.classList.contains('animated')) {
                const animationType = element.getAttribute('data-animate');
                element.classList.add('animated', `animate-${animationType}`);
            }
        });
    },

    // Thiết lập các hoạt ảnh chung
    setupAnimations: function() {
        // Thêm hoạt ảnh hiển thị cuộn cho các phần tử
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

        // Theo dõi các phần tử để hoạt ảnh
        const elementsToAnimate = document.querySelectorAll('.feature-card, .service-card, .product-card, .blog-card, .team-member');
        elementsToAnimate.forEach(el => observer.observe(el));
    },

    // Hoạt ảnh đếm số liệu thống kê
    setupStatCounters: function() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 giây
            const start = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Hàm easing cho hoạt ảnh mượt mà
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

        // Intersection Observer cho hoạt ảnh đếm số liệu
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

    // Chức năng tab bộ lọc
    setupFilterTabs: function() {
        const filterTabs = document.querySelectorAll('.filter-btn, .filter-tab');
        const filterableItems = document.querySelectorAll('[data-category]');

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetCategory = tab.getAttribute('data-category');
                
                // Cập nhật tab đang hoạt động
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Lọc các mục
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

    // Chức năng accordion FAQ
    setupFAQ: function() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Đóng tất cả các mục FAQ
                    faqItems.forEach(faq => {
                        faq.classList.remove('active');
                        const faqAnswer = faq.querySelector('.faq-answer');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = '0';
                        }
                    });

                    // Mở mục đã nhấp nếu nó chưa hoạt động
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    },

    // Xác thực biểu mẫu
    setupFormValidation: function() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Xác thực theo thời gian thực
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                // Xác thực khi mất tiêu điểm
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                // Xóa lỗi khi nhập
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });

            // Gửi biểu mẫu
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    },

    // Xác thực trường đơn lẻ
    validateField: function(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Xóa lỗi trước đó
        this.clearFieldError(field);

        // Xác thực trường bắt buộc
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        }
        // Xác thực email
        else if (fieldType === 'email' && value && !this.utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Vui lòng nhập email hợp lệ';
        }
        // Xác thực số điện thoại
        else if (fieldType === 'tel' && value && !this.utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Vui lòng nhập số điện thoại hợp lệ';
        }
        // Xác thực ô kiểm
        else if (field.type === 'checkbox' && isRequired && !field.checked) {
            isValid = false;
            errorMessage = 'Vui lòng đồng ý với điều khoản';
        }

        // Hiển thị lỗi nếu không hợp lệ
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Hiển thị lỗi trường
    showFieldError: function(field, message) {
        field.classList.add('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    // Xóa lỗi trường
    clearFieldError: function(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    },

    // Xử lý gửi biểu mẫu
    handleFormSubmission: function(form) {
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Xác thực tất cả các trường
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Hiển thị trạng thái đang tải
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading"></span> Đang gửi...';
            submitButton.disabled = true;

            // Giả lập gửi biểu mẫu (thay thế bằng cuộc gọi API thực tế)
            setTimeout(() => {
                this.showFormStatus(form, 'success', 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                form.reset();
                
                // Đặt lại nút
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        } else {
            this.showFormStatus(form, 'error', 'Vui lòng kiểm tra lại thông tin và thử lại.');
        }
    },

    // Hiển thị thông báo trạng thái biểu mẫu
    showFormStatus: function(form, type, message) {
        const statusElement = form.parentNode.querySelector('.form-status') || 
                             document.getElementById('formStatus');
        
        if (statusElement) {
            statusElement.className = `form-status ${type}`;
            statusElement.textContent = message;
            statusElement.style.display = 'block';

            // Ẩn sau 5 giây
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    },

    // Chức năng tìm kiếm
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

    // Thực hiện tìm kiếm
    performSearch: function(query, inputElement) {
        const searchableItems = document.querySelectorAll('.blog-card, .product-card');
        const normalizedQuery = query.toLowerCase().trim();

        if (normalizedQuery === '') {
            // Hiển thị tất cả các mục
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

    // Tải chậm cho hình ảnh và nội dung
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

    // Cải thiện khả năng tiếp cận
    setupAccessibility: function() {
        // Liên kết bỏ qua để đến nội dung chính
        this.createSkipLink();
        
        // Điều hướng bằng bàn phím
        this.setupKeyboardNavigation();
        
        // Quản lý tiêu điểm
        this.setupFocusManagement();
        
        // Cập nhật ARIA
        this.setupARIAUpdates();
    },

    // Tạo liên kết bỏ qua để đến nội dung chính
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

    // Thiết lập điều hướng bằng bàn phím
    setupKeyboardNavigation: function() {
        // Phím ESC để đóng các hộp thoại/menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Đóng menu di động
                const navList = document.querySelector('.nav-list.active');
                if (navList) {
                    navList.classList.remove('active');
                }
                
                // Đóng tất cả các dropdown đang mở
                const openDropdowns = document.querySelectorAll('.dropdown.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });

        // Điều hướng bằng phím mũi tên cho các tab
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

    // Thiết lập quản lý tiêu điểm
    setupFocusManagement: function() {
        // Bẫy tiêu điểm cho các hộp thoại (nếu có)
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

    // Thiết lập cập nhật ARIA
    setupARIAUpdates: function() {
        // Cập nhật trạng thái mở rộng ARIA
        const expandableButtons = document.querySelectorAll('[aria-expanded]');
        expandableButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
            });
        });

        // Cập nhật vùng sống
        this.createLiveRegion();
    },

    // Tạo vùng sống cho thông báo của trình đọc màn hình
    createLiveRegion: function() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    },

    // Thông báo cho trình đọc màn hình
    announce: function(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    },

    // Các hàm tiện ích cho việc sử dụng bên ngoài
    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    console.log(`User location: ${lat}, ${lng}`);
                    
                    // Lưu vào localStorage
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

    // Lấy sở thích của người dùng từ localStorage
    getUserPreferences: function() {
        if (typeof Storage !== 'undefined') {
            const preferences = localStorage.getItem('userPreferences');
            return preferences ? JSON.parse(preferences) : {};
        }
        return {};
    },

    // Lưu sở thích của người dùng vào localStorage
    saveUserPreferences: function(preferences) {
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
        }
    }
};

// Các hàm tiện ích toàn cầu
window.getDirections = function() {
    TechViet.announce('Mở ứng dụng bản đồ để chỉ đường');
    // Mở ứng dụng bản đồ
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
        // Sao chép vào clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            TechViet.announce('Đã sao chép địa chỉ trang web');
        });
    }
};

// Khởi tạo khi DOM sẵn sàng
TechViet.init();

// Xuất cho các hệ thống module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechViet;
}
