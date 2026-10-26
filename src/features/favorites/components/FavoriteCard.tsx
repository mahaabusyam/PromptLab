import { useTranslation } from 'react-i18next';
import { categoryLabels, statusLabels } from '@/features/prompts/constants';
import { complexityLabels } from '@/features/templates/constants';
import { formatUpdated } from '@/utils/dates';
import type { FavoriteEntry } from '../types';
import { FavoriteActions, FavoriteHeart, KindBadge } from './FavoriteParts';
import type { FavoriteHandlers } from './FavoriteParts';
import { handleHotkey } from '../handleHotkey';

interface FavoriteCardProps extends FavoriteHandlers {
  entry: FavoriteEntry;
}

export function FavoriteCard({ entry, onToggle, onUse, onPreview }: FavoriteCardProps) {
  const { t } = useTranslation();
  const shownVars = entry.variables.slice(0, 3);
  const extraVars = entry.variables.length - shownVars.length;

  const meta =
    entry.kind === 'prompt'
      ? `${entry.versionLabel ?? ''} • ${statusLabels[entry.status]}`
      : complexityLabels[entry.template.complexity].split(' (')[0];

  return (
    <article
      data-card
      onKeyDown={(e) => handleHotkey(e, entry, onToggle)}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 focus-within:border-primary/40"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <KindBadge entry={entry} />
            <span dir="auto" className="truncate font-mono text-xs text-muted-foreground">{meta}</span>
          </div>
          <FavoriteHeart entry={entry} onToggle={onToggle} />
        </div>

        <div>
          <h3 dir="auto" className="font-heading text-base font-semibold transition-colors group-hover:text-primary">
            {entry.title}
          </h3>
          <p dir="auto" className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.description}</p>
        </div>

        {entry.kind === 'prompt' ? (
          <div className="space-y-1.5 rounded-xl bg-background/70 p-3">
            <p className="flex justify-between gap-2 text-[11px] uppercase text-muted-foreground">
              <span>{t('favorites.item.variablesInjected')}</span>
              <span>{t('favorites.item.tokensShort', { total: entry.tokens })}</span>
            </p>
            {shownVars.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('favorites.item.noVariables')}</p>
            ) : (
              <ul className="flex flex-wrap gap-1 font-mono text-xs">
                {shownVars.map((v) => (
                  <li key={v} dir="ltr" className="rounded bg-muted px-1.5 py-0.5 text-primary">{`{{${v}}}`}</li>
                ))}
                {extraVars > 0 && (
                  <li dir="ltr" className="px-1 py-0.5 text-muted-foreground">+{extraVars}</li>
                )}
              </ul>
            )}
          </div>
        ) : (
          <dl className="grid grid-cols-3 gap-2 rounded-xl bg-background/70 p-2 text-center">
            <div className="rounded-lg bg-muted/50 p-1.5">
              <dd className="font-heading text-base font-semibold text-primary">~{entry.tokens}</dd>
              <dt className="text-[11px] text-muted-foreground">{t('favorites.item.tokens')}</dt>
            </div>
            <div className="rounded-lg bg-muted/50 p-1.5">
              <dd className="font-heading text-base font-semibold">{entry.variables.length}</dd>
              <dt className="text-[11px] text-muted-foreground">{t('favorites.item.variables')}</dt>
            </div>
            <div className="rounded-lg bg-muted/50 p-1.5">
              <dd className="truncate font-heading text-base font-semibold">
                {categoryLabels[entry.template.category]}
              </dd>
              <dt className="text-[11px] text-muted-foreground">{t('favorites.item.category')}</dt>
            </div>
          </dl>
        )}

        {entry.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map((tag) => (
              <li key={tag} dir="auto" className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <p className="flex min-w-0 items-center gap-2 text-xs">
          <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="truncate font-semibold">{entry.modelName}</span>
          {entry.updatedAt && (
            <span className="shrink-0 text-muted-foreground">
              • {formatUpdated(new Date(entry.updatedAt).toISOString())}
            </span>
          )}
        </p>
        <FavoriteActions entry={entry} onUse={onUse} onPreview={onPreview} />
      </div>
    </article>
  );
}