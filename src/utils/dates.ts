import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'

/** "2 hours ago" لو أقل من أسبوع، غير هيك "Oct 3" */
export function formatUpdated(iso: string): string {
  const date = new Date(iso)
  return differenceInDays(new Date(), date) < 7
    ? formatDistanceToNowStrict(date, { addSuffix: true })
    : format(date, 'MMM d')
}
import { formatDistanceStrict } from 'date-fns' // ضيفيها لسطر الـ import الموجود

/** "just now" أو "2 minutes ago" */
export function formatSavedAgo(savedAt: number, now: number): string {
  if (now - savedAt < 10_000) return 'just now'
  return formatDistanceStrict(savedAt, now, { addSuffix: true })
}