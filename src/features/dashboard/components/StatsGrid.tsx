import { Network, SquareTerminal, Star, TrendingUp, Zap } from 'lucide-react'
import { Sparkline } from '@/components/common/Sparkline'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { DashboardStats } from '../types'
import { toneBg } from '../tones'
import { StatCard } from './StatCard'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/i18n/format'


const valueClass =
  'font-display-hero-mobile text-display-hero-mobile tracking-tight text-on-surface'

interface StatsGridProps {
  stats: DashboardStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()
  const { totalPrompts, favorites, projects, savedTime } = stats

  return (
    <section ref={ref} className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Prompts */}
      <StatCard  label={t('dashboard.stats.totalPrompts')} icon={SquareTerminal}>
        <div className="my-space-sm">
          <div className={valueClass}>{formatNumber(totalPrompts.value)}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-surface-container-highest px-2 py-0.5 text-label-sm font-semibold text-primary">
              <TrendingUp className="size-3.5" /> +{totalPrompts.newThisMonth}
</span>
<span className="text-label-sm text-outline">{t('dashboard.stats.newThisMonth')}</span>
          </div>
        </div>
        <Sparkline values={totalPrompts.trend} className="text-primary" />
      </StatCard>

      {/* 2. Favorite Prompts */}
      <StatCard label={t('dashboard.stats.favorites')} icon={Star} iconClassName="text-tertiary" iconFilled>
        <div className="my-space-sm">
          <div className={valueClass}>{favorites.value}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-tertiary" />
            <span className="text-label-sm font-medium text-on-surface-variant">
                {t('dashboard.stats.shareOfLibrary', { percent: favorites.shareOfLibraryPercent })}
            </span>
          </div>
        </div>
        <div className="pt-2">
          <div className="mb-1.5 flex justify-between text-label-sm text-outline">
            <span>{t('dashboard.stats.productionReady')}</span>
            <span className="font-semibold text-on-surface">{favorites.productionReadyPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-linear-to-r from-tertiary-container to-tertiary"
              style={{ width: `${favorites.productionReadyPercent}%` }}
            />
          </div>
        </div>
      </StatCard>

      {/* 3. Active Projects */}
      <StatCard label={t('dashboard.stats.projects')} icon={Network} iconClassName="text-secondary">
        <div className="my-space-sm">
          <div className={valueClass}>{projects.value}</div>
          <div className="mt-1 text-label-sm text-on-surface-variant">
            {t('dashboard.stats.subfolders', { total: projects.subfolderCount })}
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-surface-container-highest">
            {projects.modelSplit.map((m) => (
              <div
                key={m.label}
                className={`h-full rounded-sm ${toneBg[m.tone]}`}
                style={{ width: `${m.percent}%` }}
                title={`${m.label} (${m.percent}%)`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-0.5 text-label-sm text-outline">
            {projects.modelSplit.map((m) => (
              <span key={m.label} className="flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${toneBg[m.tone]}`} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </StatCard>

      {/* 4. Saved Time */}
      <StatCard label={t('dashboard.stats.savedTime')} icon={Zap} iconClassName="text-primary-fixed-dim">
        <div className="my-space-sm">
          <div className="flex items-baseline gap-2">
            <span className={valueClass}>{savedTime.hours}</span>
            <span className="text-title-md font-normal text-on-surface-variant">{t('dashboard.stats.hours')}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-label-sm font-semibold text-secondary">
              {t('dashboard.stats.estRoi', { value: savedTime.estimatedRoi })}
            </span>
            <span className="text-label-sm text-outline">{t('dashboard.stats.thisCycle')}</span>
          </div>
        </div>
        <Sparkline values={savedTime.trend} className="text-secondary" />
      </StatCard>
    </section>
  )
}