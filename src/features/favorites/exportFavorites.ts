import type { Prompt } from "@/features/prompts/types";
import type { Template } from "@/features/templates/schemas";
import type { FavoriteEntry } from "./types";

export interface FavoritesExportFile {
  app: "promptlab";
  type: "favorites";
  version: 1;
  exportedAt: string;
  prompts: Prompt[];
  templates: Template[];
}

export function buildFavoritesExport(
  entries: FavoriteEntry[],
  now: Date = new Date(),
): FavoritesExportFile {
  const prompts: Prompt[] = [];
  const templates: Template[] = [];
  for (const e of entries) {
    if (e.kind === "prompt") prompts.push(e.prompt);
    else templates.push(e.template);
  }
  return {
    app: "promptlab",
    type: "favorites",
    version: 1,
    exportedAt: now.toISOString(),
    prompts,
    templates,
  };
}
