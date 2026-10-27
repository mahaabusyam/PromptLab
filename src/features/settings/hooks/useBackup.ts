import { format } from 'date-fns';
import type { TFunction } from 'i18next';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadJson } from '@/features/prompts/services/importExport';
import { usePromptStore } from '@/stores/promptStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTemplateStore } from '@/stores/templateStore';
import {
  MAX_BACKUP_BYTES,
  buildBackup,
  mergeById,
  parseBackup,
  summarizeBackup,
  type BackupFile,
  type ParseBackupResult,
} from '../backup';

export type ImportMode = 'merge' | 'replace';

export interface BackupStatus {
  type: 'success' | 'error';
  message: string;
}

export interface PendingImport {
  fileName: string;
  file: BackupFile;
  summary: ReturnType<typeof summarizeBackup>;
}

type BackupFailure = Extract<ParseBackupResult, { ok: false }>;

/** Turns a parse failure (a code from the service) into a translated message. */
function describeFailure(failure: BackupFailure, t: TFunction): string {
  switch (failure.code) {
    case 'too_large':
      return t('settings.backup.errTooLarge');
    case 'invalid_json':
      return t('settings.backup.errInvalidJson');
    case 'checksum':
      return t('settings.backup.errChecksum');
    case 'invalid_backup':
      return failure.where && failure.detail
        ? t('settings.backup.errInvalidBackupAt', { where: failure.where, detail: failure.detail })
        : t('settings.backup.errInvalidBackup');
  }
}

export function useBackup() {
  const { t } = useTranslation();
  const prompts = usePromptStore((s) => s.prompts);
  const folders = usePromptStore((s) => s.folders);
  const importData = usePromptStore((s) => s.importData);
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  const favoriteIds = useTemplateStore((s) => s.favoriteIds);
  const settings = useSettingsStore((s) => s.settings);

  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [pending, setPending] = useState<PendingImport | null>(null);

  const exportBackup = useCallback(async () => {
    const file = await buildBackup({
      prompts,
      folders,
      customTemplates,
      favoriteTemplateIds: favoriteIds,
      settings,
    });
    downloadJson(file, `promptlab-backup-${format(new Date(), 'yyyy-MM-dd')}.json`);
    setStatus({
      type: 'success',
      message: t('settings.backup.exported', {
        prompts: prompts.length,
        templates: customTemplates.length,
      }),
    });
  }, [prompts, folders, customTemplates, favoriteIds, settings, t]);

  // Step 1: read + validate the file, but don't touch any store yet
  const stageFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_BACKUP_BYTES) {
        setPending(null);
        setStatus({ type: 'error', message: t('settings.backup.errTooLarge') });
        return;
      }
      const result = await parseBackup(await file.text());
      if (!result.ok) {
        setPending(null);
        setStatus({ type: 'error', message: describeFailure(result, t) });
        return;
      }
      setStatus(null);
      setPending({ fileName: file.name, file: result.file, summary: summarizeBackup(result.file.data) });
    },
    [t],
  );

  // Step 2: the user confirmed → write into the stores
  const applyPending = useCallback(
    (mode: ImportMode) => {
      if (!pending) return;
      const { data } = pending.file;

      importData({ prompts: data.prompts, folders: data.folders }, mode);

      const templates = useTemplateStore.getState();
      if (mode === 'replace') {
        useTemplateStore.setState({
          customTemplates: data.customTemplates,
          favoriteIds: data.favoriteTemplateIds,
        });
        useSettingsStore.getState().replace(data.settings);
      } else {
        useTemplateStore.setState({
          customTemplates: mergeById(templates.customTemplates, data.customTemplates).items,
          favoriteIds: [...new Set([...templates.favoriteIds, ...data.favoriteTemplateIds])],
        });
      }

      setStatus({
        type: 'success',
        message: t(mode === 'replace' ? 'settings.backup.restored' : 'settings.backup.merged', {
          prompts: pending.summary.prompts,
          name: pending.fileName,
        }),
      });
      setPending(null);
    },
    [pending, importData, t],
  );

  const cancelPending = useCallback(() => setPending(null), []);

  return { status, pending, exportBackup, stageFile, applyPending, cancelPending };
}