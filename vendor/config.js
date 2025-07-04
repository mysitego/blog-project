// ملف تكوين المكتبات والـ API Keys
const CONFIG = {
    // TinyMCE API Key
    TINYMCE_API_KEY: 'a26u7uk5kczf03g4s40i7gb6r72ockbuxqllpe09e3zrvp49',
    
    // Chart.js Configuration
    CHARTJS_CONFIG: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    },
    
    // Bootstrap Configuration
    BOOTSTRAP_CONFIG: {
        version: '5.3.0',
        rtl: true
    },
    
    // Font Awesome Configuration
    FONTAWESOME_CONFIG: {
        version: '6.4.0',
        pro: false
    },
    
    // Application Settings
    APP_CONFIG: {
        name: 'مدونة المعرفة',
        version: '1.0.0',
        language: 'ar',
        direction: 'rtl',
        theme: 'light'
    }
};

// تصدير التكوين للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
} 