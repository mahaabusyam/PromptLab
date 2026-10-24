import { FolderOpen } from 'lucide-react';
import { useState } from 'react';
import type { FolderCount, VariableCount } from '../sidebarData';

interface FavoritesSidebarProps {
  folders: FolderCount[];
  variables: VariableCount[];
  activeFolderId: string | null;
  activeVariable: string | null;
  onFolderChange: (id: string | null) => void;
  onVariableChange: (name: string | null) => void;
}

const VISIBLE_VARIABLES = 8;

export function FavoritesSidebar({
  folders,
  variables,
  activeFolderId,
  activeVariable,
  onFolderChange,
  onVariableChange,
}: FavoritesSidebarProps) {
  const [showAllVars, setShowAllVars] = useState(false);
  const shownVars = showAllVars ? variables : variables.slice(0, VISIBLE_VARIABLES);
  const hiddenCount = variables.length - VISIBLE_VARIABLES;

  return (
    <aside data-enter aria-label="Favorites filters" className="flex flex-col gap-4 xl:order-first xl:col-span-3">
      {/* Starred folders */}
      <section aria-labelledby="fav-folders" className="rounded-2xl border border-border bg-card p-4">
        <h2 id="fav-folders" className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold">
          <FolderOpen className="size-[18px] text-primary" aria-hidden="true" />
          Starred Folders
        </h2>

        {folders.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Favorite prompts that live inside a folder will be grouped here.
          </p>
        ) : (
          <ul className="space-y-1">
            {folders.map((f) => {
              const active = activeFolderId === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onFolderChange(active ? null : f.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                      active
                        ? 'bg-primary/15 font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{f.name}</span>
                    <span className="rounded-full bg-background px-2 py-0.5 font-mono text-xs">{f.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Top variables */}
      <section aria-labelledby="fav-vars" className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="fav-vars" className="font-heading text-sm font-semibold">Top Variable Tokens</h2>
          <span className="text-[11px] text-muted-foreground">Auto-indexed</span>
        </div>

        {variables.length === 0 ? (
          <p className="text-xs text-muted-foreground">No variables in your favorites yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {shownVars.map((v) => {
              const active = activeVariable === v.name;
              return (
                <li key={v.name}>
                  <button
                    type="button"
                    aria-pressed={active}
                    title={`Used in ${v.count} ${v.count === 1 ? 'favorite' : 'favorites'}`}
                    onClick={() => onVariableChange(active ? null : v.name)}
                    className={`rounded-md px-2 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-background text-primary hover:bg-muted'
                    }`}
                  >
                    {`{{${v.name}}}`}
                  </button>
                </li>
              );
            })}
            {hiddenCount > 0 && (
              <li>
                <button
                  type="button"
                  aria-expanded={showAllVars}
                  onClick={() => setShowAllVars((v) => !v)}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {showAllVars ? 'Show less' : `+${hiddenCount} more`}
                </button>
              </li>
            )}
          </ul>
        )}
      </section>
    </aside>
  );
}