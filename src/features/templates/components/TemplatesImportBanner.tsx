import { Puzzle, Upload } from 'lucide-react';
import { useRef } from 'react';

interface TemplatesImportBannerProps {
  onFile: (file: File) => void;
}

export function TemplatesImportBanner({ onFile }: TemplatesImportBannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section
      aria-labelledby="import-title"
      className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center"
    >
      <div className="space-y-1">
        <h2 id="import-title" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Puzzle className="size-5 text-primary" aria-hidden="true" />
          Can&apos;t find what you need?
        </h2>
        <p className="text-sm text-muted-foreground">
          Import your own templates from a JSON file. They are saved in this browser and appear in the gallery.
        </p>
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose a JSON file with templates"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = ''; // allows choosing the same file again
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Upload className="size-4" aria-hidden="true" />
          Import Template
        </button>
      </div>
    </section>
  );
}