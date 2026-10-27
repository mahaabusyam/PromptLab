import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { categoryLabels, providerLabels } from "@/features/prompts/constants";
import { complexityLabels } from "../constants";
import type { TemplateListItem } from "../types";

interface TemplatePreviewDialogProps {
  item: TemplateListItem;
  onClose: () => void;
  onUse: (item: TemplateListItem) => void;
}

function HighlightedContent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
        part.startsWith("{{") ? (
          <span
            key={i}
            dir="ltr"
            className="rounded bg-primary/15 px-0.5 font-semibold text-primary"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function TemplatePreviewDialog({
  item,
  onClose,
  onUse,
}: TemplatePreviewDialogProps) {
  const { t } = useTranslation();
  const { template, variables, tokens } = item;
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal(); // guard: StrictMode runs effects twice
  }, []);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose} // Escape
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop click
      }}
      aria-labelledby="template-preview-title"
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-border bg-card p-0 text-foreground backdrop:bg-black/60"
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2
              id="template-preview-title"
              dir="auto"
              className="font-heading text-xl font-semibold"
            >
              {template.title}
            </h2>
            <ul className="flex flex-wrap gap-2 text-xs font-medium">
              <li className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                {categoryLabels[template.category]}
              </li>
              <li className="rounded-full bg-muted px-2.5 py-0.5">
                {providerLabels[template.provider]}
              </li>
              <li className="rounded-full bg-muted px-2.5 py-0.5">
                {complexityLabels[template.complexity]}
              </li>
              <li className="rounded-full bg-muted px-2.5 py-0.5 font-mono">
                {t("templates.card.tokens", { total: tokens })}
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("templates.preview.close")}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <p dir="auto" className="text-sm text-muted-foreground">
          {template.description}
        </p>

        {variables.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("templates.preview.variables", { total: variables.length })}
            </h3>
            <ul className="flex flex-wrap gap-2 font-mono text-xs">
              {variables.map((v) => (
                <li
                  key={v}
                  dir="ltr"
                  className="rounded-md bg-muted px-2 py-1 text-primary"
                >{`{{${v}}}`}</li>
              ))}
            </ul>
          </div>
        )}

        <pre
          dir="auto"
          data-lenis-prevent
          tabIndex={0}
          aria-label={t("templates.preview.contentLabel")}
          className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed focus-visible:outline-2 focus-visible:outline-primary"
        >
          <HighlightedContent text={template.content} />
        </pre>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied
              ? t("templates.preview.copied")
              : t("templates.preview.copy")}
          </button>
          <button
            type="button"
            onClick={() => onUse(item)}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("templates.preview.use")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
