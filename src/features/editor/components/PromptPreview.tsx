import { useTranslation } from "react-i18next";
import { splitTemplate } from "@/utils/promptVariables";

interface PromptPreviewProps {
  content: string;
  values: Record<string, string>;
}

export function PromptPreview({ content, values }: PromptPreviewProps) {
  const { t } = useTranslation();

  if (!content.trim()) {
    return (
      <p className="p-space-md text-body-sm text-outline">
        {t("editor.preview.empty")}
      </p>
    );
  }

  return (
    <div
      dir="auto"
      className="whitespace-pre-wrap break-words p-space-md font-code-md text-code-md leading-6 text-on-surface"
    >
      {splitTemplate(content).map((segment, i) => {
        if (segment.kind === "text") return <span key={i}>{segment.text}</span>;
        const value = values[segment.name]?.trim();
        return value ? (
          <mark key={i} className="rounded bg-primary/15 px-1 text-on-surface">
            {value}
          </mark>
        ) : (
          // المتغير بدون قيمة بيضل chip، فبتعرفي شو لسا ناقص
          <span
            key={i}
            dir="ltr"
            className="variable-chip"
            title={t("editor.preview.noValue")}
          >{`{{${segment.name}}}`}</span>
        );
      })}
    </div>
  );
}
