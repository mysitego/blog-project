// main.js

// دالة تهيئة صفحة المقالات
window.initPostsPage = function() {
  window.posts = window.posts || [
    {id: 1, title: "كيف تكتب مقالاً إبداعياً؟", slug: "creative-writing", excerpt: "ملخص عن الكتابة الإبداعية.", meta: "مقال عن الكتابة الإبداعية.", keywords: "كتابة,إبداع", category: "الكتابة الإبداعية", date: "2024-07-01", status: "publish", content: "<p>محتوى المقال 1</p>", image: "../images/blog-1.png", tags: ["كتابة","إبداع"], allowComments: true, featuredPost: false, seoTitle: "", metaDescription: "", focusKeyword: "", metaKeywords: ""},
    {id: 2, title: "أساسيات كتابة المحتوى التسويقي", slug: "content-writing", meta: "مقال عن كتابة المحتوى.", keywords: "محتوى,تسويق", category: "كتابة المحتوى", date: "2024-06-28", status: "مسودة", content: "<p>محتوى المقال 2</p>", image: "../images/blog-2.png"},
    {id: 3, title: "نصائح لتطوير الذات", slug: "self-development", meta: "مقال عن تطوير الذات.", keywords: "تطوير,ذات", category: "تطوير الذات", date: "2024-06-20", status: "منشور", content: "<p>محتوى المقال 3</p>", image: "../images/blog-3.webp"},
  ];
  window.editId = null;
  window.tags = [];
  window.categories = ["تكنولوجيا","برمجة","تصميم","أعمال","تسويق"];
  // عرض المقالات
  window.renderPostsTable = function(data) {
    const tbody = document.getElementById('postsTableBody');
    tbody.innerHTML = '';
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-gray-400">لا توجد مقالات</td></tr>`;
      return;
    }
    data.forEach((post, idx) => {
      tbody.innerHTML += `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4 font-bold">${idx + 1}</td>
          <td class="py-3 px-4">${post.title}</td>
          <td class="py-3 px-4 text-xs text-gray-500">${post.slug}</td>
          <td class="py-3 px-4">${post.category}</td>
          <td class="py-3 px-4">${post.date}</td>
          <td class="py-3 px-4">
            <span class="inline-block px-3 py-1 rounded ${post.status === 'منشور' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-bold">${post.status}</span>
          </td>
          <td class="py-3 px-4 flex justify-center gap-2">
            <button onclick="openEditModal(${post.id})" class="bg-primary text-gold px-3 py-1 rounded hover:bg-gold hover:text-primary transition text-sm flex items-center gap-1" title="تعديل"><i class="fas fa-edit"></i></button>
            <button onclick="deletePost(${post.id})" class="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition text-sm flex items-center gap-1" title="حذف"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  };
  window.renderPostsTable(window.posts);
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const val = e.target.value.trim();
    const filtered = window.posts.filter(p => p.title.includes(val) || p.category.includes(val) || p.slug.includes(val));
    window.renderPostsTable(filtered);
  });
  // حذف مقال
  window.deletePost = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      window.posts = window.posts.filter(p => p.id !== id);
      window.renderPostsTable(window.posts);
    }
  };
  // فتح مودال إضافة مقال
  document.getElementById('addPostBtn').onclick = window.openAddModal = function() {
    window.editId = null;
    window.openModal();
  };
  // فتح مودال تعديل مقال
  window.openEditModal = function(id) {
    window.editId = id;
    window.openModal(window.posts.find(p=>p.id==id));
  };
  // فتح المودال وتعبئة البيانات
  window.openModal = function(post = null) {
    document.getElementById('postModalBg').classList.remove('hidden');
    document.getElementById('postModal').classList.remove('hidden');
    document.getElementById('formSubtitle').textContent = post ? 'تعديل مقال' : 'إضافة مقال جديد';
    document.getElementById('title').value = post ? post.title : '';
    document.getElementById('slug').value = post ? post.slug : '';
    document.getElementById('excerpt').value = post ? post.excerpt || '' : '';
    document.getElementById('category').value = post ? post.category : '';
    document.getElementById('status').value = post ? post.status : 'publish';
    document.getElementById('publishDate').value = post && post.date ? post.date : '';
    document.getElementById('allowComments').checked = post ? post.allowComments : true;
    document.getElementById('featuredPost').checked = post ? post.featuredPost : false;
    document.getElementById('seoTitle').value = post ? post.seoTitle || '' : '';
    document.getElementById('metaDescription').value = post ? post.metaDescription || '' : '';
    document.getElementById('focusKeyword').value = post ? post.focusKeyword || '' : '';
    document.getElementById('metaKeywords').value = post ? post.metaKeywords || '' : '';
    // الوسوم
    window.tags = post && post.tags ? [...post.tags] : [];
    window.renderTags();
    // الصورة
    document.getElementById('imagePreview').src = post && post.image ? post.image : '../images/blog-1.png';
    document.getElementById('imagePreview').classList.toggle('hidden', !(post && post.image));
    // تهيئة CKEditor وتعبئة المحتوى
    setTimeout(function() {
      window.initCKEditor(post ? (post.content || '') : '');
    }, 100);
  };
  // إغلاق المودال
  document.getElementById('closeModal').onclick = window.closeModal;
  document.getElementById('postModalBg').onclick = window.closeModal;
  document.getElementById('cancelBtn').onclick = window.closeModal;
  window.closeModal = function() {
    document.getElementById('postModalBg').classList.add('hidden');
    document.getElementById('postModal').classList.add('hidden');
    document.getElementById('categoryModal').classList.add('hidden');
  };
  // CKEditor instance
  window.ckeditorInstance = null;
  window.initCKEditor = function(content = '') {
    if (window.ckeditorInstance) {
      window.ckeditorInstance.destroy().then(() => {
        window.createCKEditor(content);
      });
    } else {
      window.createCKEditor(content);
    }
  };
  window.createCKEditor = function(content) {
    ClassicEditor.create(document.querySelector('#postContent'), {
      language: {
        ui: 'ar',
        content: 'ar'
      },
      toolbar: [
        'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'bulletedList', 'numberedList', 'blockQuote',
        '|', 'insertTable', 'imageUpload', 'mediaEmbed', 'code', 'codeBlock', 'undo', 'redo', 'alignment', 'removeFormat', 'outdent', 'indent', 'horizontalLine', 'fontColor', 'fontBackgroundColor', 'fontSize', 'fontFamily', 'highlight'
      ],
      image: {
        toolbar: [
          'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
        ]
      },
      table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
      },
      mediaEmbed: {
        previewsInData: true
      },
      direction: 'rtl',
    })
    .then(editor => {
      window.ckeditorInstance = editor;
      if(content) editor.setData(content);
    });
  };
  // الوسوم
  window.renderTags = function() {
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';
    window.tags.forEach((tag,i)=>{
      container.innerHTML += `<span class='bg-primary text-gold px-2 py-1 rounded flex items-center gap-1'>${tag}<button type='button' onclick='removeTag(${i})' class='ml-1 text-xs' title='حذف'>&times;</button></span>`;
    });
  };
  window.removeTag = function(idx) {
    window.tags.splice(idx,1);
    window.renderTags();
  }
  // إضافة فئة جديدة
  document.getElementById('addCategoryBtn').onclick = function(){
    document.getElementById('categoryModal').classList.remove('hidden');
  };
  document.getElementById('closeCategoryModal').onclick = function(){
    document.getElementById('categoryModal').classList.add('hidden');
  };
  document.getElementById('saveNewCategory').onclick = function(){
    const name = document.getElementById('newCategoryName').value.trim();
    if(name && !window.categories.includes(name)){
      window.categories.push(name);
      const select = document.getElementById('category');
      select.innerHTML += `<option value='${name}'>${name}</option>`;
      select.value = name;
      document.getElementById('categoryModal').classList.add('hidden');
    }
  };
  // أزرار الحفظ
  document.getElementById('saveDraftBtn').onclick = function(){ window.savePost('draft'); };
  document.getElementById('publishBtn').onclick = function(){ window.savePost('publish'); };
  window.savePost = function(status){
    const title = document.getElementById('title').value;
    const slug = document.getElementById('slug').value;
    const excerpt = document.getElementById('excerpt').value;
    const category = document.getElementById('category').value;
    const content = window.ckeditorInstance ? window.ckeditorInstance.getData() : document.getElementById('postContent').value;
    const image = document.getElementById('imagePreview').src || '';
    const allowComments = document.getElementById('allowComments').checked;
    const featuredPost = document.getElementById('featuredPost').checked;
    const publishDate = document.getElementById('publishDate').value;
    const seoTitle = document.getElementById('seoTitle').value;
    const metaDescription = document.getElementById('metaDescription').value;
    const focusKeyword = document.getElementById('focusKeyword').value;
    const metaKeywords = document.getElementById('metaKeywords').value;
    if(window.editId){
      const idx = window.posts.findIndex(p=>p.id==window.editId);
      if(idx!==-1){
        window.posts[idx] = { ...window.posts[idx], title, slug, excerpt, category, content, image, allowComments, featuredPost, date: publishDate, status, tags: [...window.tags], seoTitle, metaDescription, focusKeyword, metaKeywords };
      }
    }else{
      const newId = window.posts.length ? Math.max(...window.posts.map(p=>p.id))+1 : 1;
      window.posts.push({id: newId, title, slug, excerpt, category, content, image, allowComments, featuredPost, date: publishDate, status, tags: [...window.tags], seoTitle, metaDescription, focusKeyword, metaKeywords });
    }
    window.renderPostsTable(window.posts);
    window.closeModal();
  }
}; 