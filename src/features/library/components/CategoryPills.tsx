import { useTranslation } from "react-i18next";
import { categoryLabels, categoryOrder } from "@/features/prompts/constants";
import type { PromptCategory } from "@/features/prompts/types";
import { useLibraryStore } from "@/stores/libraryStore";

interface CategoryPillsProps {
  counts: { all: number; byCategory: Partial<Record<PromptCategory, number>> };
}

const pillBase =
  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-label-md transition-colors";
const pillActive =
  "bg-secondary-container font-semibold text-on-secondary-container shadow-sm";
const pillIdle =
  "bg-surface-container-high/70 text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface";

export function CategoryPills({ counts }: CategoryPillsProps) {
  const { t } = useTranslation();
  const category = useLibraryStore((s) => s.category);
  const setCategory = useLibraryStore((s) => s.setCategory);

  const items: { id: "all" | PromptCategory; label: string; count: number }[] =
    [
      { id: "all", label: t("library.scope.all"), count: counts.all },
      ...categoryOrder.map((id) => ({
        id,
        label: categoryLabels[id],
        count: counts.byCategory[id] ?? 0,
      })),
    ];

  return (
    <div
      role="group"
      aria-label={t("library.toolbar.categoryGroup")}
      className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={category === item.id}
          onClick={() => setCategory(item.id)}
          className={`${pillBase} ${category === item.id ? pillActive : pillIdle}`}
        >
          {item.label}{" "}
          <span className="ms-1 text-[11px] font-normal opacity-80">
            {item.count}
          </span>
        </button>
      ))}
    </div>
  );
}
