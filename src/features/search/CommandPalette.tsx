import gsap from 'gsap';
import { CornerDownLeft, FileText, LayoutTemplate, Search } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateItems } from '@/features/templates/hooks/useTemplateItems';
import { useUseTemplate } from '@/features/templates/hooks/useUseTemplate';
import { usePromptStore } from '@/stores/promptStore';
import { searchEntries, type SearchResult } from './searchEntries';

interface CommandPaletteProps {
  onClose: () => void;
}

const HINT: Record<SearchResult['kind'], string> = {
  prompt: 'Open in editor',
  template: 'Create prompt from template',
  page: 'Go to page',
};

function ResultIcon({ kind }: { kind: SearchResult['kind'] }) {
  const className = 'size-4 shrink-0 text-primary';
  if (kind === 'prompt') return <FileText className={className} aria-hidden="true" />;
  if (kind === 'template') return <LayoutTemplate className={className} aria-hidden="true" />;
  return <CornerDownLeft className={className} aria-hidden="true" />;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const baseId = useId();
  const navigate = useNavigate();
  const prompts = usePromptStore((s) => s.prompts);
  const templateItems = useTemplateItems();
  const startFromTemplate = useUseTemplate();

  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const templates = useMemo(() => templateItems.map((item) => item.template), [templateItems]);
  const results = useMemo(() => searchEntries(prompts, templates, query), [prompts, templates, query]);
  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal(); // guard: StrictMode runs effects twice in dev

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      dialog,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out', clearProps: 'transform,opacity' },
    );
    return () => {
      tween.kill();
    };
  }, []);

  // Keep the highlighted option visible when navigating with the arrow keys
  useEffect(() => {
    document.getElementById(`${baseId}-${current}`)?.scrollIntoView({ block: 'nearest' });
  }, [baseId, current]);

  function choose(result: SearchResult): void {
    onClose();
    if (result.kind === 'prompt') navigate(`/editor/${result.id}`);
    else if (result.kind === 'template') startFromTemplate(result.template);
    else navigate(result.to);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(results.length === 0 ? 0 : (current + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(results.length === 0 ? 0 : (current - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = results[current];
      if (result) choose(result);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search"
      onClose={onClose} // Escape
      onClick={(e) => e.target === e.currentTarget && onClose()} // backdrop click
      className="mx-auto mt-[12vh] w-[min(92vw,36rem)] rounded-2xl bg-surface-container-high p-0 text-on-surface shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search className="size-5 shrink-0 text-outline" aria-hidden="true" />
        <input
          type="text"
          autoFocus
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search prompts, templates, pages..."
          role="combobox"
          aria-expanded="true"
          aria-controls={`${baseId}-list`}
          aria-activedescendant={results.length > 0 ? `${baseId}-${current}` : undefined}
          aria-autocomplete="list"
          className="w-full bg-transparent py-4 text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        />
      </div>

      <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {query.trim() ? 'Results' : 'Recent prompts'}
      </p>

      <ul id={`${baseId}-list`} role="listbox" data-lenis-prevent className="max-h-80 overflow-y-auto px-2 pb-2">
        {results.map((result, index) => {
          const isActive = index === current;
          return (
            <li
              key={result.key}
              id={`${baseId}-${index}`}
              role="option"
              aria-selected={isActive}
              onMouseMove={() => setActive(index)}
              onClick={() => choose(result)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${
                isActive ? 'bg-primary/15' : ''
              }`}
            >
              <ResultIcon kind={result.kind} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body-sm font-semibold">{result.title}</span>
                <span className="block truncate text-label-sm text-on-surface-variant">{result.subtitle}</span>
              </span>
              {isActive && <span className="hidden shrink-0 text-label-sm text-primary sm:block">{HINT[result.kind]}</span>}
            </li>
          );
        })}
      </ul>

      {results.length === 0 && (
        <p className="px-4 pb-6 pt-2 text-center text-body-sm text-on-surface-variant">
          {query.trim() ? `No results for “${query.trim()}”.` : 'No prompts yet. Create one from the editor.'}
        </p>
      )}

      <p role="status" className="sr-only">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      <footer className="flex items-center gap-4 border-t border-border px-4 py-2 text-label-sm text-on-surface-variant">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>Esc close</span>
      </footer>
    </dialog>
  );
}