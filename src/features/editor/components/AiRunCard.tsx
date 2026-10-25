import { Check, Copy, Loader2, Sparkles, TriangleAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { getAiErrorMessage } from '@/features/ai/errors'
import type { AiError } from '@/features/ai/errors'
import type { RunResponse } from '@/features/ai/types'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { gsap } from '@/utils/gsap'
import { EditorCard } from './EditorCard'

interface AiRunCardProps {
  hasContent: boolean
  unresolved: string[] // variables without a value
  isPending: boolean
  error: AiError | null
  data: RunResponse | undefined
  onRun: () => void
}

export function AiRunCard({ hasContent, unresolved, isPending, error, data, onRun }: AiRunCardProps) {
  const { copied, copy } = useCopyToClipboard()
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = outputRef.current
    if (!data || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
    )
    return () => {
      tween.kill()
    }
  }, [data])

  const blocked = !hasContent || unresolved.length > 0
  const hint = !hasContent
    ? 'Write some prompt text first.'
    : unresolved.length > 0
      ? `Fill in values for ${unresolved.map((n) => `{{${n}}}`).join(', ')} first.`
      : null

  return (
    <EditorCard
      icon={Sparkles}
      title="Run with AI"
      action={
        <button
          type="button"
          aria-label="Copy AI answer"
          disabled={!data}
          onClick={() => data && copy(data.output)}
          className="rounded-lg bg-surface-container-high p-1.5 text-outline transition-colors hover:bg-surface-bright hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
      }
    >
      <button
        type="button"
        onClick={onRun}
        disabled={blocked || isPending}
        aria-busy={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary-container px-4 py-2 text-body-sm font-semibold text-on-secondary-container shadow-lg transition-[filter,scale] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      >
        {isPending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Sparkles aria-hidden className="size-4" />}
        {isPending ? 'Waiting for the model…' : 'Run with AI'}
      </button>

      <p className="text-label-sm text-outline">
         {hint ?? 'Sends the final prompt (with your variable values) to the app’s AI model, not the model selected above. Uses API quota.'}
      </p>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-error-container px-3 py-2 text-body-sm text-on-error-container">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {getAiErrorMessage(error)}
        </p>
      )}

      {data && (
        <div ref={outputRef} className="flex flex-col gap-space-xs">
          <div
            data-lenis-prevent
            className="flex max-h-64 flex-col gap-space-xs overflow-y-auto rounded-lg border-s-2 border-tertiary bg-surface-container-lowest p-space-sm text-body-sm leading-relaxed shadow-inner"
          >
            <span className="border-b border-surface-variant/40 pb-1 font-code-md text-[11px] text-outline">
              [LIVE • real model response]
            </span>
            <p className="whitespace-pre-wrap break-words text-on-surface">{data.output}</p>
          </div>
          <p className="text-label-sm text-outline">
            {data.model} · {(data.latencyMs / 1000).toFixed(1)}s
            {data.inputTokens !== undefined && data.outputTokens !== undefined
              ? ` · ${data.inputTokens} in / ${data.outputTokens} out tokens`
              : ''}
          </p>
        </div>
      )}
    </EditorCard>
  )
}