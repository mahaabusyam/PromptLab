import { useId } from "react";
import { useTranslation } from "react-i18next";
import { languageMeta, languagePreferences } from "@/i18n/languages";
import { useLanguageStore } from "@/stores/languageStore";

export function LanguageField() {
  const { t } = useTranslation();
  const id = useId();
  const preference = useLanguageStore((state) => state.preference);
  const setPreference = useLanguageStore((state) => state.setPreference);

  const labelFor = (option: (typeof languagePreferences)[number]) =>
    option === "auto"
      ? t("settings.language.auto")
      : languageMeta[option].nativeName;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-sm text-on-surface-variant">
        {t("settings.language.label")}
      </label>
      <select
        id={id}
        value={preference}
        onChange={(e) => {
          const next = languagePreferences.find(
            (option) => option === e.target.value,
          );
          if (next) setPreference(next);
        }}
        className="rounded-xl bg-surface-container-high px-3 py-2 text-body-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
      >
        {languagePreferences.map((option) => (
          <option key={option} value={option}>
            {labelFor(option)}
          </option>
        ))}
      </select>
      <p className="text-label-sm text-outline">
        {t("settings.language.hint")}
      </p>
    </div>
  );
}
