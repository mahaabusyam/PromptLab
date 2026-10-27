import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePromptStore } from "@/stores/promptStore";
import { useLibraryStore } from "@/stores/libraryStore";
import type { PromptCategory } from "@/features/prompts/types";
import { applyFilters } from "../filterPrompts";
import type { LibraryFilters } from "../types";

export function useLibraryPrompts() {
  const prompts = usePromptStore((s) => s.prompts);
  const folders = usePromptStore((s) => s.folders);

  // بنختار عدة حقول بمرة وحدة. useShallow بيقارن الحقول وحدة وحدة،
  // بدونه الـ object الجديد كل render بيسبب infinite loop
  const { search, sort, model, tag, category, scope } = useLibraryStore(
    useShallow((s) => ({
      search: s.search,
      sort: s.sort,
      model: s.model,
      tag: s.tag,
      category: s.category,
      scope: s.scope,
    })),
  );

  const filters = useMemo<LibraryFilters>(
    () => ({ search, sort, model, tag, category, scope }),
    [search, sort, model, tag, category, scope],
  );

  const filtered = useMemo(
    () => applyFilters(prompts, filters, folders),
    [prompts, filters, folders],
  );

  // أعداد التصنيفات: نطبّق كل الفلاتر ما عدا التصنيف نفسه
  const categoryCounts = useMemo(() => {
    const base = applyFilters(
      prompts,
      { ...filters, category: "all" },
      folders,
    );
    const byCategory: Partial<Record<PromptCategory, number>> = {};
    base.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    });
    return { all: base.length, byCategory };
  }, [prompts, filters, folders]);

  const activeCount = useMemo(
    () => prompts.filter((p) => !p.isArchived).length,
    [prompts],
  );

  const allTags = useMemo(
    () =>
      [
        ...new Set(prompts.filter((p) => !p.isArchived).flatMap((p) => p.tags)),
      ].sort(),
    [prompts],
  );

  const hasActiveFilters =
    Boolean(search.trim()) ||
    model !== "all" ||
    tag !== null ||
    category !== "all";

  return { filtered, categoryCounts, activeCount, allTags, hasActiveFilters };
}
