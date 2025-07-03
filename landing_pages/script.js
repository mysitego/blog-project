/* ===================================================================
   JavaScript لصفحة الهبوط
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeLandingPage();
});

function initializeLandingPage() {
    setupSignupForm();
    setupSmoothScrolling();
    setupAnimations();
    setupTestimonialSlider();
}

/* ===================================================================
   نموذج التسجيل
   =================================================================== */
function setupSignupForm() {
    const form = document.getElementById('landingSignupForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup(form);
    });
    
    // التحقق من صحة الحقول
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function handleSignup(form) {
    if (!validateForm(form)) {
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // إظهار حالة التحميل
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    
    // محاكاة إرسال البيانات
    setTimeout(() => {
        // حفظ البيانات في التخزين المحلي
        saveSubscription(data);
        
        // إظهار رسالة نجاح
        showSuccessMessage();
        
        // إعادة تعيين النموذج
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // إعادة توجيه للمدونة
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
        
    }, 2000);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
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
    let isValid = true;
    let message = '';
    
    // إزالة الأخطاء السابقة
    clearFieldError(field);
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'هذا الحقل مطلوب';
    }
    // التحقق من البريد الإلكتروني
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'يرجى إدخال بريد إلكتروني صحيح';
        }
    }
    // التحقق من الأسماء
    else if ((field.name === 'firstName' || field.name === 'lastName') && value) {
        if (value.length < 2) {
            isValid = false;
            message = 'يجب أن يحتوي على حرفين على الأقل';
        }
    }
    
    if (!isValid) {
        showFieldError(field, message);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = 'var(--danger-color)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorElement.style.cssText = `
        color: var(--danger-color);
        font-size: var(--font-size-xs);
        margin-top: var(--spacing-1);
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function saveSubscription(data) {
    // حفظ في التخزين المحلي
    let subscriptions = JSON.parse(localStorage.getItem('blog_subscriptions') || '[]');
    
    const subscription = {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'landing_page_1'
    };
    
    subscriptions.push(subscription);
    localStorage.setItem('blog_subscriptions', JSON.stringify(subscriptions));
}

function showSuccessMessage() {
    // إنشاء رسالة نجاح
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>تم التسجيل بنجاح!</h3>
            <p>مرحباً بك في مجتمع مدونة المعرفة. ستتلقى رسالة تأكيد في بريدك الإلكتروني قريباً.</p>
        </div>
    `;
    
    // إضافة أنماط CSS
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease;
    `;
    
    const successContent = successDiv.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        text-align: center;
        max-width: 400px;
        animation: slideInUp 0.5s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

/* ===================================================================
   التمرير السلس
   =================================================================== */
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===================================================================
   الرسوم المتحركة
   =================================================================== */
function setupAnimations() {
    // تأثير الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر للتأثيرات
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .signup-form-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // تأثير العد التصاعدي للإحصائيات
    setupCounterAnimation();
}

function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    const suffix = finalValue.replace(/[\d]/g, '');
    
    let currentValue = 0;
    const increment = numericValue / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue) + suffix;
    }, stepTime);
}

/* ===================================================================
   عرض الشهادات
   =================================================================== */
function setupTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length <= 1) return;
    
    let currentIndex = 0;
    
    // تأثير التمرير التلقائي (اختياري)
    setInterval(() => {
        testimonialCards[currentIndex].style.transform = 'scale(1)';
        testimonialCards[currentIndex].style.opacity = '1';
        
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        
        testimonialCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.transform = 'scale(1.02)';
                card.style.opacity = '1';
            } else {
                card.style.transform = 'scale(1)';
                card.style.opacity = '0.8';
            }
        });
    }, 5000);
}

/* ===================================================================
   تحسينات إضافية
   =================================================================== */

// تحسين الأداء - تأجيل تحميل الصور
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// إضافة كلاسات CSS للتأثيرات
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from { 
            opacity: 0;
            transform: translateY(50px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .success-message {
        animation: fadeIn 0.5s ease;
    }
    
    .success-content {
        animation: slideInUp 0.5s ease;
    }
    
    .success-content i {
        font-size: 3rem;
        color: var(--success-color);
        margin-bottom: 1rem;
    }
    
    .success-content h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .success-content p {
        color: var(--text-muted);
        margin: 0;
        line-height: 1.6;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(additionalStyles);