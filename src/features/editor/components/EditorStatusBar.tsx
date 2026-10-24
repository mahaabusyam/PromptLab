import { Check, Info } from 'lucide-react'
import { estimateCostUsd, estimateTokens } from '@/utils/tokens'

interface EditorStatusBarProps {
  content: string
  modelName: string
  variableNames: string[]
  values: Record<string, string>
}

export function EditorStatusBar({ content, modelName, variableNames, values }: EditorStatusBarProps) {
  const lines = content.split('\n').length
  const tokens = estimateTokens(content)
  const cost = estimateCostUsd(tokens)
  const total = variableNames.length
  const bound = variableNames.filter((name) => values[name]?.trim()).length
  const allBound = total > 0 && bound === total
  const modKey = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'

  return (
    <div className="flex flex-col justify-between gap-2 bg-surface-container-low px-space-md py-2.5 text-label-sm text-on-surface-variant sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-space-md">
        <span>
          <span className="text-outline">Lines: </span>
          <span className="font-semibold text-on-surface">{lines}</span>
        </span>
        <span>
          <span className="text-outline">Chars: </span>
          <span className="font-semibold text-on-surface">{content.length.toLocaleString()}</span>
        </span>
        <span>
          <span className="text-outline">Tokens: </span>
          <span className="font-semibold text-primary">
            ~{tokens.toLocaleString()} (${cost.toFixed(4)} via {modelName})
          </span>
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
            allBound ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-container text-outline'
          }`}
        >
          {allBound ? <Check aria-hidden className="size-3.5 text-primary" /> : <Info aria-hidden className="size-3.5" />}
          {total === 0
            ? 'No variables'
            : allBound
              ? `All ${total} variables bound`
              : `${bound} of ${total} variables bound`}
        </span>
      </div>
      <span className="flex items-center gap-space-sm text-outline">
  <span className="hidden md:inline">Quick Run:</span>
  <kbd className="rounded bg-surface-container px-1.5 py-0.5 font-code-md text-code-md font-semibold text-on-surface">
    {modKey} + ↵
  </kbd>
  UTF-8
</span>
    </div>
  )
}