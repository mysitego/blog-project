// ملف إدارة التنقل والتفاعل في لوحة التحكم الاحترافية

class DashboardNavigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.sidebarLinks = [];
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupMobileMenu();
        this.setupResponsive();
        this.setupActiveLinks();
        this.setupNotifications();
        this.setupUserMenu();
        this.setupSearch();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename.replace('.html', '');
    }

    setupSidebar() {
        // تعريف روابط التنقل
        this.sidebarLinks = [
            {
                id: 'dashboard',
                title: 'لوحة التحكم',
                icon: 'fas fa-tachometer-alt',
                url: 'dashboard.html',
                badge: null,
                active: this.currentPage === 'dashboard'
            },
            {
                id: 'stats',
                title: 'الإحصائيات',
                icon: 'fas fa-chart-bar',
                url: 'stats.html',
                badge: null,
                active: this.currentPage === 'stats'
            },
            {
                id: 'articles',
                title: 'المقالات',
                icon: 'fas fa-edit',
                url: 'articles-management.html',
                badge: '25',
                active: this.currentPage === 'articles-management'
            },
            {
                id: 'categories',
                title: 'الفئات',
                icon: 'fas fa-tags',
                url: 'categories-management.html',
                badge: null,
                active: this.currentPage === 'categories-management'
            },
            {
                id: 'comments',
                title: 'التعليقات',
                icon: 'fas fa-comments',
                url: 'comments-management.html',
                badge: '12',
                active: this.currentPage === 'comments-management'
            },
            {
                id: 'users',
                title: 'المستخدمون',
                icon: 'fas fa-users',
                url: 'users-management.html',
                badge: null,
                active: this.currentPage === 'users-management'
            },
            {
                id: 'profile',
                title: 'الملف الشخصي',
                icon: 'fas fa-user',
                url: 'profile.html',
                badge: null,
                active: this.currentPage === 'profile'
            },
            {
                id: 'settings',
                title: 'الإعدادات',
                icon: 'fas fa-cog',
                url: 'settings.html',
                badge: null,
                active: this.currentPage === 'settings'
            }
        ];

        this.renderSidebar();
    }

    renderSidebar() {
        const sidebar = document.querySelector('#sidebarNav');
        if (!sidebar) return;

        sidebar.innerHTML = this.sidebarLinks.map(link => `
            <li>
                <a href="${link.url}" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    link.active 
                        ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                }">
                    <i class="${link.icon} text-lg"></i>
                    <span>${link.title}</span>
                    ${link.badge ? `<span class="mr-auto bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">${link.badge}</span>` : ''}
                </a>
            </li>
        `).join('');

        // إضافة مستمعي الأحداث للروابط
        sidebar.querySelectorAll('.sidebar-link').forEach((link, index) => {
            link.addEventListener('click', (e) => {
                this.handleNavigation(e, this.sidebarLinks[index]);
            });
        });
    }

    handleNavigation(e, link) {
        // إظهار مؤشر التحميل
        this.showLoading();
        
        // تحديث الرابط النشط
        this.updateActiveLink(link.id);
        
        // إغلاق القائمة في الأجهزة المحمولة
        if (window.innerWidth < 1280) {
            this.closeMobileMenu();
        }
    }

    updateActiveLink(activeId) {
        this.sidebarLinks.forEach(link => {
            link.active = link.id === activeId;
        });
        this.renderSidebar();
    }

    setupMobileMenu() {
        const openBtn = document.getElementById('openSidebar');
        const closeBtn = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mainContent = document.getElementById('mainContent');

        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openMobileMenu();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMobileMenu();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMobileMenu();
            });
        }

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1280 && 
                sidebar && 
                openBtn &&
                !sidebar.contains(e.target) && 
                !openBtn.contains(e.target) && 
                sidebar.classList.contains('sidebar-expanded')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mainContent = document.getElementById('mainContent');
        
        if (!sidebar || !overlay || !mainContent) return;

        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
        overlay.classList.remove('hidden');
        mainContent.classList.add('main-full');
        mainContent.classList.remove('main-shifted');
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mainContent = document.getElementById('mainContent');
        
        if (!sidebar || !overlay || !mainContent) return;

        sidebar.classList.add('sidebar-collapsed');
        sidebar.classList.remove('sidebar-expanded');
        overlay.classList.add('hidden');
        mainContent.classList.remove('main-full');
        mainContent.classList.add('main-shifted');
    }

    setupResponsive() {
        // مراقبة تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // تطبيق الإعدادات الأولية
        this.handleResize();
    }

    handleResize() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const overlay = document.getElementById('sidebarOverlay');

        if (window.innerWidth >= 1280) {
            // شاشات كبيرة - إظهار الشريط الجانبي دائماً
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            mainContent.classList.add('main-shifted');
            mainContent.classList.remove('main-full');
            if (overlay) overlay.classList.add('hidden');
        } else {
            // شاشات صغيرة - إخفاء الشريط الجانبي
            sidebar.classList.add('sidebar-collapsed');
            sidebar.classList.remove('sidebar-expanded');
            mainContent.classList.remove('main-shifted');
            mainContent.classList.add('main-full');
        }
    }

    setupActiveLinks() {
        // تحديث الرابط النشط في الشريط الجانبي
        const currentLink = this.sidebarLinks.find(link => link.active);
        if (currentLink) {
            this.updateActiveLink(currentLink.id);
        }
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    showNotifications() {
        // إنشاء قائمة الإشعارات
        const notifications = [
            { message: 'تم نشر مقال جديد بنجاح', type: 'success', time: 'منذ 5 دقائق' },
            { message: 'لديك 3 تعليقات جديدة تحتاج مراجعة', type: 'warning', time: 'منذ 15 دقيقة' },
            { message: 'تم تحديث الإعدادات بنجاح', type: 'info', time: 'منذ ساعة' }
        ];

        // إظهار الإشعارات في قائمة منسدلة
        this.showDropdown('notifications', notifications.map(n => `
            <div class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div class="flex-shrink-0">
                    <i class="fas fa-${n.type === 'success' ? 'check-circle text-green-500' : n.type === 'warning' ? 'exclamation-triangle text-yellow-500' : 'info-circle text-blue-500'}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">${n.message}</p>
                    <p class="text-xs text-gray-500 mt-1">${n.time}</p>
                </div>
            </div>
        `).join(''));
    }

    setupUserMenu() {
        const userBtn = document.getElementById('userBtn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                this.showUserMenu();
            });
        }
    }

    showUserMenu() {
        const userMenu = [
            { title: 'الملف الشخصي', icon: 'fas fa-user', url: 'profile.html' },
            { title: 'الإعدادات', icon: 'fas fa-cog', url: 'settings.html' },
            { title: 'تسجيل الخروج', icon: 'fas fa-sign-out-alt', action: 'logout' }
        ];

        this.showDropdown('user', userMenu.map(item => `
            <a href="${item.url || '#'}" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                item.action === 'logout' ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
            }">
                <i class="${item.icon} text-lg"></i>
                <span>${item.title}</span>
            </a>
        `).join(''));
    }

    showDropdown(type, content) {
        // إزالة القوائم المنسدلة الموجودة
        const existingDropdowns = document.querySelectorAll('.dropdown-menu');
        existingDropdowns.forEach(dropdown => dropdown.remove());

        // إنشاء القائمة المنسدلة الجديدة
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-64 z-50';
        dropdown.innerHTML = content;

        // تحديد موقع القائمة
        const trigger = document.getElementById(type === 'notifications' ? 'notificationBtn' : 'userBtn');
        if (trigger) {
            trigger.parentNode.appendChild(dropdown);
        }

        // إغلاق القائمة عند النقر خارجها
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 0);
    }

    setupSearch() {
        const searchInput = document.querySelector('input[placeholder*="بحث"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            // البحث عند الضغط على Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
    }

    handleSearch(query) {
        // البحث المباشر في الصفحة الحالية
        if (query.length > 2) {
            this.highlightSearchResults(query);
        } else {
            this.clearSearchHighlights();
        }
    }

    performSearch(query) {
        // البحث في جميع الصفحات
        if (query.trim()) {
            // يمكن إضافة منطق البحث المتقدم هنا
            console.log('البحث عن:', query);
        }
    }

    highlightSearchResults(query) {
        // تمييز نتائج البحث في الصفحة
        const content = document.querySelector('main');
        if (content) {
            const regex = new RegExp(`(${query})`, 'gi');
            content.innerHTML = content.innerHTML.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
        }
    }

    clearSearchHighlights() {
        // إزالة تمييز البحث
        const marks = document.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.innerHTML;
        });
    }

    setupAutoSave() {
        // حفظ تلقائي للنماذج
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            this.setupFormAutoSave(form);
        });
    }

    setupFormAutoSave(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(form);
            });
        });

        // تحميل البيانات المحفوظة عند تحميل الصفحة
        this.loadFormData(form);
    }

    saveFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem(`form_${form.id}`, JSON.stringify(data));
    }

    loadFormData(form) {
        const savedData = localStorage.getItem(`form_${form.id}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K للبحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder*="بحث"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Ctrl/Cmd + N لمقال جديد
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                window.location.href = 'article-editor.html';
            }

            // Escape لإغلاق القوائم المنسدلة
            if (e.key === 'Escape') {
                const dropdowns = document.querySelectorAll('.dropdown-menu');
                dropdowns.forEach(dropdown => dropdown.remove());
            }
        });
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // وظائف مساعدة
    showToast(message, type = 'info') {
        if (window.NotificationManager) {
            window.NotificationManager.show(message, type);
        } else {
            // إنشاء toast بسيط
            const toast = document.createElement('div');
            toast.className = `fixed top-4 right-4 bg-white border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 shadow-lg rounded-lg p-4 z-50`;
            toast.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} text-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 mr-3"></i>
                    <span class="text-gray-900">${message}</span>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }

    // تحديث الإحصائيات
    updateStats() {
        // يمكن إضافة منطق تحديث الإحصائيات هنا
        console.log('تحديث الإحصائيات...');
    }

    // تصدير البيانات
    exportData(type) {
        console.log(`تصدير البيانات: ${type}`);
        // يمكن إضافة منطق التصدير هنا
    }
}

// تهيئة التنقل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.DashboardNav = new DashboardNavigation();
});

// تصدير الفئة للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardNavigation;
} 