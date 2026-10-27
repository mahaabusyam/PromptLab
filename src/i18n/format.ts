import i18n from "@/i18n";

/** Latin digits (1,2,3) in both languages, with the language's own separators. */
export function formatNumber(value: number): string {
  const locale = i18n.resolvedLanguage === "ar" ? "ar-u-nu-latn" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
}
