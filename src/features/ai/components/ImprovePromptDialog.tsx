import { Loader2, Sparkles, TriangleAlert } from 'lucide-react'
import { useId, useState } from 'react'
import { DEFAULT_AI_OPTIONS } from '../constants'
import { getAiErrorMessage } from '../errors'
import { useImprovePrompt } from '../hooks/useImprovePrompt'
import { useModalDialog } from '../hooks/useModalDialog'
import { MAX_AI_PROMPT_CHARS } from '../types'
import type { AiOptions } from '../types'
import { compareVariables } from '../variableCheck'
import { AiOptionsFields } from './AiOptionsFields'

interface ImprovePromptDialogProps {
  prompt: string
  onApply: (improved: string) => void
  onClose: () => void
}

export function ImprovePromptDialog({ prompt, onApply, onClose }: ImprovePromptDialogProps) {
  const { ref, close, onBackdropClick } = useModalDialog()
  const titleId = useId()
  const [options, setOptions] = useState<AiOptions>(DEFAULT_AI_OPTIONS)
  const improve = useImprovePrompt()

  const tooLong = prompt.length > MAX_AI_PROMPT_CHARS
  const improved = improve.data?.improved
  const check = improved ? compareVariables(prompt, improved) : null
  const hasVariableWarning = check !== null && (check.missing.length > 0 || check.added.length > 0)

  const run = () => improve.mutate({ prompt, ...options })

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={onBackdropClick}
      data-lenis-prevent
      className="m-auto max-h-[88vh] w-[min(92vw,56rem)] overflow-y-auto rounded-2xl bg-surface-container p-0 text-on-surface shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-space-md p-space-md">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden className="size-5 text-primary" />
          <h2 id={titleId} className="text-title-md font-semibold">
            Improve with AI
          </h2>
        </div>

        <AiOptionsFields value={options} onChange={setOptions} />

        {tooLong && (
          <p role="alert" className="text-body-sm text-error">
            This prompt is {prompt.length.toLocaleString()} characters. The limit is{' '}
            {MAX_AI_PROMPT_CHARS.toLocaleString()}.
          </p>
        )}

        {improve.isPending && (
          <p role="status" className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Improving your prompt…
          </p>
        )}

        {improve.isError && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-container px-3 py-2 text-body-sm text-on-error-container">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {getAiErrorMessage(improve.error)}
          </p>
        )}

        {improved && (
          <div className="flex flex-col gap-space-sm">
            {hasVariableWarning && check && (
              <p role="status" className="flex items-start gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-body-sm">
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-tertiary" />
                <span>
                  {check.missing.length > 0 && <>Removed variables: {check.missing.map((n) => `{{${n}}}`).join(', ')}. </>}
                  {check.added.length > 0 && <>New variables: {check.added.map((n) => `{{${n}}}`).join(', ')}. </>}
                  Review before applying.
                </span>
              </p>
            )}

            <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
              <section aria-label="Original prompt">
                <h3 className="mb-1.5 text-label-sm text-on-surface-variant">Original</h3>
                <pre
                  data-lenis-prevent
                  tabIndex={0}
                  className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-container-low p-3 text-body-sm"
                >
                  {prompt}
                </pre>
              </section>
              <section aria-label="Suggested prompt">
                <h3 className="mb-1.5 text-label-sm text-primary">Suggested</h3>
                <pre
                  data-lenis-prevent
                  tabIndex={0}
                  className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-container-low p-3 text-body-sm ring-1 ring-primary/40"
                >
                  {improved}
                </pre>
              </section>
            </div>
            <p className="text-label-sm text-outline">
              Applying replaces the text in the editor. Save a version first if you want to keep the current one.
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={run}
            disabled={improve.isPending || tooLong}
            className="inline-flex items-center gap-1.5 rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {improved || improve.isError ? 'Try again' : 'Improve'}
          </button>
          {improved && (
            <button
              type="button"
              onClick={() => onApply(improved)}
              className="rounded-xl bg-secondary-container px-4 py-2 text-body-sm font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95"
            >
              Apply suggestion
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}