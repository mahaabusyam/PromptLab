import { Columns2, Rows3, WrapText } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type DiffMode = "split" | "unified";

interface DiffToolbarProps {
  mode: DiffMode;
  onModeChange: (mode: DiffMode) => void;
  wrap: boolean;
  onWrapChange: (wrap: boolean) => void;
  children?: ReactNode;
}

export function DiffToolbar({
  mode,
  onModeChange,
  wrap,
  onWrapChange,
  children,
}: DiffToolbarProps) {
  const { t } = useTranslation();

  const modes = [
    {
      value: "split" as const,
      label: t("compare.toolbar.split"),
      icon: Columns2,
    },
    {
      value: "unified" as const,
      label: t("compare.toolbar.unified"),
      icon: Rows3,
    },
  ];

  return (
    <div data-enter className="flex flex-wrap items-center gap-3">
      <div
        className="inline-flex rounded-xl border border-border bg-card p-1"
        role="group"
        aria-label={t("compare.toolbar.layout")}
      >
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onModeChange(value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              mode === value
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={wrap}
        onClick={() => onWrapChange(!wrap)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
      >
        <WrapText className="size-4" aria-hidden="true" />
        {wrap ? t("compare.toolbar.wrapOn") : t("compare.toolbar.wrapOff")}
      </button>

      <div className="ms-auto flex flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
}
