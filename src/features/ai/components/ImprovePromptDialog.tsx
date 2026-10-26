import { Loader2, Sparkles, TriangleAlert } from 'lucide-react'
import { useId, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { formatNumber } from '@/i18n/format'
import { DEFAULT_AI_OPTIONS } from '../constants'
import { getAiErrorMessage } from '../errors'
import { formatVariableList } from '../formatVariables'
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
  const { t } = useTranslation()
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
            {t('ai.improve.title')}
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

        {improve.isPending && (
          <p role="status" className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            {t('ai.improve.working')}
          </p>
        )}

        {improve.isError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-error-container px-3 py-2 text-body-sm text-on-error-container"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {getAiErrorMessage(improve.error)}
          </p>
        )}

        {improved && (
          <div className="flex flex-col gap-space-sm">
            {hasVariableWarning && check && (
              <p
                role="status"
                className="flex items-start gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-body-sm"
              >
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-tertiary" />
                <span>
                  {check.missing.length > 0 && (
                    <>
                      <Trans
                        i18nKey="ai.improve.removed"
                        values={{ vars: formatVariableList(check.missing) }}
                        components={{ vars: <bdi dir="ltr" className="font-mono" /> }}
                      />{' '}
                    </>
                  )}
                  {check.added.length > 0 && (
                    <>
                      <Trans
                        i18nKey="ai.improve.added"
                        values={{ vars: formatVariableList(check.added) }}
                        components={{ vars: <bdi dir="ltr" className="font-mono" /> }}
                      />{' '}
                    </>
                  )}
                  {t('ai.improve.review')}
                </span>
              </p>
            )}

            <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
              <section aria-label={t('ai.improve.originalLabel')}>
                <h3 className="mb-1.5 text-label-sm text-on-surface-variant">{t('ai.improve.original')}</h3>
                <pre
                  dir="auto"
                  data-lenis-prevent
                  tabIndex={0}
                  className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-container-low p-3 text-body-sm"
                >
                  {prompt}
                </pre>
              </section>
              <section aria-label={t('ai.improve.suggestedLabel')}>
                <h3 className="mb-1.5 text-label-sm text-primary">{t('ai.improve.suggested')}</h3>
                <pre
                  dir="auto"
                  data-lenis-prevent
                  tabIndex={0}
                  className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-surface-container-low p-3 text-body-sm ring-1 ring-primary/40"
                >
                  {improved}
                </pre>
              </section>
            </div>
            <p className="text-label-sm text-outline">{t('ai.improve.note')}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={run}
            disabled={improve.isPending || tooLong}
            className="inline-flex items-center gap-1.5 rounded-xl bg-surface-container-high px-4 py-2 text-body-sm font-medium transition-[background-color,scale] hover:bg-surface-bright active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {improved || improve.isError ? t('ai.improve.tryAgain') : t('ai.improve.run')}
          </button>
          {improved && (
            <button
              type="button"
              onClick={() => onApply(improved)}
              className="rounded-xl bg-secondary-container px-4 py-2 text-body-sm font-semibold text-on-secondary-container transition-[filter,scale] hover:brightness-110 active:scale-95"
            >
              {t('ai.improve.apply')}
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}