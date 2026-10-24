import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Template } from '@/features/templates/schemas';

interface TemplateState {
  favoriteIds: string[];
  customTemplates: Template[];
  toggleFavorite: (id: string) => void;
  importTemplates: (templates: Template[]) => void;
  deleteCustomTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      customTemplates: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((x) => x !== id)
            : [...state.favoriteIds, id],
        })),
      importTemplates: (templates) =>
        set((state) => ({ customTemplates: [...state.customTemplates, ...templates] })),
      deleteCustomTemplate: (id) =>
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
          favoriteIds: state.favoriteIds.filter((x) => x !== id), // don't leave a dangling favorite
        })),
    }),
    { name: 'promptlab-templates', version: 1 },
  ),
);