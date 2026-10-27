import { useId } from "react";
import { Braces, WandSparkles } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { autoFillValues } from "../variables";
import { EditorCard } from "./EditorCard";

interface VariablesPanelProps {
  variableNames: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export function VariablesPanel({
  variableNames,
  values,
  onChange,
}: VariablesPanelProps) {
  const { t } = useTranslation();
  const uid = useId();
  const count = variableNames.length;

  return (
    <EditorCard
      icon={Braces}
      title={t("editor.variables.title", { total: count })}
      action={
        <button
          type="button"
          disabled={count === 0}
          onClick={() => onChange(autoFillValues(variableNames, values))}
          title={t("editor.variables.autoFillHint")}
          className="inline-flex items-center gap-1 rounded-lg bg-surface-container-high px-2 py-1 text-label-sm font-semibold text-primary transition-colors hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WandSparkles aria-hidden className="size-3.5" />
          {t("editor.variables.autoFill")}
        </button>
      }
    >
      {count === 0 ? (
        <p className="text-body-sm text-outline">
          <Trans
            i18nKey="editor.variables.empty"
            values={{ example: "{{name}}" }}
            components={{ chip: <span dir="ltr" className="variable-chip" /> }}
          />
        </p>
      ) : (
        variableNames.map((name) => {
          const filled = Boolean(values[name]?.trim());
          return (
            <div key={name} className="flex flex-col gap-1">
              <label
                htmlFor={`${uid}-${name}`}
                className="flex items-center justify-between"
              >
                <span
                  dir="ltr"
                  className="font-code-md text-code-md font-semibold text-secondary"
                >
                  {name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-outline">
                  {filled
                    ? t("editor.variables.filled")
                    : t("editor.variables.emptyValue")}
                </span>
              </label>
              <textarea
                id={`${uid}-${name}`}
                dir="auto"
                rows={1}
                value={values[name] ?? ""}
                onChange={(e) =>
                  onChange({ ...values, [name]: e.target.value })
                }
                placeholder={t("editor.variables.valueFor", {
                  variable: `{{${name}}}`,
                })}
                className="max-h-32 min-h-9 w-full resize-y rounded-lg bg-surface-container-lowest px-space-sm py-2 text-body-sm text-on-surface shadow-inner [field-sizing:content] placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          );
        })
      )}
    </EditorCard>
  );
}
