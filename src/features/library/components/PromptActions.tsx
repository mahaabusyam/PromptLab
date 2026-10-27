import { Check, Copy, SquarePen, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { Prompt } from "@/features/prompts/types";
import { usePromptStore } from "@/stores/promptStore";
import { PromptActionsMenu } from "./PromptActionsMenu";

const iconBtn =
  "rounded-lg p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface";

export function FavoriteButton({ prompt }: { prompt: Prompt }) {
  const { t } = useTranslation();
  const toggleFavorite = usePromptStore((s) => s.toggleFavorite);
  return (
    <button
      type="button"
      aria-label={
        prompt.isFavorite
          ? t("promptCard.removeFavorite")
          : t("promptCard.addFavorite")
      }
      aria-pressed={prompt.isFavorite}
      onClick={() => toggleFavorite(prompt.id)}
      className={`rounded-lg p-1 transition-colors hover:bg-surface-container-high ${prompt.isFavorite ? "text-primary" : "text-outline hover:text-primary"}`}
    >
      <Star
        className="size-5"
        fill={prompt.isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}

export function PromptQuickActions({ prompt }: { prompt: Prompt }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        aria-label={t("promptCard.copy")}
        title={t("library.actions.copyTitle")}
        onClick={() => copy(prompt.content)}
        className={iconBtn}
      >
        {copied ? (
          <Check className="size-[18px] text-primary" />
        ) : (
          <Copy className="size-[18px]" />
        )}
      </button>
      <button
        type="button"
        aria-label={t("library.actions.openEditor")}
        title={t("library.actions.openEditor")}
        onClick={() => navigate(`/editor/${prompt.id}`)}
        className={`${iconBtn} hover:text-primary`}
      >
        <SquarePen className="size-[18px]" />
      </button>
      <PromptActionsMenu prompt={prompt} />
    </div>
  );
}
