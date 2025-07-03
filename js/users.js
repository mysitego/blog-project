// كود البحث في جدول المستخدمين
const searchInput = document.querySelector('.users-header .search-input');
const tableRows = document.querySelectorAll('.users-table tbody tr');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const value = this.value.trim();
    tableRows.forEach(row => {
      const name = row.children[0].textContent;
      const email = row.children[1].textContent;
      if (name.includes(value) || email.includes(value) || value === '') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}
// نافذة إضافة مستخدم جديد
const addUserBtn = document.getElementById('addUserBtn');
const addUserModal = document.getElementById('addUserModal');
const closeUserModal = document.getElementById('closeUserModal');
const userForm = document.getElementById('userForm');
if (addUserBtn && addUserModal) {
  addUserBtn.addEventListener('click', function(e) {
    e.preventDefault();
    addUserModal.classList.add('active');
  });
}
if (closeUserModal && addUserModal) {
  closeUserModal.addEventListener('click', function() {
    addUserModal.classList.remove('active');
  });
}
if (userForm) {
  userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // هنا يمكنك إضافة منطق الحفظ الفعلي
    alert('تمت إضافة المستخدم بنجاح!');
    addUserModal.classList.remove('active');
    userForm.reset();
  });
}
// أزرار الإجراءات (تعديل/حذف)
document.querySelectorAll('.btn-action').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.dataset.action;
    const id = this.dataset.id;
    if (action === 'edit') {
      alert('تعديل المستخدم رقم ' + id);
    } else if (action === 'delete') {
      if (confirm('هل أنت متأكد من حذف المستخدم؟')) {
        alert('تم حذف المستخدم رقم ' + id);
      }
    }
  });
}); 