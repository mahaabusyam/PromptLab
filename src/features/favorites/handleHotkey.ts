import type { FavoriteEntry } from "./types";
import type { KeyboardEvent } from "react";

export function handleHotkey(
  e: KeyboardEvent<HTMLElement>,
  entry: FavoriteEntry,
  onToggle: (entry: FavoriteEntry) => void,
): void {
  if (e.key.toLowerCase() !== "h" || e.ctrlKey || e.metaKey || e.altKey) return;

  const tag = (e.target as HTMLElement).tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

  e.preventDefault();
  onToggle(entry);
}
