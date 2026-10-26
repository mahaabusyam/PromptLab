import { Download, Heart, Library } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { downloadTextFile } from '@/features/compare/exportDiff';
import { buildFavoritesExport } from '../exportFavorites';
import type { FavoriteEntry } from '../types';

interface FavoritesHeaderProps {
  entries: FavoriteEntry[];
}

export function FavoritesHeader({ entries }: FavoritesHeaderProps) {
  const { t } = useTranslation();

  function handleExport(): void {
    const file = buildFavoritesExport(entries);
    downloadTextFile(
      `promptlab-favorites-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(file, null, 2),
    );
  }

  return (
    <header data-enter className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight">{t('favorites.header.title')}</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-primary">
            <Heart className="size-3.5 fill-pink-500 text-pink-500" aria-hidden="true" />
            {t('favorites.header.starred', { total: entries.length })}
          </span>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{t('favorites.header.subtitle')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={entries.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden="true" />
          {t('favorites.header.export')}
        </button>
        <Link
          to="/library"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Library className="size-4" aria-hidden="true" />
          {t('favorites.header.browse')}
        </Link>
      </div>
    </header>
  );
}