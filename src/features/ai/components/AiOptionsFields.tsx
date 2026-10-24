import { useId } from 'react'
import { lengthLabels, taskLabels, toneLabels } from '../constants'
import { aiLengths, aiTasks, aiTones } from '../types'
import type { AiOptions } from '../types'

interface OptionSelectProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  labels: Record<T, string>
  onChange: (value: T) => void
}

function OptionSelect<T extends string>({ label, value, options, labels, onChange }: OptionSelectProps<T>) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-label-sm text-on-surface-variant">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const next = options.find((option) => option === e.target.value)
          if (next) onChange(next)
        }}
        className="rounded-xl bg-surface-container-high px-3 py-2 text-body-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </div>
  )
}

interface AiOptionsFieldsProps {
  value: AiOptions
  onChange: (next: AiOptions) => void
}

export function AiOptionsFields({ value, onChange }: AiOptionsFieldsProps) {
  return (
    <div className="flex flex-col gap-space-sm sm:flex-row">
      <OptionSelect label="Task" value={value.task} options={aiTasks} labels={taskLabels} onChange={(task) => onChange({ ...value, task })} />
      <OptionSelect label="Tone" value={value.tone} options={aiTones} labels={toneLabels} onChange={(tone) => onChange({ ...value, tone })} />
      <OptionSelect label="Length" value={value.length} options={aiLengths} labels={lengthLabels} onChange={(length) => onChange({ ...value, length })} />
    </div>
  )
}