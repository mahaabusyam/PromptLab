import { Check, Copy, Loader2, Split, TriangleAlert } from 'lucide-react'
import { useId, useState } from 'react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { DEFAULT_AI_OPTIONS } from '../constants'
import { getAiErrorMessage } from '../errors'
import { useGenerateVariations } from '../hooks/useGenerateVariations'
import { useModalDialog } from '../hooks/useModalDialog'
import { MAX_AI_PROMPT_CHARS } from '../types'
import type { AiOptions } from '../types'
import { compareVariables } from '../variableCheck'
import { AiOptionsFields } from './AiOptionsFields'

interface VariationsDialogProps {
  prompt: string
  onUse: (content: string) => void
  onClose: () => void
}

interface VariationCardProps {
  index: number
  original: string
  text: string
  onUse: (content: string) => void
}

function VariationCard({ index, original, text, onUse }: VariationCardProps) {
  const { copied, copy } = useCopyToClipboard()
  const check = compareVariables(original, text)
  const hasWarning = check.missing.length > 0 || check.added.length > 0
  const number = index + 1

  return (
    <li className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-3">
      <h3 className="text-label-md font-semibold text-primary">Variation {number}</h3>

      {hasWarning && (
        <p role="status" className="flex items-start gap-2 text-label-sm text-on-surface-variant">
          <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-tertiary" />
          <span>
            {check.missing.length > 0 && <>Removed: {check.missing.map((n) => `{{${n}}}`).join(', ')}. </>}
            {check.added.length > 0 && <>New: {check.added.map((n) => `{{${n}}}`).join(', ')}.</>}
          </span>
        </p>
      )}

      <pre
        data-lenis-prevent
        tabIndex={0}
        aria-label={`Variation ${number} text`}
        className="max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-container p-3 text-body-sm"
      >
        {text}
      </pre>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(text)}
          aria-label={`Copy variation ${number}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-1.5 text-label-md transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
        >
          {copied ? <Check aria-hidden className="size-4 text-primary" /> : <Copy aria-hidden className="size-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={() => onUse(text)}
          aria-label={`Use variation ${number}`}
          className="rounded-lg bg-secondary-container px-3 py-1.5 text-label-md font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95"
        >
          Use this
        </button>
      </div>
    </li>
  )
}

export function VariationsDialog({ prompt, onUse, onClose }: VariationsDialogProps) {
  const { ref, close, onBackdropClick } = useModalDialog()
  const titleId = useId()
  const [options, setOptions] = useState<AiOptions>(DEFAULT_AI_OPTIONS)
  const generate = useGenerateVariations()

  const tooLong = prompt.length > MAX_AI_PROMPT_CHARS
  const variations = generate.data?.variations
  const run = () => generate.mutate({ prompt, ...options })

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
          <Split aria-hidden className="size-5 text-primary" />
          <h2 id={titleId} className="text-title-md font-semibold">
            Generate Variations
          </h2>
        </div>

        <AiOptionsFields value={options} onChange={setOptions} />

        {tooLong && (
          <p role="alert" className="text-body-sm text-error">
            This prompt is {prompt.length.toLocaleString()} characters. The limit is{' '}
            {MAX_AI_PROMPT_CHARS.toLocaleString()}.
          </p>
        )}

        {generate.isPending && (
          <p role="status" className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Writing 3 variations… this takes a little longer than a single answer.
          </p>
        )}

        {generate.isError && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-container px-3 py-2 text-body-sm text-on-error-container">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {getAiErrorMessage(generate.error)}
          </p>
        )}

        {variations && (
          <div className="flex flex-col gap-space-sm">
            <ol className="flex flex-col gap-space-sm">
              {variations.map((text, index) => (
                <VariationCard key={`${index}-${text.slice(0, 24)}`} index={index} original={prompt} text={text} onUse={onUse} />
              ))}
            </ol>
            <p className="text-label-sm text-outline">
              “Use this” replaces the text in the editor. Save a version first if you want to keep the current one.
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
          >
            Close
          </button>
          <button
            type="button"
            onClick={run}
            disabled={generate.isPending || tooLong}
            className="inline-flex items-center gap-1.5 rounded-xl bg-secondary-container px-4 py-2 text-body-sm font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {variations || generate.isError ? 'Generate again' : 'Generate variations'}
          </button>
        </div>
      </div>
    </dialog>
  )
}