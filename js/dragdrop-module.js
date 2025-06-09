/**
 * TechViet - Drag & Drop Module
 * Implements HTML5 Drag & Drop API for file uploads and interactive elements
 * Provides seamless file handling and content organization features
 */

'use strict';

const DragDropModule = {
    // Configuration
    config: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: {
            documents: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
            images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            spreadsheets: ['xls', 'xlsx', 'csv'],
            presentations: ['ppt', 'pptx'],
            archives: ['zip', 'rar', '7z']
        },
        uploadChunkSize: 1024 * 1024, // 1MB chunks for large files
        previewImageSize: 150, // pixels
        animationDuration: 300
    },

    // File upload state
    uploadState: {
        activeUploads: new Map(),
        uploadQueue: [],
        totalProgress: 0,
        isUploading: false
    },

    // Initialize drag and drop functionality
    init: function() {
        console.log('Initializing Drag & Drop Module...');
        
        this.setupFileUploadAreas();
        this.setupDragDropInteractions();
        this.setupFilePreview();
        this.setupProgressTracking();
        this.preventDefaultDragBehavior();
        this.setupAccessibility();
        
        console.log('Drag & Drop Module initialized successfully');
    },

    // Setup file upload areas
    setupFileUploadAreas: function() {
        const uploadAreas = document.querySelectorAll('.upload-area, .file-upload-area, #uploadArea, #fileUploadArea');
        
        uploadAreas.forEach(area => {
            this.initializeUploadArea(area);
        });

        // Setup file input triggers
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            this.setupFileInput(input);
        });
    },

    // Initialize individual upload area
    initializeUploadArea: function(area) {
        if (area.dataset.initialized) return;
        area.dataset.initialized = 'true';

        // Get associated file input
        const fileInput = area.querySelector('input[type="file"]') || 
                         document.getElementById(area.dataset.fileInput);

        // Drag events
        area.addEventListener('dragenter', (e) => this.handleDragEnter(e, area));
        area.addEventListener('dragover', (e) => this.handleDragOver(e, area));
        area.addEventListener('dragleave', (e) => this.handleDragLeave(e, area));
        area.addEventListener('drop', (e) => this.handleDrop(e, area, fileInput));

        // Click to select files
        area.addEventListener('click', (e) => {
            if (e.target === area || e.target.closest('.upload-content')) {
                if (fileInput) {
                    fileInput.click();
                }
            }
        });

        // Keyboard accessibility
        area.setAttribute('tabindex', '0');
        area.setAttribute('role', 'button');
        area.setAttribute('aria-label', 'Khu vực upload file - nhấn Enter để chọn file hoặc kéo thả file vào đây');

        area.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (fileInput) {
                    fileInput.click();
                }
            }
        });

        // Setup drop zone styling
        this.setupDropZoneStyling(area);
    },

    // Setup file input handlers
    setupFileInput: function(input) {
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const uploadArea = input.closest('.upload-area, .file-upload-area') || 
                              document.querySelector(`[data-file-input="${input.id}"]`);
            
            this.processFiles(files, uploadArea);
        });
    },

    // Handle drag enter
    handleDragEnter: function(e, area) {
        e.preventDefault();
        e.stopPropagation();
        
        area.classList.add('dragover');
        this.showDropIndicator(area);
        
        // Announce to screen readers
        this.announceToScreenReader('File đang được kéo vào khu vực upload');
    },

    // Handle drag over
    handleDragOver: function(e, area) {
        e.preventDefault();
        e.stopPropagation();
        
        // Set drop effect
        e.dataTransfer.dropEffect = 'copy';
        
        // Update visual feedback
        area.classList.add('dragover');
    },

    // Handle drag leave
    handleDragLeave: function(e, area) {
        e.preventDefault();
        e.stopPropagation();
        
        // Only remove dragover if we're leaving the drop zone completely
        if (!area.contains(e.relatedTarget)) {
            area.classList.remove('dragover');
            this.hideDropIndicator(area);
        }
    },

    // Handle file drop
    handleDrop: function(e, area, fileInput) {
        e.preventDefault();
        e.stopPropagation();
        
        area.classList.remove('dragover');
        this.hideDropIndicator(area);
        
        const files = Array.from(e.dataTransfer.files);
        
        if (files.length === 0) {
            this.showErrorMessage(area, 'Không có file nào được chọn');
            return;
        }
        
        // Validate file count if input has multiple attribute
        if (fileInput && !fileInput.multiple && files.length > 1) {
            this.showErrorMessage(area, 'Chỉ được chọn một file');
            return;
        }
        
        this.processFiles(files, area);
        this.announceToScreenReader(`Đã nhận ${files.length} file`);
    },

    // Process uploaded files
    processFiles: function(files, uploadArea) {
        const validFiles = [];
        const invalidFiles = [];
        
        files.forEach(file => {
            const validation = this.validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                invalidFiles.push({ file, error: validation.error });
            }
        });
        
        // Show validation errors
        if (invalidFiles.length > 0) {
            this.showValidationErrors(invalidFiles, uploadArea);
        }
        
        // Process valid files
        if (validFiles.length > 0) {
            this.displayFileList(validFiles, uploadArea);
            this.uploadFiles(validFiles, uploadArea);
        }
    },

    // Validate individual file
    validateFile: function(file) {
        // Check file size
        if (file.size > this.config.maxFileSize) {
            return {
                valid: false,
                error: `File "${file.name}" quá lớn. Kích thước tối đa: ${this.formatFileSize(this.config.maxFileSize)}`
            };
        }
        
        // Check file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = Object.values(this.config.allowedTypes).flat();
        
        if (!allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                error: `File "${file.name}" có định dạng không được hỗ trợ. Chỉ hỗ trợ: ${allowedExtensions.join(', ')}`
            };
        }
        
        return { valid: true };
    },

    // Display file list in upload area
    displayFileList: function(files, uploadArea) {
        let fileList = uploadArea.querySelector('.file-list, .upload-list, #fileList, #uploadList');
        
        if (!fileList) {
            fileList = document.createElement('div');
            fileList.className = 'file-list';
            uploadArea.appendChild(fileList);
        }
        
        files.forEach((file, index) => {
            const fileItem = this.createFileItem(file, index);
            fileList.appendChild(fileItem);
            
            // Animate file item appearance
            setTimeout(() => {
                fileItem.classList.add('show');
            }, index * 100);
        });
    },

    // Create file item element
    createFileItem: function(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = `file_${Date.now()}_${index}`;
        
        const fileIcon = this.getFileIcon(file);
        const fileSize = this.formatFileSize(file.size);
        const fileName = file.name;
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${fileIcon}</div>
                <div class="file-details">
                    <div class="file-name" title="${fileName}">${fileName}</div>
                    <div class="file-meta">
                        <span class="file-size">${fileSize}</span>
                        <span class="file-status">Đang chuẩn bị...</span>
                    </div>
                </div>
            </div>
            <div class="file-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">0%</div>
            </div>
            <div class="file-actions">
                <button type="button" class="file-remove" aria-label="Xóa file ${fileName}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Setup remove button
        const removeBtn = fileItem.querySelector('.file-remove');
        removeBtn.addEventListener('click', () => {
            this.removeFile(fileItem, file);
        });
        
        // Add preview for images
        if (this.isImageFile(file)) {
            this.addImagePreview(fileItem, file);
        }
        
        return fileItem;
    },

    // Get file type icon
    getFileIcon: function(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (this.config.allowedTypes.documents.includes(extension)) {
            if (extension === 'pdf') return '<i class="fas fa-file-pdf"></i>';
            return '<i class="fas fa-file-alt"></i>';
        }
        
        if (this.config.allowedTypes.images.includes(extension)) {
            return '<i class="fas fa-file-image"></i>';
        }
        
        if (this.config.allowedTypes.spreadsheets.includes(extension)) {
            return '<i class="fas fa-file-excel"></i>';
        }
        
        if (this.config.allowedTypes.presentations.includes(extension)) {
            return '<i class="fas fa-file-powerpoint"></i>';
        }
        
        if (this.config.allowedTypes.archives.includes(extension)) {
            return '<i class="fas fa-file-archive"></i>';
        }
        
        return '<i class="fas fa-file"></i>';
    },

    // Check if file is an image
    isImageFile: function(file) {
        return file.type.startsWith('image/');
    },

    // Add image preview
    addImagePreview: function(fileItem, file) {
        const fileIcon = fileItem.querySelector('.file-icon');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = `
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 4px;
            `;
            img.alt = `Preview của ${file.name}`;
            
            fileIcon.innerHTML = '';
            fileIcon.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    },

    // Upload files
    uploadFiles: function(files, uploadArea) {
        files.forEach((file, index) => {
            const fileId = `file_${Date.now()}_${index}`;
            this.uploadState.activeUploads.set(fileId, {
                file: file,
                uploadArea: uploadArea,
                progress: 0,
                status: 'uploading'
            });
            
            // Start upload simulation (replace with actual upload logic)
            this.simulateFileUpload(fileId, file);
        });
        
        this.uploadState.isUploading = true;
        this.updateOverallProgress();
    },

    // Simulate file upload (replace with actual upload implementation)
    simulateFileUpload: function(fileId, file) {
        const upload = this.uploadState.activeUploads.get(fileId);
        if (!upload) return;
        
        const fileItem = upload.uploadArea.querySelector(`[data-file-id="${fileId}"]`);
        if (!fileItem) return;
        
        let progress = 0;
        const progressFill = fileItem.querySelector('.progress-fill');
        const progressText = fileItem.querySelector('.progress-text');
        const fileStatus = fileItem.querySelector('.file-status');
        
        fileStatus.textContent = 'Đang upload...';
        
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 10;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);
                
                // Mark as completed
                upload.progress = 100;
                upload.status = 'completed';
                
                fileStatus.textContent = 'Hoàn thành';
                fileItem.classList.add('completed');
                
                // Remove from active uploads
                this.uploadState.activeUploads.delete(fileId);
                
                // Check if all uploads are complete
                if (this.uploadState.activeUploads.size === 0) {
                    this.uploadState.isUploading = false;
                    this.onAllUploadsComplete(upload.uploadArea);
                }
                
                this.announceToScreenReader(`Upload file "${file.name}" hoàn thành`);
            }
            
            // Update progress display
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            upload.progress = progress;
            
            this.updateOverallProgress();
        }, 100 + Math.random() * 200);
        
        // Store interval for potential cancellation
        upload.interval = uploadInterval;
    },

    // Update overall progress
    updateOverallProgress: function() {
        if (this.uploadState.activeUploads.size === 0) {
            this.uploadState.totalProgress = 0;
            return;
        }
        
        let totalProgress = 0;
        this.uploadState.activeUploads.forEach(upload => {
            totalProgress += upload.progress;
        });
        
        this.uploadState.totalProgress = totalProgress / this.uploadState.activeUploads.size;
        
        // Update global progress indicator if exists
        const globalProgress = document.querySelector('.global-upload-progress');
        if (globalProgress) {
            globalProgress.style.width = `${this.uploadState.totalProgress}%`;
        }
    },

    // Handle upload completion
    onAllUploadsComplete: function(uploadArea) {
        this.showSuccessMessage(uploadArea, 'Tất cả file đã được upload thành công!');
        
        // Trigger custom event
        const event = new CustomEvent('uploadComplete', {
            detail: { uploadArea: uploadArea }
        });
        document.dispatchEvent(event);
    },

    // Remove file
    removeFile: function(fileItem, file) {
        const fileId = fileItem.dataset.fileId;
        
        // Cancel upload if in progress
        const upload = this.uploadState.activeUploads.get(fileId);
        if (upload && upload.interval) {
            clearInterval(upload.interval);
            this.uploadState.activeUploads.delete(fileId);
        }
        
        // Animate removal
        fileItem.classList.add('removing');
        setTimeout(() => {
            fileItem.remove();
        }, this.config.animationDuration);
        
        this.announceToScreenReader(`Đã xóa file "${file.name}"`);
    },

    // Setup drag and drop for other interactive elements
    setupDragDropInteractions: function() {
        this.setupSortableLists();
        this.setupDraggableCards();
    },

    // Setup sortable lists
    setupSortableLists: function() {
        const sortableLists = document.querySelectorAll('[data-sortable]');
        
        sortableLists.forEach(list => {
            this.initializeSortableList(list);
        });
    },

    // Initialize sortable list
    initializeSortableList: function(list) {
        const items = list.querySelectorAll('[data-draggable]');
        
        items.forEach(item => {
            item.setAttribute('draggable', 'true');
            item.classList.add('draggable-item');
            
            item.addEventListener('dragstart', (e) => this.handleItemDragStart(e, item));
            item.addEventListener('dragend', (e) => this.handleItemDragEnd(e, item));
        });
        
        list.addEventListener('dragover', (e) => this.handleListDragOver(e, list));
        list.addEventListener('drop', (e) => this.handleListDrop(e, list));
    },

    // Handle item drag start
    handleItemDragStart: function(e, item) {
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.outerHTML);
        e.dataTransfer.setData('text/plain', item.dataset.id || item.textContent);
        
        // Create drag image
        const dragImage = item.cloneNode(true);
        dragImage.style.transform = 'rotate(5deg)';
        dragImage.style.opacity = '0.8';
        e.dataTransfer.setDragImage(dragImage, 0, 0);
    },

    // Handle item drag end
    handleItemDragEnd: function(e, item) {
        item.classList.remove('dragging');
        
        // Remove any drop indicators
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
    },

    // Handle list drag over
    handleListDragOver: function(e, list) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const draggingItem = list.querySelector('.dragging');
        if (!draggingItem) return;
        
        const afterElement = this.getDragAfterElement(list, e.clientY);
        
        if (afterElement == null) {
            list.appendChild(draggingItem);
        } else {
            list.insertBefore(draggingItem, afterElement);
        }
    },

    // Handle list drop
    handleListDrop: function(e, list) {
        e.preventDefault();
        
        // Trigger reorder event
        const event = new CustomEvent('itemReorder', {
            detail: { 
                list: list,
                newOrder: this.getListOrder(list)
            }
        });
        document.dispatchEvent(event);
        
        this.announceToScreenReader('Thứ tự danh sách đã được thay đổi');
    },

    // Get drag after element
    getDragAfterElement: function(container, y) {
        const draggableElements = [...container.querySelectorAll('[data-draggable]:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    // Get list order
    getListOrder: function(list) {
        const items = list.querySelectorAll('[data-draggable]');
        return Array.from(items).map(item => item.dataset.id || item.textContent.trim());
    },

    // Setup draggable cards
    setupDraggableCards: function() {
        const draggableCards = document.querySelectorAll('.draggable-card, [data-card-draggable]');
        
        draggableCards.forEach(card => {
            card.setAttribute('draggable', 'true');
            card.addEventListener('dragstart', (e) => this.handleCardDragStart(e, card));
            card.addEventListener('dragend', (e) => this.handleCardDragEnd(e, card));
        });
        
        // Setup drop zones for cards
        const dropZones = document.querySelectorAll('.card-drop-zone, [data-card-drop-zone]');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleCardDragOver(e, zone));
            zone.addEventListener('drop', (e) => this.handleCardDrop(e, zone));
        });
    },

    // Handle card drag start
    handleCardDragStart: function(e, card) {
        card.classList.add('card-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({
            id: card.dataset.cardId,
            type: 'card',
            source: card.parentElement.dataset.zoneId
        }));
    },

    // Handle card drag end
    handleCardDragEnd: function(e, card) {
        card.classList.remove('card-dragging');
    },

    // Handle card drag over
    handleCardDragOver: function(e, zone) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drop-zone-active');
    },

    // Handle card drop
    handleCardDrop: function(e, zone) {
        e.preventDefault();
        zone.classList.remove('drop-zone-active');
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'card') {
                const sourceZone = document.querySelector(`[data-zone-id="${data.source}"]`);
                const card = sourceZone?.querySelector(`[data-card-id="${data.id}"]`);
                
                if (card && zone !== sourceZone) {
                    zone.appendChild(card);
                    
                    // Trigger card move event
                    const event = new CustomEvent('cardMove', {
                        detail: {
                            cardId: data.id,
                            fromZone: data.source,
                            toZone: zone.dataset.zoneId
                        }
                    });
                    document.dispatchEvent(event);
                    
                    this.announceToScreenReader(`Đã di chuyển thẻ từ ${data.source} sang ${zone.dataset.zoneId}`);
                }
            }
        } catch (error) {
            console.error('Error processing card drop:', error);
        }
    },

    // Setup file preview functionality
    setupFilePreview: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.file-item')) {
                const fileItem = e.target.closest('.file-item');
                const fileName = fileItem.querySelector('.file-name').textContent;
                
                if (this.isPreviewableFile(fileName)) {
                    this.showFilePreview(fileItem);
                }
            }
        });
    },

    // Check if file is previewable
    isPreviewableFile: function(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt'].includes(extension);
    },

    // Show file preview modal
    showFilePreview: function(fileItem) {
        const fileName = fileItem.querySelector('.file-name').textContent;
        const fileIcon = fileItem.querySelector('.file-icon img');
        
        const modal = document.createElement('div');
        modal.className = 'file-preview-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${fileName}</h3>
                    <button type="button" class="modal-close" aria-label="Đóng preview">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${fileIcon ? `<img src="${fileIcon.src}" alt="Preview ${fileName}" class="preview-image">` : 
                                '<div class="preview-placeholder">Không thể preview file này</div>'}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary modal-close">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="window.open('${fileIcon?.src}', '_blank')">
                        Mở trong tab mới
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelectorAll('.modal-close, .modal-backdrop').forEach(element => {
            element.addEventListener('click', () => {
                modal.remove();
            });
        });
        
        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.focus();
    },

    // Setup progress tracking
    setupProgressTracking: function() {
        // Create global progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'global-upload-progress-container';
        progressContainer.innerHTML = `
            <div class="upload-status">
                <span class="upload-text">Uploading files...</span>
                <div class="global-upload-progress"></div>
            </div>
        `;
        
        progressContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: none;
        `;
        
        document.body.appendChild(progressContainer);
        
        // Show/hide based on upload state
        setInterval(() => {
            if (this.uploadState.isUploading) {
                progressContainer.style.display = 'block';
            } else {
                progressContainer.style.display = 'none';
            }
        }, 100);
    },

    // Prevent default drag behavior on document
    preventDefaultDragBehavior: function() {
        // Prevent default drag behavior on the entire document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                // Only prevent default if not in a designated drop zone
                if (!e.target.closest('.upload-area, .file-upload-area, [data-sortable], .card-drop-zone')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, false);
        });
    },

    // Setup accessibility features
    setupAccessibility: function() {
        // Add ARIA labels and roles
        const uploadAreas = document.querySelectorAll('.upload-area, .file-upload-area');
        uploadAreas.forEach(area => {
            if (!area.hasAttribute('aria-label')) {
                area.setAttribute('aria-label', 'Khu vực upload file');
            }
            
            if (!area.hasAttribute('role')) {
                area.setAttribute('role', 'button');
            }
        });
        
        // Add keyboard navigation for file items
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('file-item')) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    const removeBtn = e.target.querySelector('.file-remove');
                    if (removeBtn) {
                        removeBtn.click();
                    }
                }
            }
        });
    },

    // Show/hide drop indicator
    showDropIndicator: function(area) {
        if (area.querySelector('.drop-indicator')) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        indicator.innerHTML = `
            <div class="drop-indicator-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Thả file vào đây</span>
            </div>
        `;
        
        area.appendChild(indicator);
    },

    hideDropIndicator: function(area) {
        const indicator = area.querySelector('.drop-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // Setup drop zone styling
    setupDropZoneStyling: function(area) {
        if (area.dataset.styled) return;
        area.dataset.styled = 'true';
        
        // Add CSS classes for styling
        area.classList.add('drop-zone');
        
        // Add styles if not already present
        if (!document.getElementById('dragdrop-styles')) {
            const styles = document.createElement('style');
            styles.id = 'dragdrop-styles';
            styles.textContent = `
                .drop-zone {
                    transition: all 0.3s ease;
                    border: 2px dashed #e5e7eb;
                    border-radius: 8px;
                    position: relative;
                }
                
                .drop-zone.dragover {
                    border-color: #2563eb;
                    background-color: rgba(37, 99, 235, 0.05);
                    transform: scale(1.02);
                }
                
                .drop-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(37, 99, 235, 0.1);
                    border: 2px solid #2563eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                
                .drop-indicator-content {
                    text-align: center;
                    color: #2563eb;
                    font-weight: 600;
                }
                
                .drop-indicator-content i {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    display: block;
                }
                
                .file-item {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: white;
                }
                
                .file-item.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .file-item.removing {
                    opacity: 0;
                    transform: translateX(-100%);
                }
                
                .file-item.completed {
                    border-color: #10b981;
                    background: #f0fdf4;
                }
                
                .file-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .file-icon {
                    font-size: 1.5rem;
                    color: #6b7280;
                    width: 40px;
                    text-align: center;
                }
                
                .file-details {
                    flex: 1;
                }
                
                .file-name {
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                }
                
                .file-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .file-progress {
                    margin: 0.5rem 0;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .progress-bar {
                    flex: 1;
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #2563eb;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    font-size: 0.875rem;
                    font-weight: 500;
                    min-width: 40px;
                    text-align: right;
                }
                
                .file-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .file-remove {
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .file-remove:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }
                
                .draggable-item {
                    cursor: move;
                    transition: all 0.3s ease;
                }
                
                .draggable-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .draggable-item.dragging {
                    opacity: 0.5;
                    transform: rotate(5deg);
                }
                
                .card-drop-zone {
                    min-height: 100px;
                    border: 2px dashed transparent;
                    transition: all 0.3s ease;
                    border-radius: 8px;
                    padding: 1rem;
                }
                
                .card-drop-zone.drop-zone-active {
                    border-color: #2563eb;
                    background: rgba(37, 99, 235, 0.05);
                }
                
                .file-preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                }
                
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    max-width: 90vw;
                    max-height: 90vh;
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .modal-body {
                    padding: 1rem;
                    max-height: 60vh;
                    overflow: auto;
                }
                
                .preview-image {
                    max-width: 100%;
                    max-height: 50vh;
                    object-fit: contain;
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1rem;
                    border-top: 1px solid #e5e7eb;
                }
                
                .no-animations * {
                    transition: none !important;
                    animation: none !important;
                }
            `;
            
            document.head.appendChild(styles);
        }
    },

    // Utility functions
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Show error message
    showErrorMessage: function(area, message) {
        this.showMessage(area, message, 'error');
    },

    // Show success message
    showSuccessMessage: function(area, message) {
        this.showMessage(area, message, 'success');
    },

    // Show validation errors
    showValidationErrors: function(invalidFiles, area) {
        const errorMessages = invalidFiles.map(item => item.error).join('\n');
        this.showErrorMessage(area, errorMessages);
    },

    // Generic message display
    showMessage: function(area, message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `upload-message upload-message-${type}`;
        messageElement.textContent = message;
        
        messageElement.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
            font-size: 0.875rem;
            background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#e0e7ff'};
            color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af'};
            border: 1px solid ${type === 'error' ? '#fecaca' : type === 'success' ? '#a7f3d0' : '#c7d2fe'};
        `;
        
        area.appendChild(messageElement);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    },

    // Announce to screen readers
    announceToScreenReader: function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    },

    // Public API methods
    api: {
        // Add files programmatically
        addFiles: function(files, uploadAreaSelector) {
            const uploadArea = document.querySelector(uploadAreaSelector);
            if (uploadArea && files.length > 0) {
                DragDropModule.processFiles(Array.from(files), uploadArea);
            }
        },

        // Get upload status
        getUploadStatus: function() {
            return {
                isUploading: DragDropModule.uploadState.isUploading,
                activeUploads: DragDropModule.uploadState.activeUploads.size,
                totalProgress: DragDropModule.uploadState.totalProgress
            };
        },

        // Cancel all uploads
        cancelAllUploads: function() {
            DragDropModule.uploadState.activeUploads.forEach((upload, fileId) => {
                if (upload.interval) {
                    clearInterval(upload.interval);
                }
            });
            DragDropModule.uploadState.activeUploads.clear();
            DragDropModule.uploadState.isUploading = false;
        },

        // Configure module
        configure: function(options) {
            Object.assign(DragDropModule.config, options);
        }
    }
};

// Initialize Drag & Drop Module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    DragDropModule.init();
});

// Global API exposure
window.TechVietDragDrop = DragDropModule.api;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragDropModule;
}
