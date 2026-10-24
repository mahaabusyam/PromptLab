import { useLayoutEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

/** Mirrors accent + contrast settings onto <html> so the CSS blocks above can react. */
export function useApplyAppearance() {
  const accent = useSettingsStore((s) => s.settings.accent);
  const highContrast = useSettingsStore((s) => s.settings.highContrast);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = accent;
    if (highContrast) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;
  }, [accent, highContrast]);
}