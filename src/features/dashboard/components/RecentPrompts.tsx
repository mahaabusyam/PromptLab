import { useEffect, useMemo, useState } from 'react'
import { Braces } from 'lucide-react'
import { usePromptStore } from '@/stores/promptStore'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ScrollTrigger } from '@/utils/gsap'
import type { PromptFilter } from '../types'
import { RecentPromptCard } from './RecentPromptCard'

export function RecentPrompts() {
  const ref = useScrollReveal<HTMLElement>()
  const prompts = usePromptStore((s) => s.prompts)
  const toggleFavorite = usePromptStore((s) => s.toggleFavorite)
  const [filter, setFilter] = useState<PromptFilter>('all')

  // آخر 4 Prompts تعدّلت. نصوص التاريخ ISO بتترتب صح كنص عادي
  const recent = useMemo(
    () =>
      prompts
        .filter((p) => !p.isArchived)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 4),
    [prompts],
  )

  const visible = useMemo(
    () => (filter === 'all' ? recent : recent.filter((p) => p.status === filter)),
    [recent, filter],
  )

  // ارتفاع القسم بيتغير لما نفلتر، فنخلي ScrollTrigger يعيد حساب مواقع الأقسام اللي تحته
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [filter])

  const tabs: { id: PromptFilter; label: string }[] = [
    { id: 'all', label: `All (${recent.length})` },
    { id: 'production', label: 'Production' },
    { id: 'testing', label: 'Testing' },
    { id: 'draft', label: 'Drafts' },
  ]

  return (
    <section
      ref={ref}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-low p-space-lg shadow-lg"
    >
      <div
        data-reveal
        className="flex flex-col justify-between gap-space-sm pb-1 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-2.5">
          <Braces className="size-[22px] text-primary" />
          <div>
            <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              Recent Prompts
            </h2>
            <p className="text-body-sm text-outline">Synchronized across production pipelines</p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filter prompts"
          className="inline-flex self-start rounded-xl bg-surface-container-lowest p-1 sm:self-auto"
        >
          {tabs.map((tab) => {
            const active = filter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1 text-label-md transition-colors ${
                  active
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg bg-surface-container-lowest px-space-md py-space-xl text-center text-body-sm text-outline">
          No prompts in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          {visible.map((p) => (
            <RecentPromptCard key={p.id} prompt={p} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </section>
  )
}