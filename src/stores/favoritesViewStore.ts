import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteView } from '@/features/favorites/types';

interface FavoritesViewState {
  view: FavoriteView;
  setView: (view: FavoriteView) => void;
}

export const useFavoritesViewStore = create<FavoritesViewState>()(
  persist((set) => ({ view: 'grid', setView: (view) => set({ view }) }), {
    name: 'promptlab-favorites-view',
    version: 1,
  }),
);