import { LayoutList, Search, Table2, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { hasActiveFilters } from '../filterHistory';
import type { HistoryFilters, HistoryKind, HistoryRange, HistoryView } from '../types';

interface PromptOption {
  id: string;
  title: string;
}

interface HistoryToolbarProps {
  filters: HistoryFilters;
  onChange: (patch: Partial<HistoryFilters>) => void;
  onReset: () => void;
  promptOptions: PromptOption[];
  kindCounts: Record<HistoryKind, number>;
  view: HistoryView;
  onViewChange: (view: HistoryView) => void;
}

const rangeOptions: { value: HistoryRange; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

const pills: { kind: HistoryKind; label: string; dot: string }[] = [
  { kind: 'all', label: 'All Logs', dot: 'bg-muted-foreground' },
  { kind: 'edit', label: 'Edits', dot: 'bg-primary' },
  { kind: 'rollback', label: 'Rollbacks', dot: 'bg-red-500' },
  { kind: 'initial', label: 'Created', dot: 'bg-emerald-500' },
];

const selectClass =
  'h-10 rounded-lg border border-border bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary';

export function HistoryToolbar({
  filters,
  onChange,
  onReset,
  promptOptions,
  kindCounts,
  view,
  onViewChange,
}: HistoryToolbarProps) {
  const viewButtons = [
    { value: 'timeline' as const, label: 'Timeline', icon: LayoutList },
    { value: 'table' as const, label: 'Table', icon: Table2 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ query: e.target.value })}
            placeholder="Search by prompt name, commit hash or note..."
            aria-label="Search version logs"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>

        {/* Dropdowns */}
        <select
          aria-label="Filter by prompt"
          value={filters.promptId}
          onChange={(e) => onChange({ promptId: e.target.value })}
          className={`${selectClass} lg:max-w-56`}
        >
          <option value="all">All prompts</option>
          {promptOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by time range"
          value={filters.range}
          onChange={(e) => onChange({ range: e.target.value as HistoryRange })}
          className={selectClass}
        >
          {rangeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div className="inline-flex rounded-lg border border-border bg-card p-1" role="group" aria-label="View mode">
          {viewButtons.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                view === value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by log type">
        {pills.map(({ kind, label, dot }) => {
          const active = filters.kind === kind;
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ kind })}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
              {label}
              <span className="tabular-nums opacity-70">{kindCounts[kind]}</span>
            </button>
          );
        })}

        {hasActiveFilters(filters) && (
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