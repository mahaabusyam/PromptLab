import { Brain, Braces, Coins } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/i18n/format';
import { providerLabels } from '@/features/prompts/constants';
import type { FavoriteStats } from '../types';

interface FavoritesStatsProps {
  stats: FavoriteStats;
}

interface Tile {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

export function FavoritesStats({ stats }: FavoritesStatsProps) {
  const { t } = useTranslation();
  const tiles: Tile[] = [
    {
      key: 'tokens',
      label: t('favorites.stats.tokens'),
      value: formatNumber(stats.totalTokens),
      hint: t('favorites.stats.tokensHint'),
      icon: Coins,
    },
    {
      key: 'vars',
      label: t('favorites.stats.variables'),
      value: String(stats.distinctVariables),
      hint: t('favorites.stats.variablesHint'),
      icon: Braces,
    },
    {
      key: 'model',
      label: t('favorites.stats.model'),
      value: stats.primaryProvider ? providerLabels[stats.primaryProvider.provider] : '–',
      hint: stats.primaryProvider
        ? t('favorites.stats.modelHint', { percent: stats.primaryProvider.percent })
        : t('favorites.stats.modelNone'),
      icon: Brain,
    },
  ];

  return (
    <div data-enter className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card/60 p-3 sm:grid-cols-3">
      {tiles.map(({ key, label, value, hint, icon: Icon }) => (
        <section key={key} className="flex items-center gap-4 rounded-lg bg-background/60 px-4 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-semibold">{value}</span>
              <span className="truncate text-xs text-muted-foreground">{hint}</span>
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}