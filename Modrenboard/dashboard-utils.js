// ملف الوظائف المساعدة للوحة التحكم الاحترافية

// فئة إدارة الإشعارات
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxVisible = DASHBOARD_CONFIG.notifications.maxVisible;
        this.duration = DASHBOARD_CONFIG.notifications.duration;
        this.position = DASHBOARD_CONFIG.notifications.position;
        this.init();
    }

    init() {
        // إنشاء حاوية الإشعارات
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = `fixed ${this.position} z-50 p-4 space-y-2`;
        document.body.appendChild(container);
    }

    show(message, type = 'info', duration = null) {
        const notification = this.createNotification(message, type);
        const container = document.getElementById('notification-container');
        
        container.appendChild(notification);
        this.notifications.push(notification);

        // إزالة الإشعارات الزائدة
        if (this.notifications.length > this.maxVisible) {
            const oldNotification = this.notifications.shift();
            oldNotification.remove();
        }

        // إزالة الإشعار تلقائياً
        const autoRemove = setTimeout(() => {
            this.remove(notification);
        }, duration || this.duration);

        // إزالة الإشعار عند النقر
        notification.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.remove(notification);
        });

        return notification;
    }

    createNotification(message, type) {
        const config = DASHBOARD_CONFIG.notifications.types[type] || DASHBOARD_CONFIG.notifications.types.info;
        
        const notification = document.createElement('div');
        notification.className = `bg-white border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 shadow-lg rounded-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105`;
        notification.style.borderLeftColor = config.color;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="${config.icon} text-lg mr-3" style="color: ${config.color}"></i>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${message}</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return notification;
    }

    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// فئة إدارة الجداول
class TableManager {
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        this.options = { ...DASHBOARD_CONFIG.table, ...options };
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // البحث
        const searchInput = this.table.querySelector('[data-search]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filter(e.target.value);
            });
        }

        // التصفية
        const filterSelects = this.table.querySelectorAll('[data-filter]');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.filter();
            });
        });

        // الترتيب
        const sortHeaders = this.table.querySelectorAll('[data-sort]');
        sortHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                this.sort(e.target.dataset.sort);
            });
        });
    }

    setData(data) {
        this.data = data;
        this.filteredData = [...data];
        this.render();
    }

    filter(searchTerm = '') {
        this.filteredData = this.data.filter(item => {
            // البحث في النص
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const searchableFields = Object.values(item).join(' ').toLowerCase();
                if (!searchableFields.includes(searchLower)) {
                    return false;
                }
            }

            // التصفية حسب الحقول
            const filterSelects = this.table.querySelectorAll('[data-filter]');
            for (const select of filterSelects) {
                const field = select.dataset.filter;
                const value = select.value;
                if (value && item[field] !== value) {
                    return false;
                }
            }

            return true;
        });

        this.currentPage = 1;
        this.render();
    }

    sort(field) {
        this.filteredData.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (typeof aVal === 'string') {
                return aVal.localeCompare(bVal, 'ar');
            }
            
            return aVal - bVal;
        });

        this.render();
    }

    render() {
        const startIndex = (this.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        // تحديث الجدول
        const tbody = this.table.querySelector('tbody');
        tbody.innerHTML = '';

        pageData.forEach(item => {
            const row = this.createRow(item);
            tbody.appendChild(row);
        });

        // تحديث الترقيم
        this.updatePagination();
    }

    createRow(item) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // إضافة خلايا الجدول حسب البيانات
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
            cell.textContent = value;
            row.appendChild(cell);
        });

        return row;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        const pagination = this.table.querySelector('[data-pagination]');
        
        if (pagination) {
            pagination.innerHTML = this.createPaginationHTML(totalPages);
        }
    }

    createPaginationHTML(totalPages) {
        let html = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === this.currentPage;
            html += `
                <button class="px-3 py-2 mx-1 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}" 
                        onclick="tableManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        return html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.render();
    }
}

// فئة إدارة الرسوم البيانية
class ChartManager {
    constructor(canvasId, type = 'line', data = {}, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.type = type;
        this.data = data;
        this.options = { ...DASHBOARD_CONFIG.charts, ...options };
        this.chart = null;
        this.init();
    }

    init() {
        if (this.canvas) {
            this.chart = new Chart(this.canvas.getContext('2d'), {
                type: this.type,
                data: this.data,
                options: this.options
            });
        }
    }

    updateData(newData) {
        this.data = newData;
        if (this.chart) {
            this.chart.data = this.data;
            this.chart.update();
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// فئة إدارة النماذج
class FormManager {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupAutoSave();
    }

    setupValidation() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
                notificationManager.error('يرجى تصحيح الأخطاء في النموذج');
            }
        });
    }

    validate() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showError(input, 'هذا الحقل مطلوب');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    }

    showError(input, message) {
        this.clearError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        
        input.classList.add('border-red-500');
        input.parentNode.appendChild(errorDiv);
    }

    clearError(input) {
        input.classList.remove('border-red-500');
        const errorDiv = input.parentNode.querySelector('.text-red-600');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupAutoSave() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let autoSaveTimeout;

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.autoSave();
                }, 2000);
            });
        });
    }

    autoSave() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // حفظ في localStorage
        localStorage.setItem('form_autosave', JSON.stringify(data));
        
        notificationManager.info('تم الحفظ التلقائي');
    }

    loadAutoSave() {
        const saved = localStorage.getItem('form_autosave');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const input = this.form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    }
}

// فئة إدارة الأمان
class SecurityManager {
    constructor() {
        this.sessionTimeout = DASHBOARD_CONFIG.security.sessionTimeout;
        this.maxLoginAttempts = DASHBOARD_CONFIG.security.maxLoginAttempts;
        this.lockoutDuration = DASHBOARD_CONFIG.security.lockoutDuration;
        this.loginAttempts = 0;
        this.init();
    }

    init() {
        this.startSessionTimer();
        this.setupActivityListener();
    }

    startSessionTimer() {
        setTimeout(() => {
            this.logout();
        }, this.sessionTimeout);
    }

    setupActivityListener() {
        let activityTimeout;
        
        const resetTimer = () => {
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                this.logout();
            }, this.sessionTimeout);
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
    }

    logout() {
        notificationManager.warning('انتهت صلاحية الجلسة، سيتم تسجيل الخروج');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    validateCSRF(token) {
        return token === DASHBOARD_CONFIG.security.csrfToken;
    }

    incrementLoginAttempts() {
        this.loginAttempts++;
        if (this.loginAttempts >= this.maxLoginAttempts) {
            this.lockAccount();
        }
    }

    lockAccount() {
        notificationManager.error(`تم قفل الحساب لمدة ${this.lockoutDuration / 60000} دقائق`);
        setTimeout(() => {
            this.loginAttempts = 0;
        }, this.lockoutDuration);
    }
}

// تهيئة المديرين
const notificationManager = new NotificationManager();
const securityManager = new SecurityManager();

// وظائف مساعدة عامة
const Utils = {
    // تنسيق التاريخ
    formatDate(date, format = 'ar-SA') {
        return new Intl.DateTimeFormat(format, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // تنسيق الأرقام
    formatNumber(number) {
        return new Intl.NumberFormat('ar-SA').format(number);
    },

    // تحويل النص إلى slug
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },

    // التحقق من صحة البريد الإلكتروني
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // تحميل الصور
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(DASHBOARD_CONFIG.app.uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                return result.url;
            } else {
                throw new Error('فشل في تحميل الصورة');
            }
        } catch (error) {
            notificationManager.error(error.message);
            return null;
        }
    },

    // نسخ إلى الحافظة
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            notificationManager.success('تم النسخ إلى الحافظة');
        }).catch(() => {
            notificationManager.error('فشل في النسخ');
        });
    },

    // تحميل ملف
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// تصدير الكلاس والوظائف
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificationManager,
        TableManager,
        ChartManager,
        FormManager,
        SecurityManager,
        Utils
    };
} else {
    window.DashboardUtils = {
        NotificationManager,
        TableManager,
        ChartManager,
        FormManager,
        SecurityManager,
        Utils
    };
} 