import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useLanguageStore } from '@/stores/languageStore'
import { resolveLanguage } from './languages'
import { ar } from './locales/ar'
import { en } from './locales/en'

const browserLanguages = typeof navigator === 'undefined' ? [] : navigator.languages

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: resolveLanguage(useLanguageStore.getState().preference, browserLanguages),
  fallbackLng: 'en',
  initAsync: false, // resources are bundled, so load them synchronously (no flash of keys)
  interpolation: { escapeValue: false }, // React already escapes
})

export default i18n