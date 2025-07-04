// ملف تكوين لوحة التحكم الاحترافية
const DASHBOARD_CONFIG = {
    // إعدادات عامة
    app: {
        name: 'مدونة المعرفة',
        version: '1.0.0',
        language: 'ar',
        direction: 'rtl',
        theme: 'light',
        apiBaseUrl: '/api',
        uploadUrl: '/upload'
    },

    // إعدادات TinyMCE
    editor: {
        apiKey: 'a26u7uk5kczf03g4s40i7gb6r72ockbuxqllpe09e3zrvp49',
        height: 500,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: [
            'undo redo | formatselect | bold italic underline strikethrough |',
            'alignleft aligncenter alignright alignjustify |',
            'bullist numlist outdent indent | link image media table |',
            'forecolor backcolor | removeformat | help'
        ].join(''),
        contentStyle: `
            body { 
                font-family: 'Tajawal', 'Cairo', 'Segoe UI', sans-serif; 
                font-size: 16px; 
                line-height: 1.6; 
                direction: rtl; 
                text-align: right; 
            }
            h1, h2, h3, h4, h5, h6 { 
                font-weight: 700; 
                margin-bottom: 1rem; 
            }
            p { margin-bottom: 1rem; }
            img { max-width: 100%; height: auto; }
        `,
        imageAdvtab: true,
        imageTitle: true,
        imageCaption: true,
        imageClassList: [
            {title: 'Responsive', value: 'img-fluid'},
            {title: 'Rounded', value: 'rounded'},
            {title: 'Shadow', value: 'shadow'},
            {title: 'Border', value: 'border'}
        ]
    },

    // إعدادات الجداول
    table: {
        pageSize: 10,
        pageSizes: [5, 10, 25, 50, 100],
        sortable: true,
        filterable: true,
        searchable: true
    },

    // إعدادات الرسوم البيانية
    charts: {
        colors: {
            primary: '#16a34a',
            secondary: '#eab308',
            accent: '#d946ef',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6'
        },
        responsive: true,
        maintainAspectRatio: false
    },

    // إعدادات الأمان
    security: {
        csrfToken: null, // سيتم تعيينه من الخادم
        sessionTimeout: 30 * 60 * 1000, // 30 دقيقة
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000 // 15 دقيقة
    },

    // إعدادات الإشعارات
    notifications: {
        position: 'top-right',
        duration: 5000,
        maxVisible: 5,
        types: {
            success: { icon: 'fas fa-check-circle', color: '#22c55e' },
            error: { icon: 'fas fa-exclamation-circle', color: '#ef4444' },
            warning: { icon: 'fas fa-exclamation-triangle', color: '#f59e0b' },
            info: { icon: 'fas fa-info-circle', color: '#3b82f6' }
        }
    },

    // إعدادات التحميل
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        imageResize: {
            width: 1200,
            height: 800,
            quality: 0.8
        }
    },

    // إعدادات SEO
    seo: {
        metaDescriptionLength: 160,
        titleMaxLength: 60,
        slugMaxLength: 100,
        keywordsMaxCount: 10
    },

    // إعدادات المقالات
    articles: {
        statuses: {
            published: { label: 'منشور', color: '#22c55e', icon: 'fas fa-check-circle' },
            draft: { label: 'مسودة', color: '#f59e0b', icon: 'fas fa-edit' },
            pending: { label: 'معلق', color: '#3b82f6', icon: 'fas fa-clock' },
            private: { label: 'خاص', color: '#8b5cf6', icon: 'fas fa-lock' }
        },
        categories: [
            { id: 1, name: 'الكتابة الإبداعية', slug: 'creative-writing', color: '#3b82f6' },
            { id: 2, name: 'كتابة المحتوى', slug: 'content-writing', color: '#22c55e' },
            { id: 3, name: 'تطوير الذات', slug: 'self-development', color: '#f59e0b' }
        ]
    },

    // إعدادات المستخدمين
    users: {
        roles: {
            admin: { label: 'مدير', permissions: ['all'] },
            editor: { label: 'محرر', permissions: ['articles', 'categories', 'comments'] },
            author: { label: 'كاتب', permissions: ['articles'] }
        }
    }
};

// تصدير التكوين
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DASHBOARD_CONFIG;
} else {
    window.DASHBOARD_CONFIG = DASHBOARD_CONFIG;
} 