import type { HistoryEntry, HistoryFilters, HistoryKind, HistoryRange } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_FILTERS: HistoryFilters = {
  query: '',
  promptId: 'all',
  range: 'all',
  kind: 'all',
};

const rangeDays: Record<Exclude<HistoryRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export function getEntryKind(entry: HistoryEntry): Exclude<HistoryKind, 'all'> {
  if (entry.isRollback) return 'rollback';
  if (entry.isInitial) return 'initial';
  return 'edit';
}

function matchesQuery(entry: HistoryEntry, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase().replace(/^#/, '');
  if (!q) return true;
  return [entry.promptTitle, entry.note, entry.label, entry.hash].some((field) =>
    field.toLowerCase().includes(q),
  );
}

function matchesRange(entry: HistoryEntry, range: HistoryRange, now: number): boolean {
  if (range === 'all') return true;
  return Date.parse(entry.createdAt) >= now - rangeDays[range] * DAY_MS;
}

/** Applies every filter except `kind`, so the pills can show their own counts. */
export function filterWithoutKind(
  entries: HistoryEntry[],
  filters: HistoryFilters,
  now: number,
): HistoryEntry[] {
  return entries.filter(
    (e) =>
      (filters.promptId === 'all' || e.promptId === filters.promptId) &&
      matchesRange(e, filters.range, now) &&
      matchesQuery(e, filters.query),
  );
}

export function filterHistory(
  entries: HistoryEntry[],
  filters: HistoryFilters,
  now: number,
): HistoryEntry[] {
  const base = filterWithoutKind(entries, filters, now);
  return filters.kind === 'all' ? base : base.filter((e) => getEntryKind(e) === filters.kind);
}

export function countByKind(entries: HistoryEntry[]): Record<HistoryKind, number> {
  const counts: Record<HistoryKind, number> = { all: entries.length, edit: 0, rollback: 0, initial: 0 };
  for (const e of entries) counts[getEntryKind(e)] += 1;
  return counts;
}

export function hasActiveFilters(filters: HistoryFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.promptId !== DEFAULT_FILTERS.promptId ||
    filters.range !== DEFAULT_FILTERS.range ||
    filters.kind !== DEFAULT_FILTERS.kind
  );
}