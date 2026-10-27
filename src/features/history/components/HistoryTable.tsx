import {
  ExternalLink,
  GitCompareArrows,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatAgo, formatDateTime } from "@/utils/dates";
import type { HistoryEntry } from "../types";
import { CommitHash } from "./CommitHash";

interface HistoryTableProps {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const th =
  "px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function HistoryTable({
  entries,
  onRestore,
  onDelete,
}: HistoryTableProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <caption className="sr-only">{t("history.table.caption")}</caption>
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th scope="col" className={th}>
              {t("history.table.prompt")}
            </th>
            <th scope="col" className={th}>
              {t("history.table.version")}
            </th>
            <th scope="col" className={th}>
              {t("history.table.hash")}
            </th>
            <th scope="col" className={th}>
              {t("history.table.note")}
            </th>
            <th scope="col" className={th}>
              {t("history.table.changes")}
            </th>
            <th scope="col" className={th}>
              {t("history.table.when")}
            </th>
            <th scope="col" className={`${th} text-end`}>
              {t("history.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const date = new Date(e.createdAt);
            return (
              <tr
                key={e.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    to={`/editor/${e.promptId}`}
                    dir="auto"
                    className="hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {e.promptTitle}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span
                      dir="ltr"
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {e.label}
                    </span>
                    {e.isCurrent && (
                      <span className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        {t("history.badge.current")}
                      </span>
                    )}
                    {e.isRollback && (
                      <span className="text-[11px] font-semibold uppercase text-red-500">
                        {t("history.badge.rollback")}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CommitHash hash={e.hash} />
                </td>
                <td
                  dir="auto"
                  className="max-w-64 truncate px-4 py-3 text-muted-foreground"
                  title={e.note}
                >
                  {e.note || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs font-medium">
                  <span
                    dir="ltr"
                    className="inline-block text-emerald-600 dark:text-emerald-400"
                  >
                    +{e.linesAdded}
                  </span>{" "}
                  <span
                    dir="ltr"
                    className="inline-block text-red-600 dark:text-red-400"
                  >
                    −{e.linesRemoved}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {t("history.card.tokensShort", {
                      delta: `${e.tokenDelta >= 0 ? "+" : ""}${e.tokenDelta}`,
                    })}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  <time dateTime={e.createdAt} title={formatDateTime(date)}>
                    {formatAgo(date)}
                  </time>
                </td>
                <td className="px-4 py-3">
                  <span className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      className={iconBtn}
                      onClick={() => onRestore(e)}
                      disabled={e.isCurrent}
                      aria-label={t("history.table.restoreLabel", {
                        label: e.label,
                        title: e.promptTitle,
                      })}
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    </button>
                    <Link
                      to={`/editor/${e.promptId}`}
                      className={iconBtn}
                      aria-label={t("history.table.openLabel", {
                        title: e.promptTitle,
                      })}
                    >
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </Link>
                    {!e.isInitial && (
                      <Link
                        to={`/compare?prompt=${e.promptId}&target=${e.id}`}
                        className={iconBtn}
                        aria-label={t("history.table.compareLabel", {
                          label: e.label,
                        })}
                      >
                        <GitCompareArrows
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                    <button
                      type="button"
                      className={`${iconBtn} text-red-500`}
                      onClick={() => onDelete(e)}
                      disabled={e.isCurrent}
                      aria-label={t("history.table.deleteLabel", {
                        label: e.label,
                        title: e.promptTitle,
                      })}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
