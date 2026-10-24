import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { EditorView } from '@codemirror/view'
import { AlignLeft, Braces, Code, Eye, GitCompare, Maximize2, Minimize2, WrapText } from 'lucide-react'
import type { PromptVersion } from '@/features/prompts/types'
import { formatPrompt } from '@/utils/promptFormat'
import { gsap } from '@/utils/gsap'
import type { EditorDraft } from '../types'
import { DiffView } from './DiffView'
import { EditorStatusBar } from './EditorStatusBar'
import { PromptCodeEditor } from './PromptCodeEditor'
import { PromptPreview } from './PromptPreview'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { formatUpdated } from '@/utils/dates'

type TabId = 'raw' | 'preview' | 'diff'
const TAB_ORDER: TabId[] = ['raw', 'preview', 'diff']

const toolBtn =
  'rounded-lg p-1.5 text-outline transition-colors hover:bg-surface-container hover:text-on-surface disabled:pointer-events-none disabled:opacity-40'

interface PromptEditorPanelProps {
  draft: EditorDraft
  onChange: (patch: Partial<EditorDraft>) => void
  versions: PromptVersion[] 
    variableNames: string[]
    onRun: () => void
}

export function PromptEditorPanel({
  draft,
  onChange,
  versions,
  variableNames,
  onRun,
}: PromptEditorPanelProps) {
  const uid = useId()
  const [tab, setTab] = useState<TabId>('raw')
  const [wrap, setWrap] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const viewRef = useRef<EditorView | null>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const [baseId, setBaseId] = useState<string | null>(null)
const latest = versions[versions.length - 1]
// النسخة المختارة للمقارنة، وإلا آخر نسخة محفوظة
const baseVersion = versions.find((v) => v.id === baseId) ?? latest
// النقطة على التبويب: هل في تعديلات غير محفوظة كنسخة؟
const hasChanges = latest !== undefined && latest.content !== draft.content

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const panels = panelsRef.current
    if (!panels || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    const tween = gsap.fromTo(
      panels,
      { opacity: 0, y: 6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      },
    )

    return () => {
      tween.kill()
    }
  }, [tab])

  // Escape يطلّعك من وضع الشاشة الكاملة
  useEffect(() => {
    if (!fullscreen) return

    const onKeyDown = (e: globalThis.KeyboardEvent) =>
      e.key === 'Escape' && setFullscreen(false)

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [fullscreen])

  const tabIds = (id: TabId) => ({
    tab: `${uid}-tab-${id}`,
    panel: `${uid}-panel-${id}`,
  })

  // أسهم الكيبورد بين التبويبات (نمط ARIA Tabs)
  const onTabKeyDown = (e: KeyboardEvent) => {
    const index = TAB_ORDER.indexOf(tab)
    const next =
      e.key === 'ArrowRight'
        ? TAB_ORDER[(index + 1) % TAB_ORDER.length]
        : e.key === 'ArrowLeft'
          ? TAB_ORDER[(index - 1 + TAB_ORDER.length) % TAB_ORDER.length]
          : e.key === 'Home'
            ? TAB_ORDER[0]
            : e.key === 'End'
              ? TAB_ORDER[TAB_ORDER.length - 1]
              : null

    if (!next) return
    e.preventDefault()
    setTab(next)
    document.getElementById(tabIds(next).tab)?.focus()
  }

  const insertVariable = () => {
    const view = viewRef.current
    if (!view) return

    const { from, to } = view.state.selection.main

    view.dispatch({
      changes: { from, to, insert: '{{variable}}' },
      selection: { anchor: from + 2, head: from + 10 },
    })

    view.focus()
  }

  const tabs: {
    id: TabId
    label: string
    icon: typeof Code
    badge: React.ReactNode
  }[] = [
    {
      id: 'raw',
      label: 'Raw Prompt',
      icon: Code,
      badge: (
        <span className="ml-1 rounded-full bg-secondary-container px-1.5 text-label-sm font-semibold text-on-secondary-container">
          {'{{ }}'}
        </span>
      ),
    },
    {
      id: 'preview',
      label: 'Live Injected Preview',
      icon: Eye,
      badge: (
        <span className="ml-1 rounded-full bg-surface-container px-1.5 text-label-sm text-outline">
          {variableNames.length} vars
        </span>
      ),
    },
    {
      id: 'diff',
      label: baseVersion ? `Diff vs ${baseVersion.label}` : 'Diff',
      icon: GitCompare,
      badge: hasChanges ? (
        <span
          aria-label="Unsaved changes"
          className="ml-1 size-2 rounded-full bg-tertiary-container"
        />
      ) : null,
    },
  ]

  return (
    <section
      aria-label="Prompt editor"
      data-lenis-prevent={fullscreen ? '' : undefined}
      className={`flex min-w-0 flex-col overflow-hidden bg-surface-container-lowest/90 shadow-xl ${
        fullscreen ? 'fixed inset-0 z-60' : 'rounded-xl lg:col-span-8'
      }`}
    >
      <div className="flex items-center justify-between bg-surface-container-low px-space-md">
        <div
          role="tablist"
          aria-label="Editor views"
          onKeyDown={onTabKeyDown}
          className="flex items-center gap-space-xs overflow-x-auto"
        >
          {tabs.map(({ id, label, icon: Icon, badge }) => {
            const active = tab === id

            return (
              <button
                key={id}
                id={tabIds(id).tab}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={tabIds(id).panel}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(id)}
                className={`relative flex shrink-0 items-center gap-2 px-space-md py-3 text-body-sm transition-colors ${
                  active
                    ? 'font-semibold text-on-surface after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon
                  aria-hidden
                  className={`size-[18px] ${active ? 'text-primary' : 'text-outline'}`}
                />
                {label}
                {badge}
              </button>
            )
          })}
        </div>

        <div className="hidden items-center gap-1 py-2 sm:flex">
          <button
            type="button"
            title="Format prompt"
            aria-label="Format prompt"
            disabled={tab !== 'raw'}
            onClick={() =>
              onChange({ content: formatPrompt(draft.content) })
            }
            className={toolBtn}
          >
            <AlignLeft className="size-[18px]" />
          </button>

          <button
            type="button"
            title="Toggle word wrap"
            aria-label="Toggle word wrap"
            aria-pressed={wrap}
            disabled={tab !== 'raw'}
            onClick={() => setWrap((v) => !v)}
            className={`${toolBtn} ${wrap ? 'text-primary' : ''}`}
          >
            <WrapText className="size-[18px]" />
          </button>

          <button
            type="button"
            title="Insert variable"
            aria-label="Insert variable"
            disabled={tab !== 'raw'}
            onClick={insertVariable}
            className={toolBtn}
          >
            <Braces className="size-[18px]" />
          </button>

          <div className="mx-1 h-4 w-px bg-surface-variant" />

          <button
            type="button"
            title={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'}
            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
            aria-pressed={fullscreen}
            onClick={() => setFullscreen((v) => !v)}
            className={toolBtn}
          >
            {fullscreen ? (
              <Minimize2 className="size-[18px]" />
            ) : (
              <Maximize2 className="size-[18px]" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={panelsRef}
        className={fullscreen ? 'min-h-0 flex-1 overflow-auto' : ''}
      >
        <div
          id={tabIds('raw').panel}
          role="tabpanel"
          aria-labelledby={tabIds('raw').tab}
          hidden={tab !== 'raw'}
        >
          <PromptCodeEditor
            value={draft.content}
            onChange={(content) => onChange({ content })}
            wrap={wrap}
            onReady={(view) => {
              viewRef.current = view
            }}
            onQuickRun={onRun}
          />
        </div>

        {tab === 'preview' && (
          <div
            id={tabIds('preview').panel}
            role="tabpanel"
            aria-labelledby={tabIds('preview').tab}
          >
            <PromptPreview
              content={draft.content}
              values={draft.variableValues}
            />
          </div>
        )}

        {tab === 'diff' && (
  <div id={tabIds('diff').panel} role="tabpanel" aria-labelledby={tabIds('diff').tab} className="min-h-72">
    {versions.length > 1 && baseVersion && (
      <div className="flex items-center gap-2 px-space-md pt-space-sm text-label-sm text-outline">
        Compare against
        <FilterDropdown
          ariaLabel="Compare against version"
          value={baseVersion.id}
          options={[...versions].reverse().map((v) => ({
            value: v.id,
            label: `${v.label} · ${formatUpdated(v.createdAt)}`,
          }))}
          onChange={setBaseId}
        />
      </div>
    )}
    <DiffView before={baseVersion?.content} after={draft.content} baseLabel={baseVersion?.label ?? ''} />
  </div>
)}
      </div>

      <EditorStatusBar
        content={draft.content}
        modelName={draft.model.name}
        variableNames={variableNames}
        values={draft.variableValues}
      />
    </section>
  )
}