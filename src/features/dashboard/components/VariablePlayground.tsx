import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CheckCheck, ChevronDown, Code, Gauge, LoaderCircle, Play, X } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { gsap } from '@/utils/gsap'
import { extractVariables, fillTemplate, splitTemplate } from '@/utils/promptVariables'
import { estimateCostUsd, estimateTokens } from '@/utils/tokens'
import type { PlaygroundConfig } from '../types'
import { useTranslation } from 'react-i18next'

type RunStatus = 'idle' | 'running' | 'done'

const asTag = (name: string) => `{{${name}}}`

interface VariablePlaygroundProps {
  config: PlaygroundConfig
}

export function VariablePlayground({ config }: VariablePlaygroundProps) {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()
  const outputRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)

  const [values, setValues] = useState(config.defaultValues)
  const [status, setStatus] = useState<RunStatus>('idle')

  // كلها بتنحسب من النص والقيم، بدون state إضافي
  const variables = useMemo(() => extractVariables(config.template), [config.template])
  const segments = useMemo(() => splitTemplate(config.template), [config.template])
  const finalPrompt = useMemo(() => fillTemplate(config.template, values), [config.template, values])
  const tokens = estimateTokens(finalPrompt)
  const missingRequired = config.requiredVariables.some((name) => !values[name]?.trim())

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setStatus('idle') // النتيجة القديمة ما عادت تنطبق على النص الجديد
  }

  // محاكاة تشغيل (بدون API). بالمرحلة الأخيرة بنستبدلها باستدعاء حقيقي
  const runTest = () => {
    setStatus('running')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('done'), 900)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // حركة GSAP لظهور النتيجة
  useLayoutEffect(() => {
    if (status !== 'done' || !outputRef.current) return
    const tween = gsap.fromTo(
      outputRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
    }
  }, [status])

  return (
    <section
      ref={ref}
      className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-xl"
    >
      <div
        data-reveal
        className="flex items-center justify-between gap-2 bg-surface-container p-space-md"
      >
        <div className="flex items-center gap-2">
          <span className="size-2.5 animate-pulse rounded-full bg-primary" />
          <h2 className="text-title-md text-on-surface">{t('dashboard.playground.title')}</h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-surface-container-highest px-2.5 py-1 text-label-sm text-on-surface transition-colors hover:bg-surface-bright"
        >
          <span className="size-1.5 rounded-full bg-secondary" />
          {config.modelName}
          <ChevronDown className="size-3.5 text-outline" />
        </button>
      </div>

      <div data-reveal className="flex flex-col gap-space-md p-space-md">
        {/* نص الـ Prompt مع المتغيرات كـ chips */}
        <div className="rounded-lg bg-surface-container-lowest p-space-sm shadow-inner">
          <div className="mb-1 flex items-center justify-end gap-1 text-label-sm text-outline">
            <Code className="size-3.5" />
             {t('dashboard.playground.promptTemplate')}
          </div>
          <p className="font-code-md text-code-md leading-relaxed text-on-surface-variant" dir="auto" >
            {segments.map((segment, i) =>
              segment.kind === 'text' ? (
                <span key={i}>{segment.text}</span>
              ) : (
                <span
                  key={i}
                  className={`rounded px-1.5 py-0.5 font-code-md font-semibold ${
                    config.requiredVariables.includes(segment.name)
                      ? 'bg-secondary-container/40 text-secondary'
                      : 'bg-primary-container/30 text-primary'
                  }`}
                >
                  {asTag(segment.name)}
                </span>
              ),
            )}
          </p>
        </div>

        {/* حقول المتغيرات */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between text-label-sm font-semibold uppercase tracking-wider text-outline">
            <span>{t('dashboard.playground.activeVariables')}</span>
            <span>{t('dashboard.playground.dynamicTags', { total: variables.length })}</span>
          </div>

          {variables.map((name) => (
            <div key={name} className="flex flex-col gap-1">
              <label
                htmlFor={`playground-${name}`}
                className="flex items-center justify-between font-mono text-label-sm text-secondary"
              >
                <span>{asTag(name)}</span>
                <span className="font-sans text-outline">
                  {config.requiredVariables.includes(name) ? t('dashboard.playground.required') : t('dashboard.playground.optional')}
                </span>
              </label>
              <input
                id={`playground-${name}`}
                type="text"
                value={values[name] ?? ''}
                onChange={(e) => handleChange(name, e.target.value)}
                className="w-full rounded-lg bg-surface-container-lowest px-3 py-1.5 text-body-sm text-on-surface shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        {/* التوكنز + زر التشغيل */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5 font-code-md text-label-sm text-outline">
            <Gauge className="size-4 text-primary" />
            <span>
              {t('dashboard.playground.tokens', { tokens, cost: estimateCostUsd(tokens).toFixed(4) })}
            </span>
          </div>
          <button
            type="button"
            onClick={runTest}
            disabled={missingRequired || status === 'running'}
            className="flex items-center gap-2 rounded-lg bg-linear-to-r from-inverse-primary to-secondary-container px-space-md py-2 text-body-sm font-semibold text-on-surface shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {status === 'running' ? (
              <LoaderCircle className="size-[18px] animate-spin" />
            ) : (
              <Play className="size-[18px]" />
            )}
            {status === 'running' ? t('dashboard.playground.running') : t('dashboard.playground.run')}
          </button>
        </div>

        {missingRequired && (
          <p className="text-label-sm text-error">{t('dashboard.playground.fillRequired')}</p>
        )}

        {status === 'done' && (
          <div
            ref={outputRef}
            role="status"
            className="flex flex-col gap-2 rounded-lg border-s-2 border-primary bg-surface-container-lowest p-space-sm font-code-md text-label-sm text-on-surface-variant"
          >
            <div className="flex items-center justify-between text-outline">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <CheckCheck className="size-3.5" />
                {t('dashboard.playground.simulated', { ms: 264 })}
              </span>
              <button
                type="button"
                aria-label={t('dashboard.playground.closeOutput')}
                onClick={() => setStatus('idle')}
                className="transition-colors hover:text-on-surface"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p className="italic text-on-surface" dir="auto" >“{config.simulatedOutput}”</p>
          </div>
        )}
      </div>
    </section>
  )
}