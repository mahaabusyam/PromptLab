export const PAGE_SIZE = 6

export type PageItem = number | 'ellipsis'

/** مثال: الصفحة 10 من 22 → [1, …, 9, 10, 11, …, 22] */
export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const sorted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const items: PageItem[] = []
  sorted.forEach((page, i) => {
    if (i > 0) {
      const gap = page - sorted[i - 1]
      if (gap === 2) items.push(page - 1) // فجوة بصفحة وحدة؟ اعرضيها بدل "…"
      else if (gap > 2) items.push('ellipsis')
    }
    items.push(page)
  })
  return items
}