import type { en } from './en'

export const ar: typeof en = {
  settings: {
    language: {
      label: 'اللغة',
      auto: 'تلقائي (حسب لغة المتصفح)',
      hint: 'اختر لغة الواجهة. لا تتم ترجمة الـ Prompts الخاصة بك أبدًا.',
    },
  },
  header: {
    openMenu: 'فتح القائمة',
    searchButton: 'البحث في الـ Prompts والقوالب',
    searchPlaceholder: 'البحث في الـ Prompts والقوالب...',
    notifications: 'الإشعارات',
    help: 'المساعدة',
    userRole: 'قيادة هندسة الـ Prompts',
  },
  sidebar: {
    platform: 'المنصة',
    collapse: 'طيّ القائمة الجانبية',
    mainNav: 'التنقل الرئيسي',
    promptCount: '{{total}} Prompts',
  },
  search: {
    dialogLabel: 'بحث',
    placeholder: 'البحث في الـ Prompts والقوالب والصفحات...',
    results: 'النتائج',
    recent: 'آخر الـ Prompts',
    noResults: 'لا توجد نتائج لـ “{{query}}”.',
    empty: 'لا توجد Prompts بعد. يمكنك إنشاء واحد من المحرر.',
    total: 'عدد النتائج: {{total}}',
    hint: {
      prompt: 'فتح في المحرر',
      template: 'إنشاء Prompt من القالب',
      page: 'الانتقال إلى الصفحة',
    },
    footer: {
      navigate: '↑↓ للتنقل',
      select: '↵ للاختيار',
      close: 'Esc للإغلاق',
    },
    pages: {
      newPrompt: 'Prompt جديد',
      compare: 'مقارنة الإصدارات',
    },
  },
    nav: {
    dashboard: 'لوحة التحكم',
    library: 'مكتبة الـ Prompts',
    editor: 'محرر الـ Prompts',
    templates: 'القوالب',
    history: 'السجل',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
  },
    common: {
    toggleTheme: 'تبديل المظهر',
    justNow: 'الآن',
    dateFormat: 'd MMM',
  },
  dashboard: {
    hero: {
      badge: 'محرك القياس نشط',
      title: 'مرحبًا بعودتك، {{name}}!',
      summary:
        'لديك <tests>{{activeTests}} اختبارات Prompts نشطة</tests> عبر {{modelCount}} نماذج لغوية. ارتفعت كفاءة خط العمل الإجمالية بنسبة <gain>+{{efficiencyGain}}% هذا الأسبوع</gain>.',
      optimize: 'تحسين خط العمل',
      newPrompt: 'Prompt جديد',
    },
    stats: {
      totalPrompts: 'إجمالي الـ Prompts',
      newThisMonth: 'جديد هذا الشهر',
      favorites: 'الـ Prompts المفضلة',
      shareOfLibrary: '{{percent}}% من مكتبتك',
      productionReady: 'جاهز للإنتاج',
      projects: 'المشاريع النشطة',
      subfolders: 'المجلدات الفرعية: {{total}}',
      savedTime: 'الوقت الموفَّر',
      hours: 'ساعة',
      estRoi: 'العائد المقدّر: {{value}}',
      thisCycle: 'خلال هذه الدورة',
    },
        recent: {
      title: 'آخر الـ Prompts',
      subtitle: 'متزامنة عبر مسارات الإنتاج',
      filterLabel: 'تصفية الـ Prompts',
      tabs: {
        all: 'الكل ({{total}})',
        production: 'الإنتاج',
        testing: 'قيد الاختبار',
        drafts: 'المسودات',
      },
      empty: 'لا توجد Prompts في هذا التصنيف بعد.',
    },
    templates: {
      title: 'مشغّلات القوالب السريعة',
      exploreAll: 'استكشاف كل القوالب ({{total}})',
      use: 'استخدام القالب',
      items: {
        email: {
          title: 'محرك رسائل البريد الباردة',
          description:
            'يحلّل نقاط الألم لدى شركة المستلم من إشارات Crunchbase ويكتب رسائل تواصل مخصّصة بدقة عالية.',
        },
        docs: {
          title: 'مُولِّد توثيق الـ API',
          description:
            'يستقبل مخططات OpenAPI 3.1 JSON الخام ويُخرج مواصفات MDX بجودة الإنتاج لـ Mintlify وDocusaurus.',
        },
        refactor: {
          title: 'وكيل إعادة هيكلة الكود',
          description:
            'يزيل الأنماط السيئة، ويحسّن تعقيد الزمن والذاكرة، ويكتب مجموعات اختبارات Vitest شاملة.',
        },
      },
    },
    playground: {
      title: 'ملعب المتغيّرات',
      promptTemplate: 'قالب الـ Prompt',
      activeVariables: 'المتغيّرات النشطة',
      dynamicTags: 'متغيّرات ديناميكية: {{total}}',
      required: 'مطلوب',
      optional: 'اختياري',
      tokens: '~{{tokens}} توكن (${{cost}})',
      running: 'جارٍ التشغيل…',
      run: 'تشغيل الاختبار',
      fillRequired: 'املأ المتغيّرات المطلوبة لتشغيل اختبار.',
      simulated: 'ناتج محاكى ({{ms}}ms)',
      closeOutput: 'إغلاق الناتج',
    },
    benchmarks: {
      title: 'مقارنة أداء النماذج',
      live: 'P95 مباشر',
      normalized: 'مؤشر زمن الاستجابة بعد التطبيع',
      matrix: 'المصفوفة التفصيلية',
    },
  },
}