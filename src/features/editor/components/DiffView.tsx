import { useMemo } from 'react'
import { diffLines, summarizeDiff } from '@/features/versions/diff'
import type { DiffLineType } from '@/features/versions/diff'

const rowStyles: Record<DiffLineType, string> = {
  same: 'text-on-surface-variant',
  added: 'bg-primary/10 text-on-surface',
  removed: 'bg-error-container/30 text-on-surface-variant',
}
const signs: Record<DiffLineType, string> = { same: ' ', added: '+', removed: '−' }
const srLabels: Record<DiffLineType, string> = { same: '', added: 'Added: ', removed: 'Removed: ' }

interface DiffViewProps {
  before: string | undefined
  after: string
  baseLabel: string
}

export function DiffView({ before, after, baseLabel }: DiffViewProps) {
  const lines = useMemo(() => (before === undefined ? [] : diffLines(before, after)), [before, after])
  const { added, removed } = useMemo(() => summarizeDiff(lines), [lines])

  if (before === undefined) {
    return (
      <p className="p-space-md text-body-sm text-outline">
        Create the prompt first. Every saved version can then be compared here.
      </p>
    )
  }
  if (added === 0 && removed === 0) {
    return <p className="p-space-md text-body-sm text-outline">No changes since {baseLabel}.</p>
  }

  return (
    <div className="py-space-sm font-code-md text-code-md leading-6">
      <p className="flex items-center gap-3 px-space-md pb-2 text-label-sm text-outline">
        Working copy vs {baseLabel}
        <span className="font-semibold text-primary">+{added}</span>
        <span className="font-semibold text-error">−{removed}</span>
      </p>
      {lines.map((line, i) => (
        <div key={i} className={`flex whitespace-pre-wrap break-words px-space-md ${rowStyles[line.type]}`}>
          <span aria-hidden className="w-6 shrink-0 select-none text-center text-outline">
            {signs[line.type]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="sr-only">{srLabels[line.type]}</span>
            {line.text || ' '}
          </span>
        </div>
      ))}
    </div>
  )
}