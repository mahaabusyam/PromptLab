import { useEffect, useRef } from 'react'
import {
  Bookmark,
  Check,
  ChevronRight,
  Cloud,
  Copy,
  Loader2,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Split,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import type { DropdownOption } from '@/components/common/FilterDropdown'
import { categoryLabels, categoryOrder, statusLabels } from '@/features/prompts/constants'
import type { PromptCategory, PromptStatus } from '@/features/prompts/types'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useNow } from '@/hooks/useNow'
import { formatSavedAgo } from '@/utils/dates'
import { gsap } from '@/utils/gsap'
import type { EditorDraft, SaveState } from '../types'
import { TagsInput } from './TagsInput'

const actionBtn =
  'inline-flex items-center gap-1.5 rounded-xl bg-surface-container-high px-3 py-2 text-body-sm font-medium text-on-surface shadow-sm transition-[background-color,scale] hover:bg-surface-bright active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'

interface EditorHeaderProps {
  draft: EditorDraft
  onChange: (patch: Partial<EditorDraft>) => void
  isNew: boolean
  versionLabel: string
  saveState: SaveState
  savedAt: number | null
  onCreate: () => void
  onRun: () => void
  running: boolean
  onSaveVersion: () => void
  canSaveVersion: boolean
  onImprove: () => void
  canImprove: boolean
  onVariations: () => void
}

export function EditorHeader({
  draft,
  onChange,
  isNew,
  versionLabel,
  saveState,
  savedAt,
  onCreate,
  onRun,
  running,
  onSaveVersion,
  canSaveVersion,
  onImprove,
  canImprove,
  onVariations,
}: EditorHeaderProps) {
  const { t } = useTranslation()
  const now = useNow()
  const { copied, copy } = useCopyToClipboard()

  // الخيارات جوّا الـ component عشان تتترجم حسب اللغة الحالية
  const statusOptions: DropdownOption<PromptStatus>[] = (
    Object.keys(statusLabels) as PromptStatus[]
  ).map((value) => ({ value, label: statusLabels[value] }))

  const categoryOptions: DropdownOption<PromptCategory>[] = categoryOrder.map((value) => ({
    value,
    label: categoryLabels[value],
  }))

  // نبضة صغيرة على بادج النسخة لما يتغيّر رقمها (تأكيد بصري للحفظ)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const badge = badgeRef.current
    if (!badge || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      badge,
      { scale: 1.3 },
      { scale: 1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform' },
    )
    return () => {
      tween.kill()
    }
  }, [versionLabel])

  const savedText =
    saveState === 'saved' && savedAt
      ? t('editor.header.saved', { ago: formatSavedAgo(savedAt, now) })
      : saveState === 'saving'
        ? t('editor.header.saving')
        : t('editor.header.unsaved')

  const hasContent = Boolean(draft.content.trim())

  return (
    <header
      data-reveal
      className="relative z-20 flex flex-col justify-between gap-space-md rounded-2xl bg-surface-container-lowest/80 p-space-md shadow-sm backdrop-blur-md xl:flex-row xl:items-center"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        {/* Breadcrumb */}
        <nav
          aria-label={t('editor.header.breadcrumb')}
          className="flex flex-wrap items-center gap-space-xs text-label-sm text-on-surface-variant"
        >
          <Link to="/library" className="transition-colors hover:text-on-surface">
            {t('editor.header.prompts')}
          </Link>
          <ChevronRight aria-hidden className="size-3.5 text-outline rtl:-scale-x-100" />
          <span>{categoryLabels[draft.category]}</span>
          <ChevronRight aria-hidden className="size-3.5 text-outline rtl:-scale-x-100" />
          <span dir="auto" className="max-w-[200px] truncate font-medium text-on-surface">
            {draft.title.trim() || t('editor.header.untitled')}
          </span>
          <span
            ref={badgeRef}
            aria-live="polite"
            className="ms-space-xs inline-flex items-center rounded-full bg-secondary-container px-2.5 py-0.5 font-semibold text-on-secondary-container"
          >
            {versionLabel}
          </span>
        </nav>

        {/* العنوان القابل للتعديل */}
        <label className="group flex items-center gap-space-xs">
          <span className="sr-only">{t('editor.header.titleLabel')}</span>
          <input
            dir="auto"
            value={draft.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={t('editor.header.untitled')}
            maxLength={80}
            className="min-w-0 flex-1 bg-transparent font-headline-md text-headline-md tracking-tight text-on-surface transition-colors placeholder:text-outline hover:text-primary focus:text-on-surface focus:outline-none"
          />
          <Pencil
            aria-hidden
            className="size-[18px] shrink-0 text-outline transition-colors group-focus-within:text-primary group-hover:text-primary"
          />
        </label>

        {/* الحالة، التصنيف، الوسوم، حالة الحفظ */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <FilterDropdown
            ariaLabel={t('editor.header.statusLabel')}
            prefix={t('editor.header.statusPrefix')}
            value={draft.status}
            options={statusOptions}
            onChange={(status) => onChange({ status })}
          />
          <FilterDropdown
            ariaLabel={t('editor.header.categoryLabel')}
            prefix={t('editor.header.categoryPrefix')}
            value={draft.category}
            options={categoryOptions}
            onChange={(category) => onChange({ category })}
          />
          <TagsInput tags={draft.tags} onChange={(tags) => onChange({ tags })} />
          <span role="status" className="flex items-center gap-1 text-label-sm text-outline">
            {saveState === 'saved' ? (
              <Check aria-hidden className="size-3.5 text-primary" />
            ) : (
              <Cloud aria-hidden className="size-3.5" />
            )}
            {savedText}
          </span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <button
          type="button"
          onClick={onImprove}
          disabled={!canImprove}
          title={canImprove ? t('editor.header.improveHint') : t('editor.header.writeFirst')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary-container via-secondary-container to-tertiary-container px-3.5 py-2 text-title-md font-semibold text-white shadow-lg rtl:bg-linear-to-l disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles aria-hidden className="size-[18px] text-tertiary-fixed" />
          {t('editor.header.improve')}
        </button>

        <button
          type="button"
          onClick={onVariations}
          disabled={!canImprove}
          title={canImprove ? t('editor.header.variationsHint') : t('editor.header.writeFirst')}
          className={actionBtn}
        >
          <Split aria-hidden className="size-[18px] text-outline" />
          {t('editor.header.variations')}
        </button>

        {isNew ? (
          <button
            type="button"
            onClick={onCreate}
            disabled={!hasContent}
            title={hasContent ? undefined : t('editor.header.writeFirst')}
            className={actionBtn}
          >
            <Plus aria-hidden className="size-[18px] text-primary" />
            {t('editor.header.create')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSaveVersion}
            disabled={!canSaveVersion}
            title={canSaveVersion ? undefined : t('editor.header.noChanges')}
            className={actionBtn}
          >
            <Bookmark aria-hidden className="size-[18px] text-outline" />
            {t('editor.header.saveVersion')}
          </button>
        )}

        <button type="button" onClick={() => copy(draft.content)} className={actionBtn}>
          {copied ? (
            <Check aria-hidden className="size-[18px] text-primary" />
          ) : (
            <Copy aria-hidden className="size-[18px] text-outline" />
          )}
          {copied ? t('editor.header.copied') : t('editor.header.copy')}
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={running || !hasContent}
          aria-busy={running}
          title={t('editor.header.simulationHint')}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-container px-4 py-2 font-headline-sm text-headline-sm font-semibold text-on-secondary-container shadow-lg transition-[filter,scale] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
        >
          {running ? (
            <Loader2 aria-hidden className="size-5 animate-spin" />
          ) : (
            <Play aria-hidden className="size-5" fill="currentColor" />
          )}
          {running ? t('editor.header.running') : t('editor.header.run')}
        </button>
      </div>
    </header>
  )
}