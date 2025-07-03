// بحث وتصفية التقارير
const searchInput = document.querySelector('.reports-header .search-input');
const filterSelect = document.querySelector('.reports-header .filter-select');
const reportCards = document.querySelectorAll('.report-card');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const value = this.value.trim();
    reportCards.forEach(card => {
      const title = card.querySelector('h3').textContent;
      if (title.includes(value) || value === '') {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
if (filterSelect) {
  filterSelect.addEventListener('change', function() {
    const type = this.value;
    reportCards.forEach(card => {
      if (type === 'all' || card.dataset.type === type) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
// نافذة تفاصيل التقرير
const detailsBtns = document.querySelectorAll('.btn-details');
const reportDetailsModal = document.getElementById('reportDetailsModal');
const closeReportModal = document.getElementById('closeReportModal');
const reportDetailsContent = document.querySelector('.report-details-content');
const reportDetailsData = {
  visits: '<strong>تفاصيل زيارات الموقع:</strong><br>عدد الزوار الفريدين: 8,200<br>أكثر الصفحات زيارة: الصفحة الرئيسية، المقالات التقنية.<br>معدل الارتداد: 37%<br>مصادر الزيارات: بحث جوجل، شبكات اجتماعية، مباشر.',
  posts: '<strong>تفاصيل تقارير المقالات:</strong><br>أكثر المقالات قراءة: "دليل تطوير الويب"، "أساسيات البرمجة".<br>مقالات مميزة هذا الشهر: 5<br>معدل النشر اليومي: 2 مقال.',
  users: '<strong>تفاصيل تقارير المستخدمين:</strong><br>عدد المسجلين الجدد: 12<br>المستخدمون النشطون يوميًا: 18<br>أكثر المستخدمين تفاعلاً: سارة علي، أحمد محمد.',
  comments: '<strong>تفاصيل تقارير التعليقات:</strong><br>تعليقات جديدة هذا الأسبوع: 22<br>تعليقات بانتظار المراجعة: 4<br>أكثر المقالات تفاعلاً: "تطوير الويب الحديث".'
};
detailsBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const type = this.dataset.report;
    reportDetailsContent.innerHTML = reportDetailsData[type] || 'لا توجد تفاصيل.';
    reportDetailsModal.classList.add('active');
  });
});
if (closeReportModal && reportDetailsModal) {
  closeReportModal.addEventListener('click', function() {
    reportDetailsModal.classList.remove('active');
  });
} 