import { splitTemplate, truncateTemplate } from "@/utils/promptVariables";

interface PromptSnippetProps {
  content: string;
  maxChars?: number;
}

export function PromptSnippet({ content, maxChars = 120 }: PromptSnippetProps) {
  const segments = splitTemplate(truncateTemplate(content, maxChars));

  return (
    <p
      dir="auto"
      className="break-words rounded-xl bg-surface-container-lowest/90 p-3 font-code-md text-code-md leading-relaxed text-on-surface-variant shadow-inner"
    >
      {segments.map((segment, i) =>
        segment.kind === "variable" ? (
          <span
            key={i}
            dir="ltr"
            className="mx-0.5 rounded bg-secondary-container/40 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary-fixed-dim"
          >
            {`{{${segment.name}}}`}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  );
}
