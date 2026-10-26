import { Check, Copy, Loader2, Split, TriangleAlert } from 'lucide-react'
import { useId, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { formatNumber } from '@/i18n/format'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { DEFAULT_AI_OPTIONS } from '../constants'
import { getAiErrorMessage } from '../errors'
import { formatVariableList } from '../formatVariables'
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
  const { t } = useTranslation()
  const { copied, copy } = useCopyToClipboard()
  const check = compareVariables(original, text)
  const hasWarning = check.missing.length > 0 || check.added.length > 0
  const number = index + 1

  return (
    <li className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-3">
      <h3 className="text-label-md font-semibold text-primary">{t('ai.variations.item', { number })}</h3>

      {hasWarning && (
        <p role="status" className="flex items-start gap-2 text-label-sm text-on-surface-variant">
          <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-tertiary" />
          <span>
            {check.missing.length > 0 && (
              <>
                <Trans
                  i18nKey="ai.variations.removed"
                  values={{ vars: formatVariableList(check.missing) }}
                  components={{ vars: <bdi dir="ltr" className="font-mono" /> }}
                />{' '}
              </>
            )}
            {check.added.length > 0 && (
              <Trans
                i18nKey="ai.variations.added"
                values={{ vars: formatVariableList(check.added) }}
                components={{ vars: <bdi dir="ltr" className="font-mono" /> }}
              />
            )}
          </span>
        </p>
      )}

      <pre
        dir="auto"
        data-lenis-prevent
        tabIndex={0}
        aria-label={t('ai.variations.itemText', { number })}
        className="max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-container p-3 text-body-sm"
      >
        {text}
      </pre>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(text)}
          aria-label={t('ai.variations.copyLabel', { number })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-1.5 text-label-md transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
        >
          {copied ? <Check aria-hidden className="size-4 text-primary" /> : <Copy aria-hidden className="size-4" />}
          {copied ? t('ai.variations.copied') : t('ai.variations.copy')}
        </button>
        <button
          type="button"
          onClick={() => onUse(text)}
          aria-label={t('ai.variations.useLabel', { number })}
          className="rounded-lg bg-secondary-container px-3 py-1.5 text-label-md font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95"
        >
          {t('ai.variations.use')}
        </button>
      </div>
    </li>
  )
}

export function VariationsDialog({ prompt, onUse, onClose }: VariationsDialogProps) {
  const { t } = useTranslation()
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
            {t('ai.variations.title')}
          </h2>
        </div>

        <AiOptionsFields value={options} onChange={setOptions} />

        {tooLong && (
          <p role="alert" className="text-body-sm text-error">
            {t('ai.tooLong', {
              length: formatNumber(prompt.length),
              limit: formatNumber(MAX_AI_PROMPT_CHARS),
            })}
          </p>
        )}

        {generate.isPending && (
          <p role="status" className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            {t('ai.variations.working')}
          </p>
        )}

        {generate.isError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-error-container px-3 py-2 text-body-sm text-on-error-container"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {getAiErrorMessage(generate.error)}
          </p>
        )}

        {variations && (
          <div className="flex flex-col gap-space-sm">
            <ol className="flex flex-col gap-space-sm">
              {variations.map((text, index) => (
                <VariationCard
                  key={`${index}-${text.slice(0, 24)}`}
                  index={index}
                  original={prompt}
                  text={text}
                  onUse={onUse}
                />
              ))}
            </ol>
            <p className="text-label-sm text-outline">{t('ai.variations.note')}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
          >
            {t('common.close')}
          </button>
          <button
            type="button"
            onClick={run}
            disabled={generate.isPending || tooLong}
            className="inline-flex items-center gap-1.5 rounded-xl bg-secondary-container px-4 py-2 text-body-sm font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {variations || generate.isError ? t('ai.variations.generateAgain') : t('ai.variations.generate')}
          </button>
        </div>
      </div>
    </dialog>
  )
}