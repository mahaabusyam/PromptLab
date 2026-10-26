import { useTranslation } from 'react-i18next';
import { formatUpdated } from '@/utils/dates';
import type { FavoriteEntry } from '../types';
import { handleHotkey } from '../handleHotkey';
import { FavoriteActions, FavoriteHeart, KindBadge } from './FavoriteParts';
import type { FavoriteHandlers } from './FavoriteParts';

interface FavoriteRowProps extends FavoriteHandlers {
  entry: FavoriteEntry;
}

export function FavoriteRow({ entry, onToggle, onUse, onPreview }: FavoriteRowProps) {
  const { t } = useTranslation();

  return (
    <li
      data-card
      onKeyDown={(e) => handleHotkey(e, entry, onToggle)}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40 focus-within:border-primary/40"
    >
      <FavoriteHeart entry={entry} onToggle={onToggle} />
      <KindBadge entry={entry} />

      <div className="min-w-48 flex-1">
        <h3 dir="auto" className="truncate font-heading text-sm font-semibold">{entry.title}</h3>
        <p dir="auto" className="truncate text-xs text-muted-foreground">{entry.description}</p>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{entry.modelName}</span>
        <span className="font-mono">{t('favorites.item.tokensShort', { total: entry.tokens })}</span>
        <span>{t('favorites.item.varsShort', { total: entry.variables.length })}</span>
        {entry.updatedAt && <span>{formatUpdated(new Date(entry.updatedAt).toISOString())}</span>}
      </p>

      <FavoriteActions entry={entry} onUse={onUse} onPreview={onPreview} />
    </li>
  );
}