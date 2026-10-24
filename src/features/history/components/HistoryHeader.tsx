import { Download } from 'lucide-react';
import type { HistoryEntry } from '../types';

interface HistoryHeaderProps {
  entries: HistoryEntry[];
}

function exportAuditLog(entries: HistoryEntry[]): void {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `promptlab-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function HistoryHeader({ entries }: HistoryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {entries.length} Audited Revisions
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight">History &amp; Version Logs</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Every saved version of every prompt, with line and token changes. Restoring never erases
          history, it adds a new version.
        </p>
      </div>

      <button
        type="button"
        onClick={() => exportAuditLog(entries)}
        disabled={entries.length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="size-4" aria-hidden="true" />
        Export Audit Log (JSON)
      </button>
    </header>
  );
}