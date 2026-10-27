import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { HistoryHeader } from "@/features/history/components/HistoryHeader";
import { ListPagination } from "@/components/common/ListPagination";
import { HistoryStatsGrid } from "@/features/history/components/HistoryStatsGrid";
import { HistoryTable } from "@/features/history/components/HistoryTable";
import { HistoryTimeline } from "@/features/history/components/HistoryTimeline";
import { HistoryToolbar } from "@/features/history/components/HistoryToolbar";
import { useHistoryEntries } from "@/features/history/hooks/useHistoryEntries";
import { buildHistoryStats } from "@/features/history/buildHistory";
import {
  DEFAULT_FILTERS,
  countByKind,
  filterHistory,
  filterWithoutKind,
} from "@/features/history/filterHistory";
import { paginate } from "@/features/history/paginate";
import type {
  HistoryEntry,
  HistoryFilters,
  HistoryView,
} from "@/features/history/types";
import { usePromptStore } from "@/stores/promptStore";

type PendingAction = { type: "restore" | "delete"; entry: HistoryEntry };

export default function HistoryPage() {
  const { t } = useTranslation();
  const entries = useHistoryEntries();
  const restoreVersion = usePromptStore((s) => s.restoreVersion);
  const deleteVersion = usePromptStore((s) => s.deleteVersion);

  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<HistoryView>("timeline");
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
    (entry: HistoryEntry) => setPending({ type: "restore", entry }),
    [],
  );
  const handleDelete = useCallback(
    (entry: HistoryEntry) => setPending({ type: "delete", entry }),
    [],
  );
  const handleCancel = useCallback(() => setPending(null), []);

  function handleConfirm(): void {
    if (!pending) return;
    const { type, entry } = pending;

    if (type === "restore") {
      const created = restoreVersion(entry.promptId, entry.id);
      setNotice(
        created
          ? t("history.page.restored", {
              label: entry.label,
              title: entry.promptTitle,
              newLabel: created.label,
            })
          : t("history.page.restoreFailed"),
      );
    } else {
      const ok = deleteVersion(entry.promptId, entry.id);
      setNotice(
        ok
          ? t("history.page.deleted", {
              label: entry.label,
              title: entry.promptTitle,
            })
          : t("history.page.deleteFailed"),
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
          dir="auto"
          className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
        >
          {notice}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {entries.length === 0
            ? t("history.page.emptyAll")
            : t("history.page.noMatch")}
        </div>
      ) : (
        <>
          {view === "timeline" ? (
            <HistoryTimeline
              entries={pageResult.items}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          ) : (
            <HistoryTable
              entries={pageResult.items}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          )}
          <ListPagination
            result={pageResult}
            onPageChange={setPage}
            noun={t("history.page.noun")}
          />
        </>
      )}

      {pending && (
        <ConfirmDialog
          tone={pending.type === "delete" ? "danger" : "primary"}
          title={
            pending.type === "restore"
              ? t("history.page.restoreTitle", { label: pending.entry.label })
              : t("history.page.deleteTitle", { label: pending.entry.label })
          }
          description={
            pending.type === "restore"
              ? t("history.page.restoreBody", {
                  title: pending.entry.promptTitle,
                  label: pending.entry.label,
                })
              : t("history.page.deleteBody", {
                  title: pending.entry.promptTitle,
                  label: pending.entry.label,
                })
          }
          confirmLabel={
            pending.type === "restore"
              ? t("history.page.restoreConfirm")
              : t("history.page.deleteConfirm")
          }
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
