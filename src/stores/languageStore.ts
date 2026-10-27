import { create } from "zustand";
import { persist } from "zustand/middleware";
import { languagePreferences } from "@/i18n/languages";
import type { LanguagePreference } from "@/i18n/languages";

interface LanguageState {
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
}

function readPreference(value: unknown): LanguagePreference {
  if (typeof value === "object" && value !== null && "preference" in value) {
    const { preference } = value;
    const match = languagePreferences.find((option) => option === preference);
    if (match) return match;
  }
  return "auto";
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      preference: "auto",
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: "promptlab-language",
      version: 1,
      merge: (persisted, current) => ({
        ...current,
        preference: readPreference(persisted),
      }),
    },
  ),
);
