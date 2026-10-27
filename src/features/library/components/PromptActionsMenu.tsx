import { useRef, useState } from "react";
import { Archive, ArchiveRestore, MoreVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDismiss } from "@/hooks/useDismiss";
import type { Prompt } from "@/features/prompts/types";
import { usePromptStore } from "@/stores/promptStore";

const itemClass =
  "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-body-sm transition-colors hover:bg-surface-container-highest";

export function PromptActionsMenu({ prompt }: { prompt: Prompt }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const toggleArchive = usePromptStore((s) => s.toggleArchive);
  const deletePrompt = usePromptStore((s) => s.deletePrompt);

  useDismiss(
    open,
    (reason) => {
      setOpen(false);
      if (reason === "escape") triggerRef.current?.focus();
    },
    rootRef,
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("library.actions.more")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        <MoreVertical className="size-[18px]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-30 mt-1 min-w-40 rounded-xl bg-surface-container-high p-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              toggleArchive(prompt.id);
              setOpen(false);
            }}
            className={`${itemClass} text-on-surface`}
          >
            {prompt.isArchived ? (
              <ArchiveRestore className="size-4" />
            ) : (
              <Archive className="size-4" />
            )}
            {prompt.isArchived
              ? t("library.actions.restore")
              : t("library.actions.archive")}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setConfirming(true);
            }}
            className={`${itemClass} text-error`}
          >
            <Trash2 className="size-4" />
            {t("library.actions.delete")}
          </button>
        </div>
      )}

      {confirming && (
        <ConfirmDialog
          title={t("library.actions.deleteTitle", { title: prompt.title })}
          description={t("library.actions.deleteBody")}
          confirmLabel={t("library.actions.delete")}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            deletePrompt(prompt.id);
          }}
        />
      )}
    </div>
  );
}
