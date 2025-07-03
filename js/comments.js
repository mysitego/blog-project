// كود البحث في جدول التعليقات
const searchInput = document.querySelector('.comments-header .search-input');
const tableRows = document.querySelectorAll('.comments-table tbody tr');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const value = this.value.trim();
    tableRows.forEach(row => {
      const user = row.children[0].textContent;
      const comment = row.children[1].textContent;
      if (user.includes(value) || comment.includes(value) || value === '') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}
// نافذة تفاصيل التعليق
const viewBtns = document.querySelectorAll('.btn-action[data-action="view"]');
const viewCommentModal = document.getElementById('viewCommentModal');
const closeCommentModal = document.getElementById('closeCommentModal');
const commentDetails = document.querySelector('.comment-details');
viewBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.closest('tr');
    const user = row.children[0].textContent;
    const comment = row.children[1].textContent;
    const post = row.children[2].textContent;
    const date = row.children[3].textContent;
    commentDetails.innerHTML = `<strong>المستخدم:</strong> ${user}<br><strong>التعليق:</strong> ${comment}<br><strong>المقال:</strong> ${post}<br><strong>التاريخ:</strong> ${date}`;
    viewCommentModal.classList.add('active');
  });
});
if (closeCommentModal && viewCommentModal) {
  closeCommentModal.addEventListener('click', function() {
    viewCommentModal.classList.remove('active');
  });
}
// زر حذف
const deleteBtns = document.querySelectorAll('.btn-action[data-action="delete"]');
deleteBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      alert('تم حذف التعليق!');
    }
  });
}); 