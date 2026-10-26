import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { getPageNumbers } from '@/utils/paginate';
import type { PageResult } from '@/utils/paginate';

interface ListPaginationProps {
  result: PageResult<unknown>;
  onPageChange: (page: number) => void;
  /** Already-translated plural name of the list, e.g. "templates". */
  noun?: string;
}

const btn =
  'inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

export function ListPagination({ result, onPageChange, noun }: ListPaginationProps) {
  const { t } = useTranslation();
  const { page, totalPages, from, to, total } = result;
  const label = noun ?? t('common.pagination.defaultNoun');

  return (
    <nav
      aria-label={t('common.pagination.label', { noun: label })}
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        <Trans
          i18nKey="common.pagination.showing"
          values={{ noun: label, from, to, total }}
          components={{ range: <bdi dir="ltr" /> }}
        />
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={btn}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label={t('common.pagination.previous')}
          >
            <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
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
                aria-label={t('common.pagination.page', { n })}
                aria-current={n === page ? 'page' : undefined}
                className={`${btn} ${n === page ? 'border-primary/40 bg-primary/10 text-primary' : ''}`}
              >
                {n}
              </button>
            ),
          )}

          <button
            type="button"
            className={btn}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label={t('common.pagination.next')}
          >
            <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
}