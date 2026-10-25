import { useEffect, useMemo, useRef } from 'react'
import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { Prompt } from '@/features/prompts/types'
import { useLibraryStore } from '@/stores/libraryStore'
import { gsap } from '@/utils/gsap'
import { PAGE_SIZE } from '../pagination'
import { Pagination } from './Pagination'
import { PromptCard } from './PromptCard'
import { PromptTable } from './PromptTable'

interface PromptResultsProps {
  prompts: Prompt[]
  hasActiveFilters: boolean
}

export function PromptResults({ prompts, hasActiveFilters }: PromptResultsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const viewMode = useLibraryStore((s) => s.viewMode)
  const page = useLibraryStore((s) => s.page)
  const scope = useLibraryStore((s) => s.scope)
  const setPage = useLibraryStore((s) => s.setPage)
  const setScope = useLibraryStore((s) => s.setScope)
  const resetFilters = useLibraryStore((s) => s.resetFilters)

  const totalPages = Math.max(1, Math.ceil(prompts.length / PAGE_SIZE))
  // لو حذفتي آخر Prompt بالصفحة الأخيرة، ما نضل واقفين على صفحة فاضية
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => prompts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [prompts, currentPage],
  )

  // نعيد الأنيميشن بس لما يتغير الشكل/الصفحة/القائمة. تبديل النجمة ما بيغيّر الـ ids فما بيعيد الأنيميشن
  const resultKey = `${viewMode}|${currentPage}|${pageItems.map((p) => p.id).join(',')}`

  useEffect(() => {
    const container = containerRef.current
    if (!container || !container.querySelector('[data-result-item]')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-result-item]',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity' },
      )
    }, container)
    return () => ctx.revert()
  }, [resultKey])

  if (prompts.length === 0) {
    const copy = hasActiveFilters
      ? { title: t('library.empty.filters.title'), body: t('library.empty.filters.body') }
      : scope.kind === 'archive'
        ? { title: t('library.empty.archive.title'), body: t('library.empty.archive.body') }
        : scope.kind === 'starred'
          ? { title: t('library.empty.starred.title'), body: t('library.empty.starred.body') }
          : scope.kind === 'folder'
            ? { title: t('library.empty.folder.title'), body: t('library.empty.folder.body') }
            : { title: t('library.empty.none.title'), body: t('library.empty.none.body') }

    const action = hasActiveFilters
      ? { label: t('library.toolbar.clearFilters'), run: resetFilters }
      : scope.kind === 'all'
        ? { label: t('library.header.create'), run: () => navigate('/editor') }
        : { label: t('library.empty.showAll'), run: () => setScope({ kind: 'all' }) }

    return (
      <div
        ref={containerRef}
        role="status"
        className="flex min-w-0 flex-1 flex-col items-center gap-space-sm rounded-2xl bg-surface-container-low/85 px-space-lg py-space-xl text-center"
      >
        <SearchX aria-hidden className="size-8 text-outline" />
        <h2 className="text-title-md text-on-surface">{copy.title}</h2>
        <p className="text-body-sm text-on-surface-variant">{copy.body}</p>
        <button
          type="button"
          onClick={action.run}
          className="mt-1 rounded-xl bg-secondary-container px-4 py-2 text-label-md text-on-secondary-container transition-[filter] hover:brightness-110"
        >
          {action.label}
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-space-md">
      <div ref={containerRef}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 2xl:grid-cols-3">
            {pageItems.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        ) : (
          <PromptTable prompts={pageItems} />
        )}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={prompts.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  )
}