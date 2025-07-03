/* ===================================================================
   نظام إدارة المدونة - JavaScript الرئيسي
   =================================================================== */

// التكوين الأساسي
const BlogApp = {
  currentLang: 'ar',
  currentTheme: 'light',
  
  // إعدادات التطبيق
  config: {
    animationDuration: 300,
    loadMoreDelay: 1000,
    autoSaveInterval: 30000
  },
  
  // البيانات الافتراضية
  data: {
    posts: [],
    categories: [],
    comments: [],
    users: []
  },
  
  // الترجمات
  translations: {
    ar: {
      // التنقل
      'home': 'الرئيسية',
      'blog': 'المدونة', 
      'categories': 'الفئات',
      'about': 'من نحن',
      'contact': 'اتصل بنا',
      'admin': 'لوحة التحكم',
      
      // المحتوى
      'read-more': 'اقرأ المزيد',
      'load-more': 'تحميل المزيد',
      'explore-artic': 'اكتشف مقالاتنا',
      'subscribe': 'اشترك',
      'share': 'مشاركة',
      'comment': 'تعليق',
      'comments': 'التعليقات',
      'search': 'بحث',
      'author': 'الكاتب',
      'date': 'التاريخ',
      'category': 'الفئة',
      
      // النماذج
      'name': 'الاسم',
      'email': 'البريد الإلكتروني',
      'message': 'الرسالة',
      'send': 'إرسال',
      'submit': 'إرسال',
      'cancel': 'إلغاء',
      'save': 'حفظ',
      'edit': 'تعديل',
      'delete': 'حذف',
      
      // الرسائل
      'success': 'تم بنجاح',
      'error': 'حدث خطأ',
      'loading': 'جاري التحميل...',
      'no-results': 'لا توجد نتائج',
      'language-changed': 'تم تغيير اللغة',
      'dark-mode': 'الوضع الليلي',
      'light-mode': 'الوضع النهاري',
      'close-notification': 'إغلاق الإشعار',
      
      // لوحة التحكم
      'dashboard': 'لوحة التحكم',
      'posts': 'المقالات',
      'users': 'المستخدمون',
      'settings': 'الإعدادات',
      'logout': 'تسجيل الخروج',
      'login': 'تسجيل الدخول',
      
      // النصوص الأساسية
      'welcome': 'أهلاً وسهلاً',
      'discover-knowledge': 'اكتشف عالمًا من المعرفة والإلهام',
      'latest-posts': 'أحدث المقالات',
      'all-posts': 'جميع المقالات',
      'newsletter-signup': 'اشترك في النشرة الإخبارية',
      'about-me': 'من أنا',
      'learn-more': 'تعرف علي المزيد'
    },
    en: {
      // Navigation
      'home': 'Home',
      'blog': 'Blog',
      'categories': 'Categories', 
      'about': 'About',
      'contact': 'Contact',
      'admin': 'Admin Panel',
      
      // Content
      'read-more': 'Read More',
      'load-more': 'Load More',
      'subscribe': 'Subscribe',
      'share': 'Share',
      'comment': 'Comment',
      'comments': 'Comments',
      'search': 'Search',
      'author': 'Author',
      'date': 'Date',
      'category': 'Category',
      
      // Forms
      'name': 'Name',
      'email': 'Email',
      'message': 'Message',
      'send': 'Send',
      'submit': 'Submit',
      'cancel': 'Cancel',
      'save': 'Save',
      'edit': 'Edit',
      'delete': 'Delete',
      
      // Messages
      'success': 'Success',
      'error': 'Error',
      'loading': 'Loading...',
      'no-results': 'No results found',
      'language-changed': 'Language changed',
      'dark-mode': 'Dark Mode',
      'light-mode': 'Light Mode',
      'close-notification': 'Close notification',
      
      // Admin
      'dashboard': 'Dashboard',
      'posts': 'Posts',
      'users': 'Users',
      'settings': 'Settings',
      'logout': 'Logout',
      'login': 'Login',
      
      // Basic texts
      'welcome': 'Welcome',
      'discover-knowledge': 'Discover a World of Knowledge and Inspiration',
      'latest-posts': 'Latest Posts',
      'all-posts': 'All Posts',
      'newsletter-signup': 'Subscribe to Newsletter',
      'about-me': 'About Me',
      'learn-more': 'Learn More'
    }
  }
};

/* ===================================================================
   وظائف التهيئة والبدء
   =================================================================== */
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadInitialData();
});

function initializeApp() {
  // تحميل الإعدادات المحفوظة
  loadSavedSettings();
  
  // تطبيق الثيم واللغة
  applyTheme(BlogApp.currentTheme);
  applyLanguage(BlogApp.currentLang);
  
  // تهيئة المكونات
  initializeComponents();
  
  console.log('تم تهيئة التطبيق بنجاح');
}

function loadSavedSettings() {
  // تحميل اللغة المحفوظة
  const savedLang = localStorage.getItem('blog_language') || 'ar';
  BlogApp.currentLang = savedLang;
  
  // تحميل الثيم المحفوظ
  const savedTheme = localStorage.getItem('blog_theme') || 'light';
  BlogApp.currentTheme = savedTheme;
}

function setupEventListeners() {
  // أزرار تبديل اللغة
  const langToggles = document.querySelectorAll('[data-lang-toggle]');
  langToggles.forEach(toggle => {
    toggle.addEventListener('click', handleLanguageToggle);
  });
  
  // أزرار تبديل الثيم
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', handleThemeToggle);
  });
  
  // أزرار تحميل المزيد
  const loadMoreBtns = document.querySelectorAll('[data-load-more]');
  loadMoreBtns.forEach(btn => {
    btn.addEventListener('click', handleLoadMore);
  });
  
  // نماذج الاتصال
  const contactForms = document.querySelectorAll('[data-contact-form]');
  contactForms.forEach(form => {
    form.addEventListener('submit', handleContactForm);
  });
  
  // البحث
  const searchInputs = document.querySelectorAll('[data-search]');
  searchInputs.forEach(input => {
    input.addEventListener('input', debounce(handleSearch, 300));
  });
  
  // القوائم المنسدلة
  setupDropdowns();
  
  // الموبايل مينو
  setupMobileMenu();
}

/* ===================================================================
   وظائف اللغة
   =================================================================== */
function handleLanguageToggle(event) {
  event.preventDefault();
  const newLang = BlogApp.currentLang === 'ar' ? 'en' : 'ar';
  switchLanguage(newLang);
}

function switchLanguage(lang) {
  BlogApp.currentLang = lang;
  localStorage.setItem('blog_language', lang);
  applyLanguage(lang);
  showNotification(translate('language-changed'), 'success');
}

function applyLanguage(lang) {
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  updateTexts();
  updateLanguageButtons();
}

function updateTexts() {
  const translatableElements = document.querySelectorAll('[data-translate]');
  translatableElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = translate(key);
    if (translation) {
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
}

function translate(key) {
  return BlogApp.translations[BlogApp.currentLang][key] || key;
}

function updateLanguageButtons() {
  const langButtons = document.querySelectorAll('[data-lang-toggle]');
  langButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      // Update icon based on current language, if needed, or keep it static
      // For now, we'll keep it static as fas fa-language
    }
    // No text to update as per new requirement
  });
}

/* ===================================================================
   وظائف الثيم (الوضع الليلي/النهاري)
   =================================================================== */
function handleThemeToggle(event) {
  event.preventDefault();
  const newTheme = BlogApp.currentTheme === 'light' ? 'dark' : 'light';
  switchTheme(newTheme);
}

function switchTheme(theme) {
  BlogApp.currentTheme = theme;
  localStorage.setItem('blog_theme', theme);
  
  // تطبيق الثيم
  applyTheme(theme);
  
  // إظهار تأثير التغيير
  showNotification(translate('theme-changed'), 'success');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // تحديث أيقونات الثيم
  updateThemeButtons();
}

function updateThemeButtons() {
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  themeButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (BlogApp.currentTheme === 'dark') {
        icon.className = 'fas fa-sun'; // Font Awesome sun icon
        btn.setAttribute('title', translate('light-mode')); // Update title for accessibility
      } else {
        icon.className = 'fas fa-moon'; // Font Awesome moon icon
        btn.setAttribute('title', translate('dark-mode')); // Update title for accessibility
      }
    }
    // No text to update as per new requirement
  });
}

/* ===================================================================
   وظائف تحميل المحتوى (AJAX محاكي)
   =================================================================== */
function handleLoadMore(event) {
  event.preventDefault();
  const button = event.target;
  const target = button.getAttribute('data-target');
  const type = button.getAttribute('data-type') || 'posts';
  
  // إظهار حالة التحميل
  showLoadingState(button);
  
  // محاكاة تحميل البيانات
  setTimeout(() => {
    loadMoreContent(target, type);
    hideLoadingState(button);
  }, BlogApp.config.loadMoreDelay);
}

function loadMoreContent(target, type) {
  const container = document.querySelector(target);
  if (!container) return;
  
  let newContent = '';
  
  switch(type) {
    case 'posts':
      newContent = generatePostCards(3);
      break;
    case 'comments':
      newContent = generateComments(5);
      break;
    default:
      newContent = '<div class="alert">محتوى جديد</div>';
  }
  
  // إضافة المحتوى مع تأثير انتقالي
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newContent;
  
  while (tempDiv.firstChild) {
    const element = tempDiv.firstChild;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    container.appendChild(element);
    
    // تطبيق التأثير
    setTimeout(() => {
      element.style.transition = 'all 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 50);
  }
}

function showLoadingState(button) {
  button.disabled = true;
  button.innerHTML = '<i class="icon-spinner animate-spin"></i> ' + translate('loading');
}

function hideLoadingState(button) {
  button.disabled = false;
  button.innerHTML = translate('load-more');
}

/* ===================================================================
   وظائف البحث
   =================================================================== */
function handleSearch(event) {
  const query = event.target.value.trim();
  const resultsContainer = document.querySelector('[data-search-results]');
  
  if (query.length < 2) {
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
    return;
  }
  
  // محاكاة البحث
  performSearch(query, resultsContainer);
}

function performSearch(query, container) {
  if (!container) return;
  
  // إظهار حالة التحميل
  container.innerHTML = '<div class="text-center p-4">' + translate('loading') + '</div>';
  
  // محاكاة نتائج البحث
  setTimeout(() => {
    const results = generateSearchResults(query);
    container.innerHTML = results;
  }, 500);
}

function generateSearchResults(query) {
  const mockResults = [
    { title: 'نتيجة البحث الأولى', excerpt: 'وصف مختصر للنتيجة...', date: '2024-01-15' },
    { title: 'نتيجة البحث الثانية', excerpt: 'وصف آخر للنتيجة...', date: '2024-01-10' }
  ];
  
  if (mockResults.length === 0) {
    return '<div class="text-center p-4">' + translate('no-results') + '</div>';
  }
  
  return mockResults.map(result => `
    <div class="search-result p-3 border-bottom">
      <h6><a href="#" class="text-decoration-none">${result.title}</a></h6>
      <p class="text-muted small mb-1">${result.excerpt}</p>
      <small class="text-muted">${result.date}</small>
    </div>
  `).join('');
}

/* ===================================================================
   وظائف النماذج
   =================================================================== */
function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  // إظهار حالة التحميل
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.value;
  submitBtn.value = translate('loading');
  submitBtn.disabled = true;
  
  // محاكاة الإرسال
  setTimeout(() => {
    // إعادة تعيين النموذج
    form.reset();
    submitBtn.value = originalText;
    submitBtn.disabled = false;
    
    // إظهار رسالة نجاح
    showNotification(translate('message-sent'), 'success');
  }, 2000);
}

/* ===================================================================
   وظائف واجهة المستخدم
   =================================================================== */
function setupDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // إغلاق القوائم الأخرى
        closeAllDropdowns();
        
        // تبديل القائمة الحالية
        menu.classList.toggle('show');
      });
    }
  });
  
  // إغلاق القوائم عند النقر خارجها
  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
  const openMenus = document.querySelectorAll('.dropdown-menu.show');
  openMenus.forEach(menu => menu.classList.remove('show'));
}

function setupMobileMenu() {
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const navbar = document.querySelector('.navbar'); // Get the navbar element

  if (mobileToggle && mobileMenu && navbar) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active'); // Use 'active' class for mobile menu
      mobileToggle.classList.toggle('active');
      // Add/remove overlay to prevent scrolling on body when menu is open
      document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('active'));
    });
    
    // إغلاق القائمة عند النقر على رابط
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close mobile menu if window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }
}

// Add scroll event listener for navbar background change
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) { // Adjust scroll threshold as needed
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

function showNotification(message, type = 'info') {
  // إنشاء عنصر الإشعار
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close" aria-label="${translate('close-notification')}">&times;</button>
    </div>
  `;
  
  // إضافة الإشعار للصفحة
  document.body.appendChild(notification);
  
  // إضافة الأنماط إذا لم تكن موجودة
  if (!document.querySelector('#notification-styles')) {
    addNotificationStyles();
  }
  
  // إظهار الإشعار
  setTimeout(() => notification.classList.add('show'), 100);
  
  // إخفاء الإشعار تلقائياً
  setTimeout(() => hideNotification(notification), 5000);
  
  // زر الإغلاق
  notification.querySelector('.notification-close').addEventListener('click', () => {
    hideNotification(notification);
  });
}

function hideNotification(notification) {
  notification.classList.add('hide');
  setTimeout(() => notification.remove(), 300);
}

function addNotificationStyles() {
  const styles = document.createElement('style');
  styles.id = 'notification-styles';
  styles.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s ease-out; /* Use ease-out for smoother entry */
      min-width: 300px;
      max-width: 90%; /* Ensure it doesn't overflow on small screens */
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification.hide {
      transform: translateX(100%);
      opacity: 0; /* Fade out when hiding */
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
    }
    
    body.no-scroll {
      overflow: hidden; /* Prevent scrolling when mobile menu is open */
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
      margin-left: 10px;
    }
    
    .notification-success {
      border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
      border-left: 4px solid var(--danger-color);
    }
    
    .notification-info {
      border-left: 4px solid var(--info-color);
    }
    
    [dir="rtl"] .notification {
      right: auto;
      left: 20px;
      transform: translateX(-100%);
    }
    
    [dir="rtl"] .notification.show {
      transform: translateX(0);
    }
    
    [dir="rtl"] .notification.hide {
      transform: translateX(-100%);
    }
  `;
  document.head.appendChild(styles);
}

/* ===================================================================
   مولدات المحتوى التجريبي
   =================================================================== */
function generatePostCards(count) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    posts.push(`
      <article class="card mb-4 fade-in">
        <img src="/images/blog-${i + 4}.jpg" alt="صورة المقال" class="card-img-top" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">عنوان المقال ${i + 4}</h5>
          <p class="card-text text-muted">مقتطف من المقال يعطي فكرة سريعة عن المحتوى...</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">2024-01-${15 + i}</small>
            <a href="post.html" class="btn btn-outline btn-sm" data-translate="read-more">اقرأ المزيد</a>
          </div>
        </div>
      </article>
    `);
  }
  return posts.join('');
}

function generateComments(count) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(`
      <div class="comment mb-3 p-3 border rounded fade-in">
        <div class="d-flex align-items-center mb-2">
          <img src="/images/avatar-${i + 1}.jpg" alt="صورة المستخدم" class="rounded-circle me-2" width="40" height="40">
          <div>
            <h6 class="mb-0">المستخدم ${i + 1}</h6>
            <small class="text-muted">منذ ${i + 1} ساعة</small>
          </div>
        </div>
        <p class="mb-0">تعليق تجريبي رقم ${i + 1}...</p>
      </div>
    `);
  }
  return comments.join('');
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

function initializeComponents() {
  // تهيئة المكونات التفاعلية
  initializeTabs();
  initializeAccordions();
  initializeCarousels();
}

function initializeTabs() {
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-tab');
      activateTab(tab, target);
    });
  });
}

function activateTab(activeTab, target) {
  // إزالة الفئة النشطة من جميع التبويبات
  const allTabs = document.querySelectorAll('[data-tab]');
  allTabs.forEach(tab => tab.classList.remove('active'));
  
  // إضافة الفئة النشطة للتبويب المحدد
  activeTab.classList.add('active');
  
  // إخفاء جميع المحتويات
  const allContents = document.querySelectorAll('[data-tab-content]');
  allContents.forEach(content => content.classList.remove('active'));
  
  // إظهار المحتوى المطلوب
  const targetContent = document.querySelector(`[data-tab-content="${target}"]`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

function initializeAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isOpen = content.classList.contains('show');
      
      // إغلاق جميع العناصر الأخرى في نفس الأكورديون
      const accordion = header.closest('.accordion');
      if (accordion) {
        const allContents = accordion.querySelectorAll('.accordion-content');
        allContents.forEach(c => c.classList.remove('show'));
        
        const allHeaders = accordion.querySelectorAll('.accordion-header');
        allHeaders.forEach(h => h.classList.remove('active'));
      }
      
      // تبديل العنصر الحالي
      if (!isOpen) {
        content.classList.add('show');
        header.classList.add('active');
      }
    });
  });
}

function initializeCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentSlide = 0;
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        updateCarousel(carousel, currentSlide);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        updateCarousel(carousel, currentSlide);
      });
    }
    
    // تطبيق الحالة الأولية
    updateCarousel(carousel, 0);
  });
}

function updateCarousel(carousel, index) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

/* ===================================================================
   تحميل البيانات الأولية
   =================================================================== */
function loadInitialData() {
  // تحميل البيانات التجريبية
  BlogApp.data.posts = generateMockPosts();
  BlogApp.data.categories = generateMockCategories();
  BlogApp.data.comments = generateMockComments();
  BlogApp.data.users = generateMockUsers();
  
  console.log('تم تحميل البيانات الأولية');
}

function generateMockPosts() {
  return [
    { id: 1, title: 'مقدمة في تطوير الويب', excerpt: 'تعلم أساسيات تطوير الويب...', category: 'تكنولوجيا', date: '2024-01-15' },
    { id: 2, title: 'أهمية الصحة النفسية', excerpt: 'كيف نحافظ على صحتنا النفسية...', category: 'صحة', date: '2024-01-14' },
    { id: 3, title: 'استراتيجيات ريادة الأعمال', excerpt: 'نصائح للمبتدئين في ريادة الأعمال...', category: 'أعمال', date: '2024-01-13' }
  ];
}

function generateMockCategories() {
  return [
    { id: 1, name: 'تكنولوجيا', count: 15 },
    { id: 2, name: 'صحة', count: 12 },
    { id: 3, name: 'أعمال', count: 8 }
  ];
}

function generateMockComments() {
  return [
    { id: 1, postId: 1, author: 'أحمد محمد', content: 'مقال رائع!', date: '2024-01-15' },
    { id: 2, postId: 1, author: 'فاطمة علي', content: 'شكراً على المعلومات المفيدة', date: '2024-01-15' }
  ];
}

function generateMockUsers() {
  return [
    { id: 1, name: 'المدير', email: 'admin@blog.com', role: 'admin' },
    { id: 2, name: 'الكاتب', email: 'writer@blog.com', role: 'author' }
  ];
}

/* ===================================================================
   تفعيل وإخفاء الشريط الجانبي في لوحة التحكم (داشبورد الأدمن)
   =================================================================== */
document.addEventListener('DOMContentLoaded', function() {
  const adminSidebar = document.getElementById('adminSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const adminMain = document.querySelector('.admin-main');

  // منطق طي السايد بار في الديسكتوب
  function toggleSidebarCollapse() {
    if (adminSidebar && adminMain) {
      adminSidebar.classList.toggle('collapsed');
      adminMain.classList.toggle('sidebar-collapsed');
    }
  }

  // منطق overlay في الموبايل
  function openSidebarMobile() {
    if (adminSidebar) {
      adminSidebar.classList.add('animate');
      adminSidebar.classList.add('show');
      adminSidebar.classList.remove('hide');
    }
    document.body.classList.add('sidebar-open');
  }
  function closeSidebarMobile() {
    if (adminSidebar) {
      adminSidebar.classList.add('animate');
      adminSidebar.classList.remove('show');
      adminSidebar.classList.add('hide');
      setTimeout(() => {
        adminSidebar.classList.remove('animate');
      }, 450);
    }
    document.body.classList.remove('sidebar-open');
  }
  function toggleSidebarMobile() {
    if (adminSidebar.classList.contains('show')) {
      closeSidebarMobile();
    } else {
      openSidebarMobile();
    }
  }

  // زر السايد بار (ديسكتوب فقط)
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (window.innerWidth > 991) {
        toggleSidebarCollapse();
      } else {
        closeSidebarMobile();
      }
    });
  }
  // زر البرجر في الهيدر (موبايل فقط)
  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (window.innerWidth <= 991) {
        toggleSidebarMobile();
      }
    });
  }
  // إغلاق السايد بار overlay عند الضغط خارجها في الموبايل فقط
  document.addEventListener('click', function(e) {
    if (
      adminSidebar &&
      adminSidebar.classList.contains('show') &&
      !adminSidebar.contains(e.target) &&
      !e.target.closest('#sidebarToggle') &&
      !e.target.closest('#mobileSidebarToggle') &&
      window.innerWidth <= 991
    ) {
      closeSidebarMobile();
    }
  });
  // عند تغيير حجم الشاشة: أعد السايد بار لوضعه الطبيعي إذا انتقلنا من موبايل إلى ديسكتوب
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991 && lastWidth <= 991 && adminSidebar && adminMain) {
      adminSidebar.classList.remove('show', 'hide', 'animate');
      document.body.classList.remove('sidebar-open');
      closeSidebarMobile();
      adminSidebar.classList.remove('collapsed');
      adminMain.classList.remove('sidebar-collapsed');
    }
    lastWidth = window.innerWidth;
  });
});

// عند تحميل الصفحة أضف حركة للناف بار
window.addEventListener('DOMContentLoaded', function() {
  const adminHeader = document.querySelector('.admin-header');
  if (adminHeader) {
    adminHeader.classList.add('animated');
    setTimeout(() => adminHeader.classList.remove('animated'), 900);
  }
});

// تصدير وظائف للاستخدام العام
window.BlogApp = BlogApp;
window.translate = translate;
window.showNotification = showNotification;

// اختبار زر البرجر
window.addEventListener('DOMContentLoaded', function() {
  var burger = document.getElementById('mobileSidebarToggle');
  if (burger) {
    burger.addEventListener('click', function() {
      console.log('تم الضغط على زر البرجر (Burger Icon)');
    });
  }
});
