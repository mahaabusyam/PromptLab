import type { Folder, Prompt } from "@/features/prompts/types";
import type { LibraryFilters, SortKey } from "./types";

/** المجلد نفسه + كل المجلدات الفرعية تحته */
export function collectFolderIds(
  folders: Folder[],
  rootId: string,
): Set<string> {
  const ids = new Set<string>([rootId]);
  const addChildren = (parentId: string) => {
    folders
      .filter((f) => f.parentId === parentId)
      .forEach((f) => {
        ids.add(f.id);
        addChildren(f.id);
      });
  };
  addChildren(rootId);
  return ids;
}

const sorters: Record<SortKey, (a: Prompt, b: Prompt) => number> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  created: (a, b) => b.createdAt.localeCompare(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title),
};

export function applyFilters(
  prompts: Prompt[],
  filters: LibraryFilters,
  folders: Folder[],
): Prompt[] {
  const { scope, category, model, tag, search, sort } = filters;
  const query = search.trim().toLowerCase();
  const folderIds =
    scope.kind === "folder" ? collectFolderIds(folders, scope.folderId) : null;

  return prompts
    .filter((p) => {
      // المؤرشف بيظهر بس بقسم Archive
      if (scope.kind === "archive" ? !p.isArchived : p.isArchived) return false;
      if (scope.kind === "starred" && !p.isFavorite) return false;
      if (folderIds && (!p.folderId || !folderIds.has(p.folderId)))
        return false;
      if (category !== "all" && p.category !== category) return false;
      if (model !== "all" && p.model.provider !== model) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (query) {
        // البحث بالمحتوى كمان، فبيلاقي أسماء المتغيرات مثل {{topic}}
        const haystack = `${p.title} ${p.description} ${p.content} ${p.tags.join(" ")}`;
        if (!haystack.toLowerCase().includes(query)) return false;
      }
      return true;
    })
    .sort(sorters[sort]); // filter رجّعت مصفوفة جديدة، فالـ sort ما بيلمس الـ store
}
