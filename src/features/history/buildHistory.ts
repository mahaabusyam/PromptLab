import type { Prompt } from "@/features/prompts/types";
import { diffLines, summarizeDiff } from "@/features/versions/diff";
import { estimateTokens } from "@/utils/tokens";
import type { HistoryEntry, HistoryStats } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Deterministic 7-char hex hash, so the same version always shows the same #hash. */
export function hashFromId(id: string): string {
  let h = 5381;
  for (const ch of id) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

export function buildHistoryEntries(prompts: Prompt[]): HistoryEntry[] {
  const entries = prompts.flatMap((prompt) => {
    const sorted = [...prompt.versions].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );

    return sorted.map((version, index): HistoryEntry => {
      const previous = index > 0 ? sorted[index - 1] : null;
      const { added, removed } = summarizeDiff(
        diffLines(previous?.content ?? "", version.content),
      );

      return {
        id: version.id,
        promptId: prompt.id,
        promptTitle: prompt.title,
        label: version.label,
        note: version.note,
        createdAt: version.createdAt,
        hash: hashFromId(version.id),
        isRollback: Boolean(version.restoredFrom),
        restoredFrom: version.restoredFrom ?? null,
        linesAdded: added,
        linesRemoved: removed,
        tokenDelta:
          estimateTokens(version.content) -
          estimateTokens(previous?.content ?? ""),
        isInitial: previous === null,
        content: version.content,
        previousContent: previous?.content ?? null,
        isCurrent: index === sorted.length - 1,
      };
    });
  });

  return entries.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export function buildHistoryStats(
  entries: HistoryEntry[],
  now: number,
): HistoryStats {
  const inRange = (e: HistoryEntry, from: number, to: number): boolean => {
    const t = Date.parse(e.createdAt);
    return t > from && t <= to;
  };

  const last30 = entries.filter((e) =>
    inRange(e, now - 30 * DAY_MS, now),
  ).length;
  const prev30 = entries.filter((e) =>
    inRange(e, now - 60 * DAY_MS, now - 30 * DAY_MS),
  ).length;

  return {
    totalCommits: entries.length,
    rollbacks: entries.filter((e) => e.isRollback).length,
    promptsVersioned: new Set(entries.map((e) => e.promptId)).size,
    avgDaily: Math.round((last30 / 30) * 10) / 10,
    commitsTrend:
      prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 100) : null,
  };
}
