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

// دالة لعرض المقالة في blog-article.html
function renderBlogArticlePage() {
  if (!window.location.pathname.includes('blog-article.html')) return;
  // جلب باراميتر id
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get('id'), 10);
  if (!postId) return;
  if (typeof postsData === 'undefined') return;
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  // رأس المقالة
  const header = document.getElementById('article-header');
  header.innerHTML = `
    <div class="flex flex-wrap items-center gap-3 mb-3">
      <span class="inline-block text-xs font-bold text-gold bg-gold/10 border border-gold rounded px-3 py-1">${post.category}</span>
    </div>
    <h1 class="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-relaxed">${post.title}</h1>
    <div class="flex flex-wrap items-center gap-4 text-primary/70 text-sm mb-4">
      <div class="flex items-center gap-2">
        <img src="${post.authorImg}" alt="${post.author}" class="w-10 h-10 rounded-full border-2 border-gold shadow" />
        <div>
          <span class="font-bold text-primary">${post.author}</span>
          <div class="text-xs text-primary/50">${post.authorTitle || ''}</div>
        </div>
      </div>
      <span class="flex items-center gap-1"><i class="fas fa-calendar-alt"></i> ${post.date}</span>
      <span class="flex items-center gap-1"><i class="fas fa-clock"></i> ${post.readTime} قراءة</span>
      <span class="flex items-center gap-1"><i class="fas fa-eye"></i> ${post.views} مشاهدة</span>
    </div>
  `;
  // صورة رئيسية
  const featured = document.getElementById('article-featured-image');
  featured.innerHTML = `
    <img src="${post.mainImg}" alt="${post.title}" class="w-full h-72 object-cover" />
    <figcaption class="bg-gold/10 text-gold text-center py-2 text-xs">${post.mainImgCaption || ''}</figcaption>
  `;
  // محتوى المقالة
  const content = document.getElementById('article-content');
  content.innerHTML = post.content;
  // قسم التعليقات (نفس التعليقات الثابتة مؤقتاً)
  const comments = document.getElementById('comments-section');
  comments.innerHTML = `
    <h3 class="text-lg font-bold text-primary mb-4">آراء القراء</h3>
    <div class="space-y-4 mb-6">
      <div class="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
        <div class="flex items-center gap-2 mb-1">
          <img src="images/avatar-1.png" alt="أحمد محمد" class="w-8 h-8 rounded-full border-2 border-gold" />
          <span class="font-bold text-primary">أحمد محمد</span>
          <span class="text-xs text-primary/60">منذ يومين</span>
        </div>
        <p class="text-primary/90">مقال رائع جدًا! التمارين ساعدتني على تطوير أسلوبي.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
        <div class="flex items-center gap-2 mb-1">
          <img src="images/avatar-2.jpg" alt="فاطمة علي" class="w-8 h-8 rounded-full border-2 border-gold" />
          <span class="font-bold text-primary">فاطمة علي</span>
          <span class="text-xs text-primary/60">منذ 5 أيام</span>
        </div>
        <p class="text-primary/90">أحببت الاقتباسات وروابط المنصات. شكرًا على المقال الملهم!</p>
      </div>
    </div>
    <form class="flex flex-col gap-3">
      <input type="text" placeholder="اسمك" class="rounded-lg border border-gold/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold/60 font-arabic text-primary bg-white" required />
      <textarea placeholder="اكتب تعليقك..." class="rounded-lg border border-gold/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold/60 font-arabic text-primary bg-white" rows="3" required></textarea>
      <button type="submit" class="self-end bg-gold text-primary px-6 py-2 rounded font-bold hover:bg-gold-dark">إرسال التعليق</button>
    </form>
  `;
}
// نفذ الدالة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', renderBlogArticlePage);

// تعريف بيانات جميع المقالات (ثابت)
const postsData = [
  {
    id: 1,
    title: 'كيف تطلق العنان لإبداعك في الكتابة الأدبية',
    category: 'الكتابة الإبداعية',
    date: '10 مايو 2024',
    readTime: '7 دقائق',
    views: '2,150',
    author: 'ريم محمد الجهني',
    authorTitle: 'كاتبة ومدونة',
    authorImg: 'images/avatar-1.png',
    mainImg: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
    mainImgCaption: 'الكتابة رحلة تبدأ من القلب وتصل إلى كل قارئ يبحث عن الإلهام.',
    content: `
      <div class="post-intro mb-8">
        <p class="text-lg md:text-xl font-semibold text-primary/90 leading-relaxed bg-gold/5 rounded-xl p-4 shadow mb-4">
          الكتابة الأدبية ليست مجرد حروف تتراقص على الورق، بل هي نبض الروح حين تبوح، وجسرٌ بين الخيال والواقع. في هذا المقال، سنخوض معًا رحلة لاكتشاف أسرار الإبداع الأدبي، ونكشف كيف يمكن لكل منا أن يطلق العنان لقلمه ليكتب نصوصًا تلامس القلوب وتثير الدهشة.
        </p>
      </div>
      <h2 class="text-2xl font-bold text-gold">ما معنى الكتابة الإبداعية؟</h2>
      <hr class="my-6 border-gold/40">
      <div class="flex flex-col md:flex-row gap-6 items-center mb-6">
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="إبداع الكتابة" class="rounded-xl shadow-lg w-full md:w-1/2 mb-4 md:mb-0" />
        <div>
          <p class="mb-4 text-primary/90 leading-loose">
            الكتابة الإبداعية هي فن التعبير عن الذات والأفكار والمشاعر بأسلوب فريد وجذاب. هي مساحة حرة لا تعترف بالحدود، تتيح للكاتب أن يرسم عوالمه الخاصة بالكلمات، سواء في قصة قصيرة، أو رواية، أو حتى مقالة أدبية.
          </p>
          <blockquote class="bg-gold/10 border-r-4 border-gold rounded-xl p-4 text-gold italic">
            "الإبداع الأدبي هو أن تكتب ما لا يُقال، وتمنح القارئ فرصة أن يرى العالم بعينيك." — ريم محمد الجهني
          </blockquote>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gold">لماذا نكتب؟</h2>
      <hr class="my-6 border-gold/40">
      <ul class="list-disc list-inside space-y-2 text-primary/90 mb-6">
        <li>لنعبر عن مشاعرنا وأحلامنا.</li>
        <li>لنترك أثرًا في ذاكرة الآخرين.</li>
        <li>لنحاور العالم ونغيّر وجهات النظر.</li>
        <li>لنعالج جراحنا ونحتفل بانتصاراتنا.</li>
      </ul>
      <div class="flex flex-col md:flex-row gap-6 items-center mb-6">
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="دفتر وأقلام" class="rounded-xl shadow-lg w-full md:w-1/2 mb-4 md:mb-0" />
        <div>
          <h2 class="text-2xl font-bold text-gold">خطوات عملية لإطلاق الإبداع في الكتابة</h2>
          <hr class="my-6 border-gold/40">
          <ol class="list-decimal list-inside space-y-2 text-primary/90 mb-4">
            <li><strong>اقرأ كثيرًا:</strong> القراءة هي وقود الخيال، وكل كتاب جديد يفتح لك نافذة على عالم مختلف.</li>
            <li><strong>اكتب يوميًا:</strong> لا تنتظر الإلهام، بل اصنعه بالتمرين المستمر حتى لو بسطر واحد كل يوم.</li>
            <li><strong>جرب أساليب متنوعة:</strong> اكتب قصة، خاطرة، رسالة، أو حتى نصًا ساخرًا. لا تخف من التجربة.</li>
            <li><strong>شارك كتاباتك:</strong> انشر نصوصك في منصات مثل <a href="https://www.hindawi.org/books/" target="_blank" class="text-gold underline hover:text-gold-dark">هنداوي</a> أو <a href="https://www.alukah.net/" target="_blank" class="text-gold underline hover:text-gold-dark">الألوكة</a> وتقبل النقد البناء.</li>
            <li><strong>استلهم من الحياة:</strong> كل موقف، كل شعور، كل حلم قد يكون بذرة لنص عظيم.</li>
          </ol>
          <div class="bg-gold/10 border-r-4 border-gold rounded-xl p-4 my-6">
            <strong class="text-gold">نصيحة ذهبية:</strong> لا تكتب لترضي الجميع، بل اكتب لتكون صادقًا مع نفسك أولاً.
          </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gold">تمرينات لتحفيز الإبداع</h2>
      <hr class="my-6 border-gold/40">
      <ul class="list-disc list-inside space-y-2 text-primary/90 mb-6">
        <li>اكتب قصة قصيرة من 100 كلمة فقط عن لحظة غيرت حياتك.</li>
        <li>صف مشهدًا من طفولتك دون استخدام كلمة "كنت".</li>
        <li>اكتب رسالة إلى نفسك بعد عشر سنوات.</li>
      </ul>
      <div class="flex flex-col md:flex-row gap-6 items-center mb-6">
        <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80" alt="إلهام الكتابة" class="rounded-xl shadow-lg w-full md:w-1/2 mb-4 md:mb-0" />
        <div class="w-full md:w-1/2">
          <h2 class="text-2xl font-bold text-gold">جدول مقارنة بين أنواع الكتابة الأدبية</h2>
          <hr class="my-6 border-gold/40">
          <table class="w-full rounded-xl shadow bg-white mb-4">
            <thead>
              <tr class="bg-gold/10 text-gold">
                <th class="p-2">النوع</th>
                <th class="p-2">السمات</th>
                <th class="p-2">أمثلة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2">القصة القصيرة</td>
                <td class="p-2">مكثفة، تركز على حدث أو فكرة واحدة</td>
                <td class="p-2">"الطريق" لنجيب محفوظ</td>
              </tr>
              <tr class="bg-gold/5">
                <td class="p-2">الرواية</td>
                <td class="p-2">أحداث وشخصيات متعددة، بناء عوالم</td>
                <td class="p-2">"ثلاثية غرناطة" لرضوى عاشور</td>
              </tr>
              <tr>
                <td class="p-2">الخاطرة</td>
                <td class="p-2">تعبير عن لحظة أو إحساس عابر</td>
                <td class="p-2">نصوص جبران خليل جبران</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gold">صورة تلهمك للكتابة</h2>
      <hr class="my-6 border-gold/40">
      <figure class="mb-8">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" alt="إلهام الكتابة" class="rounded-xl shadow-lg w-full mb-2" />
        <figcaption class="text-xs text-center text-gold">كل صورة تحمل قصة تنتظر أن تُروى</figcaption>
      </figure>
      <h2 class="text-2xl font-bold text-gold">فيديو تحفيزي عن الكتابة الأدبية</h2>
      <hr class="my-6 border-gold/40">
      <div class="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden shadow-lg">
        <iframe src="https://www.youtube.com/embed/2qW8t5bYb_Y" title="Creative Writing Motivation" allowfullscreen class="w-full h-64 rounded-xl"></iframe>
      </div>
      <h2 class="text-2xl font-bold text-gold">روابط مفيدة للكتّاب</h2>
      <hr class="my-6 border-gold/40">
      <ul class="list-disc list-inside space-y-2 text-primary/90 mb-6">
        <li><a href="https://www.arabwriters.ae/" target="_blank" class="text-gold underline hover:text-gold-dark">رابطة الكتّاب العرب</a></li>
        <li><a href="https://www.goodreads.com/quotes/tag/creative-writing" target="_blank" class="text-gold underline hover:text-gold-dark">اقتباسات عن الكتابة الإبداعية</a></li>
        <li><a href="https://www.wattpad.com/" target="_blank" class="text-gold underline hover:text-gold-dark">منصة Wattpad للكتابة والنشر</a></li>
      </ul>
      <h2 class="text-2xl font-bold text-gold">أدوات رقمية تساعدك على الكتابة</h2>
      <hr class="my-6 border-gold/40">
      <table class="w-full rounded-xl shadow bg-white mb-4">
        <thead>
          <tr class="bg-gold/10 text-gold">
            <th class="p-2">الأداة</th>
            <th class="p-2">الوصف</th>
            <th class="p-2">الرابط</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2">Grammarly</td>
            <td class="p-2">تصحيح لغوي ونحوي فوري</td>
            <td class="p-2"><a href="https://www.grammarly.com/" target="_blank" class="text-gold underline hover:text-gold-dark">زيارة</a></td>
          </tr>
          <tr class="bg-gold/5">
            <td class="p-2">Hemingway Editor</td>
            <td class="p-2">تحليل الأسلوب وتبسيط الجمل</td>
            <td class="p-2"><a href="https://hemingwayapp.com/" target="_blank" class="text-gold underline hover:text-gold-dark">زيارة</a></td>
          </tr>
          <tr>
            <td class="p-2">Notion</td>
            <td class="p-2">تنظيم الأفكار والمخطوطات</td>
            <td class="p-2"><a href="https://www.notion.so/" target="_blank" class="text-gold underline hover:text-gold-dark">زيارة</a></td>
          </tr>
        </tbody>
      </table>
      <h2 class="text-2xl font-bold text-gold">اقتباسات ملهمة</h2>
      <hr class="my-6 border-gold/40">
      <blockquote class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6 text-primary italic">
        "الكتابة هي أن تضيء شمعة في عتمة العالم." — أحلام مستغانمي
      </blockquote>
      <blockquote class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6 text-primary italic">
        "كل نص تكتبه هو نافذتك الخاصة على الحياة." — مجهول
      </blockquote>
      <div class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6">
        <strong class="text-primary">تنبيه:</strong> لا تقارن نفسك بالآخرين، فلكل كاتب طريقته وصوته الخاص.
      </div>
      <h2 class="text-2xl font-bold text-gold">خاتمة</h2>
      <hr class="my-6 border-gold/40">
      <p class="text-primary/90 leading-loose mb-8">
        الكتابة الإبداعية هي مساحة حرة للتعبير عن الذات وصناعة الجمال بالكلمات. لا تتردد في أن تبدأ رحلتك اليوم، فكل كلمة تكتبها تقربك أكثر من تحقيق حلمك الأدبي. شاركنا في التعليقات: ما هو أول نص إبداعي كتبته في حياتك؟
      </p>
    `
  },
  {
    id: 2,
    title: 'أفكار لتحسين مهارات الكتابة الإبداعية',
    category: 'الكتابة الإبداعية',
    date: '15 مايو 2024',
    readTime: '5 دقائق',
    views: '1,200',
    author: 'أحمد محمد',
    authorTitle: 'كاتب ومحرر',
    authorImg: 'images/avatar-2.jpg',
    mainImg: 'images/blog-2.jpg',
    mainImgCaption: 'الكتابة هي أداة للتعبير عن الذات والتأثير على الآخرين.',
    content: `
      <div class="post-intro">
        <p class="lead font-bold text-lg text-primary/90">
          الكتابة الإبداعية ليست مجرد فن، بل هي طريقة للتعبير عن الذات والتأثير على الآخرين. في هذا المقال، سنقترح أفكارًا لتحسين مهارات الكتابة الإبداعية وتحويلها إلى أداة قوية للتعبير عن الذات.
        </p>
      </div>
      <h2>التمرين الأول: تحديد الهدف</h2>
      <p>
        قبل أن تبدأ في كتابة مقال أو قصة، يجب أن تحدد الهدف الذي تريد تحقيقه. هل تريد أن تثير القلوب؟ أم تريد أن تغير وجهة نظر القارئ؟ أم تريد أن تشارك أفكارك؟ هذا الهدف سيساعدك في توجيه الكتابة وتحقيق الأهداف.
      </p>
      <h2>التمرين الثاني: التركيز</h2>
      <p>
        التركيز هو الأساس في الكتابة الإبداعية. إذا كنت تتردد في التركيز، يمكنك استخدام أدوات مثل <a href="https://www.focus@will.com/" target="_blank">Focus@Will</a> أو <a href="https://www.pomodoro-technique.com/" target="_blank">تقنية البومودورو</a>. هذه الأدوات تساعدك في التركيز على المهمة وتجنب التشتت.
      </p>
      <h2>التمرين الثالث: التنويع</h2>
      <p>
        لا تقتصر الكتابة الإبداعية على نوع واحد من المقالات. جرب كتابة قصة قصيرة، أو رواية، أو خاطرة، أو حتى نصًا ساخرًا. هذا التنويع يساعدك في تطوير مهاراتك وتحسين الإبداع.
      </p>
      <h2>التمرين الرابع: التحليل</h2>
      <p>
        اقرأ مقالات أخرى في نفس الفئة أو الفئات المختلفة. هذا سيساعدك في فهم الأساليب والأنماط المختلفة للكتابة الإبداعية. كما يمكنك التحقق من مواقع مثل <a href="https://www.writersdigest.com/" target="_blank">Writers Digest</a> أو <a href="https://www.the-literary-hub.com/" target="_blank">The Literary Hub</a> للحصول على أفكار وتحليلات متنوعة.
      </p>
      <h2>التمرين الخامس: التطوير</h2>
      <p>
        بعد كتابة مقال أو قصة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى النجاح. هل كتبت نصًا ساخرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <div class="bg-gold/10 border-r-4 border-gold rounded-xl p-4 my-6">
        <strong class="text-gold">نصيحة ذهبية:</strong> لا تتردد في التجربة والتجربة، فالكتابة الإبداعية هي عملية متكررة للتحسين.
      </div>
      <h2>التمرين السادس: التنويع المتقدم</h2>
      <p>
        جرب كتابة نصًا مختلفًا عن الذي كتبته سابقًا. هل يمكنك كتابة نصًا ساخرًا؟ أم يمكنك كتابة نصًا ملهمًا؟ أم يمكنك كتابة نصًا مكتملًا؟ هذا التمرين يساعدك في تطوير مهارات الكتابة الإبداعية وتحسين الإبداع.
      </p>
      <h2>التمرين السابع: التحليل المتقدم</h2>
      <p>
        بعد كتابة مقال أو قصة جديد، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى النجاح. هل كتبت نصًا ساخرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>التمرين الثامن: التطوير المتقدم</h2>
      <p>
        بعد كتابة مقال أو قصة جديد، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى النجاح. هل كتبت نصًا ساخرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التطوير سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>جدول مقارنة بين أنواع الكتابة الأدبية</h2>
      <table>
        <thead>
          <tr>
            <th>النوع</th>
            <th>السمات</th>
            <th>أمثلة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>القصة القصيرة</td>
            <td>مكثفة، تركز على حدث أو فكرة واحدة</td>
            <td>"الطريق" لنجيب محفوظ</td>
          </tr>
          <tr>
            <td>الرواية</td>
            <td>أحداث وشخصيات متعددة، بناء عوالم</td>
            <td>"ثلاثية غرناطة" لرضوى عاشور</td>
          </tr>
          <tr>
            <td>الخاطرة</td>
            <td>تعبير عن لحظة أو إحساس عابر</td>
            <td>نصوص جبران خليل جبران</td>
          </tr>
        </tbody>
      </table>
      <h2>صورة تلهمك للكتابة</h2>
      <figure>
        <img src="images/blog-4.jpg" alt="إلهام الكتابة" class="mb-2" />
        <figcaption class="text-xs text-center text-gold">كل صورة تحمل قصة تنتظر أن تُروى</figcaption>
      </figure>
      <h2>فيديو تحفيزي عن الكتابة الأدبية</h2>
      <div class="aspect-w-16 aspect-h-9 mb-4">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Improve Your Writing Skills" allowfullscreen class="w-full h-64 rounded-xl"></iframe>
      </div>
      <h2>روابط مفيدة للكتّاب</h2>
      <ul>
        <li><a href="https://www.arabwriters.ae/" target="_blank">رابطة الكتّاب العرب</a></li>
        <li><a href="https://www.goodreads.com/quotes/tag/creative-writing" target="_blank">اقتباسات عن الكتابة الإبداعية</a></li>
        <li><a href="https://www.wattpad.com/" target="_blank">منصة Wattpad للكتابة والنشر</a></li>
      </ul>
      <h2>أدوات رقمية تساعدك على الكتابة</h2>
      <table>
        <thead>
          <tr>
            <th>الأداة</th>
            <th>الوصف</th>
            <th>الرابط</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Grammarly</td>
            <td>تصحيح لغوي ونحوي فوري</td>
            <td><a href="https://www.grammarly.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Hemingway Editor</td>
            <td>تحليل الأسلوب وتبسيط الجمل</td>
            <td><a href="https://hemingwayapp.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Notion</td>
            <td>تنظيم الأفكار والمخطوطات</td>
            <td><a href="https://www.notion.so/" target="_blank">زيارة</a></td>
          </tr>
        </tbody>
      </table>
      <h2>اقتباسات ملهمة</h2>
      <blockquote>
        "الكتابة هي أن تضيء شمعة في عتمة العالم." — أحلام مستغانمي
      </blockquote>
      <blockquote>
        "كل نص تكتبه هو نافذتك الخاصة على الحياة." — مجهول
      </blockquote>
      <div class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6">
        <strong class="text-primary">تنبيه:</strong> لا تقارن نفسك بالآخرين، فلكل كاتب طريقته وصوته الخاص.
      </div>
      <h2>خاتمة</h2>
      <p>
        الكتابة الإبداعية هي مساحة حرة للتعبير عن الذات وصناعة الجمال بالكلمات. لا تتردد في أن تبدأ رحلتك اليوم، فكل كلمة تكتبها تقربك أكثر من تحقيق حلمك الأدبي. شاركنا في التعليقات: ما هو أول نص إبداعي كتبته في حياتك؟
      </p>
    `
  },
  {
    id: 3,
    title: 'كيف تصنع قصة جذابة ومثيرة للقراءة؟',
    category: 'الكتابة الإبداعية',
    date: '20 مايو 2024',
    readTime: '10 دقائق',
    views: '3,500',
    author: 'فاطمة علي',
    authorTitle: 'كاتبة ومدونة',
    authorImg: 'images/avatar-3.jpg',
    mainImg: 'images/blog-5.jpg',
    mainImgCaption: 'القصة الإبداعية هي فن تحويل الأحداث إلى عالم جديد.',
    content: `
      <div class="post-intro">
        <p class="lead font-bold text-lg text-primary/90">
          القصة الإبداعية هي فن تحويل الأحداث إلى عالم جديد. في هذا المقال، سنتعلم كيفية إنشاء قصة جذابة ومثيرة للقراءة، من خلال تحديد الأفكار، وتنظيم الأحداث، واستخدام الأدوات المناسبة.
        </p>
      </div>
      <h2>الخطوة الأولى: تحديد الأفكار</h2>
      <p>
        قبل أن تبدأ في كتابة قصة، يجب أن تكتب قائمة بالأفكار التي تريد أن تتضمنها. هذه الأفكار يمكن أن تكون من أي مجال، مثل الأحداث التاريخية، أو الأحداث المستقبلية، أو الأحداث التي تريد أن تصنعها.
      </p>
      <h2>الخطوة الثانية: تنظيم الأحداث</h2>
      <p>
        بعد تحديد الأفكار، يجب أن تقوم بتنظيم الأحداث بترتيب زمني. هذا يساعدك في إنشاء قصة منطقية ومتسلسلة. يمكنك استخدام أدوات مثل <a href="https://www.scrivener.com/" target="_blank">Scrivener</a> أو <a href="https://www.mindmeister.com/" target="_blank">MindMeister</a> لتنظيم الأفكار والأحداث.
      </p>
      <h2>الخطوة الثالثة: التفاعل مع القارئ</h2>
      <p>
        القصة الإبداعية يجب أن تكون مثيرة للقراءة. هذا يعني أنك يجب أن تستخدم أساليب مثل التفاعل مع القارئ، واستخدام الأدوات المناسبة، وتنظيم الأحداث بشكل مثير للاهتمام.
      </p>
      <h2>الخطوة الرابعة: التحليل</h2>
      <p>
        بعد كتابة قصة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة الخامسة: التطوير</h2>
      <p>
        بعد كتابة قصة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التطوير سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة السادسة: التنويع</h2>
      <p>
        جرب كتابة قصة جديدة عن نفس الموضوع، لكن بطريقة مختلفة. هل يمكنك كتابة قصة ساخرة؟ أم يمكنك كتابة قصة ملهمة؟ أم يمكنك كتابة قصة مكتملة؟ هذا التنويع سيساعدك في تطوير مهارات الكتابة الإبداعية وتحسين الإبداع.
      </p>
      <h2>الخطوة السابعة: التحليل المتقدم</h2>
      <p>
        بعد كتابة قصة جديدة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة الثامنة: التطوير المتقدم</h2>
      <p>
        بعد كتابة قصة جديدة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التطوير سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>جدول مقارنة بين أنواع الكتابة الأدبية</h2>
      <table>
        <thead>
          <tr>
            <th>النوع</th>
            <th>السمات</th>
            <th>أمثلة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>القصة القصيرة</td>
            <td>مكثفة، تركز على حدث أو فكرة واحدة</td>
            <td>"الطريق" لنجيب محفوظ</td>
          </tr>
          <tr>
            <td>الرواية</td>
            <td>أحداث وشخصيات متعددة، بناء عوالم</td>
            <td>"ثلاثية غرناطة" لرضوى عاشور</td>
          </tr>
          <tr>
            <td>الخاطرة</td>
            <td>تعبير عن لحظة أو إحساس عابر</td>
            <td>نصوص جبران خليل جبران</td>
          </tr>
        </tbody>
      </table>
      <h2>صورة تلهمك للكتابة</h2>
      <figure>
        <img src="images/blog-6.jpg" alt="إلهام الكتابة" class="mb-2" />
        <figcaption class="text-xs text-center text-gold">كل صورة تحمل قصة تنتظر أن تُروى</figcaption>
      </figure>
      <h2>فيديو تحفيزي عن الكتابة الأدبية</h2>
      <div class="aspect-w-16 aspect-h-9 mb-4">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Improve Your Writing Skills" allowfullscreen class="w-full h-64 rounded-xl"></iframe>
      </div>
      <h2>روابط مفيدة للكتّاب</h2>
      <ul>
        <li><a href="https://www.arabwriters.ae/" target="_blank">رابطة الكتّاب العرب</a></li>
        <li><a href="https://www.goodreads.com/quotes/tag/creative-writing" target="_blank">اقتباسات عن الكتابة الإبداعية</a></li>
        <li><a href="https://www.wattpad.com/" target="_blank">منصة Wattpad للكتابة والنشر</a></li>
      </ul>
      <h2>أدوات رقمية تساعدك على الكتابة</h2>
      <table>
        <thead>
          <tr>
            <th>الأداة</th>
            <th>الوصف</th>
            <th>الرابط</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Grammarly</td>
            <td>تصحيح لغوي ونحوي فوري</td>
            <td><a href="https://www.grammarly.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Hemingway Editor</td>
            <td>تحليل الأسلوب وتبسيط الجمل</td>
            <td><a href="https://hemingwayapp.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Notion</td>
            <td>تنظيم الأفكار والمخطوطات</td>
            <td><a href="https://www.notion.so/" target="_blank">زيارة</a></td>
          </tr>
        </tbody>
      </table>
      <h2>اقتباسات ملهمة</h2>
      <blockquote>
        "الكتابة هي أن تضيء شمعة في عتمة العالم." — أحلام مستغانمي
      </blockquote>
      <blockquote>
        "كل نص تكتبه هو نافذتك الخاصة على الحياة." — مجهول
      </blockquote>
      <div class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6">
        <strong class="text-primary">تنبيه:</strong> لا تقارن نفسك بالآخرين، فلكل كاتب طريقته وصوته الخاص.
      </div>
      <h2>خاتمة</h2>
      <p>
        الكتابة الإبداعية هي مساحة حرة للتعبير عن الذات وصناعة الجمال بالكلمات. لا تتردد في أن تبدأ رحلتك اليوم، فكل كلمة تكتبها تقربك أكثر من تحقيق حلمك الأدبي. شاركنا في التعليقات: ما هو أول نص إبداعي كتبته في حياتك؟
      </p>
    `
  },
  {
    id: 4,
    title: 'كيف تصنع قصة جذابة ومثيرة للقراءة؟',
    category: 'الكتابة الإبداعية',
    date: '25 مايو 2024',
    readTime: '10 دقائق',
    views: '3,500',
    author: 'فاطمة علي',
    authorTitle: 'كاتبة ومدونة',
    authorImg: 'images/avatar-3.jpg',
    mainImg: 'images/blog-5.jpg',
    mainImgCaption: 'القصة الإبداعية هي فن تحويل الأحداث إلى عالم جديد.',
    content: `
      <div class="post-intro">
        <p class="lead font-bold text-lg text-primary/90">
          القصة الإبداعية هي فن تحويل الأحداث إلى عالم جديد. في هذا المقال، سنتعلم كيفية إنشاء قصة جذابة ومثيرة للقراءة، من خلال تحديد الأفكار، وتنظيم الأحداث، واستخدام الأدوات المناسبة.
        </p>
      </div>
      <h2>الخطوة الأولى: تحديد الأفكار</h2>
      <p>
        قبل أن تبدأ في كتابة قصة، يجب أن تكتب قائمة بالأفكار التي تريد أن تتضمنها. هذه الأفكار يمكن أن تكون من أي مجال، مثل الأحداث التاريخية، أو الأحداث المستقبلية، أو الأحداث التي تريد أن تصنعها.
      </p>
      <h2>الخطوة الثانية: تنظيم الأحداث</h2>
      <p>
        بعد تحديد الأفكار، يجب أن تقوم بتنظيم الأحداث بترتيب زمني. هذا يساعدك في إنشاء قصة منطقية ومتسلسلة. يمكنك استخدام أدوات مثل <a href="https://www.scrivener.com/" target="_blank">Scrivener</a> أو <a href="https://www.mindmeister.com/" target="_blank">MindMeister</a> لتنظيم الأفكار والأحداث.
      </p>
      <h2>الخطوة الثالثة: التفاعل مع القارئ</h2>
      <p>
        القصة الإبداعية يجب أن تكون مثيرة للقراءة. هذا يعني أنك يجب أن تستخدم أساليب مثل التفاعل مع القارئ، واستخدام الأدوات المناسبة، وتنظيم الأحداث بشكل مثير للاهتمام.
      </p>
      <h2>الخطوة الرابعة: التحليل</h2>
      <p>
        بعد كتابة قصة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة الخامسة: التطوير</h2>
      <p>
        بعد كتابة قصة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التطوير سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة السادسة: التنويع</h2>
      <p>
        جرب كتابة قصة جديدة عن نفس الموضوع، لكن بطريقة مختلفة. هل يمكنك كتابة قصة ساخرة؟ أم يمكنك كتابة قصة ملهمة؟ أم يمكنك كتابة قصة مكتملة؟ هذا التنويع سيساعدك في تطوير مهارات الكتابة الإبداعية وتحسين الإبداع.
      </p>
      <h2>الخطوة السابعة: التحليل المتقدم</h2>
      <p>
        بعد كتابة قصة جديدة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التحليل سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>الخطوة الثامنة: التطوير المتقدم</h2>
      <p>
        بعد كتابة قصة جديدة، قم بتحليلها بعناية لتحديد الأساليب التي أدت إلى نجاح القصة. هل كتبت نصًا مثيرًا؟ أم كتبت نصًا ملهمًا؟ أم كتبت نصًا مكتملًا؟ هذا التطوير سيساعدك في تحسين مهارات الكتابة الإبداعية في المرات القادمة.
      </p>
      <h2>جدول مقارنة بين أنواع الكتابة الأدبية</h2>
      <table>
        <thead>
          <tr>
            <th>النوع</th>
            <th>السمات</th>
            <th>أمثلة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>القصة القصيرة</td>
            <td>مكثفة، تركز على حدث أو فكرة واحدة</td>
            <td>"الطريق" لنجيب محفوظ</td>
          </tr>
          <tr>
            <td>الرواية</td>
            <td>أحداث وشخصيات متعددة، بناء عوالم</td>
            <td>"ثلاثية غرناطة" لرضوى عاشور</td>
          </tr>
          <tr>
            <td>الخاطرة</td>
            <td>تعبير عن لحظة أو إحساس عابر</td>
            <td>نصوص جبران خليل جبران</td>
          </tr>
        </tbody>
      </table>
      <h2>صورة تلهمك للكتابة</h2>
      <figure>
        <img src="images/blog-6.jpg" alt="إلهام الكتابة" class="mb-2" />
        <figcaption class="text-xs text-center text-gold">كل صورة تحمل قصة تنتظر أن تُروى</figcaption>
      </figure>
      <h2>فيديو تحفيزي عن الكتابة الأدبية</h2>
      <div class="aspect-w-16 aspect-h-9 mb-4">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Improve Your Writing Skills" allowfullscreen class="w-full h-64 rounded-xl"></iframe>
      </div>
      <h2>روابط مفيدة للكتّاب</h2>
      <ul>
        <li><a href="https://www.arabwriters.ae/" target="_blank">رابطة الكتّاب العرب</a></li>
        <li><a href="https://www.goodreads.com/quotes/tag/creative-writing" target="_blank">اقتباسات عن الكتابة الإبداعية</a></li>
        <li><a href="https://www.wattpad.com/" target="_blank">منصة Wattpad للكتابة والنشر</a></li>
      </ul>
      <h2>أدوات رقمية تساعدك على الكتابة</h2>
      <table>
        <thead>
          <tr>
            <th>الأداة</th>
            <th>الوصف</th>
            <th>الرابط</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Grammarly</td>
            <td>تصحيح لغوي ونحوي فوري</td>
            <td><a href="https://www.grammarly.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Hemingway Editor</td>
            <td>تحليل الأسلوب وتبسيط الجمل</td>
            <td><a href="https://hemingwayapp.com/" target="_blank">زيارة</a></td>
          </tr>
          <tr>
            <td>Notion</td>
            <td>تنظيم الأفكار والمخطوطات</td>
            <td><a href="https://www.notion.so/" target="_blank">زيارة</a></td>
          </tr>
        </tbody>
      </table>
      <h2>اقتباسات ملهمة</h2>
      <blockquote>
        "الكتابة هي أن تضيء شمعة في عتمة العالم." — أحلام مستغانمي
      </blockquote>
      <blockquote>
        "كل نص تكتبه هو نافذتك الخاصة على الحياة." — مجهول
      </blockquote>
      <div class="bg-primary/5 border-r-4 border-primary rounded-xl p-4 my-6">
        <strong class="text-primary">تنبيه:</strong> لا تقارن نفسك بالآخرين، فلكل كاتب طريقته وصوته الخاص.
      </div>
      <h2>خاتمة</h2>
      <p>
        الكتابة الإبداعية هي مساحة حرة للتعبير عن الذات وصناعة الجمال بالكلمات. لا تتردد في أن تبدأ رحلتك اليوم، فكل كلمة تكتبها تقربك أكثر من تحقيق حلمك الأدبي. شاركنا في التعليقات: ما هو أول نص إبداعي كتبته في حياتك؟
      </p>
    `
  },
];
// نفذ الدالة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', renderBlogArticlePage); 