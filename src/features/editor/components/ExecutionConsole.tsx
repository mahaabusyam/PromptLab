import { useEffect, useRef } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
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
      <span className={`text-title-md font-semibold ${tone}`}>{value}</span>
    </div>
  )
}

export function ExecutionConsole({ status, result, modelName, temperature, maxTokens }: ExecutionConsoleProps) {
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
      title="Execution Console"
      action={
        <button
          type="button"
          aria-label="Copy output"
          disabled={!ready}
          onClick={() => result && copy(result.output)}
          className="rounded-lg bg-surface-container-high p-1.5 text-outline transition-colors hover:bg-surface-bright hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Latency" value={ready ? `${result.latencyMs}ms` : '—'} tone="text-primary" />
        <Metric label="Cost" value={ready ? `$${result.costUsd.toFixed(4)}` : '—'} tone="text-tertiary" />
        <Metric label="Tokens" value={ready ? `~${result.inputTokens + result.outputTokens}` : '—'} tone="text-on-surface" />
      </div>

      <div role="status" aria-live="polite" className="contents">
        {status === 'idle' && (
          <p className="rounded-lg bg-surface-container-lowest p-space-sm text-body-sm text-outline shadow-inner">
            Press <strong className="text-on-surface">Run Test</strong> to preview the final prompt with
            your variable values injected.
          </p>
        )}
        {status === 'running' && (
          <p className="animate-pulse rounded-lg bg-surface-container-lowest p-space-sm text-body-sm text-on-surface-variant shadow-inner">
            Running simulation…
          </p>
        )}
      </div>

      {ready && (
        <div ref={outputRef} className="flex flex-col gap-space-xs">
          <div
            data-lenis-prevent
            className="flex max-h-56 flex-col gap-space-xs overflow-y-auto rounded-lg border-l-2 border-primary bg-surface-container-lowest p-space-sm text-body-sm leading-relaxed text-on-surface-variant shadow-inner"
          >
            <div className="flex items-center justify-between gap-2 border-b border-surface-variant/40 pb-1 font-code-md text-[11px] text-outline">
              <span>[SIMULATED • no AI model was called]</span>
              <span className="font-semibold text-tertiary-fixed">Resolved prompt</span>
            </div>
            <p className="whitespace-pre-wrap break-words text-on-surface">{result.output}</p>
          </div>

          {result.unresolved.length > 0 && (
            <p className="text-label-sm text-outline">
              No value for:{' '}
              {result.unresolved.map((name) => (
                <span key={name} className="variable-chip mr-1">{`{{${name}}}`}</span>
              ))}
            </p>
          )}
          <p className="text-label-sm text-outline">
            {modelName} · temp {temperature.toFixed(2)} · max {maxTokens.toLocaleString()}
          </p>
        </div>
      )}
    </EditorCard>
  )
}