import { useEffect, useRef } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { gsap } from '@/utils/gsap'
import type { RunResult } from '../simulateRun'
import type { RunStatus } from '../types'
import { EditorCard } from './EditorCard'

interface ExecutionConsoleProps {
  status: RunStatus
  result: RunResult | null
  modelName: string
  temperature: number
  maxTokens: number
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg bg-surface-container-lowest p-2 text-center shadow-inner">
      <span className="block text-label-sm text-outline">{label}</span>
      <span dir="ltr" className={`inline-block text-title-md font-semibold ${tone}`}>
        {value}
      </span>
    </div>
  )
}

export function ExecutionConsole({ status, result, modelName, temperature, maxTokens }: ExecutionConsoleProps) {
  const { t } = useTranslation()
  const { copied, copy } = useCopyToClipboard()
  const outputRef = useRef<HTMLDivElement>(null)

  // أنيميشن GSAP لظهور النتيجة
  useEffect(() => {
    const el = outputRef.current
    if (status !== 'done' || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' },
    )
    return () => {
      tween.kill()
    }
  }, [status, result])

  const ready = status === 'done' && result

  return (
    <EditorCard
      icon={Terminal}
      title={t('editor.console.title')}
      action={
        <button
          type="button"
          aria-label={t('editor.console.copy')}
          disabled={!ready}
          onClick={() => result && copy(result.output)}
          className="rounded-lg bg-surface-container-high p-1.5 text-outline transition-colors hover:bg-surface-bright hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <Metric
          label={t('editor.console.latency')}
          value={ready ? `${result.latencyMs}ms` : '—'}
          tone="text-primary"
        />
        <Metric
          label={t('editor.console.cost')}
          value={ready ? `$${result.costUsd.toFixed(4)}` : '—'}
          tone="text-tertiary"
        />
        <Metric
          label={t('editor.console.tokens')}
          value={ready ? `~${result.inputTokens + result.outputTokens}` : '—'}
          tone="text-on-surface"
        />
      </div>

      <div role="status" aria-live="polite" className="contents">
        {status === 'idle' && (
          <p className="rounded-lg bg-surface-container-lowest p-space-sm text-body-sm text-outline shadow-inner">
            <Trans
              i18nKey="editor.console.idle"
              components={{ strong: <strong className="text-on-surface" /> }}
            />
          </p>
        )}
        {status === 'running' && (
          <p className="animate-pulse rounded-lg bg-surface-container-lowest p-space-sm text-body-sm text-on-surface-variant shadow-inner">
            {t('editor.console.running')}
          </p>
        )}
      </div>

      {ready && (
        <div ref={outputRef} className="flex flex-col gap-space-xs">
          <div
            data-lenis-prevent
            className="flex max-h-56 flex-col gap-space-xs overflow-y-auto rounded-lg border-s-2 border-primary bg-surface-container-lowest p-space-sm text-body-sm leading-relaxed text-on-surface-variant shadow-inner"
          >
            <div className="flex items-center justify-between gap-2 border-b border-surface-variant/40 pb-1 font-code-md text-[11px] text-outline">
              <span>{t('editor.console.simulated')}</span>
              <span className="font-semibold text-tertiary-fixed">{t('editor.console.resolved')}</span>
            </div>
            <p dir="auto" className="whitespace-pre-wrap break-words text-on-surface">
              {result.output}
            </p>
          </div>

          {result.unresolved.length > 0 && (
            <p className="text-label-sm text-outline">
              {t('editor.console.noValueFor')}{' '}
              {result.unresolved.map((name) => (
                <span key={name} dir="ltr" className="variable-chip me-1">{`{{${name}}}`}</span>
              ))}
            </p>
          )}
          <p className="text-label-sm text-outline">
            {t('editor.console.footer', {
              model: modelName,
              temp: temperature.toFixed(2),
              max: maxTokens.toLocaleString('en-US'),
            })}
          </p>
        </div>
      )}
    </EditorCard>
  )
}