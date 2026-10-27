import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import type { TemplateListItem } from "../types";
import { TemplateCard } from "./TemplateCard";

interface TemplatesGridProps {
  items: TemplateListItem[];
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onUse: (item: TemplateListItem) => void;
  onPreview: (item: TemplateListItem) => void;
  onDelete: (item: TemplateListItem) => void;
}

export function TemplatesGrid({
  items,
  favoriteIds,
  onToggleFavorite,
  onUse,
  onPreview,
  onDelete,
}: TemplatesGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Re-animate only when a different set of cards is shown (not on every favorite toggle)
  const idsKey = useMemo(
    () => items.map((i) => i.template.id).join("|"),
    [items],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-card]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
    }, root);
    return () => ctx.revert();
  }, [idsKey]);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <TemplateCard
          key={item.template.id}
          item={item}
          isFavorite={favoriteIds.has(item.template.id)}
          onToggleFavorite={onToggleFavorite}
          onUse={onUse}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
