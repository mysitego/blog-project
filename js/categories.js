// كود البحث في جدول الفئات
const searchInput = document.querySelector('.categories-header .search-input');
const tableRows = document.querySelectorAll('.categories-table tbody tr');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const value = this.value.trim();
    tableRows.forEach(row => {
      const name = row.children[0].textContent;
      if (name.includes(value) || value === '') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}
// أزرار الإجراءات (تعديل/حذف)
document.querySelectorAll('.btn-action').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.dataset.action;
    const id = this.dataset.id;
    if (action === 'edit') {
      alert('تعديل الفئة رقم ' + id);
    } else if (action === 'delete') {
      if (confirm('هل أنت متأكد من حذف الفئة؟')) {
        alert('تم حذف الفئة رقم ' + id);
      }
    }
  });
});

// نافذة إضافة فئة جديدة
const addCategoryBtn = document.getElementById('addCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const categoryForm = document.getElementById('categoryForm');

if (addCategoryBtn && addCategoryModal) {
  addCategoryBtn.addEventListener('click', function(e) {
    e.preventDefault();
    addCategoryModal.classList.add('active');
  });
}
if (closeCategoryModal && addCategoryModal) {
  closeCategoryModal.addEventListener('click', function() {
    addCategoryModal.classList.remove('active');
  });
}
if (categoryForm) {
  categoryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // هنا يمكنك إضافة منطق الحفظ الفعلي
    alert('تمت إضافة الفئة بنجاح!');
    addCategoryModal.classList.remove('active');
    categoryForm.reset();
  });
} 