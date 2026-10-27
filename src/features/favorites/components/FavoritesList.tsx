import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import type { FavoriteEntry, FavoriteView } from "../types";
import { FavoriteCard } from "./FavoriteCard";
import { FavoriteRow } from "./FavoriteRow";
import type { FavoriteHandlers } from "./FavoriteParts";

interface FavoritesListProps extends FavoriteHandlers {
  entries: FavoriteEntry[];
  view: FavoriteView;
}

export function FavoritesList({
  entries,
  view,
  onToggle,
  onUse,
  onPreview,
}: FavoritesListProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Re-animate when the set of shown cards (or the layout) changes
  const key = useMemo(
    () => `${view}:${entries.map((e) => e.key).join("|")}`,
    [entries, view],
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
  }, [key]);

  const handlers = { onToggle, onUse, onPreview };

  return (
    <div ref={rootRef}>
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {entries.map((e) => (
            <FavoriteCard key={e.key} entry={e} {...handlers} />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <FavoriteRow key={e.key} entry={e} {...handlers} />
          ))}
        </ul>
      )}
    </div>
  );
}
