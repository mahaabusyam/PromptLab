import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function CommitHash({ hash }: { hash: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: ignore silently */
    }
  }

  return (
    <button
      type="button"
      dir="ltr"
      onClick={handleCopy}
      aria-label={
        copied ? t("history.commit.copied") : t("history.commit.copy", { hash })
      }
      className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
    >
      #{hash}
      {copied ? (
        <Check className="size-3 text-emerald-500" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
    </button>
  );
}
