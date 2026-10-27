import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FolderTree } from "@/features/library/components/FolderTree";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { LibraryToolbar } from "@/features/library/components/LibraryToolbar";
import { PromptResults } from "@/features/library/components/PromptResults";
import { useLibraryPrompts } from "@/features/library/hooks/useLibraryPrompts";

export default function LibraryPage() {
  const ref = useScrollReveal<HTMLDivElement>();
  const { filtered, categoryCounts, activeCount, allTags, hasActiveFilters } =
    useLibraryPrompts();

  return (
    <div ref={ref} className="flex w-full flex-col gap-space-lg">
      <LibraryHeader activeCount={activeCount} />
      <LibraryToolbar
        allTags={allTags}
        categoryCounts={categoryCounts}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex flex-col gap-space-lg lg:flex-row lg:items-start">
        <FolderTree />
        <PromptResults prompts={filtered} hasActiveFilters={hasActiveFilters} />
      </div>
    </div>
  );
}
