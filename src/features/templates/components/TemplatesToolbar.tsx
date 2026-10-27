import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  categoryLabels,
  categoryOrder,
  providerLabels,
} from "@/features/prompts/constants";
import { complexityLabels, sortLabels } from "../constants";
import { hasActiveTemplateFilters } from "../filterTemplates";
import type { TemplateComplexity } from "../schemas";
import type {
  TemplateCategory,
  TemplateFilters,
  TemplateProvider,
  TemplateSort,
} from "../types";

interface TemplatesToolbarProps {
  filters: TemplateFilters;
  counts: Record<string, number>;
  onChange: (patch: Partial<TemplateFilters>) => void;
  onReset: () => void;
}

const selectClass =
  "h-10 rounded-xl border border-border bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary";

const providerKeys = Object.keys(providerLabels) as TemplateProvider[];
const complexityKeys = Object.keys(complexityLabels) as TemplateComplexity[];
const sortKeys = Object.keys(sortLabels) as TemplateSort[];

export function TemplatesToolbar({
  filters,
  counts,
  onChange,
  onReset,
}: TemplatesToolbarProps) {
  const { t } = useTranslation();
  const pills: { value: TemplateCategory | "all"; label: string }[] = [
    { value: "all", label: t("templates.toolbar.all") },
    ...categoryOrder.map((c) => ({
      value: c as TemplateCategory,
      label: categoryLabels[c],
    })),
  ];

  return (
    <div
      data-enter
      className="space-y-3 rounded-2xl border border-border bg-card/60 p-3"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Category pills */}
        <div
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto"
          role="group"
          aria-label={t("templates.toolbar.categoryGroup")}
        >
          {pills.map(({ value, label }) => {
            const active = filters.category === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ category: value })}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${active ? "bg-black/20" : "bg-muted"}`}
                >
                  {counts[value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selects */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={t("templates.toolbar.modelLabel")}
            value={filters.provider}
            onChange={(e) =>
              onChange({ provider: e.target.value as TemplateProvider | "all" })
            }
            className={selectClass}
          >
            <option value="all">{t("templates.toolbar.allModels")}</option>
            {providerKeys.map((p) => (
              <option key={p} value={p}>
                {providerLabels[p]}
              </option>
            ))}
          </select>

          <select
            aria-label={t("templates.toolbar.complexityLabel")}
            value={filters.complexity}
            onChange={(e) =>
              onChange({
                complexity: e.target.value as TemplateComplexity | "all",
              })
            }
            className={selectClass}
          >
            <option value="all">
              {t("templates.toolbar.allComplexities")}
            </option>
            {complexityKeys.map((c) => (
              <option key={c} value={c}>
                {complexityLabels[c]}
              </option>
            ))}
          </select>

          <select
            aria-label={t("templates.toolbar.sortLabel")}
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as TemplateSort })}
            className={selectClass}
          >
            {sortKeys.map((s) => (
              <option key={s} value={s}>
                {sortLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveTemplateFilters(filters) && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="size-3.5" aria-hidden="true" />
          {t("templates.toolbar.clear")}
        </button>
      )}
    </div>
  );
}
