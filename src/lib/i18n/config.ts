export const locales = ["en", "fr", "de", "zh", "fa"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const rtlLocales: Locale[] = ["fa"];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  fa: "فارسی",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  zh: "🇨🇳",
  fa: "🇮🇷",
};
