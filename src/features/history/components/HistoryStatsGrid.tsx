import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { TFunction } from 'i18next';
import { GitCommitHorizontal, RotateCcw, Layers, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { HistoryStats } from '../types';

interface HistoryStatsGridProps {
  stats: HistoryStats;
}

interface KpiCard {
  key: string;
  label: string;
  value: string;
  hint: string | null;
  icon: LucideIcon;
  tone: 'primary' | 'danger' | 'secondary' | 'accent';
}

const toneClasses: Record<KpiCard['tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  danger: 'bg-red-500/10 text-red-500',
  secondary: 'bg-violet-500/10 text-violet-500',
  accent: 'bg-pink-500/10 text-pink-500',
};

function buildCards(stats: HistoryStats, t: TFunction): KpiCard[] {
  const trend =
    stats.commitsTrend === null
      ? null
      : t('history.stats.trend', { value: `${stats.commitsTrend >= 0 ? '+' : ''}${stats.commitsTrend}` });

  return [
    { key: 'commits', label: t('history.stats.commits'), value: String(stats.totalCommits), hint: trend, icon: GitCommitHorizontal, tone: 'primary' },
    { key: 'rollbacks', label: t('history.stats.rollbacks'), value: String(stats.rollbacks), hint: null, icon: RotateCcw, tone: 'danger' },
    { key: 'prompts', label: t('history.stats.prompts'), value: String(stats.promptsVersioned), hint: null, icon: Layers, tone: 'secondary' },
    { key: 'daily', label: t('history.stats.daily'), value: String(stats.avgDaily), hint: t('history.stats.last30'), icon: Activity, tone: 'accent' },
  ];
}

export function HistoryStatsGrid({ stats }: HistoryStatsGridProps) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const cards = buildCards(stats, t);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-kpi]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, value, hint, icon: Icon, tone }) => (
        <section key={key} data-kpi className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <span className={`flex size-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </section>
      ))}
    </div>
  );
}