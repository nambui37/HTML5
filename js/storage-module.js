

'use strict';

const StorageModule = {
    // Storage configuration
    config: {
        storagePrefix: 'techviet_',
        expirationTime: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        maxStorageSize: 5 * 1024 * 1024, // 5MB limit
        compressionThreshold: 1024 // Compress data larger than 1KB
    },

    // Initialize storage module
    init: function() {
        console.log('Initializing Storage Module...');
        
        if (!this.isStorageAvailable()) {
            console.warn('Web Storage is not available in this browser');
            return;
        }

        this.setupStorageHandlers();
        this.loadUserPreferences();
        this.setupStorageEvents();
        this.cleanupExpiredData();
        this.setupFormDataPersistence();
        this.setupAnalytics();
        
        console.log('Storage Module initialized successfully');
    },

    // Check if Web Storage is available
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

    // Get storage quota information
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

    // Set item with metadata
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

            // Compress large data
            if (serializedData.length > this.config.compressionThreshold) {
                try {
                    // Simple compression using JSON stringify optimization
                    serializedData = this.compressData(serializedData);
                    data.compressed = true;
                    serializedData = JSON.stringify(data);
                } catch (e) {
                    console.warn('Compression failed:', e);
                }
            }

            // Check storage size
            if (this.getStorageSize() + serializedData.length > this.config.maxStorageSize) {
                this.clearOldestData();
            }

            storageType.setItem(fullKey, serializedData);
            
            // Trigger custom event
            this.triggerStorageEvent('set', key, value);
            
            return true;
        } catch (error) {
            console.error('Storage setItem error:', error);
            return false;
        }
    },

    // Get item with automatic expiration check
    getItem: function(key, options = {}) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const storageType = options.session ? sessionStorage : localStorage;
            const serializedData = storageType.getItem(fullKey);

            if (!serializedData) {
                return null;
            }

            let data = JSON.parse(serializedData);

            // Decompress if needed
            if (data.compressed) {
                try {
                    const decompressedValue = this.decompressData(data.value);
                    data.value = JSON.parse(decompressedValue);
                } catch (e) {
                    console.warn('Decompression failed:', e);
                    return null;
                }
            }

            // Check expiration
            if (data.expires && Date.now() > data.expires) {
                this.removeItem(key, options);
                return null;
            }

            // Update access timestamp
            if (options.updateAccess) {
                data.lastAccess = Date.now();
                storageType.setItem(fullKey, JSON.stringify(data));
            }

            return data.value;
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },

    // Remove item
    removeItem: function(key, options = {}) {
        try {
            const fullKey = this.config.storagePrefix + key;
            const storageType = options.session ? sessionStorage : localStorage;
            
            storageType.removeItem(fullKey);
            this.triggerStorageEvent('remove', key, null);
            
            return true;
        } catch (error) {
            console.error('Storage removeItem error:', error);
            return false;
        }
    },

    // Clear all app data
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
            console.error('Storage clear error:', error);
            return false;
        }
    },

    // Get all app keys
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

    // Get storage size
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

    // Simple data compression
    compressData: function(data) {
        // Basic string compression by removing unnecessary whitespace
        return data.replace(/\s+/g, ' ').trim();
    },

    // Simple data decompression
    decompressData: function(data) {
        return data; // In a real implementation, this would reverse the compression
    },

    // Clear oldest data when storage is full
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
                // Remove corrupted items
                localStorage.removeItem(key);
            }
        });

        // Sort by last access time (oldest first)
        items.sort((a, b) => a.lastAccess - b.lastAccess);

        // Remove oldest 25% of items
        const removeCount = Math.ceil(items.length * 0.25);
        for (let i = 0; i < removeCount; i++) {
            localStorage.removeItem(items[i].key);
        }
    },

    // Clean up expired data
    cleanupExpiredData: function() {
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.expires && Date.now() > data.expires) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Remove corrupted items
                localStorage.removeItem(key);
            }
        });
    },

    // Setup storage event handlers
    setupStorageHandlers: function() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith(this.config.storagePrefix)) {
                const appKey = e.key.replace(this.config.storagePrefix, '');
                this.handleStorageChange(appKey, e.oldValue, e.newValue);
            }
        });

        // Periodic cleanup
        setInterval(() => {
            this.cleanupExpiredData();
        }, 60000); // Every minute
    },

    // Handle storage changes from other tabs
    handleStorageChange: function(key, oldValue, newValue) {
        console.log(`Storage changed: ${key}`, { oldValue, newValue });
        
        // Handle specific key changes
        switch (key) {
            case 'user_preferences':
                this.loadUserPreferences();
                break;
            case 'theme':
                this.applyThemeChanges();
                break;
        }
    },

    // User Preferences Management
    loadUserPreferences: function() {
        const preferences = this.getItem('user_preferences') || {};
        
        // Apply default preferences
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

    // Save user preferences
    saveUserPreferences: function(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        this.setItem('user_preferences', this.userPreferences);
        this.applyUserPreferences();
    },

    // Apply user preferences to the UI
    applyUserPreferences: function() {
        const body = document.body;
        
        // Apply theme
        body.setAttribute('data-theme', this.userPreferences.theme);
        
        // Apply font size
        body.setAttribute('data-font-size', this.userPreferences.fontSize);
        
        // Apply animations
        if (!this.userPreferences.animationsEnabled) {
            body.classList.add('no-animations');
        } else {
            body.classList.remove('no-animations');
        }
        
        // Update UI controls
        this.updatePreferenceControls();
    },

    // Update preference controls in the UI
    updatePreferenceControls: function() {
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.userPreferences.theme;
        }

        // Font size selector
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.value = this.userPreferences.fontSize;
        }

        // Notifications toggle
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.userPreferences.notifications;
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.userPreferences.animationsEnabled;
        }
    },

    // Form Data Persistence
    setupFormDataPersistence: function() {
        const forms = document.querySelectorAll('form[data-persist]');
        
        forms.forEach(form => {
            const formId = form.id || form.getAttribute('data-persist');
            if (!formId) return;

            // Load saved form data
            this.loadFormData(form, formId);

            // Save form data on input
            form.addEventListener('input', (e) => {
                this.saveFormData(form, formId);
            });

            // Save on form submission
            form.addEventListener('submit', () => {
                this.removeFormData(formId);
            });

            // Auto-save interval
            if (form.hasAttribute('data-auto-save')) {
                setInterval(() => {
                    this.saveFormData(form, formId);
                }, 30000); // Every 30 seconds
            }
        });
    },

    // Save form data
    saveFormData: function(form, formId) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        this.setItem(`form_${formId}`, data, { expires: 24 * 60 * 60 * 1000 }); // 24 hours
    },

    // Load form data
    loadFormData: function(form, formId) {
        const data = this.getItem(`form_${formId}`);
        if (!data) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = field.value === data[key];
                } else {
                    field.value = data[key];
                }
            }
        });

        // Show restoration notice
        this.showFormRestoreNotice(form);
    },

    // Remove form data
    removeFormData: function(formId) {
        this.removeItem(`form_${formId}`);
    },

    // Show form restore notice
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

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notice.remove();
        }, 5000);

        // Close button
        notice.querySelector('.notice-close').addEventListener('click', () => {
            notice.remove();
        });
    },

    // Analytics and Usage Tracking
    setupAnalytics: function() {
        this.trackPageView();
        this.trackUserSession();
        this.setupInteractionTracking();
    },

    // Track page views
    trackPageView: function() {
        const page = window.location.pathname;
        const pageViews = this.getItem('page_views') || {};
        
        pageViews[page] = (pageViews[page] || 0) + 1;
        pageViews.lastVisit = Date.now();
        
        this.setItem('page_views', pageViews);
    },

    // Track user session
    trackUserSession: function() {
        const sessionId = this.getItem('session_id', { session: true });
        
        if (!sessionId) {
            // New session
            const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.setItem('session_id', newSessionId, { session: true });
            this.setItem('session_start', Date.now(), { session: true });
            
            // Track session count
            const sessionCount = this.getItem('session_count') || 0;
            this.setItem('session_count', sessionCount + 1);
        }

        // Update last activity
        this.setItem('last_activity', Date.now(), { session: true });
    },

    // Setup interaction tracking
    setupInteractionTracking: function() {
        const interactions = this.getItem('interactions') || {};

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                const element = e.target;
                const key = element.textContent.trim() || element.getAttribute('aria-label') || 'unknown';
                
                interactions[key] = (interactions[key] || 0) + 1;
                this.setItem('interactions', interactions);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formId = form.id || form.action || 'unknown_form';
            
            interactions[`form_${formId}`] = (interactions[`form_${formId}`] || 0) + 1;
            this.setItem('interactions', interactions);
        });
    },

    // Get analytics data
    getAnalytics: function() {
        return {
            pageViews: this.getItem('page_views') || {},
            sessionCount: this.getItem('session_count') || 0,
            interactions: this.getItem('interactions') || {},
            lastActivity: this.getItem('last_activity', { session: true }),
            userPreferences: this.userPreferences
        };
    },

    // Search History Management
    saveSearchQuery: function(query) {
        if (!query.trim()) return;

        const searchHistory = this.getItem('search_history') || [];
        
        // Remove if already exists
        const index = searchHistory.indexOf(query);
        if (index > -1) {
            searchHistory.splice(index, 1);
        }

        // Add to beginning
        searchHistory.unshift(query);

        // Keep only last 10 searches
        if (searchHistory.length > 10) {
            searchHistory.splice(10);
        }

        this.setItem('search_history', searchHistory);
    },

    // Get search history
    getSearchHistory: function() {
        return this.getItem('search_history') || [];
    },

    // Clear search history
    clearSearchHistory: function() {
        this.removeItem('search_history');
    },

    // Shopping Cart / Favorites Management
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

    // Remove from favorites
    removeFromFavorites: function(itemId) {
        const favorites = this.getItem('favorites') || [];
        const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
        
        this.setItem('favorites', updatedFavorites);
        this.showNotification('Đã xóa khỏi danh sách yêu thích');
    },

    // Get favorites
    getFavorites: function() {
        return this.getItem('favorites') || [];
    },

    // Bookmark Management
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

    // Export/Import Data
    exportData: function() {
        const data = {};
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            try {
                data[key] = localStorage.getItem(key);
            } catch (e) {
                console.warn(`Failed to export key: ${key}`);
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

    // Import data
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

    // Setup storage events
    setupStorageEvents: function() {
        // Custom storage events
        this.storageEvents = document.createElement('div');
        
        // Broadcast storage changes
        this.storageEvents.addEventListener('storage-change', (e) => {
            console.log('Storage change event:', e.detail);
        });
    },

    // Trigger storage events
    triggerStorageEvent: function(action, key, value) {
        const event = new CustomEvent('storage-change', {
            detail: { action, key, value, timestamp: Date.now() }
        });
        
        this.storageEvents.dispatchEvent(event);
    },

    // Theme management
    applyThemeChanges: function() {
        const theme = this.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', theme);
    },

    // Show notification
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

    // Get storage statistics
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

    // Format bytes for display
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Debug methods
    debug: {
        // List all stored keys
        listKeys: function() {
            return StorageModule.getAllKeys().map(key => 
                key.replace(StorageModule.config.storagePrefix, '')
            );
        },

        // Get item info
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
                return { key, error: 'Invalid JSON' };
            }
        },

        // View all storage data
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

// Initialize Storage Module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    StorageModule.init();
});

// Expose some methods globally for development
window.TechVietStorage = {
    get: (key) => StorageModule.getItem(key),
    set: (key, value, options) => StorageModule.setItem(key, value, options),
    remove: (key) => StorageModule.removeItem(key),
    clear: () => StorageModule.clear(),
    stats: () => StorageModule.getStorageStats(),
    export: () => StorageModule.exportData(),
    debug: StorageModule.debug
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageModule;
}

