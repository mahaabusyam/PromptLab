import { Keyboard } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Trans, useTranslation } from "react-i18next";
import { buildFavoriteStats } from "@/features/favorites/buildFavorites";
import { FavoritesHeader } from "@/features/favorites/components/FavoritesHeader";
import { FavoritesList } from "@/features/favorites/components/FavoritesList";
import type { TemplateEntry } from "@/features/favorites/components/FavoriteParts";
import { FavoritesSidebar } from "@/features/favorites/components/FavoritesSidebar";
import { FavoritesStats } from "@/features/favorites/components/FavoritesStats";
import { FavoritesToolbar } from "@/features/favorites/components/FavoritesToolbar";
import { FAVORITES_PAGE_SIZE } from "@/features/favorites/constants";
import {
  DEFAULT_FAVORITE_FILTERS,
  countByTab,
  filterFavorites,
} from "@/features/favorites/filterFavorites";
import { useFavoriteEntries } from "@/features/favorites/hooks/useFavoriteEntries";
import {
  buildFolderCounts,
  buildTopVariables,
} from "@/features/favorites/sidebarData";
import type {
  FavoriteEntry,
  FavoriteFilters,
} from "@/features/favorites/types";
import { ListPagination } from "@/components/common/ListPagination";
import { paginate } from "@/features/history/paginate";
import { TemplatePreviewDialog } from "@/features/templates/components/TemplatePreviewDialog";
import { useUseTemplate } from "@/features/templates/hooks/useUseTemplate";
import type { Template } from "@/features/templates/schemas";
import type { TemplateListItem } from "@/features/templates/types";
import { useFavoritesViewStore } from "@/stores/favoritesViewStore";
import { usePromptStore } from "@/stores/promptStore";
import { useTemplateStore } from "@/stores/templateStore";

interface Notice {
  text: string;
  undoEntry: FavoriteEntry;
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const entries = useFavoriteEntries();

  const [filters, setFilters] = useState<FavoriteFilters>(
    DEFAULT_FAVORITE_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<TemplateListItem | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const view = useFavoritesViewStore((s) => s.view);
  const setView = useFavoritesViewStore((s) => s.setView);
  const folders = usePromptStore((s) => s.folders);
  const togglePrompt = usePromptStore((s) => s.toggleFavorite);
  const toggleTemplate = useTemplateStore((s) => s.toggleFavorite);
  const startFromTemplate = useUseTemplate();

  const stats = useMemo(() => buildFavoriteStats(entries), [entries]);
  const visible = useMemo(
    () => filterFavorites(entries, filters),
    [entries, filters],
  );
  const counts = useMemo(
    () => countByTab(entries, filters),
    [entries, filters],
  );
  const pageResult = useMemo(
    () => paginate(visible, page, FAVORITES_PAGE_SIZE),
    [visible, page],
  );

  // Sidebar describes ALL favorites (not the filtered ones), so choices never vanish
  const folderCounts = useMemo(
    () => buildFolderCounts(entries, folders),
    [entries, folders],
  );
  const topVariables = useMemo(() => buildTopVariables(entries), [entries]);

  const handleChange = useCallback((patch: Partial<FavoriteFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FAVORITE_FILTERS);
    setPage(1);
  }, []);

  const flip = useCallback(
    (entry: FavoriteEntry) =>
      entry.kind === "prompt"
        ? togglePrompt(entry.id)
        : toggleTemplate(entry.id),
    [togglePrompt, toggleTemplate],
  );

  // Everything on this page is already a favorite, so toggling = removing (with Undo)
  const handleToggle = useCallback(
    (entry: FavoriteEntry) => {
      flip(entry);
      setNotice({
        text: t("favorites.page.removed", { title: entry.title }),
        undoEntry: entry,
      });
    },
    [flip, t],
  );

  function handleUndo(): void {
    if (!notice) return;
    flip(notice.undoEntry);
    setNotice(null);
  }

  const handleUse = useCallback(
    (template: Template) => {
      setPreview(null);
      startFromTemplate(template);
    },
    [startFromTemplate],
  );

  const handlePreview = useCallback((entry: TemplateEntry) => {
    setPreview({
      template: entry.template,
      variables: entry.variables,
      tokens: entry.tokens,
    });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-enter]",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="space-y-6">
      <FavoritesHeader entries={entries} />
      <FavoritesStats stats={stats} />
      <FavoritesToolbar
        filters={filters}
        counts={counts}
        onChange={handleChange}
        onReset={handleReset}
        view={view}
        onViewChange={setView}
      />

      {notice && (
        <p
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
        >
          <span dir="auto">{notice.text}</span>
          <button
            type="button"
            onClick={handleUndo}
            className="rounded-md px-2 py-0.5 font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {t("favorites.page.undo")}
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-9">
          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {entries.length === 0
                ? t("favorites.page.emptyAll")
                : t("favorites.page.noMatch")}
            </div>
          ) : (
            <>
              <FavoritesList
                entries={pageResult.items}
                view={view}
                onToggle={handleToggle}
                onUse={handleUse}
                onPreview={handlePreview}
              />
              <ListPagination
                result={pageResult}
                onPageChange={setPage}
                noun={t("favorites.page.noun")}
              />
            </>
          )}
        </div>

        <FavoritesSidebar
          folders={folderCounts}
          variables={topVariables}
          activeFolderId={filters.folderId}
          activeVariable={filters.variable}
          onFolderChange={(folderId) => handleChange({ folderId })}
          onVariableChange={(variable) => handleChange({ variable })}
        />
      </div>

      <p className="flex items-center justify-center gap-2 rounded-xl bg-card/60 px-4 py-2 text-center text-sm text-muted-foreground">
        <Keyboard
          className="size-4 shrink-0 text-pink-500"
          aria-hidden="true"
        />
        <span>
          <Trans
            i18nKey="favorites.page.tip"
            components={{
              kbd: (
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground" />
              ),
            }}
          />
        </span>
      </p>

      {preview && (
        <TemplatePreviewDialog
          item={preview}
          onClose={() => setPreview(null)}
          onUse={(item) => handleUse(item.template)}
        />
      )}
    </div>
  );
}
