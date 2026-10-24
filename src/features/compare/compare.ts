import { diffLines, summarizeDiff } from '@/features/versions/diff';
import type { DiffLine } from '@/features/versions/diff';
import type { PromptVersion } from '@/features/prompts/types';
import { extractVariables } from '@/utils/promptVariables';
import { estimateCostUsd, estimateTokens } from '@/utils/tokens';
import { hashFromId } from '@/features/history/buildHistory';

export interface VersionSnapshot {
  id: string;
  label: string;
  note: string;
  createdAt: string;
  hash: string;
  tokens: number;
  costUsd: number;
}

export interface CompareResult {
  diff: DiffLine[];
  added: number;
  removed: number;
  unchanged: number;
  tokenDelta: number;
  sizePercent: number | null; // null when base is empty
  variablesAdded: string[];
  variablesRemoved: string[];
}

export function toSnapshot(version: PromptVersion): VersionSnapshot {
  const tokens = estimateTokens(version.content);
  return {
    id: version.id,
    label: version.label,
    note: version.note,
    createdAt: version.createdAt,
    hash: hashFromId(version.id),
    tokens,
    costUsd: estimateCostUsd(tokens),
  };
}

export function buildCompare(base: PromptVersion, target: PromptVersion): CompareResult {
  const diff = diffLines(base.content, target.content);
  const { added, removed } = summarizeDiff(diff);

  const baseTokens = estimateTokens(base.content);
  const targetTokens = estimateTokens(target.content);

  const baseVars = new Set(extractVariables(base.content));
  const targetVars = new Set(extractVariables(target.content));

  return {
    diff,
    added,
    removed,
    unchanged: diff.filter((l) => l.type === 'same').length,
    tokenDelta: targetTokens - baseTokens,
    sizePercent:
      baseTokens === 0 ? null : Math.round(((targetTokens - baseTokens) / baseTokens) * 1000) / 10,
    variablesAdded: [...targetVars].filter((v) => !baseVars.has(v)),
    variablesRemoved: [...baseVars].filter((v) => !targetVars.has(v)),
  };
}