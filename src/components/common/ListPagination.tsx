import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageNumbers } from '@/utils/paginate';
import type { PageResult } from '@/utils/paginate';

interface ListPaginationProps {
  result: PageResult<unknown>;
  onPageChange: (page: number) => void;
  noun?: string;
}

const btn =
  'inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

export function ListPagination({ result, onPageChange,noun = 'version logs' }: ListPaginationProps ) {
  const { page, totalPages, from, to, total } = result;

  return (
    <nav aria-label={`${noun} pagination`} className="...">
  <p className="text-sm text-muted-foreground">
    Showing {from}–{to} of {total} {noun}
  </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button type="button" className={btn} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft className="rtl:-scale-x-100 size-4" aria-hidden="true" />
          </button>

          {getPageNumbers(page, totalPages).map((n, i) =>
            n === null ? (
              <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? 'page' : undefined}
                className={`${btn} ${n === page ? 'border-primary/40 bg-primary/10 text-primary' : ''}`}
              >
                {n}
              </button>
            ),
          )}

          <button type="button" className={btn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
            <ChevronRight className="rtl:-scale-x-100 size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
}