import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "fa", "de"], // Add your RTL locales
  defaultLocale: "fa",
  localePrefix: "always",
  localeDetection: true,
});

export const isRTLLocale = (locale: string): boolean => {
  const rtlLocales = ["ar", "fa"];
  return rtlLocales.includes(locale);
};

export const supportedLanguages = routing.locales.map((code) => {
  return code;
});