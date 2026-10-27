import type { ParseKeys } from "i18next";

export const SEARCH_PAGE_KEYS = [
  { labelKey: "nav.dashboard", to: "/" },
  { labelKey: "nav.library", to: "/library" },
  { labelKey: "search.pages.newPrompt", to: "/editor" },
  { labelKey: "nav.templates", to: "/templates" },
  { labelKey: "nav.history", to: "/history" },
  { labelKey: "search.pages.compare", to: "/compare" },
  { labelKey: "nav.favorites", to: "/favorites" },
  { labelKey: "nav.settings", to: "/settings" },
] as const satisfies readonly { labelKey: ParseKeys; to: string }[];
