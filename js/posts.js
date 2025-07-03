// JavaScript خاص بصفحة إدارة المقالات (posts.html)

document.addEventListener('DOMContentLoaded', function() {
  // مثال: بحث مباشر في الجدول
  const searchInput = document.querySelector('.posts-header .search-input');
  const tableRows = document.querySelectorAll('.posts-table tbody tr');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const value = this.value.trim();
      tableRows.forEach(row => {
        if (row.textContent.includes(value)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // مثال: زر حذف/تعديل
  document.querySelectorAll('.btn-action[data-action]').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      const postId = this.getAttribute('data-id');
      if (action === 'delete') {
        if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
          // تنفيذ الحذف
        }
      } else if (action === 'edit') {
        window.location.href = `post-edit.html?id=${postId}`;
      }
    });
  });
}); 