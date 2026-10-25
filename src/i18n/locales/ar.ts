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
  },
}