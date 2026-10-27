import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedFolders, seedPrompts } from "@/data/seedPrompts";
import type { Folder, Prompt, PromptVersion } from "@/features/prompts/types";
import { nextVersionLabel } from "@/features/versions/versionLabel";
import type { VersionBump } from "@/features/versions/versionLabel";
import { modelCatalog } from "@/features/prompts/constants";
import { useSettingsStore } from "@/stores/settingsStore";

export type NewPromptInput = Pick<Prompt, "title" | "content"> &
  Partial<
    Omit<
      Prompt,
      "id" | "title" | "content" | "versions" | "createdAt" | "updatedAt"
    >
  >;

interface PromptState {
  prompts: Prompt[];
  folders: Folder[];
  addPrompt: (input: NewPromptInput) => Prompt;
  updatePrompt: (
    id: string,
    changes: Partial<Omit<Prompt, "id" | "createdAt">>,
  ) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  addFolder: (name: string, parentId?: string | null) => Folder;
  addVersion: (
    id: string,
    input: { note: string; content: string; bump: VersionBump },
  ) => PromptVersion | null;
  importData: (
    data: { prompts: Prompt[]; folders: Folder[] },
    mode: "merge" | "replace",
  ) => void;
  resetToSeed: () => void;
  restoreVersion: (promptId: string, versionId: string) => PromptVersion | null;
  deleteVersion: (promptId: string, versionId: string) => boolean;
}

function resolveDefaultModel(): Prompt["model"] {
  const name = useSettingsStore.getState().settings.defaultModel;
  const entry = modelCatalog.find((m) => m.name === name);
  return entry
    ? { name: entry.name, provider: entry.provider }
    : { name: "Claude 3.5 Sonnet", provider: "anthropic" };
}

/** دمج حسب الـ id: العنصر المستورد بيستبدل الموجود إذا إلهم نفس الـ id */
function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const byId = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
}

export const usePromptStore = create<PromptState>()(
  persist(
    // get: بنحتاجها بـ addVersion عشان نقرأ الـ Prompt الحالي قبل ما نضيف نسخة
    (set, get) => ({
      prompts: seedPrompts,
      folders: seedFolders,

      addPrompt: (input) => {
        const now = new Date().toISOString();
        const prompt: Prompt = {
          description: "",
          status: "draft",
          category: "writing",
          tags: [],
          model: resolveDefaultModel(),
          folderId: null,
          isFavorite: false,
          isArchived: false,
          ...input,
          id: crypto.randomUUID(),
          versions: [
            {
              id: crypto.randomUUID(),
              label: "v1.0",
              content: input.content,
              note: "Initial version",
              createdAt: now,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ prompts: [prompt, ...state.prompts] }));
        return prompt;
      },

      updatePrompt: (id, changes) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id
              ? { ...p, ...changes, updatedAt: new Date().toISOString() }
              : p,
          ),
        })),

      deletePrompt: (id) =>
        set((state) => ({ prompts: state.prompts.filter((p) => p.id !== id) })),

      toggleFavorite: (id) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p,
          ),
        })),

      toggleArchive: (id) =>
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, isArchived: !p.isArchived } : p,
          ),
        })),

      addFolder: (name, parentId = null) => {
        const folder: Folder = {
          id: crypto.randomUUID(),
          name: name.trim(),
          parentId,
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return folder;
      },

      addVersion: (id, { note, content, bump }) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (!prompt) return null;

        const version: PromptVersion = {
          id: crypto.randomUUID(),
          label: nextVersionLabel(prompt.versions, bump),
          content,
          note,
          createdAt: new Date().toISOString(),
        };
        // نحدّث النص الشغّال وقائمة النسخ بنفس العملية (set واحد)
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  content,
                  versions: [...p.versions, version],
                  updatedAt: version.createdAt,
                }
              : p,
          ),
        }));
        return version;
      },
      restoreVersion: (promptId, versionId) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        const source = prompt?.versions.find((v) => v.id === versionId);
        if (!prompt || !source) return null;

        // Reuse addVersion so label/updatedAt logic stays in ONE place.
        const created = get().addVersion(promptId, {
          note: `Restored from ${source.label}`,
          content: source.content,
          bump: "minor",
        });
        if (!created) return null;

        const withMarker: PromptVersion = {
          ...created,
          restoredFrom: source.label,
        };
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === promptId
              ? {
                  ...p,
                  versions: p.versions.map((v) =>
                    v.id === created.id ? withMarker : v,
                  ),
                }
              : p,
          ),
        }));
        return withMarker;
      },
      deleteVersion: (promptId, versionId) => {
        const prompt = get().prompts.find((p) => p.id === promptId);
        if (!prompt) return false;

        const index = prompt.versions.findIndex((v) => v.id === versionId);
        // Guard in the store too (not only in the UI): the current (last) version is protected.
        if (index === -1 || index === prompt.versions.length - 1) return false;

        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === promptId
              ? { ...p, versions: p.versions.filter((v) => v.id !== versionId) }
              : p,
          ),
        }));
        return true;
      },

      importData: (data, mode) =>
        set((state) =>
          mode === "replace"
            ? { prompts: data.prompts, folders: data.folders }
            : {
                prompts: mergeById(state.prompts, data.prompts),
                folders: mergeById(state.folders, data.folders),
              },
        ),

      resetToSeed: () => set({ prompts: seedPrompts, folders: seedFolders }),
    }),
    { name: "promptlab-prompts", version: 1 },
  ),
);
