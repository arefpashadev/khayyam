import { isRTLLocale } from "@/i18n/routing";

/** BCP-47 tag used for numbers and dates in each site language. */
export const intlTag = (locale: string) => ({ fa: "fa-IR", ar: "ar-EG", de: "de-DE", en: "en-US" })[locale] ?? locale;

export const dirOf = (locale: string): "rtl" | "ltr" => (isRTLLocale(locale) ? "rtl" : "ltr");

/** Formats a number in the site language's digits and separators. */
export const formatNumber = (locale: string, value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(intlTag(locale), { maximumFractionDigits: 1, ...options }).format(value);
