import { LayoutGrid, List, Search, X } from 'lucide-react';
import { providerLabels } from '@/features/prompts/constants';
import type { ModelProvider } from '@/features/prompts/types';
import { favoriteSortLabels } from '../constants';
import { hasActiveFavoriteFilters } from '../filterFavorites';
import type { FavoriteFilters, FavoriteSort, FavoriteTab, FavoriteView } from '../types';

interface FavoritesToolbarProps {
  filters: FavoriteFilters;
  counts: Record<FavoriteTab, number>;
  onChange: (patch: Partial<FavoriteFilters>) => void;
  onReset: () => void;
  view: FavoriteView;
  onViewChange: (view: FavoriteView) => void;
}

const tabs: { value: FavoriteTab; label: string }[] = [
  { value: 'all', label: 'All Favorites' },
  { value: 'prompt', label: 'Favorite Prompts' },
  { value: 'template', label: 'Favorite Templates' },
];

const views = [
  { value: 'grid' as const, label: 'Grid view', icon: LayoutGrid },
  { value: 'list' as const, label: 'List view', icon: List },
];

const providerKeys = Object.keys(providerLabels) as ModelProvider[];
const sortKeys = Object.keys(favoriteSortLabels) as FavoriteSort[];

const selectClass =
  'h-10 rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary';

export function FavoritesToolbar({ filters, counts, onChange, onReset, view, onViewChange }: FavoritesToolbarProps) {
  return (
    <div data-enter className="space-y-3 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search favorites by title, variable, model or tag..."
            aria-label="Search favorites"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by model"
            value={filters.provider}
            onChange={(e) => onChange({ provider: e.target.value as ModelProvider | 'all' })}
            className={selectClass}
          >
            <option value="all">All models</option>
            {providerKeys.map((p) => (
              <option key={p} value={p}>{providerLabels[p]}</option>
            ))}
          </select>

          <select
            aria-label="Sort favorites"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as FavoriteSort })}
            className={selectClass}
          >
            {sortKeys.map((s) => (
              <option key={s} value={s}>Sort by: {favoriteSortLabels[s]}</option>
            ))}
          </select>

          <div className="inline-flex rounded-lg border border-border bg-background p-0.5" role="group" aria-label="View mode">
            {views.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={view === value}
                onClick={() => onViewChange(value)}
                className={`rounded-md p-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                  view === value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
        {tabs.map(({ value, label }) => {
          const active = filters.tab === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ tab: value })}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${active ? 'bg-black/20' : 'bg-muted'}`}>
                {counts[value]}
              </span>
            </button>
          );
        })}

        {hasActiveFavoriteFilters(filters) && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}