import {
  ExternalLink,
  Eye,
  EyeOff,
  GitCompareArrows,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { diffLines } from "@/features/versions/diff";
import { formatAgo, formatDateTime } from "@/utils/dates";
import type { HistoryEntry } from "../types";
import { CommitHash } from "./CommitHash";

interface HistoryLogCardProps {
  entry: HistoryEntry;
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

const lineClass = {
  added: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  removed: "bg-red-500/10 text-red-600 line-through dark:text-red-400",
  same: "text-muted-foreground",
} as const;

const linePrefix = { added: "+ ", removed: "− ", same: "  " } as const;

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export function HistoryLogCard({
  entry,
  onRestore,
  onDelete,
}: HistoryLogCardProps) {
  const { t } = useTranslation();
  const [showDiff, setShowDiff] = useState(false);
  const diffId = useId();

  const diff = useMemo(
    () =>
      showDiff ? diffLines(entry.previousContent ?? "", entry.content) : [],
    [showDiff, entry.previousContent, entry.content],
  );

  const date = new Date(entry.createdAt);
  const tokenDelta = `${entry.tokenDelta >= 0 ? "+" : ""}${entry.tokenDelta}`;

  return (
    <article
      className={`rounded-xl border bg-card p-5 ${
        entry.isRollback ? "border-red-500/40" : "border-border"
      }`}
    >
      {/* Title row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link
          to={`/editor/${entry.promptId}`}
          dir="auto"
          className="font-heading text-base font-semibold hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          {entry.promptTitle}
        </Link>
        <span
          dir="ltr"
          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
        >
          {entry.label}
        </span>
        {entry.isCurrent && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            {t("history.badge.current")}
          </span>
        )}
        {entry.isRollback && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-500">
            <RotateCcw className="size-3" aria-hidden="true" />
            {t("history.badge.rollback")}
          </span>
        )}
        <span className="ms-auto">
          <CommitHash hash={entry.hash} />
        </span>
      </div>

      {/* Author + time */}
      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
          aria-hidden="true"
        >
          M
        </span>
        Maha
        <span aria-hidden="true">·</span>
        <time dateTime={entry.createdAt} title={formatDateTime(date)}>
          {formatAgo(date)}
        </time>
      </p>

      {/* Note */}
      <p dir="auto" className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-sm">
        {entry.note || t("history.card.noDescription")}
      </p>

      {/* Telemetry chips */}
      <ul
        className="mt-3 flex flex-wrap gap-2 text-xs font-medium"
        aria-label={t("history.card.changesLabel")}
      >
        <li className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400">
          {t("history.card.linesAdded", { total: entry.linesAdded })}
        </li>
        <li className="rounded-md bg-red-500/10 px-2 py-1 text-red-600 dark:text-red-400">
          {t("history.card.linesRemoved", { total: entry.linesRemoved })}
        </li>
        <li className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
          {t("history.card.tokens", { delta: tokenDelta })}
        </li>
        {entry.restoredFrom && (
          <li className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
            {t("history.card.restoredFrom", { label: entry.restoredFrom })}
          </li>
        )}
      </ul>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={actionBtn}
          aria-expanded={showDiff}
          aria-controls={diffId}
          onClick={() => setShowDiff((v) => !v)}
        >
          {showDiff ? (
            <EyeOff className="size-3.5" aria-hidden="true" />
          ) : (
            <Eye className="size-3.5" aria-hidden="true" />
          )}
          {showDiff ? t("history.card.hideDiff") : t("history.card.viewDiff")}
        </button>

        <button
          type="button"
          className={actionBtn}
          onClick={() => onRestore(entry)}
          disabled={entry.isCurrent}
          title={entry.isCurrent ? t("history.card.alreadyCurrent") : undefined}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          {t("history.card.restore")}
        </button>

        <Link to={`/editor/${entry.promptId}`} className={actionBtn}>
          <ExternalLink className="size-3.5" aria-hidden="true" />
          {t("history.card.open")}
        </Link>
        {!entry.isInitial && (
          <Link
            to={`/compare?prompt=${entry.promptId}&target=${entry.id}`}
            className={actionBtn}
          >
            <GitCompareArrows className="size-3.5" aria-hidden="true" />
            {t("history.card.compare")}
          </Link>
        )}
        <button
          type="button"
          className={`${actionBtn} ms-auto text-red-500`}
          onClick={() => onDelete(entry)}
          disabled={entry.isCurrent}
          aria-label={t("history.card.delete", { label: entry.label })}
          title={
            entry.isCurrent ? t("history.card.cannotDeleteCurrent") : undefined
          }
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Inline diff */}
      {showDiff && (
        <pre
          id={diffId}
          dir="ltr"
          data-lenis-prevent
          className="mt-3 max-h-64 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed"
        >
          {diff.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap px-1 ${lineClass[line.type]}`}
            >
              {linePrefix[line.type]}
              {line.text || " "}
            </div>
          ))}
        </pre>
      )}
    </article>
  );
}
