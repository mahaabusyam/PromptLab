import { Check, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/i18n/format'
import { estimateCostUsd, estimateTokens } from '@/utils/tokens'

interface EditorStatusBarProps {
  content: string
  modelName: string
  variableNames: string[]
  values: Record<string, string>
}

export function EditorStatusBar({ content, modelName, variableNames, values }: EditorStatusBarProps) {
  const { t } = useTranslation()
  const lines = content.split('\n').length
  const tokens = estimateTokens(content)
  const cost = estimateCostUsd(tokens)
  const total = variableNames.length
  const bound = variableNames.filter((name) => values[name]?.trim()).length
  const allBound = total > 0 && bound === total
  const modKey =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'

  return (
    <div className="flex flex-col justify-between gap-2 bg-surface-container-low px-space-md py-2.5 text-label-sm text-on-surface-variant sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-space-md">
        <span>
          <span className="me-1 text-outline">{t('editor.status.lines')}</span>
          <span className="font-semibold text-on-surface">{formatNumber(lines)}</span>
        </span>
        <span>
          <span className="me-1 text-outline">{t('editor.status.chars')}</span>
          <span className="font-semibold text-on-surface">{formatNumber(content.length)}</span>
        </span>
        <span>
          <span className="me-1 text-outline">{t('editor.status.tokens')}</span>
          <span className="font-semibold text-primary">
            {t('editor.status.tokensValue', {
              tokens: formatNumber(tokens),
              cost: cost.toFixed(4),
              model: modelName,
            })}
          </span>
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
            allBound ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-container text-outline'
          }`}
        >
          {allBound ? (
            <Check aria-hidden className="size-3.5 text-primary" />
          ) : (
            <Info aria-hidden className="size-3.5" />
          )}
          {total === 0
            ? t('editor.status.noVariables')
            : allBound
              ? t('editor.status.allBound', { total })
              : t('editor.status.someBound', { bound, total })}
        </span>
      </div>
      <span className="flex items-center gap-space-sm text-outline">
        <span className="hidden md:inline">{t('editor.status.quickRun')}</span>
        <kbd
          dir="ltr"
          className="rounded bg-surface-container px-1.5 py-0.5 font-code-md text-code-md font-semibold text-on-surface"
        >
          {modKey} + ↵
        </kbd>
        UTF-8
      </span>
    </div>
  )
}