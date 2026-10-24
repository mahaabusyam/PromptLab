import { formatDistanceToNow } from 'date-fns';
import type { FavoriteEntry } from '../types';
import { handleHotkey } from '../handleHotkey';
import { FavoriteActions, FavoriteHeart, KindBadge } from './FavoriteParts';
import type { FavoriteHandlers } from './FavoriteParts';

interface FavoriteRowProps extends FavoriteHandlers {
  entry: FavoriteEntry;
}

export function FavoriteRow({ entry, onToggle, onUse, onPreview }: FavoriteRowProps) {
  return (
    <li
      data-card
      onKeyDown={(e) => handleHotkey(e, entry, onToggle)}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40 focus-within:border-primary/40"
    >
      <FavoriteHeart entry={entry} onToggle={onToggle} />
      <KindBadge entry={entry} />

      <div className="min-w-48 flex-1">
        <h3 className="truncate font-heading text-sm font-semibold">{entry.title}</h3>
        <p className="truncate text-xs text-muted-foreground">{entry.description}</p>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{entry.modelName}</span>
        <span className="font-mono">~{entry.tokens} tok</span>
        <span>{entry.variables.length} vars</span>
        {entry.updatedAt && <span>{formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}</span>}
      </p>

      <FavoriteActions entry={entry} onUse={onUse} onPreview={onPreview} />
    </li>
  );
}