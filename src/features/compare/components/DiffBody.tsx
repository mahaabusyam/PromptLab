import { useTranslation } from "react-i18next";
import type { DiffCell, Segment, SplitRow, UnifiedRow } from "../diffRows";

const cellTone: Record<DiffCell["type"], string> = {
  same: "text-foreground",
  added: "bg-primary/10 text-foreground",
  removed: "bg-red-500/10 text-foreground",
};

const gutterTone: Record<DiffCell["type"], string> = {
  same: "text-muted-foreground/60",
  added: "text-primary",
  removed: "text-red-500",
};

const segmentTone: Record<"added" | "removed", string> = {
  added: "rounded bg-primary/30 px-0.5 font-semibold",
  removed: "rounded bg-red-500/30 px-0.5 font-semibold",
};

const sign: Record<DiffCell["type"], string> = {
  same: " ",
  added: "+",
  removed: "−",
};

/** Screen-reader prefix for changed lines ("Added: " / "Removed: "), translated. */
function useSignLabels(): Record<DiffCell["type"], string> {
  const { t } = useTranslation();
  return {
    same: "",
    added: `${t("compare.sr.added")} `,
    removed: `${t("compare.sr.removed")} `,
  };
}

/** Highlights {{variables}} inside a piece of text. */
function WithVariables({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
        part.startsWith("{{") ? (
          <span key={i} className="font-semibold text-primary">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function CellText({ cell }: { cell: DiffCell }) {
  if (cell.segments && cell.type !== "same") {
    const tone = segmentTone[cell.type];
    return (
      <>
        {cell.segments.map((s: Segment, i) =>
          s.changed ? (
            <mark key={i} className={`${tone} text-inherit`}>
              <WithVariables text={s.text} />
            </mark>
          ) : (
            <WithVariables key={i} text={s.text} />
          ),
        )}
      </>
    );
  }
  return <WithVariables text={cell.text || " "} />;
}

function CellView({ cell, wrap }: { cell: DiffCell; wrap: boolean }) {
  const signLabel = useSignLabels();
  return (
    <div className={`flex items-start px-2 ${cellTone[cell.type]}`}>
      <span
        aria-hidden="true"
        className={`w-10 shrink-0 select-none pe-3 text-end ${gutterTone[cell.type]}`}
      >
        {cell.lineNo}
      </span>
      <span
        aria-hidden="true"
        className={`w-4 shrink-0 select-none text-center font-bold ${gutterTone[cell.type]}`}
      >
        {sign[cell.type]}
      </span>
      <span
        dir="auto"
        className={
          wrap
            ? "min-w-0 flex-1 whitespace-pre-wrap break-words"
            : "flex-1 whitespace-pre"
        }
      >
        <span className="sr-only">{signLabel[cell.type]}</span>
        <CellText cell={cell} />
      </span>
    </div>
  );
}

function EmptyCell() {
  return <div aria-hidden="true" className="bg-muted/30" />;
}

export function SplitBody({ rows, wrap }: { rows: SplitRow[]; wrap: boolean }) {
  return (
    // ONE grid, two shared columns: rows can never get misaligned.
    <div className="grid grid-cols-[minmax(18rem,1fr)_minmax(18rem,1fr)] divide-x divide-border">
      {rows.map((row, i) => (
        <div key={i} className="contents">
          {row.left ? <CellView cell={row.left} wrap={wrap} /> : <EmptyCell />}
          {row.right ? (
            <CellView cell={row.right} wrap={wrap} />
          ) : (
            <EmptyCell />
          )}
        </div>
      ))}
    </div>
  );
}

export function UnifiedBody({
  rows,
  wrap,
}: {
  rows: UnifiedRow[];
  wrap: boolean;
}) {
  const signLabel = useSignLabels();
  return (
    <div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex items-start px-2 ${cellTone[row.cell.type]}`}
        >
          <span
            aria-hidden="true"
            className="w-9 shrink-0 select-none pe-2 text-end text-muted-foreground/60"
          >
            {row.oldNo ?? ""}
          </span>
          <span
            aria-hidden="true"
            className="w-9 shrink-0 select-none pe-2 text-end text-muted-foreground/60"
          >
            {row.newNo ?? ""}
          </span>
          <span
            aria-hidden="true"
            className={`w-4 shrink-0 select-none text-center font-bold ${gutterTone[row.cell.type]}`}
          >
            {sign[row.cell.type]}
          </span>
          <span
            dir="auto"
            className={
              wrap
                ? "min-w-0 flex-1 whitespace-pre-wrap break-words"
                : "flex-1 whitespace-pre"
            }
          >
            <span className="sr-only">{signLabel[row.cell.type]}</span>
            <CellText cell={row.cell} />
          </span>
        </div>
      ))}
    </div>
  );
}
