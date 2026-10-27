import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const MAX_TAGS = 8;

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const add = () => {
    const tag = value
      .trim()
      .replace(/^#+/, "")
      .replace(/\s+/g, "-")
      .slice(0, 24);
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS)
      onChange([...tags, tag]);
    setValue("");
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant"
        >
          <span dir="auto">#{tag}</span>
          <button
            type="button"
            aria-label={t("editor.tags.remove", { tag })}
            onClick={() =>
              onChange(tags.filter((existing) => existing !== tag))
            }
            className="rounded-full text-outline transition-colors hover:text-on-surface"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {tags.length < MAX_TAGS && (
        <input
          dir="auto"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={add}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !value && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          aria-label={t("editor.tags.add")}
          placeholder={t("editor.tags.placeholder")}
          className="w-16 bg-transparent text-label-sm text-on-surface placeholder:text-outline focus:outline-none"
        />
      )}
    </div>
  );
}
