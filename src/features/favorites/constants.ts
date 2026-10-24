import type { FavoriteSort } from './types';

export const favoriteSortLabels: Record<FavoriteSort, string> = {
  updated: 'Recently updated',
  name: 'Name (A–Z)',
  tokens: 'Token size (small first)',
};

export const FAVORITES_PAGE_SIZE = 6;