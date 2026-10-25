import { Plus, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { WelcomeSummary } from '../types'
import { Trans, useTranslation } from 'react-i18next'

export function WelcomeHero({ userName, activeTests, modelCount, efficiencyGain }: WelcomeSummary) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-between gap-space-md overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-xl md:flex-row md:items-center"
    >
      {/* وهج الخلفية */}
      <div className="pointer-events-none absolute -end-16 -top-16 size-80 rounded-full bg-secondary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 start-1/3 size-60 rounded-full bg-primary-container/10 blur-2xl" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-1">
        <div data-reveal className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary-container/40 px-2 py-0.5 text-label-sm font-semibold uppercase tracking-widest text-secondary">
            {t('dashboard.hero.badge')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2 py-0.5 font-code-md text-label-sm text-on-surface-variant">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Cluster v3.8.1
          </span>
        </div>
        <h1
          data-reveal
          className="mt-1 font-headline-lg text-headline-lg tracking-tight text-on-surface"
        >
          {t('dashboard.hero.title', { name: userName })} <span className="text-tertiary">✨</span>
        </h1>
        <p data-reveal className="text-body-md leading-relaxed text-on-surface-variant">
          <Trans
            i18nKey="dashboard.hero.summary"
            values={{ activeTests, modelCount, efficiencyGain }}
            components={{
              tests: <span className="font-semibold text-on-surface" />,
              gain: <span className="font-semibold text-primary" />,
            }}
          />
        </p>
      </div>

      <div data-reveal className="relative z-10 flex shrink-0 flex-wrap items-center gap-space-sm">
        <button
          type="button"
          className="group flex items-center gap-2 rounded-lg bg-surface-container px-space-md py-2.5 text-body-md font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-container-high hover:shadow-md"
        >
          <SlidersHorizontal className="size-[18px] text-secondary transition-transform duration-300 group-hover:rotate-45" />
          {t('dashboard.hero.optimize')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/editor')}
          className="group flex items-center gap-2 rounded-lg bg-linear-to-r from-inverse-primary via-secondary-container to-secondary-container px-space-lg py-2.5 text-body-md font-semibold text-on-surface shadow-lg shadow-secondary-container/30 transition-all hover:scale-[1.02] hover:shadow-secondary-container/60 active:scale-[0.98]"
        >
          <Plus className="size-5 transition-transform group-hover:rotate-90" />
          {t('dashboard.hero.newPrompt')}
        </button>
      </div>
    </section>
  )
}