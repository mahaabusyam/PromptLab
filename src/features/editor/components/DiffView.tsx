import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { diffLines, summarizeDiff } from "@/features/versions/diff";
import type { DiffLineType } from "@/features/versions/diff";

const rowStyles: Record<DiffLineType, string> = {
  same: "text-on-surface-variant",
  added: "bg-primary/10 text-on-surface",
  removed: "bg-error-container/30 text-on-surface-variant",
};
const signs: Record<DiffLineType, string> = {
  same: " ",
  added: "+",
  removed: "−",
};

interface DiffViewProps {
  before: string | undefined;
  after: string;
  baseLabel: string;
}

export function DiffView({ before, after, baseLabel }: DiffViewProps) {
  const { t } = useTranslation();
  const lines = useMemo(
    () => (before === undefined ? [] : diffLines(before, after)),
    [before, after],
  );
  const { added, removed } = useMemo(() => summarizeDiff(lines), [lines]);

  // للقارئ الشاشة فقط: بتتترجم حسب اللغة الحالية
  const srLabels: Record<DiffLineType, string> = {
    same: "",
    added: t("editor.diffView.added"),
    removed: t("editor.diffView.removed"),
  };

  if (before === undefined) {
    return (
      <p className="p-space-md text-body-sm text-outline">
        {t("editor.diffView.createFirst")}
      </p>
    );
  }
  if (added === 0 && removed === 0) {
    return (
      <p className="p-space-md text-body-sm text-outline">
        {t("editor.diffView.noChanges", { label: baseLabel })}
      </p>
    );
  }

  return (
    <div className="py-space-sm font-code-md text-code-md leading-6">
      <p className="flex items-center gap-3 px-space-md pb-2 text-label-sm text-outline">
        {t("editor.diffView.workingCopy", { label: baseLabel })}
        <span dir="ltr" className="font-semibold text-primary">
          +{added}
        </span>
        <span dir="ltr" className="font-semibold text-error">
          −{removed}
        </span>
      </p>
      {/* منطقة الفروقات LTR (العلامة +/− عاليسار)، واتجاه نص كل سطر تلقائي */}
      <div dir="ltr">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`flex whitespace-pre-wrap break-words px-space-md ${rowStyles[line.type]}`}
          >
            <span
              aria-hidden
              className="w-6 shrink-0 select-none text-center text-outline"
            >
              {signs[line.type]}
            </span>
            <span dir="auto" className="min-w-0 flex-1">
              <span className="sr-only">
                {srLabels[line.type] ? `${srLabels[line.type]} ` : ""}
              </span>
              {line.text || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
