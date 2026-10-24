export const HISTORY_PAGE_SIZE = 10;

export interface PageResult<T> {
  items: T[];
  page: number; // clamped to a valid page
  totalPages: number;
  from: number;
  to: number;
  total: number;
}

export function paginate<T>(items: T[], page: number, size: number = HISTORY_PAGE_SIZE): PageResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: current,
    totalPages,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + size, items.length),
    total: items.length,
  };
}

/** Page numbers to render; `null` means an ellipsis gap. e.g. [1, null, 4, 5, 6, null, 20] */
export function getPageNumbers(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) result.push(null);
    result.push(n);
  });
  return result;
}