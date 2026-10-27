import { differenceInDays, format, formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns'
import { ar } from 'date-fns/locale/ar'
import { enUS } from 'date-fns/locale/en-US'
import i18n from '@/i18n'

const currentLocale = () => (i18n.resolvedLanguage === 'ar' ? ar : enUS)

/** "2 hours ago" if less than a week old, otherwise "Oct 3" (localized) */
export function formatUpdated(iso: string): string {
  const date = new Date(iso)
  const locale = currentLocale()
  return differenceInDays(new Date(), date) < 7
    ? formatDistanceToNowStrict(date, { addSuffix: true, locale })
    : format(date, i18n.t('common.dateFormat'), { locale })
}

/** "just now" or "2 minutes ago" (localized) */
export function formatSavedAgo(savedAt: number, now: number): string {
  if (now - savedAt < 10_000) return i18n.t('common.justNow')
  return formatDistanceStrict(savedAt, now, { addSuffix: true, locale: currentLocale() })
}
/** "October 3, 2026" / "3 أكتوبر 2026" (localized) */
export function formatLongDate(date: Date): string {
  return format(date, i18n.t('common.dateFormatLong'), { locale: currentLocale() })
}
/** "2 hours ago" / "قبل ساعتين" (localized) */
export function formatAgo(date: Date): string {
  return formatDistanceToNowStrict(date, { addSuffix: true, locale: currentLocale() })
}

/** "Oct 3, 2026 at 2:30:15 PM" (localized, for tooltips) */
export function formatDateTime(date: Date): string {
  return format(date, 'PPpp', { locale: currentLocale() })
}
/** "Oct 3" / "3 أكتوبر" (localized, short) */
export function formatShortDate(date: Date): string {
  return format(date, i18n.t('common.dateFormat'), { locale: currentLocale() })
}