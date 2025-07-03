/**
 * تكوين محرر النصوص Summernote
 * هذا الملف يحتوي على إعدادات ووظائف مخصصة لمحرر النصوص
 */

// تهيئة محرر النصوص
function initSummernote(selector = '#postContent') {
    $(selector).summernote({
        lang: 'ar-AR',
        height: 400,
        minHeight: 300,
        maxHeight: 800,
        focus: true,
        placeholder: 'اكتب محتوى المقال هنا...',
        fontNames: [
            'Arial', 'Arial Black', 'Tahoma', 'Times New Roman',
            'Droid Arabic Kufi', 'Droid Sans Arabic', 'Traditional Arabic',
            'Courier New', 'Georgia', 'Impact', 'Lato', 'Roboto', 'Verdana'
        ],
        fontNamesIgnoreCheck: [
            'Arial', 'Arial Black', 'Tahoma', 'Times New Roman',
            'Droid Arabic Kufi', 'Droid Sans Arabic', 'Traditional Arabic'
        ],
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph', 'height']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', 'hr']],
            ['view', ['fullscreen', 'codeview', 'help']],
            ['rtl', ['rtl']]
        ],
        styleTags: [
            'p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ],
        callbacks: {
            onInit: function() {
                // تنفيذ عند التهيئة
                console.log('تم تهيئة محرر النصوص');
            },
            onImageUpload: function(files) {
                // رفع الصور
                uploadImageToServer(files[0], $(this));
            },
            onMediaDelete: function($target, $editable) {
                // حذف الصور
                deleteImageFromServer($target.attr('src'));
            },
            onChange: function(contents, $editable) {
                // حفظ المحتوى تلقائياً (يمكن استخدامه للمسودة التلقائية)
                autoSaveDraft(contents);
            }
        },
        popover: {
            image: [
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']],
                ['custom', ['imageAttributes', 'imageShape']],
                ['link', ['linkDialogShow', 'unlink']]
            ]
        }
    });
}

// رفع الصور إلى الخادم
function uploadImageToServer(file, editor) {
    const formData = new FormData();
    formData.append('image', file);
    
    // عرض مؤشر التحميل
    const loading = $('<div class="image-upload-loading">جاري رفع الصورة...</div>');
    $('body').append(loading);
    
    // هنا يمكنك إضافة كود AJAX لرفع الصورة إلى الخادم
    // مثال:
    /*
    $.ajax({
        url: '/api/upload-image',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                // إدراج الصورة في المحرر
                editor.summernote('insertImage', response.url);
            } else {
                alert('فشل في رفع الصورة: ' + response.message);
            }
            loading.remove();
        },
        error: function(xhr, status, error) {
            console.error('خطأ في رفع الصورة:', error);
            alert('حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.');
            loading.remove();
        }
    });
    */
    
    // حل مؤقت لعرض الصورة مباشرة (بدون رفع حقيقي)
    const reader = new FileReader();
    reader.onloadend = function() {
        editor.summernote('insertImage', reader.result);
        loading.remove();
    };
    reader.readAsDataURL(file);
}

// حذف الصورة من الخادم
function deleteImageFromServer(src) {
    // هنا يمكنك إضافة كود AJAZ لحذف الصورة من الخادم
    // مثال:
    /*
    $.ajax({
        url: '/api/delete-image',
        type: 'POST',
        data: { src: src },
        success: function(response) {
            if (!response.success) {
                console.error('فشل في حذف الصورة:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('خطأ في حذف الصورة:', error);
        }
    });
    */
    console.log('حذف الصورة:', src);
}

// حفظ المسودة تلقائياً
let autoSaveTimer;
function autoSaveDraft(content) {
    // إلغاء المؤقت السابق إذا كان موجوداً
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
    }
    
    // تعيين مؤقت جديد لحفظ المسودة بعد ثانيتين من التوقف عن الكتابة
    autoSaveTimer = setTimeout(function() {
        // هنا يمكنك إضافة كود لحفظ المسودة في التخزين المحلي أو إرسالها إلى الخادم
        const draftData = {
            title: $('#postTitle').val(),
            content: content,
            excerpt: $('#postExcerpt').val(),
            lastSaved: new Date().toISOString()
        };
        
        // حفظ في التخزين المحلي
        localStorage.setItem('postDraft', JSON.stringify(draftData));
        
        // إظهار إشعار بحفظ المسودة
        showNotification('تم حفظ المسودة تلقائياً', 'success');
        
        console.log('تم حفظ المسودة تلقائياً:', draftData);
    }, 2000);
}

// استعادة المسودة المحفوظة
function restoreDraft() {
    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            if (confirm('يوجد مسودة محفوظة. هل تريد استعادتها؟')) {
                if (draft.title) $('#postTitle').val(draft.title);
                if (draft.content) $('#postContent').summernote('code', draft.content);
                if (draft.excerpt) $('#postExcerpt').val(draft.excerpt);
                
                // إظهار إشعار
                showNotification('تم استعادة المسودة بنجاح', 'success');
                
                return true;
            }
        } catch (e) {
            console.error('خطأ في استعادة المسودة:', e);
        }
    }
    return false;
}

// مسح المسودة المحفوظة
function clearDraft() {
    localStorage.removeItem('postDraft');
    console.log('تم مسح المسودة المحفوظة');
}

// إظهار إشعار
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

// تهيئة الأزرار والأحداث
function initEditorEvents() {
    // زر حفظ المسودة
    $('#saveDraftBtn').click(function(e) {
        e.preventDefault();
        const content = $('#postContent').summernote('code');
        savePost('draft', content);
    });
    
    // زر النشر
    $('#publishBtn').click(function(e) {
        e.preventDefault();
        const content = $('#postContent').summernote('code');
        savePost('publish', content);
    });
    
    // منع إغلاق الصفحة عند وجود تغييرات غير محفوظة
    let formChanged = false;
    $('form').on('change input', 'input, textarea, select', function() {
        formChanged = true;
    });
    
    window.addEventListener('beforeunload', function(e) {
        if (formChanged) {
            const message = 'لديك تغييرات غير محفوظة. هل أنت متأكد من أنك تريد المغادرة؟';
            e.returnValue = message; // معيار قديم
            return message;
        }
    });
    
    // إضافة فئة جديدة
    $('#addNewCategory').click(function(e) {
        e.preventDefault();
        const newCategory = prompt('أدخل اسم الفئة الجديدة:');
        if (newCategory && newCategory.trim() !== '') {
            $('#postCategory').append(`<option value="${newCategory.trim()}" selected>${newCategory.trim()}</option>`);
            showNotification('تمت إضافة الفئة بنجاح', 'success');
        }
    });
    
    // إضافة وسم جديد
    $('#addTagBtn').click(function(e) {
        e.preventDefault();
        const newTag = $('#tagInput').val().trim();
        if (newTag) {
            const tagHtml = `
                <span class="badge bg-secondary me-2 mb-2">
                    ${newTag}
                    <button type="button" class="btn-close btn-close-white btn-sm ms-1" aria-label="إزالة"></button>
                    <input type="hidden" name="tags[]" value="${newTag}">
                </span>`;
            $('#tagsContainer').append(tagHtml);
            $('#tagInput').val('');
            showNotification('تمت إضافة الوسم بنجاح', 'success');
        }
    });
    
    // إزالة وسم
    $(document).on('click', '.btn-close', function() {
        $(this).parent().remove();
    });
    
    // معاينة الصورة المميزة
    $('#featuredImage').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                showNotification('الملف المحدد ليس صورة', 'danger');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                $('#imagePreview')
                    .attr('src', event.target.result)
                    .show()
                    .parent().addClass('has-image');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // إنشاء رابط تلقائي من العنوان
    $('#postTitle').on('keyup', function() {
        const title = $(this).val();
        const slug = title
            .toLowerCase()
            .replace(/[^\w\u0600-\u06FF\s-]/g, '') // إزالة الرموز غير المرغوب فيها
            .replace(/\s+/g, '-') // استبدال المسافات بشرطات
            .replace(/--+/g, '-') // استبدال الشرطات المكررة
            .replace(/^-+|-+$/g, ''); // إزالة الشرطات من البداية والنهاية
        
        $('#postSlug').val(slug);
    });
}

// دالة حفظ المقال
function savePost(status, content) {
    // التحقق من الحقول المطلوبة
    const title = $('#postTitle').val().trim();
    if (!title) {
        showNotification('الرجاء إدخال عنوان المقال', 'danger');
        $('#postTitle').focus();
        return false;
    }
    
    if (!content || content === '<p><br></p>' || content === '<p></p>') {
        showNotification('الرجاء إدخال محتوى المقال', 'danger');
        $('#postContent').summernote('focus');
        return false;
    }
    
    // جمع بيانات النموذج
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', $('#postSlug').val() || generateSlug(title));
    formData.append('content', content);
    formData.append('excerpt', $('#postExcerpt').val());
    formData.append('status', status);
    formData.append('category', $('#postCategory').val());
    formData.append('allow_comments', $('#allowComments').is(':checked') ? '1' : '0');
    formData.append('is_featured', $('#featuredPost').is(':checked') ? '1' : '0');
    
    // إضافة تاريخ النشر إذا تم تحديده
    const publishDate = $('#publishDate').val();
    if (publishDate) {
        formData.append('published_at', new Date(publishDate).toISOString());
    }
    
    // إضافة الوسوم
    $('input[name="tags[]"]').each(function() {
        formData.append('tags[]', $(this).val());
    });
    
    // إضافة الصورة المميزة إذا تم اختيارها
    const featuredImage = $('#featuredImage')[0].files[0];
    if (featuredImage) {
        formData.append('featured_image', featuredImage);
    }
    
    // إضافة بيانات SEO
    formData.append('seo_title', $('#seoTitle').val());
    formData.append('meta_description', $('#metaDescription').val());
    formData.append('focus_keyword', $('#focusKeyword').val());
    
    // عرض مؤشر التحميل
    const submitButton = status === 'draft' ? $('#saveDraftBtn') : $('#publishBtn');
    const originalText = submitButton.html();
    submitButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الحفظ...');
    
    // هنا يمكنك إضافة كود AJAX لحفظ المقال
    // مثال:
    /*
    $.ajax({
        url: '/api/posts',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                showNotification(
                    status === 'draft' ? 'تم حفظ المسودة بنجاح' : 'تم نشر المقال بنجاح', 
                    'success'
                );
                
                // مسح المسودة المحفوظة
                clearDraft();
                
                // إعادة توجيه إلى صفحة المقال أو قائمة المقالات
                setTimeout(() => {
                    window.location.href = 'posts.html';
                }, 1500);
            } else {
                showNotification(response.message || 'حدث خطأ أثناء حفظ المقال', 'danger');
            }
            
            submitButton.prop('disabled', false).html(originalText);
        },
        error: function(xhr, status, error) {
            console.error('Error saving post:', error);
            showNotification('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'danger');
            submitButton.prop('disabled', false).html(originalText);
        }
    });
    */
    
    // عرض رسالة نجاح (لأغراض العرض فقط)
    console.log('بيانات المقال المرسلة:', Object.fromEntries(formData));
    
    setTimeout(() => {
        showNotification(
            status === 'draft' ? 'تم حفظ المسودة بنجاح' : 'تم نشر المقال بنجاح', 
            'success'
        );
        submitButton.prop('disabled', false).html(originalText);
        
        // إعادة التوجيه بعد ثانيتين (لأغراض العرض فقط)
        if (status === 'publish') {
            setTimeout(() => {
                window.location.href = 'posts.html';
            }, 1500);
        }
    }, 1000);
    
    return false;
}

// إنشاء رابط تلقائي من النص
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// تهيئة المحرر عند تحميل الصفحة
$(document).ready(function() {
    // تهيئة المحرر
    initSummernote();
    
    // تهيئة الأحداث
    initEditorEvents();
    
    // محاولة استعادة المسودة المحفوظة
    setTimeout(() => {
        restoreDraft();
    }, 500);
    
    // تعطيل سحب وإفلات الملفات على النافذة لمنع فتح الملفات في المتصفح
    window.addEventListener('dragover', function(e) {
        e.preventDefault();
    }, false);
    
    window.addEventListener('drop', function(e) {
        e.preventDefault();
    }, false);
});
