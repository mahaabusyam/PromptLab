import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_SETTINGS,
  coerceSettings,
  type Settings,
} from "@/features/settings/schemas";

interface SettingsState {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  replace: (settings: Settings) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      update: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      replace: (settings) => set({ settings }),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "promptlab-settings",
      version: 1,
      // Validate what comes back from localStorage so a bad value can't break the app
      merge: (persisted, current) => ({
        ...current,
        settings: coerceSettings(
          (persisted as { settings?: unknown } | undefined)?.settings,
        ),
      }),
    },
  ),
);
