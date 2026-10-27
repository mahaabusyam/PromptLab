export const supportedLanguages = ["en", "ar"] as const;
export type Language = (typeof supportedLanguages)[number];

export const languagePreferences = ["auto", "en", "ar"] as const;
export type LanguagePreference = (typeof languagePreferences)[number];

export type Direction = "ltr" | "rtl";

export const languageMeta: Record<
  Language,
  { dir: Direction; nativeName: string }
> = {
  en: { dir: "ltr", nativeName: "English" },
  ar: { dir: "rtl", nativeName: "العربية" },
};

/** First browser language we support ("ar-EG" → "ar"), otherwise English. */
export function detectLanguage(browserLanguages: readonly string[]): Language {
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split("-")[0];
    const match = supportedLanguages.find((language) => language === base);
    if (match) return match;
  }
  return "en";
}

export function resolveLanguage(
  preference: LanguagePreference,
  browserLanguages: readonly string[],
): Language {
  return preference === "auto" ? detectLanguage(browserLanguages) : preference;
}
