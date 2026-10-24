import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/common/Modal'
import type { PromptVersion } from '@/features/prompts/types'
import { diffLines, summarizeDiff } from '@/features/versions/diff'
import { saveVersionSchema } from '@/features/versions/schemas'
import type { SaveVersionValues } from '@/features/versions/schemas'
import { nextVersionLabel } from '@/features/versions/versionLabel'

const bumpOptions: { value: SaveVersionValues['bump']; label: string }[] = [
  { value: 'minor', label: 'Minor · small tweaks' },
  { value: 'major', label: 'Major · big rewrite' },
]

interface SaveVersionDialogProps {
  versions: PromptVersion[]
  content: string
  onSave: (values: SaveVersionValues) => void
  onCancel: () => void
}

export function SaveVersionDialog({ versions, content, onSave, onCancel }: SaveVersionDialogProps) {
  const {
  register,
  handleSubmit,
  control,
  formState: { errors },
} = useForm<SaveVersionValues>({
  resolver: zodResolver(saveVersionSchema),
  defaultValues: { note: '', bump: 'minor' },
})

  const bump = useWatch({ control, name: 'bump' })
    const nextLabel = nextVersionLabel(versions, bump)
  const base = versions[versions.length - 1]
  const summary = useMemo(
    () => (base ? summarizeDiff(diffLines(base.content, content)) : null),
    [base, content],
  )

  return (
    <Modal labelledBy="save-version-title" onClose={onCancel}>
      {/* noValidate: نخلي Zod هو اللي يتحقق ويعرض الرسائل، مش المتصفح */}
      <form onSubmit={handleSubmit(onSave)} noValidate className="flex flex-col gap-space-md p-space-md">
        <div className="flex flex-col gap-1">
          <h2 id="save-version-title" className="text-title-md">
            Save Version
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Saving as <span className="font-mono font-semibold text-primary">{nextLabel}</span>
            {summary && base && (
              <>
                {' '}
                · <span className="font-semibold text-primary">+{summary.added}</span>{' '}
                <span className="font-semibold text-error">−{summary.removed}</span> lines vs {base.label}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="version-note" className="text-label-md text-on-surface">
            What changed?
          </label>
          <textarea
            id="version-note"
            rows={3}
            placeholder="e.g. Tightened the tone and added an output format"
            aria-invalid={Boolean(errors.note)}
            aria-describedby={errors.note ? 'version-note-error' : undefined}
            {...register('note')}
            className="w-full resize-none rounded-lg bg-surface-container-lowest px-space-sm py-2 text-body-sm text-on-surface shadow-inner placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:ring-1 aria-invalid:ring-error"
          />
          {errors.note && (
            <p id="version-note-error" role="alert" className="text-label-sm text-error">
              {errors.note.message}
            </p>
          )}
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-label-md text-on-surface">Version type</legend>
          <div className="flex flex-wrap gap-space-sm">
            {bumpOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-surface-container-lowest px-2.5 py-1.5 text-body-sm text-on-surface-variant has-[:checked]:bg-secondary-container/40 has-[:checked]:text-on-surface"
              >
                <input type="radio" value={option.value} {...register('bump')} className="accent-primary" />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-space-sm">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-surface-container-highest px-3.5 py-2 text-label-md transition-colors hover:bg-surface-variant"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-secondary-container px-3.5 py-2 text-label-md text-on-secondary-container transition-[filter] hover:brightness-110"
          >
            Save version
          </button>
        </div>
      </form>
    </Modal>
  )
}