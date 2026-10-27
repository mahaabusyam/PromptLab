import { useEffect, useRef } from "react";
import { LayoutGrid, List, Search, Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import type { DropdownOption } from "@/components/common/FilterDropdown";
import { providerLabels } from "@/features/prompts/constants";
import type { ModelProvider, PromptCategory } from "@/features/prompts/types";
import { useLibraryStore } from "@/stores/libraryStore";
import type { SortKey } from "../types";
import { CategoryPills } from "./CategoryPills";

const viewBtn = "rounded-lg p-1.5 transition-colors";

interface LibraryToolbarProps {
  allTags: string[];
  categoryCounts: {
    all: number;
    byCategory: Partial<Record<PromptCategory, number>>;
  };
  hasActiveFilters: boolean;
}

export function LibraryToolbar({
  allTags,
  categoryCounts,
  hasActiveFilters,
}: LibraryToolbarProps) {
  const { t } = useTranslation();
  const searchRef = useRef<HTMLInputElement>(null);
  const search = useLibraryStore((s) => s.search);
  const sort = useLibraryStore((s) => s.sort);
  const model = useLibraryStore((s) => s.model);
  const tag = useLibraryStore((s) => s.tag);
  const viewMode = useLibraryStore((s) => s.viewMode);
  const setSearch = useLibraryStore((s) => s.setSearch);
  const setSort = useLibraryStore((s) => s.setSort);
  const setModel = useLibraryStore((s) => s.setModel);
  const setTag = useLibraryStore((s) => s.setTag);
  const setViewMode = useLibraryStore((s) => s.setViewMode);
  const resetFilters = useLibraryStore((s) => s.resetFilters);

  // الخيارات جوّا الـ component عشان تتترجم حسب اللغة الحالية
  const sortOptions: DropdownOption<SortKey>[] = [
    { value: "updated", label: t("library.toolbar.sort.updated") },
    { value: "created", label: t("library.toolbar.sort.created") },
    { value: "title", label: t("library.toolbar.sort.title") },
  ];

  const modelOptions: DropdownOption<"all" | ModelProvider>[] = [
    { value: "all", label: t("library.toolbar.allModels") },
    ...(Object.keys(providerLabels) as ModelProvider[]).map((id) => ({
      value: id,
      label: providerLabels[id],
    })),
  ];

  // اختصار "/" يفتح البحث (إلا إذا كنتي أصلاً بتكتبي بحقل)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing =
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const tagOptions: DropdownOption<string>[] = [
    { value: "all", label: t("library.toolbar.allTags") },
    ...allTags.map((tg) => ({ value: tg, label: `#${tg}` })),
  ];

  return (
    <section
      data-reveal
      aria-label={t("library.toolbar.region")}
      className="relative z-20 flex flex-col gap-space-sm rounded-2xl bg-surface-container-low/90 p-space-sm shadow-md backdrop-blur-md"
    >
      <div className="flex flex-col items-stretch justify-between gap-space-sm lg:flex-row lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-outline" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t("library.toolbar.searchLabel")}
            placeholder={t("library.toolbar.searchPlaceholder")}
            className="w-full rounded-xl bg-surface-container-lowest/90 py-2.5 ps-11 pe-14 text-body-md text-on-surface shadow-inner placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center">
            {search ? (
              <button
                type="button"
                aria-label={t("library.toolbar.clearSearch")}
                onClick={() => setSearch("")}
                className="rounded p-0.5 text-outline hover:text-on-surface"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none rounded bg-surface-container px-1.5 py-0.5 font-code-md text-[11px] text-on-surface-variant">
                /
              </kbd>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <FilterDropdown
            ariaLabel={t("library.toolbar.sortLabel")}
            prefix={t("library.toolbar.sortPrefix")}
            value={sort}
            options={sortOptions}
            onChange={setSort}
          />
          <FilterDropdown
            ariaLabel={t("library.toolbar.modelLabel")}
            prefix={t("library.toolbar.modelPrefix")}
            value={model}
            options={modelOptions}
            onChange={setModel}
          />
          <FilterDropdown
            ariaLabel={t("library.toolbar.tagLabel")}
            icon={<Tag className="size-4 text-outline" />}
            value={tag ?? "all"}
            options={tagOptions}
            onChange={(v) => setTag(v === "all" ? null : v)}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl px-2.5 py-2 text-body-sm text-primary transition-colors hover:bg-surface-container-high"
            >
              {t("library.toolbar.clearFilters")}
            </button>
          )}

          <div className="mx-1 hidden h-6 w-px bg-surface-variant sm:block" />

          <div className="flex items-center rounded-xl bg-surface-container-lowest p-1">
            <button
              type="button"
              aria-label={t("library.toolbar.gridView")}
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={`${viewBtn} ${viewMode === "grid" ? "bg-secondary-container text-on-secondary-container shadow-sm" : "text-outline hover:bg-surface-container hover:text-on-surface"}`}
            >
              <LayoutGrid className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label={t("library.toolbar.listView")}
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={`${viewBtn} ${viewMode === "list" ? "bg-secondary-container text-on-secondary-container shadow-sm" : "text-outline hover:bg-surface-container hover:text-on-surface"}`}
            >
              <List className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <CategoryPills counts={categoryCounts} />
    </section>
  );
}
