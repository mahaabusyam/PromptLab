import { Database, Download, RotateCcw, Upload } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { usePromptStore } from '@/stores/promptStore';
import { useBackup, type ImportMode } from '../hooks/useBackup';
import { SettingsCard } from './SettingsParts';

const actionButton =
  'flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary';

export function DataSection() {
  const { status, pending, exportBackup, stageFile, applyPending, cancelPending } = useBackup();
  const promptCount = usePromptStore((s) => s.prompts.length);
  const resetToSeed = usePromptStore((s) => s.resetToSeed);

  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>('merge');
  const [dragging, setDragging] = useState(false);
  const [confirm, setConfirm] = useState<'replace' | 'reset' | null>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void stageFile(file);
  }

  return (
    <SettingsCard
      id="data"
      icon={Database}
      title="Data Backup & Migration"
      description="Everything lives in this browser. Export a backup to keep it safe or move it elsewhere."
      badge={
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          Local data
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-background p-4">
          <div>
            <h3 className="font-heading font-semibold">Comprehensive JSON Backup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Prompts with all versions, folders, imported templates, starred templates and settings, in one file.
            </p>
          </div>
          <div className="space-y-2">
            <button type="button" onClick={() => void exportBackup()} className={actionButton}>
              <Download className="size-4 text-primary" aria-hidden="true" />
              Export All Data (JSON)
            </button>
            <p className="px-1 text-[11px] text-muted-foreground">SHA-256 checksum included</p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col justify-between gap-4 rounded-xl border border-dashed p-4 transition-colors ${
            dragging ? 'border-primary bg-primary/10' : 'border-border bg-background'
          }`}
        >
          <div>
            <h3 className="font-heading font-semibold">Restore or Import Backup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drop a PromptLab backup here. The file is validated and its checksum verified before anything changes.
            </p>
          </div>
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void stageFile(file);
                e.target.value = ''; // allow picking the same file again
              }}
            />
            <button type="button" onClick={() => inputRef.current?.click()} className={actionButton}>
              <Upload className="size-4 text-primary" aria-hidden="true" />
              Import Backup File
            </button>
            <p className="px-1 text-[11px] text-muted-foreground">Drag &amp; drop or browse · Max 5 MB</p>
          </div>
        </div>
      </div>

      {status && (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`mt-4 rounded-lg border px-4 py-2 text-sm ${
            status.type === 'error'
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : 'border-primary/30 bg-primary/10 text-primary'
          }`}
        >
          {status.message}
        </p>
      )}

      {pending && (
        <div className="mt-4 space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div>
            <p className="text-sm font-semibold">Ready to import: {pending.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {pending.summary.prompts} prompts · {pending.summary.versions} versions · {pending.summary.folders} folders ·{' '}
              {pending.summary.templates} templates · checksum verified
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="sr-only">Import mode</legend>
            {(
              [
                ['merge', 'Merge', 'Add new items; items with the same id are replaced by the backup. Your settings stay.'],
                ['replace', 'Replace everything', 'Swap all prompts, folders, templates, favorites and settings with the backup.'],
              ] as const
            ).map(([value, label, hint]) => (
              <label key={value} className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="radio"
                  name="import-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="mt-1 accent-[var(--primary)]"
                />
                <span>
                  <span className="font-semibold">{label}</span>
                  <span className="block text-xs text-muted-foreground">{hint}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => (mode === 'replace' ? setConfirm('replace') : applyPending('merge'))}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Import
            </button>
            <button
              type="button"
              onClick={cancelPending}
              className="rounded-xl bg-muted px-4 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-background p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">Reset demo data</p>
          <p className="text-xs text-muted-foreground">
            Restore the original sample prompts and folders ({promptCount} prompts stored now).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirm('reset')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset demo data
        </button>
      </div>

      {confirm === 'replace' && (
        <ConfirmDialog
          title="Replace all data?"
          description="Your current prompts, folders, imported templates, favorites and settings will be replaced by the backup. This cannot be undone."
          confirmLabel="Replace everything"
          tone="danger"
          onConfirm={() => {
            setConfirm(null);
            applyPending('replace');
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'reset' && (
        <ConfirmDialog
          title="Reset demo data?"
          description="Your prompts and folders will be replaced with the original demo data. Imported templates and settings are kept."
          confirmLabel="Reset"
          tone="danger"
          onConfirm={() => {
            setConfirm(null);
            resetToSeed();
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </SettingsCard>
  );
}