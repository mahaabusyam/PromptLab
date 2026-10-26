import { useMemo, useState } from 'react'
import { BrainCircuit, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { formatNumber } from '@/i18n/format'
import { MAX_OUTPUT_TOKENS, modelCatalog, providerLabels } from '@/features/prompts/constants'
import { ProviderIcon } from '@/features/prompts/components/ProviderIcon'
import type { PromptSettings } from '@/features/prompts/types'
import type { EditorDraft } from '../types'
import { EditorCard } from './EditorCard'

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  digits: number
  onChange: (value: number) => void
  hints?: [string, string]
}

function RangeField({ label, value, min, max, step, digits, onChange, hints }: RangeFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-surface-container-lowest p-2.5 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="text-label-sm text-outline">{label}</span>
        <span className="rounded bg-surface-container-high px-1.5 text-label-sm font-semibold text-primary">
          {value.toFixed(digits)}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer accent-primary"
      />
      {hints && (
        <div className="flex justify-between text-[10px] text-outline">
          <span>{hints[0]}</span>
          <span>{hints[1]}</span>
        </div>
      )}
    </div>
  )
}

// حقل رقم بنص محلي: بتقدري تمسحي وتكتبي بحرية، والتحقق (1..8192) بيصير لما تطلعي منه
function MaxTokensField({ value, onCommit }: { value: number; onCommit: (value: number) => void }) {
  const { t } = useTranslation()
  const [text, setText] = useState(String(value))

  const commit = () => {
    const parsed = Number(text)
    const valid = text.trim() !== '' && Number.isFinite(parsed)
    const next = valid ? Math.min(MAX_OUTPUT_TOKENS, Math.max(1, Math.round(parsed))) : value
    setText(String(next))
    onCommit(next)
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-surface-container-lowest p-2.5 shadow-inner">
      <div className="flex items-center justify-between">
        <label htmlFor="max-tokens" className="text-label-sm text-outline">
          {t('editor.model.maxTokens')}
        </label>
        <SlidersHorizontal aria-hidden className="size-3.5 text-outline" />
      </div>
      <input
        id="max-tokens"
        type="number"
        min={1}
        max={MAX_OUTPUT_TOKENS}
        step={128}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        className="w-full bg-transparent text-body-sm font-semibold text-on-surface focus:outline-none"
      />
      <span className="truncate text-[10px] text-outline">
        {t('editor.model.limit', { limit: formatNumber(MAX_OUTPUT_TOKENS) })}
      </span>
    </div>
  )
}

interface ModelPanelProps {
  draft: EditorDraft
  onChange: (patch: Partial<EditorDraft>) => void
}

export function ModelPanel({ draft, onChange }: ModelPanelProps) {
  const { t } = useTranslation()
  const { model, settings } = draft
  const setSetting = (patch: Partial<PromptSettings>) => onChange({ settings: { ...settings, ...patch } })

  // لو موديل الـ Prompt مش بالقائمة (مثلاً من ملف مستورد)، منضيفه عشان ما يختفي
  const options = useMemo(() => {
    const known = modelCatalog.map((m) => ({ value: m.name, label: m.name }))
    return known.some((o) => o.value === model.name)
      ? known
      : [{ value: model.name, label: model.name }, ...known]
  }, [model.name])
  const info = modelCatalog.find((m) => m.name === model.name)

  return (
    <EditorCard
      icon={BrainCircuit}
      title={t('editor.model.title')}
      action={
        <span
          title={t('editor.model.badgeHint')}
          className="shrink-0 rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm font-semibold text-outline"
        >
          {t('editor.model.badge')}
        </span>
      }
    >
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-outline">{t('editor.model.activeModel')}</span>
        <div>
          <FilterDropdown
            ariaLabel={t('editor.model.modelLabel')}
            icon={<ProviderIcon provider={model.provider} className="size-4 text-primary" />}
            value={model.name}
            options={options}
            onChange={(name) => {
              const found = modelCatalog.find((m) => m.name === name)
              if (found) onChange({ model: { name: found.name, provider: found.provider } })
            }}
          />
        </div>
        <span className="text-label-sm text-outline">
          {providerLabels[model.provider]}
          {info ? ` • ${t('editor.model.context', { size: info.context })}` : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-1">
        <RangeField
          label={t('editor.model.temperature')}
          value={settings.temperature}
          min={0}
          max={1}
          step={0.05}
          digits={2}
          onChange={(temperature) => setSetting({ temperature })}
          hints={[t('editor.model.strict'), t('editor.model.creative')]}
        />
        <MaxTokensField value={settings.maxTokens} onCommit={(maxTokens) => setSetting({ maxTokens })} />
      </div>

      <RangeField
        label={t('editor.model.topP')}
        value={settings.topP}
        min={0}
        max={1}
        step={0.01}
        digits={2}
        onChange={(topP) => setSetting({ topP })}
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-body-sm text-on-surface-variant" id="strict-schema-label">
          {t('editor.model.strictSchema')}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={settings.strictSchema}
          aria-labelledby="strict-schema-label"
          onClick={() => setSetting({ strictSchema: !settings.strictSchema })}
          className={`relative h-5 w-9 rounded-full transition-colors ${settings.strictSchema ? 'bg-secondary-container' : 'bg-surface-container-highest'}`}
        >
          <span
            className={`absolute start-0.5 top-0.5 size-4 rounded-full bg-white shadow-md transition-[translate] ${settings.strictSchema ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>
      <p className="text-label-sm text-outline">{t('editor.model.note')}</p>
    </EditorCard>
  )
}