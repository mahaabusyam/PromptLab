import type { ModelProvider, PromptCategory } from "@/features/prompts/types";

export type SortKey = "updated" | "created" | "title";
export type ViewMode = "grid" | "list";

// أين نبحث؟ (بنستخدمها بالجزء 9ب مع شجرة المجلدات)
export type LibraryScope =
  | { kind: "all" }
  | { kind: "starred" }
  | { kind: "archive" }
  | { kind: "folder"; folderId: string };

export interface LibraryFilters {
  search: string;
  sort: SortKey;
  model: "all" | ModelProvider;
  tag: string | null;
  category: "all" | PromptCategory;
  scope: LibraryScope;
}
