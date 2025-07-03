/**
 * معالجة نموذج إضافة/تعديل المقال
 * هذا الملف يحتوي على الدوال اللازمة للتعامل مع نموذج المقال
 */

$(document).ready(function() {
    // تهيئة متغيرات النموذج
    const $postForm = $('#postForm');
    const $postTitle = $('#postTitle');
    const $postSlug = $('#postSlug');
    const $postContent = $('#postContent');
    const $postExcerpt = $('#postExcerpt');
    const $postStatus = $('#postStatus');
    const $featuredImage = $('#featuredImage');
    const $imagePreview = $('#imagePreview');
    const $saveDraftBtn = $('#saveDraftBtn');
    const $publishBtn = $('#publishBtn');
    
    // تهيئة المحرر (سيتم من خلال editor-config.js)
    
    // إظهار/إخفاء تاريخ النشر بناءً على حالة النشر
    function togglePublishDate() {
        const status = $postStatus.val();
        if (status === 'publish') {
            $('#publishDateField').show();
        } else {
            $('#publishDateField').hide();
        }
    }
    
    // تغيير حالة النشر
    $postStatus.change(togglePublishDate);
    
    // تعيين التاريخ والوقت الحاليين كقيمة افتراضية
    function setCurrentDateTime() {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 16);
        $('#publishDateTime').val(formattedDate);
    }
    
    // تهيئة تاريخ النشر
    togglePublishDate();
    setCurrentDateTime();
    
    // معاينة الصورة المميزة
    $featuredImage.change(function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                $imagePreview.attr('src', event.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // إنشاء رابط تلقائي من العنوان
    $postTitle.on('keyup', function() {
        const title = $(this).val();
        const slug = title
            .toLowerCase()
            .replace(/[^\w\u0600-\u06FF\s-]/g, '') // إزالة الرموز غير المرغوب فيها
            .replace(/\s+/g, '-') // استبدال المسافات بشرطات
            .replace(/--+/g, '-') // استبدال الشرطات المكررة
            .replace(/^-+|-+$/g, ''); // إزالة الشرطات من البداية والنهاية
        
        $postSlug.val(slug);
    });
    
    // إضافة وسوم جديدة
    $('#addTagBtn').click(function(e) {
        e.preventDefault();
        const $tagInput = $('#tagInput');
        const tag = $tagInput.val().trim();
        
        if (tag) {
            const tagHtml = `
                <span class="badge bg-secondary me-2 mb-2">
                    ${tag}
                    <button type="button" class="btn-close btn-close-white btn-sm ms-1" aria-label="إزالة"></button>
                    <input type="hidden" name="tags[]" value="${tag}">
                </span>`;
            
            $('#tagsContainer').append(tagHtml);
            $tagInput.val('');
        }
    });
    
    // إزالة وسوم
    $(document).on('click', '.btn-close', function() {
        $(this).parent().remove();
    });
    
    // إضافة فئة جديدة
    $('#addNewCategory').click(function(e) {
        e.preventDefault();
        const newCategory = prompt('أدخل اسم الفئة الجديدة:');
        if (newCategory && newCategory.trim() !== '') {
            const $categorySelect = $('#postCategory');
            $categorySelect.append(`<option value="${newCategory.trim()}" selected>${newCategory.trim()}</option>`);
            showNotification('تمت إضافة الفئة بنجاح', 'success');
        }
    });
    
    // حفظ المسودة
    $saveDraftBtn.click(function(e) {
        e.preventDefault();
        savePost('draft');
    });
    
    // نشر المقال
    $publishBtn.click(function(e) {
        e.preventDefault();
        savePost('publish');
    });
    
    // إرسال النموذج
    $postForm.on('submit', function(e) {
        e.preventDefault();
        const status = $postStatus.val();
        savePost(status);
    });
    
    // دالة حفظ المقال
    function savePost(status) {
        // التحقق من الحقول المطلوبة
        const title = $postTitle.val().trim();
        if (!title) {
            showNotification('الرجاء إدخال عنوان المقال', 'danger');
            $postTitle.focus();
            return false;
        }
        
        // إظهار مؤشر التحميل
        const $submitButton = status === 'draft' ? $saveDraftBtn : $publishBtn;
        const originalText = $submitButton.html();
        $submitButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الحفظ...');
        
        // جمع بيانات النموذج
        const formData = new FormData($postForm[0]);
        formData.append('status', status);
        
        // إضافة المحتوى من المحرر
        formData.append('content', $postContent.summernote('code'));
        
        // إضافة الصورة المميزة إذا تم اختيارها
        const featuredImage = $featuredImage[0].files[0];
        if (featuredImage) {
            formData.append('featured_image', featuredImage);
        }
        
        // هنا يمكنك إضافة كود AJAX لإرسال النموذج
        // هذا مثال بسيط للتوضيح فقط
        setTimeout(() => {
            console.log('بيانات النموذج:', Object.fromEntries(formData));
            
            // إظهار رسالة نجاح
            const message = status === 'draft' ? 'تم حفظ المسودة بنجاح' : 'تم نشر المقال بنجاح';
            showNotification(message, 'success');
            
            // إعادة تعيين الزر
            $submitButton.prop('disabled', false).html(originalText);
            
            // إعادة التوجيه بعد ثانيتين (لأغراض العرض فقط)
            if (status === 'publish') {
                setTimeout(() => {
                    window.location.href = 'posts.html';
                }, 1500);
            }
        }, 1000);
        
        return false;
    }
    
    // دالة لعرض الإشعارات
    function showNotification(message, type = 'info') {
        // إخفاء أي إشعارات سابقة
        $('.custom-notification').remove();
        
        // إنشاء عنصر الإشعار
        const notification = $(`
            <div class="custom-notification alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
            </div>
        `);
        
        // إضافة الإشعار إلى الصفحة
        $('body').append(notification);
        
        // إخفاء الإشعار تلقائياً بعد 5 ثواني
        setTimeout(() => {
            notification.alert('close');
        }, 5000);
    }
});
