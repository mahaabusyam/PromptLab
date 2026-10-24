import { useMemo } from 'react';
import { usePromptStore } from '@/stores/promptStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTemplateStore } from '@/stores/templateStore';
import { useThemeStore } from '@/stores/themeStore';
import { measureStorage, type StorageUsage } from '../storage';

export function useStorageUsage(): StorageUsage {
  const prompts = usePromptStore((s) => s.prompts);
  const folders = usePromptStore((s) => s.folders);
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  const favoriteIds = useTemplateStore((s) => s.favoriteIds);
  const settings = useSettingsStore((s) => s.settings);
  const theme = useThemeStore((s) => s.theme);

  // Re-measure whenever any persisted store changes
  return useMemo(() => {
    try {
      return measureStorage(localStorage);
    } catch {
      return { bytes: 0, keys: 0, percent: 0 };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-measure whenever any persisted store changes
  }, [prompts, folders, customTemplates, favoriteIds, settings, theme]);
}