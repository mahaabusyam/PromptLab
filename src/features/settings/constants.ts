import i18n from "i18next";
import "@/i18n";
import type { Accent } from "./schemas";

// `label` is a getter: it is looked up when read, so it follows the current language.
export const accentOptions: { id: Accent; label: string; swatch: string }[] = [
  {
    id: "violet",
    get label() {
      return i18n.t("settings.accent.violet");
    },
    swatch: "#8b5cf6",
  },
  {
    id: "cyan",
    get label() {
      return i18n.t("settings.accent.cyan");
    },
    swatch: "#06b6d4",
  },
  {
    id: "emerald",
    get label() {
      return i18n.t("settings.accent.emerald");
    },
    swatch: "#10b981",
  },
  {
    id: "pink",
    get label() {
      return i18n.t("settings.accent.pink");
    },
    swatch: "#ec4899",
  },
];
