import i18n from "i18next";
import "@/i18n";
import type { FavoriteSort } from "./types";

export const favoriteSortLabels: Record<FavoriteSort, string> = {
  get updated() {
    return i18n.t("favorites.sort.updated");
  },
  get name() {
    return i18n.t("favorites.sort.name");
  },
  get tokens() {
    return i18n.t("favorites.sort.tokens");
  },
};

export const FAVORITES_PAGE_SIZE = 6;
