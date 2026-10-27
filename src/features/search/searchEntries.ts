import { categoryLabels } from "@/features/prompts/constants";
import type { Prompt } from "@/features/prompts/types";
import type { Template } from "@/features/templates/schemas";

export const SEARCH_LIMIT = 8;
const RECENT_LIMIT = 5;

export const SEARCH_PAGES = [
  { label: "Dashboard", to: "/" },
  { label: "Prompt Library", to: "/library" },
  { label: "New prompt", to: "/editor" },
  { label: "Templates", to: "/templates" },
  { label: "History", to: "/history" },
  { label: "Compare versions", to: "/compare" },
  { label: "Favorites", to: "/favorites" },
  { label: "Settings", to: "/settings" },
] as const;

/** Texts shown/searched in results. Defaults are English; the UI passes translated ones. */
export interface SearchLabels {
  pages: readonly { label: string; to: string }[];
  pageSubtitle: string;
  categoryLabel: (category: Prompt["category"]) => string;
}

export const DEFAULT_SEARCH_LABELS: SearchLabels = {
  pages: SEARCH_PAGES,
  pageSubtitle: "Go to page",
  categoryLabel: (category) => categoryLabels[category],
};

export type SearchResult =
  | { kind: "prompt"; key: string; id: string; title: string; subtitle: string }
  | {
      kind: "template";
      key: string;
      id: string;
      title: string;
      subtitle: string;
      template: Template;
    }
  | { kind: "page"; key: string; title: string; subtitle: string; to: string };

interface Scored {
  result: SearchResult;
  score: number;
  time: number; // tie-breaker: most recently updated first
}

/** Exact title > title starts with > title contains > found in description/content/tags. */
function scoreMatch(query: string, title: string, extras: string[]): number {
  const t = title.toLowerCase();
  if (t === query) return 100;
  if (t.startsWith(query)) return 80;
  if (t.includes(query)) return 60;
  if (extras.some((text) => text.toLowerCase().includes(query))) return 30;
  return 0;
}

const byRecent = (a: Prompt, b: Prompt): number =>
  (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0);

function promptResult(p: Prompt, labels: SearchLabels): SearchResult {
  return {
    kind: "prompt",
    key: `prompt:${p.id}`,
    id: p.id,
    title: p.title,
    subtitle: `${labels.categoryLabel(p.category)} · ${p.model.name}`,
  };
}

export function searchEntries(
  prompts: Prompt[],
  templates: Template[],
  rawQuery: string,
  limit: number = SEARCH_LIMIT,
  labels: SearchLabels = DEFAULT_SEARCH_LABELS,
): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  const visible = prompts.filter((p) => !p.isArchived);

  // No query yet: show the most recently edited prompts
  if (!query) {
    return [...visible]
      .sort(byRecent)
      .slice(0, RECENT_LIMIT)
      .map((p) => promptResult(p, labels));
  }

  const scored: Scored[] = [];

  for (const p of visible) {
    const score = scoreMatch(query, p.title, [
      p.description,
      p.content,
      ...p.tags,
    ]);
    if (score > 0)
      scored.push({
        result: promptResult(p, labels),
        score,
        time: Date.parse(p.updatedAt) || 0,
      });
  }

  for (const t of templates) {
    const score = scoreMatch(query, t.title, [
      t.description,
      t.content,
      ...t.tags,
    ]);
    if (score > 0) {
      scored.push({
        result: {
          kind: "template",
          key: `template:${t.id}`,
          id: t.id,
          title: t.title,
          subtitle: t.description,
          template: t,
        },
        score,
        time: 0,
      });
    }
  }

  for (const page of labels.pages) {
    const score = scoreMatch(query, page.label, []);
    if (score > 0) {
      scored.push({
        result: {
          kind: "page",
          key: `page:${page.to}`,
          title: page.label,
          subtitle: labels.pageSubtitle,
          to: page.to,
        },
        score,
        time: 0,
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || b.time - a.time)
    .slice(0, limit)
    .map((s) => s.result);
}
