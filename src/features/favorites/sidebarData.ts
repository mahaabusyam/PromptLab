import type { FavoriteEntry } from './types';

export interface FolderCount {
  id: string;
  name: string;
  count: number;
}

export interface VariableCount {
  name: string;
  count: number;
}

/** Only folders that contain at least one favorite prompt, biggest first. */
export function buildFolderCounts(
  entries: FavoriteEntry[],
  folders: { id: string; name: string }[],
): FolderCount[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (e.kind === 'prompt' && e.folderId) counts.set(e.folderId, (counts.get(e.folderId) ?? 0) + 1);
  }
  return folders
    .filter((f) => counts.has(f.id))
    .map((f) => ({ id: f.id, name: f.name, count: counts.get(f.id) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** How many favorites use each variable (an item counts once per variable). */
export function buildTopVariables(entries: FavoriteEntry[]): VariableCount[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    for (const v of new Set(e.variables)) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}