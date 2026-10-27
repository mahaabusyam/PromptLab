import type {
  FavoriteEntry,
  FavoriteFilters,
  FavoriteSort,
  FavoriteTab,
} from "./types";

export const DEFAULT_FAVORITE_FILTERS: FavoriteFilters = {
  query: "",
  tab: "all",
  provider: "all",
  variable: null,
  folderId: null,
  sort: "updated",
};

function matchesQuery(entry: FavoriteEntry, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase().replace(/^#/, "");
  if (!q) return true;
  return [
    entry.title,
    entry.description,
    entry.modelName,
    entry.provider,
    ...entry.tags,
    ...entry.variables,
  ].some((field) => field.toLowerCase().includes(q));
}

const comparers: Record<
  FavoriteSort,
  (a: FavoriteEntry, b: FavoriteEntry) => number
> = {
  // entries without a date (templates) go last

  updated: (a, b) => {
    const dateA = Date.parse(a.updatedAt ?? "");
    const dateB = Date.parse(b.updatedAt ?? "");

    if (Number.isNaN(dateA)) return Number.isNaN(dateB) ? 0 : 1;
    if (Number.isNaN(dateB)) return -1;

    return dateB - dateA;
  },
  name: (a, b) => a.title.localeCompare(b.title),
  tokens: (a, b) => a.tokens - b.tokens,
};

function applyExceptTab(
  entries: FavoriteEntry[],
  filters: FavoriteFilters,
): FavoriteEntry[] {
  return entries.filter(
    (e) =>
      (filters.provider === "all" || e.provider === filters.provider) &&
      (filters.variable === null || e.variables.includes(filters.variable)) &&
      (filters.folderId === null ||
        (e.kind === "prompt" && e.folderId === filters.folderId)) &&
      matchesQuery(e, filters.query),
  );
}

export function filterFavorites(
  entries: FavoriteEntry[],
  filters: FavoriteFilters,
): FavoriteEntry[] {
  return applyExceptTab(entries, filters)
    .filter((e) => filters.tab === "all" || e.kind === filters.tab)
    .sort(comparers[filters.sort]);
}

/** Tab counts respect every other filter, so the pills never lie. */
export function countByTab(
  entries: FavoriteEntry[],
  filters: FavoriteFilters,
): Record<FavoriteTab, number> {
  const pool = applyExceptTab(entries, filters);
  const prompts = pool.filter((e) => e.kind === "prompt").length;
  return { all: pool.length, prompt: prompts, template: pool.length - prompts };
}

export function hasActiveFavoriteFilters(filters: FavoriteFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.provider !== "all" ||
    filters.variable !== null ||
    filters.folderId !== null
  );
}
