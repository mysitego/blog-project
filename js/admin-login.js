/* ===================================================================
   JavaScript لصفحة تسجيل الدخول الإدارية
   =================================================================== */

// بيانات دخول واحدة فقط: admin / 123
const DEMO_USERS = {
    'admin': {
        password: '123',
        role: 'admin',
        name: 'المدير العام',
        permissions: ['all']
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    setupFormValidation();
    checkRememberedUser();
    setupKeyboardShortcuts();
});

/* ===================================================================
   تهيئة نموذج تسجيل الدخول
   =================================================================== */
function initializeLoginForm() {
    const form = document.getElementById('adminLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // تحسين تجربة المستخدم
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        // إزالة الأخطاء عند البدء في الكتابة
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
        
        // التحقق عند فقدان التركيز
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
}

/* ===================================================================
   معالجة تسجيل الدخول
   =================================================================== */
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    
    // التحقق من صحة البيانات
    if (!validateLoginForm()) {
        return;
    }
    
    // إظهار حالة التحميل
    showLoadingState(loginBtn);
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
        const result = authenticateUser(username, password);
        
        if (result.success) {
            handleSuccessfulLogin(result.user, rememberMe);
        } else {
            handleFailedLogin(result.message);
            hideLoadingState(loginBtn);
        }
    }, 1500);
}

function authenticateUser(username, password) {
    // التحقق من البيانات التجريبية
    if (DEMO_USERS[username] && DEMO_USERS[username].password === password) {
        return {
            success: true,
            user: {
                username: username,
                ...DEMO_USERS[username]
            }
        };
    }
    
    // التحقق من البريد الإلكتروني
    const userByEmail = Object.keys(DEMO_USERS).find(key => 
        DEMO_USERS[key].email === username
    );
    
    if (userByEmail && DEMO_USERS[userByEmail].password === password) {
        return {
            success: true,
            user: {
                username: userByEmail,
                ...DEMO_USERS[userByEmail]
            }
        };
    }
    
    return {
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
    };
}

function handleSuccessfulLogin(user, rememberMe) {
    // حفظ بيانات المستخدم
    const sessionData = {
        user: user,
        timestamp: Date.now(),
        permissions: user.permissions
    };
    
    // اختيار نوع التخزين حسب خيار "تذكرني"
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('adminSession', JSON.stringify(sessionData));
    
    // إظهار رسالة نجاح
    showNotification(`مرحباً ${user.name}! جاري تحويلك إلى لوحة التحكم...`, 'success');
    
    // تسجيل الدخول في النظام
    logLoginActivity(user);
    
    // إعادة التوجيه إلى لوحة التحكم
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

function handleFailedLogin(message) {
    showNotification(message, 'error');
    
    // هز النموذج للإشارة إلى الخطأ
    const form = document.getElementById('adminLoginForm');
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
    
    // التركيز على حقل اسم المستخدم
    document.getElementById('username').focus();
    document.getElementById('username').select();
    
    // تسجيل محاولة الدخول الفاشلة
    logFailedLoginAttempt();
}

/* ===================================================================
   التحقق من صحة النموذج
   =================================================================== */
function setupFormValidation() {
    const form = document.getElementById('adminLoginForm');
    
    // قواعد التحقق
    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            message: 'اسم المستخدم مطلوب (3 أحرف على الأقل)'
        },
        password: {
            required: true,
            minLength: 6,
            message: 'كلمة المرور مطلوبة (6 أحرف على الأقل)'
        }
    };
    
    // تطبيق القواعد
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(field, validationRules[fieldName]));
        }
    });
}

function validateLoginForm() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    if (!validateField(username, { required: true, minLength: 3 })) {
        isValid = false;
    }
    
    if (!validateField(password, { required: true, minLength: 6 })) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field, rules = {}) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // إزالة الأخطاء السابقة
    clearFieldError(field);
    
    // التحقق من الحقول المطلوبة
    if (rules.required && !value) {
        isValid = false;
        message = 'هذا الحقل مطلوب';
    }
    // التحقق من الطول الأدنى
    else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        message = `يجب أن يحتوي على ${rules.minLength} أحرف على الأقل`;
    }
    // التحقق من البريد الإلكتروني
    else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    // إضافة رسالة الخطأ
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorElement);
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
}

function clearFieldError(field) {
    field.classList.remove('error', 'success');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/* ===================================================================
   وظائف مساعدة
   =================================================================== */
function showLoadingState(button) {
    button.disabled = true;
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
}

function hideLoadingState(button) {
    button.disabled = false;
    button.classList.remove('loading');
    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
        button.setAttribute('title', 'إخفاء كلمة المرور');
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
        button.setAttribute('title', 'إظهار كلمة المرور');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ===================================================================
   استعادة كلمة المرور
   =================================================================== */
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.add('show');
    
    // التركيز على حقل البريد الإلكتروني
    setTimeout(() => {
        document.getElementById('resetEmail').focus();
    }, 300);
    
    // معالجة النموذج
    const form = document.getElementById('forgotPasswordForm');
    form.addEventListener('submit', handleForgotPassword);
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.remove('show');
    
    // إعادة تعيين النموذج
    document.getElementById('forgotPasswordForm').reset();
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email || !isValidEmail(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // محاكاة إرسال البريد
    showNotification('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
    closeForgotPassword();
}

/* ===================================================================
   تذكر المستخدم
   =================================================================== */
function checkRememberedUser() {
    const sessionData = localStorage.getItem('adminSession');
    
    if (sessionData) {
        try {
            const data = JSON.parse(sessionData);
            const timeDiff = Date.now() - data.timestamp;
            
            // صالح لمدة 30 يوم
            if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
                // ملء البيانات المحفوظة
                document.getElementById('username').value = data.user.username;
                document.getElementById('rememberMe').checked = true;
                
                showNotification('مرحباً مرة أخرى! بياناتك محفوظة', 'info');
            } else {
                // انتهت صلاحية الجلسة
                localStorage.removeItem('adminSession');
            }
        } catch (e) {
            localStorage.removeItem('adminSession');
        }
    }
}

/* ===================================================================
   اختصارات لوحة المفاتيح
   =================================================================== */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Enter لتسجيل الدخول
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT') {
                const form = activeElement.closest('form');
                if (form && form.id === 'adminLoginForm') {
                    e.preventDefault();
                    handleLogin();
                }
            }
        }
        
        // Escape لإغلاق النوافذ المنبثقة
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                closeForgotPassword();
            }
        }
        
        // Alt + U للتركيز على اسم المستخدم
        if (e.altKey && e.key === 'u') {
            e.preventDefault();
            document.getElementById('username').focus();
        }
        
        // Alt + P للتركيز على كلمة المرور
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            document.getElementById('password').focus();
        }
    });
}

/* ===================================================================
   تسجيل الأنشطة
   =================================================================== */
function logLoginActivity(user) {
    const activity = {
        type: 'login',
        user: user.username,
        role: user.role,
        timestamp: new Date().toISOString(),
        ip: 'localhost', // في التطبيق الحقيقي سيتم الحصول على IP الحقيقي
        userAgent: navigator.userAgent
    };
    
    // حفظ النشاط في التخزين المحلي
    let activities = JSON.parse(localStorage.getItem('loginActivities') || '[]');
    activities.unshift(activity);
    
    // الاحتفاظ بآخر 50 نشاط فقط
    activities = activities.slice(0, 50);
    
    localStorage.setItem('loginActivities', JSON.stringify(activities));
}

function logFailedLoginAttempt() {
    const attempt = {
        type: 'failed_login',
        timestamp: new Date().toISOString(),
        ip: 'localhost',
        userAgent: navigator.userAgent
    };
    
    let attempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
    attempts.unshift(attempt);
    
    // الاحتفاظ بآخر 20 محاولة فقط
    attempts = attempts.slice(0, 20);
    
    localStorage.setItem('failedLoginAttempts', JSON.stringify(attempts));
}

/* ===================================================================
   إضافة أنماط CSS للتحقق من صحة النموذج
   =================================================================== */
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .login-form .form-control.error {
        border-color: var(--danger-color) !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    .login-form .form-control.success {
        border-color: var(--success-color) !important;
        box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.1) !important;
    }
    
    .field-error {
        color: var(--danger-color);
        font-size: var(--font-size-xs);
        margin-top: var(--spacing-1);
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        animation: slideInError 0.3s ease-out;
    }
    
    @keyframes slideInError {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .login-form.shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .modal {
        backdrop-filter: blur(4px);
    }
    
    .demo-credentials {
        animation: slideInFromRight 0.8s ease-out;
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

document.head.appendChild(validationStyles);

/* ===================================================================
   إغلاق النافذة المنبثقة عند النقر خارجها
   =================================================================== */
document.addEventListener('click', function(e) {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal && modal.classList.contains('show') && e.target === modal) {
        closeForgotPassword();
    }
});

// تصدير الوظائف للاستخدام العام
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;