import { useLayoutEffect } from 'react'
import i18n from '@/i18n'
import { languageMeta, resolveLanguage } from '@/i18n/languages'
import { useLanguageStore } from '@/stores/languageStore'

export function useApplyLanguage() {
  const preference = useLanguageStore((state) => state.preference)
  const language = resolveLanguage(preference, navigator.languages)

  useLayoutEffect(() => {
    void i18n.changeLanguage(language)
    const root = document.documentElement
    root.lang = language
    root.dir = languageMeta[language].dir
  }, [language])

  return language
}