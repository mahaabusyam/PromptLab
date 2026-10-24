import { useId } from 'react'
import { Braces, WandSparkles } from 'lucide-react'
import { autoFillValues } from '../variables'
import { EditorCard } from './EditorCard'

interface VariablesPanelProps {
  variableNames: string[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export function VariablesPanel({ variableNames, values, onChange }: VariablesPanelProps) {
  const uid = useId()
  const count = variableNames.length

  return (
    <EditorCard
      icon={Braces}
      title={`${count} Dynamic ${count === 1 ? 'Variable' : 'Variables'}`}
      action={
        <button
          type="button"
          disabled={count === 0}
          onClick={() => onChange(autoFillValues(variableNames, values))}
          title="Fill empty variables with sample values"
          className="inline-flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1 text-label-sm font-semibold text-primary transition-colors hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WandSparkles aria-hidden className="size-3.5" />
          Auto-Fill
        </button>
      }
    >
      {count === 0 ? (
        <p className="text-body-sm text-outline">
          No variables yet. Type <span className="variable-chip">{'{{name}}'}</span> in your prompt, or
          use the Insert Variable button.
        </p>
      ) : (
        variableNames.map((name) => {
          const filled = Boolean(values[name]?.trim())
          return (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={`${uid}-${name}`} className="flex items-center justify-between">
                <span className="font-code-md text-code-md font-semibold text-secondary">{name}</span>
                <span className="text-[10px] uppercase tracking-wider text-outline">
                  {filled ? 'Filled' : 'Empty'}
                </span>
              </label>
              <textarea
                id={`${uid}-${name}`}
                rows={1}
                value={values[name] ?? ''}
                onChange={(e) => onChange({ ...values, [name]: e.target.value })}
                placeholder={`Value for {{${name}}}`}
                className="max-h-32 min-h-9 w-full resize-y rounded-lg bg-surface-container-lowest px-space-sm py-2 text-body-sm text-on-surface shadow-inner [field-sizing:content] placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )
        })
      )}
    </EditorCard>
  )
}