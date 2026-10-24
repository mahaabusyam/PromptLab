import { useCallback, useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { HistoryHeader } from '@/features/history/components/HistoryHeader';
import { ListPagination } from '@/components/common/ListPagination'
import { HistoryStatsGrid } from '@/features/history/components/HistoryStatsGrid';
import { HistoryTable } from '@/features/history/components/HistoryTable';
import { HistoryTimeline } from '@/features/history/components/HistoryTimeline';
import { HistoryToolbar } from '@/features/history/components/HistoryToolbar';
import { useHistoryEntries } from '@/features/history/hooks/useHistoryEntries';
import { buildHistoryStats } from '@/features/history/buildHistory';
import {
  DEFAULT_FILTERS,
  countByKind,
  filterHistory,
  filterWithoutKind,
} from '@/features/history/filterHistory';
import { paginate } from '@/features/history/paginate';
import type { HistoryEntry, HistoryFilters, HistoryView } from '@/features/history/types';
import { usePromptStore } from '@/stores/promptStore';

type PendingAction = { type: 'restore' | 'delete'; entry: HistoryEntry };

export default function HistoryPage() {
  const entries = useHistoryEntries();
  const restoreVersion = usePromptStore((s) => s.restoreVersion);
  const deleteVersion = usePromptStore((s) => s.deleteVersion);

  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<HistoryView>('timeline');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now] = useState(() => new Date().getTime());

  const handleChange = useCallback((patch: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1); // a new filter means the old page number no longer makes sense
  }, []);
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const handleRestore = useCallback(
    (entry: HistoryEntry) => setPending({ type: 'restore', entry }),
    [],
  );
  const handleDelete = useCallback(
    (entry: HistoryEntry) => setPending({ type: 'delete', entry }),
    [],
  );
  const handleCancel = useCallback(() => setPending(null), []);

  function handleConfirm(): void {
    if (!pending) return;
    const { type, entry } = pending;

    if (type === 'restore') {
      const created = restoreVersion(entry.promptId, entry.id);
      setNotice(
        created
          ? `Restored ${entry.label} of "${entry.promptTitle}" as new version ${created.label}.`
          : 'Could not restore this version.',
      );
    } else {
      const ok = deleteVersion(entry.promptId, entry.id);
      setNotice(
        ok
          ? `Deleted ${entry.label} of "${entry.promptTitle}".`
          : 'This version cannot be deleted.',
      );
    }
    setPending(null);
  }

  // KPIs describe the whole history, not the filtered view.
 const stats = useMemo(() => buildHistoryStats(entries, now), [entries, now]);

  const promptOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of entries) seen.set(e.promptId, e.promptTitle);
    return [...seen]
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [entries]);

  const { visible, kindCounts } = useMemo(() => {
  return {
    visible: filterHistory(entries, filters, now),
    kindCounts: countByKind(filterWithoutKind(entries, filters, now)),
  };
}, [entries, filters, now]);

  const pageResult = useMemo(() => paginate(visible, page), [visible, page]);

  return (
    <div className="space-y-6">
      <HistoryHeader entries={entries} />
      <HistoryStatsGrid stats={stats} />

      <HistoryToolbar
        filters={filters}
        onChange={handleChange}
        onReset={handleReset}
        promptOptions={promptOptions}
        kindCounts={kindCounts}
        view={view}
        onViewChange={setView}
      />

      {notice && (
        <p
          role="status"
          className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
        >
          {notice}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {entries.length === 0
            ? 'No versions saved yet. Save a version from the editor and it will appear here.'
            : 'No version logs match your filters.'}
        </div>
      ) : (
        <>
          {view === 'timeline' ? (
            <HistoryTimeline entries={pageResult.items} onRestore={handleRestore} onDelete={handleDelete} />
          ) : (
            <HistoryTable entries={pageResult.items} onRestore={handleRestore} onDelete={handleDelete} />
          )}
          <ListPagination result={pageResult} onPageChange={setPage} />
        </>
      )}

      {pending && (
        <ConfirmDialog
          tone={pending.type === 'delete' ? 'danger' : 'primary'}
          title={
            pending.type === 'restore'
              ? `Restore ${pending.entry.label}?`
              : `Delete ${pending.entry.label}?`
          }
          description={
            pending.type === 'restore'
              ? `"${pending.entry.promptTitle}" will get a new version with the content of ${pending.entry.label}. Your existing history is kept, nothing is overwritten.`
              : `${pending.entry.label} of "${pending.entry.promptTitle}" will be permanently removed from its history. The current version is not affected.`
          }
          confirmLabel={pending.type === 'restore' ? 'Restore version' : 'Delete version'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}