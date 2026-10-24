import { useMemo, useState } from 'react'
import { BrainCircuit, SlidersHorizontal } from 'lucide-react'
import { FilterDropdown } from '@/components/common/FilterDropdown'
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
        <label htmlFor="max-tokens" className="text-label-sm text-outline">Max Tokens</label>
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
      <span className="truncate text-[10px] text-outline">Limit: {MAX_OUTPUT_TOKENS.toLocaleString()} cap</span>
    </div>
  )
}

interface ModelPanelProps {
  draft: EditorDraft
  onChange: (patch: Partial<EditorDraft>) => void
}

export function ModelPanel({ draft, onChange }: ModelPanelProps) {
  const { model, settings } = draft
  const setSetting = (patch: Partial<PromptSettings>) => onChange({ settings: { ...settings, ...patch } })

  // لو موديل الـ Prompt مش بالقائمة (مثلاً من ملف مستورد)، منضيفه عشان ما يختفي
  const options = useMemo(() => {
    const known = modelCatalog.map((m) => ({ value: m.name, label: m.name }))
    return known.some((o) => o.value === model.name) ? known : [{ value: model.name, label: model.name }, ...known]
  }, [model.name])
  const info = modelCatalog.find((m) => m.name === model.name)

  return (
    <EditorCard
      icon={BrainCircuit}
      title="Model Hyperparameters"
      action={
        <span
          title="These settings are saved with the prompt and used for the simulated run and its estimates. “Run with AI” uses the server's model and only applies Max Tokens."
          className="shrink-0 rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm font-semibold text-outline"
        >
          Simulation settings
        </span>
            }
    >
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-outline">Active Foundation Model</span>
        <div>
          <FilterDropdown
            ariaLabel="Foundation model"
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
          {info ? ` • ${info.context} Context` : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-1">
        <RangeField
          label="Temperature"
          value={settings.temperature}
          min={0}
          max={1}
          step={0.05}
          digits={2}
          onChange={(temperature) => setSetting({ temperature })}
          hints={['0.0 Strict', '1.0 Creative']}
        />
        <MaxTokensField value={settings.maxTokens} onCommit={(maxTokens) => setSetting({ maxTokens })} />
      </div>

      <RangeField
        label="Top-P Sampling"
        value={settings.topP}
        min={0}
        max={1}
        step={0.01}
        digits={2}
        onChange={(topP) => setSetting({ topP })}
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-body-sm text-on-surface-variant" id="strict-schema-label">Strict Schema</span>
        <button
          type="button"
          role="switch"
          aria-checked={settings.strictSchema}
          aria-labelledby="strict-schema-label"
          onClick={() => setSetting({ strictSchema: !settings.strictSchema })}
          className={`relative h-5 w-9 rounded-full transition-colors ${settings.strictSchema ? 'bg-secondary-container' : 'bg-surface-container-highest'}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-md transition-[translate] ${settings.strictSchema ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>
      <p className="text-label-sm text-outline">
        Saved with the prompt and applied once a real model is connected.
      </p>
    </EditorCard>
  )
}