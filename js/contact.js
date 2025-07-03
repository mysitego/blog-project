/* ===================================================================
   JavaScript خاص بصفحة الاتصال
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    initializeContactForm();
    initializeFormValidation();
});

/* ===================================================================
   وظائف الأسئلة الشائعة
   =================================================================== */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            toggleFAQItem(item);
        });
        
        // دعم التنقل بالكيبورد
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQItem(item);
            }
        });
        
        // جعل العنصر قابل للتفاعل بالكيبورد
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
}

function toggleFAQItem(item) {
    const isActive = item.classList.contains('active');
    const question = item.querySelector('.faq-question');
    
    // إغلاق جميع العناصر الأخرى
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
            activeItem.classList.remove('active');
            activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
    });
    
    // تبديل العنصر الحالي
    if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        
        // التمرير إلى العنصر بسلاسة
        setTimeout(() => {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
}

/* ===================================================================
   تحسين نموذج الاتصال
   =================================================================== */
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const resetBtn = form.querySelector('button[type="reset"]');
    
    // تحسين زر الإرسال
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form, submitBtn);
    });
    
    // تحسين زر إعادة التعيين
    resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleFormReset(form);
    });
    
    // حفظ البيانات تلقائياً
    setupAutoSave(form);
    
    // استعادة البيانات المحفوظة
    restoreSavedData(form);
}

function handleFormSubmission(form, submitBtn) {
    // التحقق من صحة النموذج
    if (!validateForm(form)) {
        showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
        return;
    }
    
    // إظهار حالة التحميل
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    // محاكاة إرسال النموذج
    setTimeout(() => {
        // إعادة تعيين النموذج
        form.reset();
        clearSavedData();
        
        // إعادة تعيين الزر
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // إظهار رسالة نجاح
        showNotification('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.', 'success');
        
        // التمرير إلى أعلى الصفحة
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

function handleFormReset(form) {
    // إظهار تأكيد
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        form.reset();
        clearSavedData();
        showNotification('تم مسح جميع البيانات', 'info');
        
        // إزالة رسائل الخطأ
        clearValidationErrors(form);
    }
}

/* ===================================================================
   التحقق من صحة النموذج
   =================================================================== */
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // التحقق عند فقدان التركيز
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        // التحقق أثناء الكتابة (للحقول النصية)
        if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', debounce(() => {
                validateField(input);
            }, 500));
        }
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // إزالة رسائل الخطأ السابقة
    clearFieldError(field);
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    // التحقق من البريد الإلكتروني
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
        }
    }
    // التحقق من رقم الهاتف
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'يرجى إدخال رقم هاتف صحيح';
        }
    }
    // التحقق من طول الرسالة
    else if (field.tagName === 'TEXTAREA' && value) {
        if (value.length < 20) {
            isValid = false;
            errorMessage = 'الرسالة قصيرة جداً (الحد الأدنى 20 حرف)';
        } else if (value.length > 1000) {
            isValid = false;
            errorMessage = 'الرسالة طويلة جداً (الحد الأقصى 1000 حرف)';
        }
    }
    
    // إظهار رسالة الخطأ
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    const errorElement = createErrorElement(message);
    field.parentNode.appendChild(errorElement);
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
}

function clearFieldError(field) {
    field.classList.remove('error', 'success');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearValidationErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(element => element.remove());
    
    const fields = form.querySelectorAll('.error, .success');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
    });
}

function createErrorElement(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--danger-color);
        font-size: var(--font-size-xs);
        margin-top: var(--spacing-1);
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
    `;
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-triangle';
    errorDiv.insertBefore(icon, errorDiv.firstChild);
    
    return errorDiv;
}

/* ===================================================================
   الحفظ التلقائي
   =================================================================== */
function setupAutoSave(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            saveFormData(form);
        }, 1000));
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    try {
        localStorage.setItem('contact_form_data', JSON.stringify(data));
    } catch (e) {
        console.warn('لا يمكن حفظ بيانات النموذج:', e);
    }
}

function restoreSavedData(form) {
    try {
        const savedData = localStorage.getItem('contact_form_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            for (let [key, value] of Object.entries(data)) {
                const field = form.querySelector(`[name="${key}"], #${key}`);
                if (field && value) {
                    field.value = value;
                }
            }
            
            // إظهار إشعار بالبيانات المستعادة
            showNotification('تم استعادة البيانات المحفوظة مسبقاً', 'info');
        }
    } catch (e) {
        console.warn('لا يمكن استعادة بيانات النموذج:', e);
    }
}

function clearSavedData() {
    try {
        localStorage.removeItem('contact_form_data');
    } catch (e) {
        console.warn('لا يمكن مسح البيانات المحفوظة:', e);
    }
}

/* ===================================================================
   وظائف مساعدة
   =================================================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // استخدام وظيفة الإشعارات من main.js
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // fallback في حالة عدم توفر الوظيفة
        alert(message);
    }
}

/* ===================================================================
   تحسينات إضافية
   =================================================================== */

// تحسين تجربة النقر على العناصر
document.addEventListener('click', function(e) {
    // النقر على بطاقات التواصل لنسخ المعلومات
    if (e.target.closest('.contact-info-card')) {
        const card = e.target.closest('.contact-info-card');
        const link = card.querySelector('.info-link');
        
        if (link && (link.href.startsWith('mailto:') || link.href.startsWith('tel:'))) {
            const text = link.textContent;
            copyToClipboard(text);
            showNotification(`تم نسخ: ${text}`, 'success');
        }
    }
});

// وظيفة نسخ النص
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(err => {
            console.warn('فشل في نسخ النص:', err);
        });
    } else {
        // fallback للمتصفحات القديمة
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// تحسين إمكانية الوصول
document.addEventListener('keydown', function(e) {
    // التنقل في الأسئلة الشائعة بالأسهم
    if (e.target.closest('.faq-question')) {
        const faqQuestions = document.querySelectorAll('.faq-question');
        const currentIndex = Array.from(faqQuestions).indexOf(e.target.closest('.faq-question'));
        
        if (e.key === 'ArrowDown' && currentIndex < faqQuestions.length - 1) {
            e.preventDefault();
            faqQuestions[currentIndex + 1].focus();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            faqQuestions[currentIndex - 1].focus();
        }
    }
});

// إضافة أنماط CSS للحقول مع التحقق
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .contact-form .form-control.error {
        border-color: var(--danger-color) !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    .contact-form .form-control.success {
        border-color: var(--success-color) !important;
        box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.1) !important;
    }
    
    .field-error {
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
    
    .faq-question:focus-visible {
        box-shadow: inset 0 0 0 2px var(--primary-color);
        outline: none;
    }
`;

document.head.appendChild(validationStyles);