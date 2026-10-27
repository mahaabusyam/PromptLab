import { Database, Download, RotateCcw, Upload } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePromptStore } from '@/stores/promptStore';
import { useBackup, type ImportMode } from '../hooks/useBackup';
import { SettingsCard } from './SettingsParts';

const actionButton =
  'flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary';

export function DataSection() {
  const { t } = useTranslation();
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

  const modes = [
    ['merge', t('settings.data.merge'), t('settings.data.mergeHint')],
    ['replace', t('settings.data.replace'), t('settings.data.replaceHint')],
  ] as const;

  return (
    <SettingsCard
      id="data"
      icon={Database}
      title={t('settings.data.title')}
      description={t('settings.data.description')}
      badge={
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          {t('settings.data.badge')}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-background p-4">
          <div>
            <h3 className="font-heading font-semibold">{t('settings.data.exportTitle')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('settings.data.exportBody')}</p>
          </div>
          <div className="space-y-2">
            <button type="button" onClick={() => void exportBackup()} className={actionButton}>
              <Download className="size-4 text-primary" aria-hidden="true" />
              {t('settings.data.exportButton')}
            </button>
            <p className="px-1 text-[11px] text-muted-foreground">{t('settings.data.checksum')}</p>
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
            <h3 className="font-heading font-semibold">{t('settings.data.importTitle')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('settings.data.importBody')}</p>
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
              {t('settings.data.importButton')}
            </button>
            <p className="px-1 text-[11px] text-muted-foreground">{t('settings.data.importHint')}</p>
          </div>
        </div>
      </div>

      {status && (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          dir="auto"
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
            <p dir="auto" className="text-sm font-semibold">
              {t('settings.data.ready', { name: pending.fileName })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('settings.data.summary', {
                prompts: pending.summary.prompts,
                versions: pending.summary.versions,
                folders: pending.summary.folders,
                templates: pending.summary.templates,
              })}
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="sr-only">{t('settings.data.modeLegend')}</legend>
            {modes.map(([value, label, hint]) => (
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
              {t('settings.data.import')}
            </button>
            <button
              type="button"
              onClick={cancelPending}
              className="rounded-xl bg-muted px-4 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-background p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">{t('settings.data.resetTitle')}</p>
          <p className="text-xs text-muted-foreground">
            {t('settings.data.resetHint', { total: promptCount })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirm('reset')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t('settings.data.resetTitle')}
        </button>
      </div>

      {confirm === 'replace' && (
        <ConfirmDialog
          title={t('settings.data.replaceDialogTitle')}
          description={t('settings.data.replaceDialogBody')}
          confirmLabel={t('settings.data.replace')}
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
          title={t('settings.data.resetDialogTitle')}
          description={t('settings.data.resetDialogBody')}
          confirmLabel={t('settings.data.resetConfirm')}
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