import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { templateCatalog } from "@/data/templates";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ListPagination } from "@/components/common/ListPagination";
import { paginate } from "@/features/history/paginate";
import { FeaturedTemplate } from "@/features/templates/components/FeaturedTemplate";
import { TemplatePreviewDialog } from "@/features/templates/components/TemplatePreviewDialog";
import { TemplatesGrid } from "@/features/templates/components/TemplatesGrid";
import { TemplatesHeader } from "@/features/templates/components/TemplatesHeader";
import { TemplatesImportBanner } from "@/features/templates/components/TemplatesImportBanner";
import { TemplatesToolbar } from "@/features/templates/components/TemplatesToolbar";
import { TEMPLATES_PAGE_SIZE } from "@/features/templates/constants";
import {
  DEFAULT_TEMPLATE_FILTERS,
  countByCategory,
  filterTemplates,
  hasActiveTemplateFilters,
  toListItem,
} from "@/features/templates/filterTemplates";
import { useUseTemplate } from "@/features/templates/hooks/useUseTemplate";
import {
  MAX_IMPORT_BYTES,
  parseTemplateImport,
} from "@/features/templates/importTemplates";
import type {
  TemplateFilters,
  TemplateListItem,
} from "@/features/templates/types";
import { useTemplateStore } from "@/stores/templateStore";

type Notice = { type: "success" | "error"; text: string };

export default function TemplatesPage() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<TemplateFilters>(
    DEFAULT_TEMPLATE_FILTERS,
  );
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<TemplateListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TemplateListItem | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const favoriteList = useTemplateStore((s) => s.favoriteIds);
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  const toggleFavorite = useTemplateStore((s) => s.toggleFavorite);
  const importTemplates = useTemplateStore((s) => s.importTemplates);
  const deleteCustomTemplate = useTemplateStore((s) => s.deleteCustomTemplate);
  const favoriteIds = useMemo(() => new Set(favoriteList), [favoriteList]);

  const startFromTemplate = useUseTemplate();
  const handleUse = useCallback(
    (item: TemplateListItem) => {
      setPreviewItem(null);
      startFromTemplate(item.template);
    },
    [startFromTemplate],
  );

  // Built-in catalog + imported templates. Derived values are computed once per change.
  const items = useMemo(
    () => [...templateCatalog, ...customTemplates].map(toListItem),
    [customTemplates],
  );
  const visible = useMemo(
    () => filterTemplates(items, filters),
    [items, filters],
  );
  const counts = useMemo(
    () => countByCategory(items, filters),
    [items, filters],
  );
  const pageResult = useMemo(
    () => paginate(visible, page, TEMPLATES_PAGE_SIZE),
    [visible, page],
  );

  const featured = useMemo(
    () => items.find((i) => i.template.featured),
    [items],
  );
  const showFeatured =
    featured !== undefined &&
    !hasActiveTemplateFilters(filters) &&
    pageResult.page === 1;

  const handleChange = useCallback((patch: Partial<TemplateFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_TEMPLATE_FILTERS);
    setPage(1);
  }, []);

  async function handleImportFile(file: File): Promise<void> {
    if (file.size > MAX_IMPORT_BYTES) {
      setNotice({ type: "error", text: t("templates.page.fileTooLarge") });
      return;
    }
    const result = parseTemplateImport(await file.text());
    if (!result.ok) {
      const text =
        result.code === "invalid_json"
          ? t("templates.importErrors.invalidJson")
          : result.code === "empty"
            ? t("templates.importErrors.empty")
            : t("templates.importErrors.invalidData", {
                where: result.where ?? t("templates.importErrors.file"),
                detail: result.detail ?? "",
              });
      setNotice({ type: "error", text });
      return;
    }
    importTemplates(result.templates);
    setNotice({
      type: "success",
      text: t("templates.page.imported", { total: result.templates.length }),
    });
  }

  function handleConfirmDelete(): void {
    if (!deleteItem) return;
    deleteCustomTemplate(deleteItem.template.id);
    setNotice({
      type: "success",
      text: t("templates.page.deleted", { title: deleteItem.template.title }),
    });
    setDeleteItem(null);
  }

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
      <TemplatesHeader
        total={items.length}
        query={filters.query}
        onQueryChange={(query) => handleChange({ query })}
      />

      <TemplatesToolbar
        filters={filters}
        counts={counts}
        onChange={handleChange}
        onReset={handleReset}
      />

      {notice && (
        <p
          role={notice.type === "error" ? "alert" : "status"}
          className={`rounded-lg border px-4 py-2 text-sm ${
            notice.type === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-500"
              : "border-primary/30 bg-primary/10 text-primary"
          }`}
        >
          {notice.text}
        </p>
      )}

      {showFeatured && featured && (
        <FeaturedTemplate item={featured} onUse={handleUse} />
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t("templates.page.displaying", {
          shown: pageResult.items.length,
          total: visible.length,
        })}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {items.length === 0
            ? t("templates.page.emptyCatalog")
            : t("templates.page.noMatch")}
        </div>
      ) : (
        <>
          <TemplatesGrid
            items={pageResult.items}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onUse={handleUse}
            onPreview={setPreviewItem}
            onDelete={setDeleteItem}
          />
          <ListPagination
            result={pageResult}
            onPageChange={setPage}
            noun={t("templates.page.noun")}
          />
        </>
      )}

      <TemplatesImportBanner onFile={handleImportFile} />

      {previewItem && (
        <TemplatePreviewDialog
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onUse={handleUse}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          tone="danger"
          title={t("templates.page.deleteTitle")}
          description={t("templates.page.deleteBody", {
            title: deleteItem.template.title,
          })}
          confirmLabel={t("templates.page.deleteConfirm")}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}
