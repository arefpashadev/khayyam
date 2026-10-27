/**
 * Runtime translation for the studios (site, app and AI). Their text is written in
 * Persian in the source and wrapped in `tx("…")`; the Persian text itself is the key
 * into messages/studio/<locale>.json. `{0}`, `{1}` … are filled from `args`.
 *
 * The studios render only in the browser, after `loadStudioLocale()` has set the
 * language and loaded its dictionary, so module-level `tx()` calls (option lists in the
 * configs) already resolve in the right language. Changing language reloads the page.
 */
import { intlTag } from "@/lib/locale";

let current = "fa";
let dictionary: Record<string, string> = {};

export const studioLocale = () => current;

export const loadStudioLocale = async (locale: string) => {
  current = locale;
  dictionary = locale === "fa" ? {} : ((await import(`@/messages/studio/${locale}.json`)).default as Record<string, string>);
};

export const tx = (text: string, args?: ReadonlyArray<string | number | undefined | null>) => {
  const out = current === "fa" ? text : (dictionary[text] ?? text);
  if (!args) return out;
  return out.replace(/\{(\d+)\}/g, (_, index) => String(args[Number(index)] ?? ""));
};

/** BCP-47 tag for numbers in the studio's language. */
export const numberTag = () => intlTag(current);

/** Text direction of the studio's language. */
export const studioDir = (): "rtl" | "ltr" => (current === "fa" || current === "ar" ? "rtl" : "ltr");

/** Converts Western digits in a string (times like "08:30") to the language's digits. */
export const localDigits = (text: string) => text.replace(/\d+/g, (digits) => new Intl.NumberFormat(numberTag(), { useGrouping: false }).format(Number(digits)).padStart(digits.length, new Intl.NumberFormat(numberTag()).format(0)));

/** Mirrors a horizontal offset (motion `x`) for LTR: the studios were drawn right-to-left. */
export const sx = <T extends number | string>(value: T): T =>
  studioDir() === "rtl" ? value : ((typeof value === "number" ? -value : value.startsWith("-") ? value.slice(1) : `-${value}`) as T);

const digitSets: Record<string, string> = { ar: "٠١٢٣٤٥٦٧٨٩" };
const separators: Record<string, [group: string, decimal: string, percent: string]> = {
  ar: ["٬", "٫", "٪"],
  de: [".", ",", " %"],
  en: [",", ".", "%"],
};

/** Rewrites Persian digits and separators ("۱٬۲۰۰", "۴٫۹", "۹۸٪") in the studio's language. */
export const ld = (text: string) => {
  if (current === "fa") return text;
  const digits = digitSets[current] ?? "0123456789";
  const [group, decimal, percent] = separators[current] ?? separators.en;
  return text
    .replace(/[۰-۹]/g, (digit) => digits["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)])
    .replace(/٬/g, group)
    .replace(/٫/g, decimal)
    .replace(/٪/g, percent);
};
