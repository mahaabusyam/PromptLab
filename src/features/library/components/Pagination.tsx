import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPageItems } from '../pagination'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

const navBtn =
  'rounded-xl p-2 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:pointer-events-none disabled:opacity-40'

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col items-center justify-between gap-space-sm pt-space-xs sm:flex-row">
      <p className="text-body-sm text-outline">
        Showing <span className="font-medium text-on-surface">{from}–{to}</span> of{' '}
        <span className="font-medium text-on-surface">{total}</span> prompts
      </p>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onChange(page - 1)} className={navBtn}>
            <ChevronLeft className="size-[18px]" />
          </button>

          {getPageItems(page, totalPages).map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} aria-hidden className="px-1.5 text-outline">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onChange(item)}
                className={`flex size-8 items-center justify-center rounded-xl text-label-md transition-colors ${
                  item === page
                    ? 'bg-secondary-container font-semibold text-on-secondary-container shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onChange(page + 1)} className={navBtn}>
            <ChevronRight className="size-[18px]" />
          </button>
        </nav>
      )}
    </div>
  )
}