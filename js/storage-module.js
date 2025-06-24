'use strict';

const StorageModule = {
    // Cấu hình lưu trữ
    config: {
        storagePrefix: 'techviet_',
        expirationTime: 30 * 24 * 60 * 60 * 1000, // 30 ngày (ms)
        maxStorageSize: 5 * 1024 * 1024, // Giới hạn 5MB
        compressionThreshold: 1024 // Nén dữ liệu lớn hơn 1KB
    },

    // Khởi tạo module lưu trữ
    init: function() {
        console.log('Đang khởi tạo Storage Module...');
        
        if (!this.isStorageAvailable()) {
            console.warn('Trình duyệt không hỗ trợ Web Storage');
            return;
        }

        this.setupStorageHandlers();
        this.loadUserPreferences();
        this.setupStorageEvents();
        this.cleanupExpiredData();
        this.setupFormDataPersistence();
        this.setupAnalytics();
        
        console.log('Storage Module đã khởi tạo thành công');
    },

    // Kiểm tra Web Storage có khả dụng không
    isStorageAvailable: function() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Lấy thông tin hạn ngạch lưu trữ
    getStorageQuota: function() {
        if (navigator.storage && navigator.storage.estimate) {
            return navigator.storage.estimate().then(estimate => {
                return {
                    quota: estimate.quota,
                    usage: estimate.usage,
                    available: estimate.quota - estimate.usage,
                    usagePercent: Math.round((estimate.usage / estimate.quota) * 100)
                };
            });
        }
        return Promise.resolve(null);
    },

    // Đặt mục với siêu dữ liệu
    setItem: function(key, value, options = {}) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const storageType = options.session ? sessionStorage : localStorage;
            
            const data = {
                value: value,
                timestamp: Date.now(),
                expires: options.expires ? Date.now() + options.expires : null,
                version: options.version || '1.0',
                compressed: false
            };

            let serializedData = JSON.stringify(data);

            // Nén dữ liệu lớn
            if (serializedData.length > this.config.compressionThreshold) {
                try {
                    serializedData = this.compressData(serializedData);
                    data.compressed = true;
                    serializedData = JSON.stringify(data);
                } catch (e) {
                    console.warn('Nén dữ liệu không thành công:', e);
                }
            }

            // Kiểm tra kích thước lưu trữ
            if (this.getStorageSize() + serializedData.length > this.config.maxStorageSize) {
                this.clearOldestData();
            }

            // Thử lưu và log kết quả
            storageType.setItem(fullKey, serializedData);
            if (storageType.getItem(fullKey)) {
                console.log(`[StorageModule] Đã lưu key: ${fullKey}`);
            } else {
                console.error(`[StorageModule] KHÔNG lưu được key: ${fullKey}`);
            }
            
            this.triggerStorageEvent('set', key, value);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu trữ setItem:', error);
            alert('Không thể lưu dữ liệu vào localStorage. Hãy kiểm tra quyền trình duyệt hoặc bộ nhớ.');
            return false;
        }
    },

    // Lấy mục với kiểm tra hết hạn tự động
    getItem: function(key, options = {}) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const storageType = options.session ? sessionStorage : localStorage;
            const serializedData = storageType.getItem(fullKey);

            if (!serializedData) {
                return null;
            }

            let data = JSON.parse(serializedData);

            // Giải nén nếu cần
            if (data.compressed) {
                try {
                    const decompressedValue = this.decompressData(data.value);
                    data.value = JSON.parse(decompressedValue);
                } catch (e) {
                    console.warn('Giải nén không thành công:', e);
                    return null;
                }
            }

            // Kiểm tra hết hạn
            if (data.expires && Date.now() > data.expires) {
                this.removeItem(key, options);
                return null;
            }

            // Cập nhật thời gian truy cập
            if (options.updateAccess) {
                data.lastAccess = Date.now();
                storageType.setItem(fullKey, JSON.stringify(data));
            }

            return data.value;
        } catch (error) {
            console.error('Lỗi khi lưu trữ getItem:', error);
            return null;
        }
    },

    // Xóa mục
    removeItem: function(key, options = {}) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const storageType = options.session ? sessionStorage : localStorage;
            
            storageType.removeItem(fullKey);
            this.triggerStorageEvent('remove', key, null);
            
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu trữ removeItem:', error);
            return false;
        }
    },

    // Xóa tất cả dữ liệu ứng dụng
    clear: function(options = {}) {
        try {
            const storageType = options.session ? sessionStorage : localStorage;
            const keys = this.getAllKeys(options);
            
            keys.forEach(key => {
                storageType.removeItem(key);
            });
            
            this.triggerStorageEvent('clear', null, null);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu trữ clear:', error);
            return false;
        }
    },

    // Lấy tất cả các khóa của ứng dụng
    getAllKeys: function(options = {}) {
        const storageType = options.session ? sessionStorage : localStorage;
        const keys = [];
        
        for (let i = 0; i < storageType.length; i++) {
            const key = storageType.key(i);
            if (key && key.startsWith(this.config.storagePrefix)) {
                keys.push(key);
            }
        }
        
        return keys;
    },

    // Lấy kích thước lưu trữ
    getStorageSize: function() {
        let total = 0;
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                total += value.length;
            }
        });
        
        return total;
    },

    // Nén dữ liệu đơn giản
    compressData: function(data) {
        // Nén chuỗi cơ bản bằng cách loại bỏ khoảng trắng không cần thiết
        return data.replace(/\s+/g, ' ').trim();
    },

    // Giải nén dữ liệu đơn giản
    decompressData: function(data) {
        return data; // Trong một triển khai thực tế, điều này sẽ đảo ngược quá trình nén
    },

    // Xóa dữ liệu cũ nhất khi bộ nhớ đầy
    clearOldestData: function() {
        const keys = this.getAllKeys();
        const items = [];

        keys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                items.push({
                    key: key,
                    timestamp: data.timestamp || 0,
                    lastAccess: data.lastAccess || data.timestamp || 0
                });
            } catch (e) {
                // Xóa các mục bị hỏng
                localStorage.removeItem(key);
            }
        });

        // Sắp xếp theo thời gian truy cập cuối (cũ nhất trước)
        items.sort((a, b) => a.lastAccess - b.lastAccess);

        // Xóa 25% dữ liệu cũ nhất
        const removeCount = Math.ceil(items.length * 0.25);
        for (let i = 0; i < removeCount; i++) {
            localStorage.removeItem(items[i].key);
        }
    },

    // Dọn dẹp dữ liệu đã hết hạn
    cleanupExpiredData: function() {
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.expires && Date.now() > data.expires) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Xóa các mục bị hỏng
                localStorage.removeItem(key);
            }
        });
    },

    // Thiết lập các trình xử lý sự kiện lưu trữ
    setupStorageHandlers: function() {
        // Lắng nghe các sự kiện lưu trữ từ các tab khác
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith(this.config.storagePrefix)) {
                const appKey = e.key.replace(this.config.storagePrefix, '');
                this.handleStorageChange(appKey, e.oldValue, e.newValue);
            }
        });

        // Dọn dẹp định kỳ
        setInterval(() => {
            this.cleanupExpiredData();
        }, 60000); // Mỗi phút
    },

    // Xử lý thay đổi lưu trữ từ các tab khác
    handleStorageChange: function(key, oldValue, newValue) {
        console.log(`Storage changed: ${key}`, { oldValue, newValue });
        
        // Xử lý thay đổi của các khóa cụ thể
        switch (key) {
            case 'user_preferences':
                this.loadUserPreferences();
                break;
            case 'theme':
                this.applyThemeChanges();
                break;
        }
    },

    // Quản lý sở thích người dùng
    loadUserPreferences: function() {
        const preferences = this.getItem('user_preferences') || {};
        
        // Áp dụng sở thích mặc định
        const defaultPreferences = {
            theme: 'light',
            language: 'vi',
            notifications: true,
            autoSave: true,
            fontSize: 'medium',
            animationsEnabled: true
        };

        this.userPreferences = { ...defaultPreferences, ...preferences };
        this.applyUserPreferences();
    },

    // Lưu sở thích người dùng
    saveUserPreferences: function(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        this.setItem('user_preferences', this.userPreferences);
        this.applyUserPreferences();
    },

    // Áp dụng sở thích người dùng vào giao diện
    applyUserPreferences: function() {
        const body = document.body;
        
        // Áp dụng chủ đề
        body.setAttribute('data-theme', this.userPreferences.theme);
        
        // Áp dụng kích thước phông chữ
        body.setAttribute('data-font-size', this.userPreferences.fontSize);
        
        // Áp dụng hoạt ảnh
        if (!this.userPreferences.animationsEnabled) {
            body.classList.add('no-animations');
        } else {
            body.classList.remove('no-animations');
        }
        
        // Cập nhật các điều khiển giao diện
        this.updatePreferenceControls();
    },

    // Cập nhật các điều khiển sở thích trong giao diện
    updatePreferenceControls: function() {
        // Bộ chọn chủ đề
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.userPreferences.theme;
        }

        // Bộ chọn kích thước phông chữ
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.value = this.userPreferences.fontSize;
        }

        // Công tắc thông báo
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.userPreferences.notifications;
        }

        // Công tắc hoạt ảnh
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.userPreferences.animationsEnabled;
        }
    },

    // Duy trì dữ liệu biểu mẫu
    setupFormDataPersistence: function() {
        const forms = document.querySelectorAll('form[data-persist]');
        
        forms.forEach(form => {
            const formId = form.id || form.getAttribute('data-persist');
            if (!formId) return;

            // Tải dữ liệu biểu mẫu đã lưu
            this.loadFormData(form, formId);

            // Lưu dữ liệu biểu mẫu khi nhập
            form.addEventListener('input', (e) => {
                this.saveFormData(form, formId);
            });

            // Lưu khi gửi biểu mẫu
            form.addEventListener('submit', () => {
                this.removeFormData(formId);
            });

            // Tự động lưu định kỳ
            if (form.hasAttribute('data-auto-save')) {
                setInterval(() => {
                    this.saveFormData(form, formId);
                }, 30000); // Mỗi 30 giây
            }
        });
    },

    // Lưu dữ liệu biểu mẫu
    saveFormData: function(form, formId) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        this.setItem(`form_${formId}`, data, { expires: 24 * 60 * 60 * 1000 }); // 24 giờ
    },

    // Tải dữ liệu biểu mẫu
    loadFormData: function(form, formId) {
        const data = this.getItem(`form_${formId}`);
        if (!data) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                // Bỏ qua input file vì không thể set value cho nó
                if (field.type === 'file') return;
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = !!data[key];
                } else {
                    field.value = data[key];
                }
            }
        });

        // Hiển thị thông báo khôi phục
        this.showFormRestoreNotice(form);
    },

    // Xóa dữ liệu biểu mẫu
    removeFormData: function(formId) {
        this.removeItem(`form_${formId}`);
    },

    // Hiển thị thông báo khôi phục dữ liệu biểu mẫu
    showFormRestoreNotice: function(form) {
        const notice = document.createElement('div');
        notice.className = 'form-restore-notice';
        notice.innerHTML = `
            <div class="notice-content">
                <i class="fas fa-info-circle"></i>
                <span>Đã khôi phục dữ liệu form đã lưu</span>
                <button type="button" class="notice-close">×</button>
            </div>
        `;

        form.insertBefore(notice, form.firstChild);

        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            notice.remove();
        }, 5000);

        // Nút đóng
        notice.querySelector('.notice-close').addEventListener('click', () => {
            notice.remove();
        });
    },

    // Phân tích và theo dõi sử dụng
    setupAnalytics: function() {
        this.trackPageView();
        this.trackUserSession();
        this.setupInteractionTracking();
    },

    // Theo dõi lượt xem trang
    trackPageView: function() {
        const page = window.location.pathname;
        const pageViews = this.getItem('page_views') || {};
        
        pageViews[page] = (pageViews[page] || 0) + 1;
        pageViews.lastVisit = Date.now();
        
        this.setItem('page_views', pageViews);
    },

    // Theo dõi phiên người dùng
    trackUserSession: function() {
        const sessionId = this.getItem('session_id', { session: true });
        
        if (!sessionId) {
            // Phiên mới
            const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.setItem('session_id', newSessionId, { session: true });
            this.setItem('session_start', Date.now(), { session: true });
            
            // Theo dõi số phiên
            const sessionCount = this.getItem('session_count') || 0;
            this.setItem('session_count', sessionCount + 1);
        }

        // Cập nhật hoạt động cuối
        this.setItem('last_activity', Date.now(), { session: true });
    },

    // Thiết lập theo dõi tương tác
    setupInteractionTracking: function() {
        const interactions = this.getItem('interactions') || {};

        // Theo dõi nhấp chuột vào nút
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                const element = e.target;
                const key = element.textContent.trim() || element.getAttribute('aria-label') || 'unknown';
                
                interactions[key] = (interactions[key] || 0) + 1;
                this.setItem('interactions', interactions);
            }
        });

        // Theo dõi gửi biểu mẫu
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formId = form.id || form.action || 'unknown_form';
            
            interactions[`form_${formId}`] = (interactions[`form_${formId}`] || 0) + 1;
            this.setItem('interactions', interactions);
        });
    },

    // Lấy dữ liệu phân tích
    getAnalytics: function() {
        return {
            pageViews: this.getItem('page_views') || {},
            sessionCount: this.getItem('session_count') || 0,
            interactions: this.getItem('interactions') || {},
            lastActivity: this.getItem('last_activity', { session: true }),
            userPreferences: this.userPreferences
        };
    },

    // Quản lý lịch sử tìm kiếm
    saveSearchQuery: function(query) {
        if (!query.trim()) return;

        const searchHistory = this.getItem('search_history') || [];
        
        // Xóa nếu đã tồn tại
        const index = searchHistory.indexOf(query);
        if (index > -1) {
            searchHistory.splice(index, 1);
        }

        // Thêm vào đầu danh sách
        searchHistory.unshift(query);

        // Giữ lại chỉ 10 tìm kiếm gần nhất
        if (searchHistory.length > 10) {
            searchHistory.splice(10);
        }

        this.setItem('search_history', searchHistory);
    },

    // Lấy lịch sử tìm kiếm
    getSearchHistory: function() {
        return this.getItem('search_history') || [];
    },

    // Xóa lịch sử tìm kiếm
    clearSearchHistory: function() {
        this.removeItem('search_history');
    },

    // Quản lý giỏ hàng / danh sách yêu thích
    addToFavorites: function(item) {
        const favorites = this.getItem('favorites') || [];
        
        if (!favorites.find(fav => fav.id === item.id)) {
            favorites.push({
                id: item.id,
                title: item.title,
                type: item.type,
                url: item.url,
                addedAt: Date.now()
            });
            
            this.setItem('favorites', favorites);
            this.showNotification('Đã thêm vào danh sách yêu thích');
        }
    },

    // Xóa khỏi danh sách yêu thích
    removeFromFavorites: function(itemId) {
        const favorites = this.getItem('favorites') || [];
        const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
        
        this.setItem('favorites', updatedFavorites);
        this.showNotification('Đã xóa khỏi danh sách yêu thích');
    },

    // Lấy danh sách yêu thích
    getFavorites: function() {
        return this.getItem('favorites') || [];
    },

    // Quản lý đánh dấu trang
    addBookmark: function(title, url) {
        const bookmarks = this.getItem('bookmarks') || [];
        
        bookmarks.push({
            id: Date.now(),
            title: title,
            url: url || window.location.href,
            addedAt: Date.now()
        });
        
        this.setItem('bookmarks', bookmarks);
        this.showNotification('Đã thêm bookmark');
    },

    // Xuất / Nhập dữ liệu
    exportData: function() {
        const data = {};
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            try {
                data[key] = localStorage.getItem(key);
            } catch (e) {
                console.warn(`Không thể xuất khóa: ${key}`);
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `techviet_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },

    // Nhập dữ liệu
    importData: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    Object.keys(data).forEach(key => {
                        if (key.startsWith(this.config.storagePrefix)) {
                            localStorage.setItem(key, data[key]);
                        }
                    });
                    
                    this.loadUserPreferences();
                    this.showNotification('Dữ liệu đã được import thành công');
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.readAsText(file);
        });
    },

    // Thiết lập sự kiện lưu trữ
    setupStorageEvents: function() {
        // Sự kiện lưu trữ tùy chỉnh
        this.storageEvents = document.createElement('div');
        
        // Phát sóng thay đổi lưu trữ
        this.storageEvents.addEventListener('storage-change', (e) => {
            console.log('Sự kiện thay đổi lưu trữ:', e.detail);
        });
    },

    // Kích hoạt sự kiện lưu trữ
    triggerStorageEvent: function(action, key, value) {
        const event = new CustomEvent('storage-change', {
            detail: { action, key, value, timestamp: Date.now() }
        });
        
        this.storageEvents.dispatchEvent(event);
    },

    // Quản lý chủ đề
    applyThemeChanges: function() {
        const theme = this.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', theme);
    },

    // Hiển thị thông báo
    showNotification: function(message) {
        if (!this.userPreferences.notifications) return;

        const notification = document.createElement('div');
        notification.className = 'storage-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },

    // Lấy thống kê lưu trữ
    getStorageStats: function() {
        const stats = {
            totalKeys: this.getAllKeys().length,
            totalSize: this.getStorageSize(),
            sizeFormatted: this.formatBytes(this.getStorageSize()),
            usage: (this.getStorageSize() / this.config.maxStorageSize) * 100,
            sessions: this.getItem('session_count') || 0,
            lastActivity: this.getItem('last_activity', { session: true })
        };
        
        return stats;
    },

    // Định dạng byte để hiển thị
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Phương thức gỡ lỗi
    debug: {
        // Liệt kê tất cả các khóa đã lưu
        listKeys: function() {
            return StorageModule.getAllKeys().map(key => 
                key.replace(StorageModule.config.storagePrefix, '')
            );
        },

        // Lấy thông tin mục
        getItemInfo: function(key) {
            const fullKey = StorageModule.config.storagePrefix + key;
            const data = localStorage.getItem(fullKey);
            
            if (!data) return null;
            
            try {
                const parsed = JSON.parse(data);
                return {
                    key: key,
                    size: data.length,
                    sizeFormatted: StorageModule.formatBytes(data.length),
                    timestamp: parsed.timestamp,
                    expires: parsed.expires,
                    compressed: parsed.compressed,
                    version: parsed.version
                };
            } catch (e) {
                return { key, error: 'JSON không hợp lệ' };
            }
        },

        // Xem tất cả dữ liệu lưu trữ
        viewAll: function() {
            const keys = this.listKeys();
            return keys.map(key => ({
                key,
                info: this.getItemInfo(key),
                value: StorageModule.getItem(key)
            }));
        }
    }
};

// Khởi tạo Module Lưu trữ khi DOM được tải
document.addEventListener('DOMContentLoaded', function() {
    StorageModule.init();
});

// Tiếp xúc một số phương thức toàn cục cho phát triển
window.TechVietStorage = {
    get: (key) => StorageModule.getItem(key),
    set: (key, value, options) => StorageModule.setItem(key, value, options),
    remove: (key) => StorageModule.removeItem(key),
    clear: () => StorageModule.clear(),
    stats: () => StorageModule.getStorageStats(),
    export: () => StorageModule.exportData(),
    debug: StorageModule.debug
};

// Xuất cho các hệ thống module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageModule;
}

