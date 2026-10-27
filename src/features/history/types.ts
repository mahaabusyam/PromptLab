export interface HistoryEntry {
  id: string; // version id
  promptId: string;
  promptTitle: string;
  label: string;
  note: string;
  createdAt: string;
  hash: string;
  isRollback: boolean;
  restoredFrom: string | null;
  linesAdded: number;
  linesRemoved: number;
  tokenDelta: number;
  isInitial: boolean;
  content: string;
  previousContent: string | null;
  isCurrent: boolean;
}

export interface HistoryStats {
  totalCommits: number;
  rollbacks: number;
  promptsVersioned: number;
  avgDaily: number;
  commitsTrend: number | null; // % vs previous 30 days, null if no baseline
}
export type HistoryKind = "all" | "edit" | "rollback" | "initial";
export type HistoryRange = "7d" | "30d" | "90d" | "all";
export type HistoryView = "timeline" | "table";

export interface HistoryFilters {
  query: string;
  promptId: string; // 'all' or a prompt id
  range: HistoryRange;
  kind: HistoryKind;
}
