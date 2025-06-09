/**
 * TechViet - Canvas Module
 * Implements HTML5 Canvas API for interactive charts and visualizations
 * Provides dynamic data visualization without external image dependencies
 */

'use strict';

const CanvasModule = {
    // Canvas configurations
    config: {
        chartColors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#f59e0b',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            gradient1: '#8b5cf6',
            gradient2: '#06b6d4'
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    },

    // Initialize all canvas elements
    init: function() {
        console.log('Initializing Canvas Module...');
        this.setupCanvasElements();
        this.startAnimationLoop();
    },

    // Setup all canvas elements on the page
    setupCanvasElements: function() {
        // Hero section canvas
        const heroCanvas = document.getElementById('heroCanvas');
        if (heroCanvas) {
            this.drawHeroVisualization(heroCanvas);
        }

        // About page canvases
        const visionCanvas = document.getElementById('visionCanvas');
        if (visionCanvas) {
            this.drawVisionChart(visionCanvas);
        }

        const missionCanvas = document.getElementById('missionCanvas');
        if (missionCanvas) {
            this.drawMissionChart(missionCanvas);
        }

        const valuesCanvas = document.getElementById('valuesCanvas');
        if (valuesCanvas) {
            this.drawValuesChart(valuesCanvas);
        }

        // Services page canvas
        const comparisonCanvas = document.getElementById('comparisonCanvas');
        if (comparisonCanvas) {
            this.setupServiceComparison(comparisonCanvas);
        }

        // Products page canvases
        this.setupProductCanvases();

        // Blog page canvases
        this.setupBlogCanvases();

        // Contact page canvas
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
            this.drawMapVisualization(mapCanvas);
        }
    },

    // Draw hero section visualization
    drawHeroVisualization: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Create gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, this.config.chartColors.primary + '20');
        bgGradient.addColorStop(1, this.config.chartColors.secondary + '10');
        
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw animated tech elements
        this.drawTechElements(ctx, width, height);
        
        // Draw data flow lines
        this.drawDataFlow(ctx, width, height);
        
        // Draw central node
        this.drawCentralNode(ctx, width / 2, height / 2);
    },

    // Draw tech elements (circuits, nodes)
    drawTechElements: function(ctx, width, height) {
        const time = Date.now() * 0.001;
        
        // Draw circuit lines
        ctx.strokeStyle = this.config.chartColors.primary + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Horizontal lines
        for (let i = 0; i < 5; i++) {
            const y = (height / 6) * (i + 1);
            const offset = Math.sin(time + i) * 10;
            ctx.moveTo(offset, y);
            ctx.lineTo(width - offset, y);
        }
        
        // Vertical lines
        for (let i = 0; i < 5; i++) {
            const x = (width / 6) * (i + 1);
            const offset = Math.cos(time + i) * 10;
            ctx.moveTo(x, offset);
            ctx.lineTo(x, height - offset);
        }
        
        ctx.stroke();

        // Draw nodes at intersections
        ctx.fillStyle = this.config.chartColors.accent;
        for (let i = 1; i < 5; i++) {
            for (let j = 1; j < 5; j++) {
                const x = (width / 6) * (i + 1);
                const y = (height / 6) * (j + 1);
                const pulse = Math.sin(time * 2 + i + j) * 0.5 + 0.5;
                const radius = 3 + pulse * 2;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },

    // Draw data flow animation
    drawDataFlow: function(ctx, width, height) {
        const time = Date.now() * 0.001;
        
        // Flowing particles
        ctx.fillStyle = this.config.chartColors.gradient1;
        for (let i = 0; i < 20; i++) {
            const x = (width / 20) * i + (Math.sin(time + i) * 20);
            const y = height / 2 + Math.sin(time * 2 + i) * 50;
            const size = Math.sin(time * 3 + i) * 2 + 3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Draw central processing node
    drawCentralNode: function(ctx, centerX, centerY) {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2) * 0.3 + 0.7;
        
        // Outer ring
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner core
        ctx.fillStyle = this.config.chartColors.accent;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Rotating elements
        for (let i = 0; i < 6; i++) {
            const angle = (time + i * Math.PI / 3);
            const x = centerX + Math.cos(angle) * 40;
            const y = centerY + Math.sin(angle) * 40;
            
            ctx.fillStyle = this.config.chartColors.gradient2;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Draw vision chart for about page
    drawVisionChart: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Growth chart visualization
        const data = [20, 35, 45, 60, 80, 95];
        const maxValue = Math.max(...data);
        const barWidth = width / data.length;
        
        // Draw gradient bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (height - 40);
            const x = index * barWidth + 10;
            const y = height - barHeight - 20;
            
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, this.config.chartColors.primary);
            gradient.addColorStop(1, this.config.chartColors.gradient1);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 20, barHeight);
            
            // Add value labels
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(value + '%', x + (barWidth - 20) / 2, y - 10);
        });
        
        // Add title
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Tăng trưởng dự kiến', width / 2, 20);
    },

    // Draw mission chart
    drawMissionChart: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Pie chart for mission areas
        const data = [
            { label: 'Web Dev', value: 30, color: this.config.chartColors.primary },
            { label: 'Mobile', value: 25, color: this.config.chartColors.accent },
            { label: 'AI/ML', value: 20, color: this.config.chartColors.success },
            { label: 'Cloud', value: 15, color: this.config.chartColors.gradient1 },
            { label: 'IoT', value: 10, color: this.config.chartColors.gradient2 }
        ];
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach(segment => {
            const sliceAngle = (segment.value / 100) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(segment.label, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    },

    // Draw values chart
    drawValuesChart: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Radar chart for company values
        const values = ['Đổi mới', 'Chất lượng', 'Tận tâm', 'Trách nhiệm', 'Hiệu quả'];
        const scores = [90, 95, 88, 92, 85];
        const maxScore = 100;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        const angleStep = (2 * Math.PI) / values.length;
        
        // Draw grid
        ctx.strokeStyle = this.config.chartColors.secondary + '30';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            const gridRadius = (radius / 5) * i;
            ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw axes
        for (let i = 0; i < values.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Draw labels
            const labelX = centerX + Math.cos(angle) * (radius + 15);
            const labelY = centerY + Math.sin(angle) * (radius + 15);
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(values[i], labelX, labelY);
        }
        
        // Draw data polygon
        ctx.beginPath();
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.fillStyle = this.config.chartColors.primary + '30';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < scores.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (scores[i] / maxScore) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = this.config.chartColors.accent;
        for (let i = 0; i < scores.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (scores[i] / maxScore) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    },

    // Setup service comparison chart
    setupServiceComparison: function(canvas) {
        const ctx = canvas.getContext('2d');
        const checkboxes = document.querySelectorAll('.service-checkboxes input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateServiceComparison(canvas);
            });
        });
        
        // Initial draw
        this.updateServiceComparison(canvas);
    },

    // Update service comparison chart
    updateServiceComparison: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const checkboxes = document.querySelectorAll('.service-checkboxes input[type="checkbox"]:checked');
        const selectedServices = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedServices.length === 0) {
            // Show instruction text
            ctx.fillStyle = this.config.chartColors.secondary;
            ctx.font = '16px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('Chọn dịch vụ để so sánh', width / 2, height / 2);
            return;
        }
        
        // Service comparison data
        const serviceData = {
            web: { cost: 70, time: 40, complexity: 50, maintenance: 30 },
            mobile: { cost: 90, time: 80, complexity: 70, maintenance: 60 },
            cloud: { cost: 80, time: 60, complexity: 80, maintenance: 70 }
        };
        
        const metrics = ['cost', 'time', 'complexity', 'maintenance'];
        const metricLabels = ['Chi phí', 'Thời gian', 'Độ phức tạp', 'Bảo trì'];
        
        // Draw comparison bars
        const barHeight = 30;
        const barSpacing = 50;
        const startY = 50;
        
        metrics.forEach((metric, metricIndex) => {
            const y = startY + metricIndex * barSpacing;
            
            // Draw metric label
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '14px Roboto';
            ctx.textAlign = 'left';
            ctx.fillText(metricLabels[metricIndex], 10, y + barHeight / 2 + 5);
            
            // Draw bars for each selected service
            selectedServices.forEach((service, serviceIndex) => {
                const value = serviceData[service] ? serviceData[service][metric] : 0;
                const barWidth = (value / 100) * (width - 150);
                const x = 120 + serviceIndex * 5;
                
                const colors = [
                    this.config.chartColors.primary,
                    this.config.chartColors.accent,
                    this.config.chartColors.success
                ];
                
                ctx.fillStyle = colors[serviceIndex % colors.length];
                ctx.fillRect(x, y, barWidth, barHeight - 10);
                
                // Add value label
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Roboto';
                ctx.textAlign = 'left';
                ctx.fillText(value + '%', x + 10, y + barHeight / 2 + 3);
            });
        });
        
        // Draw legend
        this.drawLegend(ctx, selectedServices, width - 150, startY);
    },

    // Draw legend for charts
    drawLegend: function(ctx, items, x, y) {
        const colors = [
            this.config.chartColors.primary,
            this.config.chartColors.accent,
            this.config.chartColors.success
        ];
        
        const serviceNames = {
            web: 'Web Dev',
            mobile: 'Mobile',
            cloud: 'Cloud'
        };
        
        items.forEach((item, index) => {
            const legendY = y + index * 25;
            
            // Draw color box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, legendY, 15, 15);
            
            // Draw label
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '12px Roboto';
            ctx.textAlign = 'left';
            ctx.fillText(serviceNames[item] || item, x + 25, legendY + 12);
        });
    },

    // Setup product canvases
    setupProductCanvases: function() {
        const productCanvases = document.querySelectorAll('.product-canvas');
        
        productCanvases.forEach(canvas => {
            const productType = canvas.getAttribute('data-product');
            this.drawProductVisualization(canvas, productType);
        });

        // Product comparison
        const comparisonCanvas = document.getElementById('productComparisonCanvas');
        if (comparisonCanvas) {
            this.setupProductComparison(comparisonCanvas);
        }

        // Product demo
        const demoCanvas = document.getElementById('demoCanvas');
        if (demoCanvas) {
            this.setupProductDemo(demoCanvas);
        }
    },

    // Draw product visualization
    drawProductVisualization: function(canvas, productType) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, this.config.chartColors.primary + '10');
        gradient.addColorStop(1, this.config.chartColors.secondary + '05');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        switch (productType) {
            case 'erp':
                this.drawERPInterface(ctx, width, height);
                break;
            case 'ecommerce':
                this.drawEcommerceInterface(ctx, width, height);
                break;
            case 'delivery':
                this.drawDeliveryInterface(ctx, width, height);
                break;
            case 'smart-home':
                this.drawSmartHomeInterface(ctx, width, height);
                break;
            case 'analytics':
                this.drawAnalyticsInterface(ctx, width, height);
                break;
            case 'learning':
                this.drawLearningInterface(ctx, width, height);
                break;
        }
    },

    // Draw ERP interface mockup
    drawERPInterface: function(ctx, width, height) {
        // Draw dashboard elements
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(10, 10, width - 20, 30);
        
        // Draw cards
        const cardWidth = (width - 40) / 3;
        for (let i = 0; i < 3; i++) {
            const x = 10 + i * (cardWidth + 10);
            const y = 50;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, cardWidth, 60);
            ctx.strokeStyle = this.config.chartColors.secondary;
            ctx.strokeRect(x, y, cardWidth, 60);
            
            // Mini chart in card
            ctx.fillStyle = this.config.chartColors.accent;
            for (let j = 0; j < 5; j++) {
                const barHeight = Math.random() * 20 + 5;
                ctx.fillRect(x + 10 + j * 8, y + 45 - barHeight, 6, barHeight);
            }
        }
        
        // Draw table
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 130, width - 20, height - 140);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(10, 130, width - 20, height - 140);
        
        // Table headers
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(10, 130, width - 20, 25);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('Sản phẩm', 20, 147);
        ctx.fillText('Số lượng', 120, 147);
        ctx.fillText('Giá', 200, 147);
    },

    // Draw E-commerce interface
    drawEcommerceInterface: function(ctx, width, height) {
        // Product grid
        const productSize = 60;
        const cols = Math.floor((width - 20) / (productSize + 10));
        const rows = Math.floor((height - 60) / (productSize + 10));
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = 10 + col * (productSize + 10);
                const y = 50 + row * (productSize + 10);
                
                // Product card
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x, y, productSize, productSize);
                ctx.strokeStyle = this.config.chartColors.secondary;
                ctx.strokeRect(x, y, productSize, productSize);
                
                // Product image placeholder
                ctx.fillStyle = this.config.chartColors.accent + '50';
                ctx.fillRect(x + 5, y + 5, productSize - 10, 35);
                
                // Price bar
                ctx.fillStyle = this.config.chartColors.primary;
                ctx.fillRect(x + 5, y + 45, productSize - 10, 10);
            }
        }
        
        // Header
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(0, 0, width, 40);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('E-Commerce Platform', width / 2, 25);
    },

    // Draw Delivery tracking interface
    drawDeliveryInterface: function(ctx, width, height) {
        // Map background
        ctx.fillStyle = this.config.chartColors.success + '20';
        ctx.fillRect(0, 0, width, height);
        
        // Route line
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, height - 40);
        ctx.quadraticCurveTo(width / 2, 40, width - 20, height / 2);
        ctx.stroke();
        
        // Delivery points
        const points = [
            { x: 20, y: height - 40, status: 'completed' },
            { x: width / 3, y: height / 2, status: 'current' },
            { x: 2 * width / 3, y: height / 3, status: 'pending' },
            { x: width - 20, y: height / 2, status: 'pending' }
        ];
        
        points.forEach(point => {
            const color = point.status === 'completed' ? this.config.chartColors.success :
                         point.status === 'current' ? this.config.chartColors.accent :
                         this.config.chartColors.secondary;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            if (point.status === 'current') {
                // Pulsing effect for current location
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 15, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
        
        // Info panel
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(10, 10, 150, 80);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(10, 10, 150, 80);
        
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('Đơn hàng: #DH001', 20, 30);
        ctx.fillText('Trạng thái: Đang giao', 20, 50);
        ctx.fillText('ETA: 15 phút', 20, 70);
    },

    // Draw Smart Home interface
    drawSmartHomeInterface: function(ctx, width, height) {
        // House outline
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // House shape
        ctx.moveTo(width / 2, 20);
        ctx.lineTo(width - 20, height / 3);
        ctx.lineTo(width - 20, height - 20);
        ctx.lineTo(20, height - 20);
        ctx.lineTo(20, height / 3);
        ctx.closePath();
        ctx.stroke();
        
        // Roof
        ctx.beginPath();
        ctx.moveTo(20, height / 3);
        ctx.lineTo(width / 2, 20);
        ctx.lineTo(width - 20, height / 3);
        ctx.stroke();
        
        // Smart devices
        const devices = [
            { x: width / 4, y: height / 2, type: 'light', active: true },
            { x: 3 * width / 4, y: height / 2, type: 'thermostat', active: false },
            { x: width / 2, y: 2 * height / 3, type: 'security', active: true },
            { x: width / 3, y: 3 * height / 4, type: 'speaker', active: true }
        ];
        
        devices.forEach(device => {
            const color = device.active ? this.config.chartColors.success : this.config.chartColors.secondary;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(device.x, device.y, 12, 0, 2 * Math.PI);
            ctx.fill();
            
            // Device icon
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            const icon = device.type === 'light' ? '💡' :
                        device.type === 'thermostat' ? '🌡️' :
                        device.type === 'security' ? '🔒' : '🔊';
            ctx.fillText(icon, device.x, device.y + 4);
            
            if (device.active) {
                // Connection lines
                ctx.strokeStyle = color + '50';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(device.x, device.y);
                ctx.lineTo(width / 2, height / 4);
                ctx.stroke();
            }
        });
        
        // Central hub
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.beginPath();
        ctx.arc(width / 2, height / 4, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('HUB', width / 2, height / 4 + 4);
    },

    // Draw Analytics interface
    drawAnalyticsInterface: function(ctx, width, height) {
        // Dashboard layout
        const margin = 10;
        const cardHeight = (height - 40) / 2;
        
        // Chart 1: Line chart
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(margin, margin, width / 2 - margin * 1.5, cardHeight);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(margin, margin, width / 2 - margin * 1.5, cardHeight);
        
        // Draw line chart
        const points = [
            { x: 20, y: cardHeight - 20 },
            { x: 40, y: cardHeight - 40 },
            { x: 60, y: cardHeight - 35 },
            { x: 80, y: cardHeight - 60 },
            { x: 100, y: cardHeight - 55 },
            { x: 120, y: cardHeight - 75 }
        ];
        
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin + points[0].x, margin + points[0].y);
        points.slice(1).forEach(point => {
            ctx.lineTo(margin + point.x, margin + point.y);
        });
        ctx.stroke();
        
        // Chart 2: Pie chart
        const pieX = width / 2 + width / 4;
        const pieY = margin + cardHeight / 2;
        const pieRadius = Math.min(width / 4, cardHeight) / 3;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width / 2 + margin / 2, margin, width / 2 - margin * 1.5, cardHeight);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(width / 2 + margin / 2, margin, width / 2 - margin * 1.5, cardHeight);
        
        const pieData = [30, 25, 20, 15, 10];
        const colors = [
            this.config.chartColors.primary,
            this.config.chartColors.accent,
            this.config.chartColors.success,
            this.config.chartColors.gradient1,
            this.config.chartColors.gradient2
        ];
        
        let currentAngle = 0;
        pieData.forEach((value, index) => {
            const sliceAngle = (value / 100) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(pieX, pieY);
            ctx.arc(pieX, pieY, pieRadius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
        
        // Chart 3: Bar chart
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(margin, cardHeight + 20, width - margin * 2, cardHeight);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(margin, cardHeight + 20, width - margin * 2, cardHeight);
        
        const barData = [60, 80, 45, 90, 70, 55];
        const barWidth = (width - 60) / barData.length;
        
        barData.forEach((value, index) => {
            const barHeight = (value / 100) * (cardHeight - 40);
            const x = margin + 20 + index * barWidth;
            const y = cardHeight + 20 + cardHeight - barHeight - 20;
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.fillRect(x, y, barWidth - 10, barHeight);
        });
    },

    // Draw Learning platform interface
    drawLearningInterface: function(ctx, width, height) {
        // Course grid
        const courseWidth = (width - 40) / 3;
        const courseHeight = (height - 60) / 2;
        
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                const x = 10 + col * (courseWidth + 10);
                const y = 40 + row * (courseHeight + 10);
                
                // Course card
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x, y, courseWidth, courseHeight);
                ctx.strokeStyle = this.config.chartColors.secondary;
                ctx.strokeRect(x, y, courseWidth, courseHeight);
                
                // Video preview
                ctx.fillStyle = this.config.chartColors.primary + '30';
                ctx.fillRect(x + 5, y + 5, courseWidth - 10, courseHeight / 2);
                
                // Play button
                ctx.fillStyle = this.config.chartColors.primary;
                ctx.beginPath();
                ctx.moveTo(x + courseWidth / 2 - 8, y + courseHeight / 4 - 6);
                ctx.lineTo(x + courseWidth / 2 + 8, y + courseHeight / 4);
                ctx.lineTo(x + courseWidth / 2 - 8, y + courseHeight / 4 + 6);
                ctx.closePath();
                ctx.fill();
                
                // Progress bar
                const progress = Math.random();
                ctx.fillStyle = this.config.chartColors.secondary + '50';
                ctx.fillRect(x + 5, y + courseHeight - 15, courseWidth - 10, 8);
                ctx.fillStyle = this.config.chartColors.success;
                ctx.fillRect(x + 5, y + courseHeight - 15, (courseWidth - 10) * progress, 8);
            }
        }
        
        // Header
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(0, 0, width, 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('TechViet Learning Platform', width / 2, 20);
    },

    // Setup product comparison
    setupProductComparison: function(canvas) {
        const selectors = document.querySelectorAll('.product-selector');
        
        selectors.forEach(selector => {
            selector.addEventListener('change', () => {
                this.updateProductComparison(canvas);
            });
        });
        
        this.updateProductComparison(canvas);
    },

    // Update product comparison
    updateProductComparison: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const product1 = document.getElementById('product1').value;
        const product2 = document.getElementById('product2').value;
        
        if (!product1 || !product2) {
            ctx.fillStyle = this.config.chartColors.secondary;
            ctx.font = '16px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('Chọn 2 sản phẩm để so sánh', width / 2, height / 2);
            return;
        }
        
        // Product comparison data
        const productData = {
            erp: { performance: 85, scalability: 90, usability: 75, cost: 70 },
            ecommerce: { performance: 80, scalability: 85, usability: 90, cost: 60 },
            delivery: { performance: 90, scalability: 70, usability: 85, cost: 50 },
            analytics: { performance: 95, scalability: 80, usability: 70, cost: 80 }
        };
        
        const metrics = ['performance', 'scalability', 'usability', 'cost'];
        const metricLabels = ['Hiệu suất', 'Khả năng mở rộng', 'Dễ sử dụng', 'Chi phí'];
        
        // Draw radar chart comparison
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        const angleStep = (2 * Math.PI) / metrics.length;
        
        // Draw grid
        ctx.strokeStyle = this.config.chartColors.secondary + '30';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            const gridRadius = (radius / 5) * i;
            ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw axes and labels
        for (let i = 0; i < metrics.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Labels
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(metricLabels[i], labelX, labelY);
        }
        
        // Draw product 1 data
        if (productData[product1]) {
            ctx.beginPath();
            ctx.strokeStyle = this.config.chartColors.primary;
            ctx.fillStyle = this.config.chartColors.primary + '20';
            ctx.lineWidth = 2;
            
            metrics.forEach((metric, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const distance = (productData[product1][metric] / 100) * radius;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        // Draw product 2 data
        if (productData[product2]) {
            ctx.beginPath();
            ctx.strokeStyle = this.config.chartColors.accent;
            ctx.fillStyle = this.config.chartColors.accent + '20';
            ctx.lineWidth = 2;
            
            metrics.forEach((metric, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const distance = (productData[product2][metric] / 100) * radius;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        // Legend
        const productNames = {
            erp: 'TechViet ERP',
            ecommerce: 'TechViet Commerce',
            delivery: 'TechViet Delivery',
            analytics: 'TechViet Analytics'
        };
        
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(20, 20, 15, 15);
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText(productNames[product1] || product1, 45, 32);
        
        ctx.fillStyle = this.config.chartColors.accent;
        ctx.fillRect(20, 45, 15, 15);
        ctx.fillStyle = this.config.chartColors.accent;
        ctx.fillText(productNames[product2] || product2, 45, 57);
    },

    // Setup product demo
    setupProductDemo: function(canvas) {
        const demoButtons = document.querySelectorAll('.demo-btn');
        
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                demoButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const demoType = button.getAttribute('data-demo');
                this.updateProductDemo(canvas, demoType);
            });
        });
        
        // Initial demo
        this.updateProductDemo(canvas, 'dashboard');
    },

    // Update product demo
    updateProductDemo: function(canvas, demoType) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Demo background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        
        switch (demoType) {
            case 'dashboard':
                this.drawDashboardDemo(ctx, width, height);
                break;
            case 'mobile':
                this.drawMobileDemo(ctx, width, height);
                break;
            case 'iot':
                this.drawIoTDemo(ctx, width, height);
                break;
        }
    },

    // Draw dashboard demo
    drawDashboardDemo: function(ctx, width, height) {
        // Header
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(0, 0, width, 60);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('Analytics Dashboard', 20, 35);
        
        // Sidebar
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 60, 200, height - 60);
        
        // Menu items
        const menuItems = ['Dashboard', 'Analytics', 'Reports', 'Settings'];
        menuItems.forEach((item, index) => {
            const y = 100 + index * 40;
            
            if (index === 0) {
                ctx.fillStyle = this.config.chartColors.primary + '20';
                ctx.fillRect(10, y - 15, 180, 30);
            }
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '14px Roboto';
            ctx.textAlign = 'left';
            ctx.fillText(item, 20, y);
        });
        
        // Main content area
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(220, 80, width - 240, height - 100);
        
        // Charts and widgets
        this.drawMiniChart(ctx, 240, 100, 200, 120, 'line');
        this.drawMiniChart(ctx, 460, 100, 200, 120, 'bar');
        this.drawMiniChart(ctx, 240, 240, 200, 120, 'pie');
        this.drawMiniChart(ctx, 460, 240, 200, 120, 'area');
    },

    // Draw mobile demo
    drawMobileDemo: function(ctx, width, height) {
        // Phone frame
        const phoneWidth = 250;
        const phoneHeight = 450;
        const phoneX = (width - phoneWidth) / 2;
        const phoneY = (height - phoneHeight) / 2;
        
        // Phone outline
        ctx.fillStyle = '#333333';
        ctx.fillRect(phoneX - 10, phoneY - 30, phoneWidth + 20, phoneHeight + 60);
        
        // Screen
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phoneX, phoneY, phoneWidth, phoneHeight);
        
        // Status bar
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(phoneX, phoneY, phoneWidth, 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('9:41', phoneX + 10, phoneY + 20);
        ctx.textAlign = 'right';
        ctx.fillText('100%', phoneX + phoneWidth - 10, phoneY + 20);
        
        // App content
        const cardHeight = 80;
        const cardMargin = 15;
        
        for (let i = 0; i < 4; i++) {
            const cardY = phoneY + 50 + i * (cardHeight + cardMargin);
            
            // Card background
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(phoneX + 15, cardY, phoneWidth - 30, cardHeight);
            
            // Card content
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.fillRect(phoneX + 25, cardY + 10, 40, 40);
            
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '14px Roboto';
            ctx.textAlign = 'left';
            ctx.fillText(`Feature ${i + 1}`, phoneX + 80, cardY + 25);
            
            ctx.fillStyle = this.config.chartColors.secondary;
            ctx.font = '12px Roboto';
            ctx.fillText('Description text here', phoneX + 80, cardY + 45);
        }
        
        // Bottom navigation
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phoneX, phoneY + phoneHeight - 60, phoneWidth, 60);
        
        const navItems = ['Home', 'Search', 'Profile'];
        navItems.forEach((item, index) => {
            const navX = phoneX + (phoneWidth / navItems.length) * index + (phoneWidth / navItems.length) / 2;
            const navY = phoneY + phoneHeight - 30;
            
            ctx.fillStyle = index === 0 ? this.config.chartColors.primary : this.config.chartColors.secondary;
            ctx.beginPath();
            ctx.arc(navX, navY - 10, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(item, navX, navY + 15);
        });
    },

    // Draw IoT demo
    drawIoTDemo: function(ctx, width, height) {
        // Network visualization
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Central hub
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('IoT Hub', centerX, centerY);
        
        // Connected devices
        const devices = [
            { x: centerX - 150, y: centerY - 100, name: 'Temperature', value: '24°C', color: this.config.chartColors.accent },
            { x: centerX + 150, y: centerY - 100, name: 'Humidity', value: '65%', color: this.config.chartColors.success },
            { x: centerX - 150, y: centerY + 100, name: 'Light', value: 'ON', color: this.config.chartColors.gradient1 },
            { x: centerX + 150, y: centerY + 100, name: 'Security', value: 'ARMED', color: this.config.chartColors.error },
            { x: centerX, y: centerY - 150, name: 'Air Quality', value: 'Good', color: this.config.chartColors.gradient2 },
            { x: centerX, y: centerY + 150, name: 'Energy', value: '2.5kW', color: this.config.chartColors.primary }
        ];
        
        devices.forEach(device => {
            // Connection lines
            ctx.strokeStyle = device.color + '50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(device.x, device.y);
            ctx.stroke();
            
            // Device node
            ctx.fillStyle = device.color;
            ctx.beginPath();
            ctx.arc(device.x, device.y, 25, 0, 2 * Math.PI);
            ctx.fill();
            
            // Device info
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(device.name, device.x, device.y - 5);
            ctx.fillText(device.value, device.x, device.y + 8);
            
            // Data flow animation
            const time = Date.now() * 0.003;
            const flowProgress = (time + device.x + device.y) % 1;
            const flowX = centerX + (device.x - centerX) * flowProgress;
            const flowY = centerY + (device.y - centerY) * flowProgress;
            
            ctx.fillStyle = device.color;
            ctx.beginPath();
            ctx.arc(flowX, flowY, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Status panel
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(20, 20, 200, 100);
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.strokeRect(20, 20, 200, 100);
        
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('System Status', 30, 40);
        
        ctx.font = '12px Roboto';
        ctx.fillText('Devices: 6/6 Online', 30, 60);
        ctx.fillText('Network: Strong', 30, 80);
        ctx.fillText('Last Update: Now', 30, 100);
    },

    // Draw mini chart helper
    drawMiniChart: function(ctx, x, y, width, height, type) {
        // Chart background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = this.config.chartColors.secondary + '50';
        ctx.strokeRect(x, y, width, height);
        
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        switch (type) {
            case 'line':
                // Line chart
                const points = [
                    { x: 0, y: 0.8 },
                    { x: 0.2, y: 0.6 },
                    { x: 0.4, y: 0.7 },
                    { x: 0.6, y: 0.4 },
                    { x: 0.8, y: 0.3 },
                    { x: 1, y: 0.2 }
                ];
                
                ctx.strokeStyle = this.config.chartColors.primary;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                points.forEach((point, index) => {
                    const px = x + padding + point.x * chartWidth;
                    const py = y + padding + point.y * chartHeight;
                    
                    if (index === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                });
                
                ctx.stroke();
                break;
                
            case 'bar':
                // Bar chart
                const barData = [0.6, 0.8, 0.4, 0.9, 0.7];
                const barWidth = chartWidth / barData.length;
                
                barData.forEach((value, index) => {
                    const barHeight = value * chartHeight;
                    const barX = x + padding + index * barWidth + 5;
                    const barY = y + height - padding - barHeight;
                    
                    ctx.fillStyle = this.config.chartColors.primary;
                    ctx.fillRect(barX, barY, barWidth - 10, barHeight);
                });
                break;
                
            case 'pie':
                // Pie chart
                const pieData = [30, 25, 20, 25];
                const colors = [
                    this.config.chartColors.primary,
                    this.config.chartColors.accent,
                    this.config.chartColors.success,
                    this.config.chartColors.gradient1
                ];
                
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                const radius = Math.min(chartWidth, chartHeight) / 2;
                
                let currentAngle = 0;
                pieData.forEach((value, index) => {
                    const sliceAngle = (value / 100) * 2 * Math.PI;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                    ctx.closePath();
                    ctx.fillStyle = colors[index];
                    ctx.fill();
                    
                    currentAngle += sliceAngle;
                });
                break;
                
            case 'area':
                // Area chart
                const areaPoints = [
                    { x: 0, y: 0.7 },
                    { x: 0.25, y: 0.5 },
                    { x: 0.5, y: 0.6 },
                    { x: 0.75, y: 0.3 },
                    { x: 1, y: 0.4 }
                ];
                
                ctx.beginPath();
                ctx.moveTo(x + padding, y + height - padding);
                
                areaPoints.forEach(point => {
                    const px = x + padding + point.x * chartWidth;
                    const py = y + padding + point.y * chartHeight;
                    ctx.lineTo(px, py);
                });
                
                ctx.lineTo(x + padding + chartWidth, y + height - padding);
                ctx.closePath();
                
                ctx.fillStyle = this.config.chartColors.primary + '30';
                ctx.fill();
                
                ctx.strokeStyle = this.config.chartColors.primary;
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
        }
    },

    // Setup blog canvases
    setupBlogCanvases: function() {
        // Featured canvas
        const featuredCanvas = document.getElementById('featuredCanvas');
        if (featuredCanvas) {
            this.drawBlogFeaturedVisualization(featuredCanvas);
        }

        // Blog post canvases
        const postCanvases = document.querySelectorAll('.post-canvas');
        postCanvases.forEach(canvas => {
            const visualType = canvas.getAttribute('data-visual');
            this.drawBlogPostVisualization(canvas, visualType);
        });
    },

    // Draw blog featured visualization
    drawBlogFeaturedVisualization: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // AI/ML themed visualization
        this.drawNeuralNetwork(ctx, width, height);
    },

    // Draw neural network visualization
    drawNeuralNetwork: function(ctx, width, height) {
        const layers = [4, 6, 6, 3];
        const layerSpacing = width / (layers.length + 1);
        const nodeRadius = 8;
        
        // Calculate node positions
        const nodes = [];
        layers.forEach((layerSize, layerIndex) => {
            const layerNodes = [];
            const x = layerSpacing * (layerIndex + 1);
            const nodeSpacing = height / (layerSize + 1);
            
            for (let i = 0; i < layerSize; i++) {
                const y = nodeSpacing * (i + 1);
                layerNodes.push({ x, y });
            }
            nodes.push(layerNodes);
        });
        
        // Draw connections
        ctx.strokeStyle = this.config.chartColors.primary + '30';
        ctx.lineWidth = 1;
        
        for (let layer = 0; layer < nodes.length - 1; layer++) {
            nodes[layer].forEach(fromNode => {
                nodes[layer + 1].forEach(toNode => {
                    ctx.beginPath();
                    ctx.moveTo(fromNode.x, fromNode.y);
                    ctx.lineTo(toNode.x, toNode.y);
                    ctx.stroke();
                });
            });
        }
        
        // Draw nodes
        nodes.forEach((layer, layerIndex) => {
            layer.forEach(node => {
                const time = Date.now() * 0.002;
                const pulse = Math.sin(time + node.x + node.y) * 0.3 + 0.7;
                
                ctx.fillStyle = layerIndex === 0 ? this.config.chartColors.success :
                               layerIndex === nodes.length - 1 ? this.config.chartColors.accent :
                               this.config.chartColors.primary;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeRadius * pulse, 0, 2 * Math.PI);
                ctx.fill();
                
                // Node glow effect
                ctx.strokeStyle = ctx.fillStyle;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeRadius * 1.5, 0, 2 * Math.PI);
                ctx.stroke();
            });
        });
        
        // Add labels
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = '12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Input', layerSpacing, height - 10);
        ctx.fillText('Hidden Layers', width / 2, height - 10);
        ctx.fillText('Output', layerSpacing * (layers.length), height - 10);
    },

    // Draw blog post visualization
    drawBlogPostVisualization: function(canvas, visualType) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, this.config.chartColors.primary + '10');
        gradient.addColorStop(1, this.config.chartColors.secondary + '05');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        switch (visualType) {
            case 'ai-chart':
                this.drawAIChart(ctx, width, height);
                break;
            case 'web-performance':
                this.drawWebPerformanceChart(ctx, width, height);
                break;
            case 'mobile-trends':
                this.drawMobileTrendsChart(ctx, width, height);
                break;
            case 'cloud-architecture':
                this.drawCloudArchitecture(ctx, width, height);
                break;
            case 'security-trends':
                this.drawSecurityTrends(ctx, width, height);
                break;
            case 'api-design':
                this.drawAPIDesign(ctx, width, height);
                break;
        }
    },

    // Draw AI chart
    drawAIChart: function(ctx, width, height) {
        // Growth curve for AI adoption
        ctx.strokeStyle = this.config.chartColors.gradient1;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 5) {
            const progress = x / width;
            const y = height - (Math.pow(progress, 0.7) * (height - 40)) - 20;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add data points
        const points = [0.2, 0.4, 0.6, 0.8];
        points.forEach(point => {
            const x = width * point;
            const y = height - (Math.pow(point, 0.7) * (height - 40)) - 20;
            
            ctx.fillStyle = this.config.chartColors.accent;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Labels
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = '12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('AI Adoption Growth', width / 2, 20);
    },

    // Draw web performance chart
    drawWebPerformanceChart: function(ctx, width, height) {
        // Performance metrics bars
        const metrics = ['LCP', 'FID', 'CLS', 'FCP'];
        const values = [2.1, 0.08, 0.05, 1.2];
        const targets = [2.5, 0.1, 0.1, 1.8];
        
        const barWidth = width / metrics.length;
        
        metrics.forEach((metric, index) => {
            const x = index * barWidth + 20;
            const maxHeight = height - 60;
            
            // Target bar (background)
            const targetHeight = (targets[index] / Math.max(...targets)) * maxHeight;
            ctx.fillStyle = this.config.chartColors.secondary + '30';
            ctx.fillRect(x, height - 30 - targetHeight, barWidth - 40, targetHeight);
            
            // Actual value bar
            const valueHeight = (values[index] / Math.max(...targets)) * maxHeight;
            const color = values[index] <= targets[index] ? this.config.chartColors.success : this.config.chartColors.warning;
            ctx.fillStyle = color;
            ctx.fillRect(x, height - 30 - valueHeight, barWidth - 40, valueHeight);
            
            // Metric label
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '12px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(metric, x + (barWidth - 40) / 2, height - 10);
        });
    },

    // Draw mobile trends chart
    drawMobileTrendsChart: function(ctx, width, height) {
        // Two trend lines: React Native vs Flutter
        const years = [2019, 2020, 2021, 2022, 2023, 2024];
        const reactNativeData = [60, 65, 70, 68, 65, 62];
        const flutterData = [20, 25, 35, 45, 55, 58];
        
        const stepX = width / (years.length - 1);
        const maxValue = Math.max(...reactNativeData, ...flutterData);
        
        // React Native line
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        reactNativeData.forEach((value, index) => {
            const x = index * stepX;
            const y = height - 30 - (value / maxValue) * (height - 60);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Flutter line
        ctx.strokeStyle = this.config.chartColors.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        flutterData.forEach((value, index) => {
            const x = index * stepX;
            const y = height - 30 - (value / maxValue) * (height - 60);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Legend
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(20, 20, 15, 10);
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('React Native', 45, 30);
        
        ctx.fillStyle = this.config.chartColors.accent;
        ctx.fillRect(150, 20, 15, 10);
        ctx.fillStyle = this.config.chartColors.accent;
        ctx.fillText('Flutter', 175, 30);
    },

    // Draw cloud architecture
    drawCloudArchitecture: function(ctx, width, height) {
        // Cloud services diagram
        const services = [
            { x: width * 0.2, y: height * 0.3, name: 'API\nGateway', size: 30 },
            { x: width * 0.5, y: height * 0.2, name: 'Load\nBalancer', size: 35 },
            { x: width * 0.8, y: height * 0.3, name: 'Auto\nScaling', size: 30 },
            { x: width * 0.3, y: height * 0.6, name: 'Database', size: 40 },
            { x: width * 0.7, y: height * 0.6, name: 'Storage', size: 35 },
            { x: width * 0.5, y: height * 0.8, name: 'Monitoring', size: 25 }
        ];
        
        // Draw connections
        ctx.strokeStyle = this.config.chartColors.primary + '50';
        ctx.lineWidth = 2;
        
        const connections = [
            [0, 1], [1, 2], [1, 3], [1, 4], [3, 5], [4, 5]
        ];
        
        connections.forEach(([from, to]) => {
            ctx.beginPath();
            ctx.moveTo(services[from].x, services[from].y);
            ctx.lineTo(services[to].x, services[to].y);
            ctx.stroke();
        });
        
        // Draw services
        services.forEach((service, index) => {
            const colors = [
                this.config.chartColors.primary,
                this.config.chartColors.accent,
                this.config.chartColors.success,
                this.config.chartColors.gradient1,
                this.config.chartColors.gradient2,
                this.config.chartColors.warning
            ];
            
            ctx.fillStyle = colors[index];
            ctx.beginPath();
            ctx.arc(service.x, service.y, service.size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Service labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            const lines = service.name.split('\n');
            lines.forEach((line, lineIndex) => {
                ctx.fillText(line, service.x, service.y + (lineIndex - lines.length / 2 + 0.5) * 12);
            });
        });
    },

    // Draw security trends
    drawSecurityTrends: function(ctx, width, height) {
        // Security threat timeline
        const threats = [
            { month: 'Jan', attacks: 120 },
            { month: 'Feb', attacks: 95 },
            { month: 'Mar', attacks: 150 },
            { month: 'Apr', attacks: 80 },
            { month: 'May', attacks: 110 },
            { month: 'Jun', attacks: 70 }
        ];
        
        const barWidth = width / threats.length;
        const maxAttacks = Math.max(...threats.map(t => t.attacks));
        
        threats.forEach((threat, index) => {
            const x = index * barWidth + 10;
            const barHeight = (threat.attacks / maxAttacks) * (height - 60);
            const y = height - 30 - barHeight;
            
            // Gradient based on threat level
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            if (threat.attacks > 130) {
                gradient.addColorStop(0, this.config.chartColors.error);
                gradient.addColorStop(1, this.config.chartColors.warning);
            } else if (threat.attacks > 100) {
                gradient.addColorStop(0, this.config.chartColors.warning);
                gradient.addColorStop(1, this.config.chartColors.accent);
            } else {
                gradient.addColorStop(0, this.config.chartColors.success);
                gradient.addColorStop(1, this.config.chartColors.primary);
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 20, barHeight);
            
            // Month labels
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(threat.month, x + (barWidth - 20) / 2, height - 10);
        });
        
        // Title
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.font = 'bold 12px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Security Incidents', width / 2, 20);
    },

    // Draw API design
    drawAPIDesign: function(ctx, width, height) {
        // REST API flow diagram
        const endpoints = [
            { x: 50, y: height / 2, method: 'GET', path: '/users' },
            { x: width / 3, y: height * 0.3, method: 'POST', path: '/users' },
            { x: width / 3, y: height * 0.7, method: 'PUT', path: '/users/:id' },
            { x: 2 * width / 3, y: height / 2, method: 'DELETE', path: '/users/:id' }
        ];
        
        const methodColors = {
            'GET': this.config.chartColors.primary,
            'POST': this.config.chartColors.success,
            'PUT': this.config.chartColors.accent,
            'DELETE': this.config.chartColors.error
        };
        
        // Draw API flow
        ctx.strokeStyle = this.config.chartColors.secondary;
        ctx.lineWidth = 2;
        
        // Connect endpoints
        for (let i = 0; i < endpoints.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(endpoints[i].x, endpoints[i].y);
            ctx.lineTo(endpoints[i + 1].x, endpoints[i + 1].y);
            ctx.stroke();
        }
        
        // Draw endpoints
        endpoints.forEach(endpoint => {
            ctx.fillStyle = methodColors[endpoint.method];
            ctx.fillRect(endpoint.x - 30, endpoint.y - 15, 60, 30);
            
            // Method label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(endpoint.method, endpoint.x, endpoint.y - 2);
            
            // Path label
            ctx.fillStyle = this.config.chartColors.primary;
            ctx.font = '8px Roboto';
            ctx.fillText(endpoint.path, endpoint.x, endpoint.y + 25);
        });
        
        // Database
        ctx.fillStyle = this.config.chartColors.gradient1;
        ctx.fillRect(width - 80, height / 2 - 20, 60, 40);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Database', width - 50, height / 2 + 3);
    },

    // Draw map visualization
    drawMapVisualization: function(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Map background
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#e8f4fd');
        bgGradient.addColorStop(1, '#b8e6ff');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        // Grid lines for streets
        ctx.strokeStyle = this.config.chartColors.secondary + '40';
        ctx.lineWidth = 1;
        
        // Vertical streets
        for (let x = 0; x < width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal streets
        for (let y = 0; y < height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Buildings/blocks
        const buildings = [
            { x: 20, y: 20, w: 100, h: 80 },
            { x: 140, y: 30, w: 120, h: 90 },
            { x: 280, y: 20, w: 80, h: 70 },
            { x: 380, y: 40, w: 140, h: 100 },
            { x: 30, y: 130, w: 90, h: 85 },
            { x: 150, y: 140, w: 110, h: 75 },
            { x: 290, y: 135, w: 100, h: 80 },
            { x: 420, y: 150, w: 120, h: 90 }
        ];
        
        buildings.forEach(building => {
            ctx.fillStyle = this.config.chartColors.secondary + '60';
            ctx.fillRect(building.x, building.y, building.w, building.h);
            ctx.strokeStyle = this.config.chartColors.secondary;
            ctx.strokeRect(building.x, building.y, building.w, building.h);
        });
        
        // Office location (TechViet)
        const officeX = width / 2;
        const officeY = height / 2;
        
        // Office building highlight
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.fillRect(officeX - 40, officeY - 30, 80, 60);
        ctx.strokeStyle = this.config.chartColors.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(officeX - 40, officeY - 30, 80, 60);
        
        // Office marker
        ctx.fillStyle = this.config.chartColors.error;
        ctx.beginPath();
        ctx.arc(officeX, officeY - 50, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Marker pointer
        ctx.beginPath();
        ctx.moveTo(officeX, officeY - 35);
        ctx.lineTo(officeX - 8, officeY - 20);
        ctx.lineTo(officeX + 8, officeY - 20);
        ctx.closePath();
        ctx.fill();
        
        // Office label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('TV', officeX, officeY - 46);
        
        // Nearby landmarks
        const landmarks = [
            { x: 150, y: 100, name: 'Metro', icon: 'M' },
            { x: 350, y: 180, name: 'Park', icon: 'P' },
            { x: 450, y: 80, name: 'Mall', icon: 'S' }
        ];
        
        landmarks.forEach(landmark => {
            ctx.fillStyle = this.config.chartColors.accent;
            ctx.beginPath();
            ctx.arc(landmark.x, landmark.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(landmark.icon, landmark.x, landmark.y + 3);
        });
        
        // Distance indicators
        ctx.strokeStyle = this.config.chartColors.primary + '50';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        landmarks.forEach(landmark => {
            ctx.beginPath();
            ctx.moveTo(officeX, officeY);
            ctx.lineTo(landmark.x, landmark.y);
            ctx.stroke();
        });
        
        ctx.setLineDash([]);
        
        // Compass
        ctx.fillStyle = this.config.chartColors.primary;
        ctx.beginPath();
        ctx.arc(width - 40, 40, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        // North arrow
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(width - 40, 25);
        ctx.lineTo(width - 35, 35);
        ctx.lineTo(width - 45, 35);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('N', width - 40, 50);
    },

    // Animation loop for dynamic effects
    startAnimationLoop: function() {
        const animate = () => {
            // Update any animated canvases
            const heroCanvas = document.getElementById('heroCanvas');
            if (heroCanvas && this.utils.isInViewport(heroCanvas)) {
                this.drawHeroVisualization(heroCanvas);
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    },

    // Utility to check if element is in viewport
    utils: {
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
};

// Initialize Canvas Module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CanvasModule.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasModule;
}

