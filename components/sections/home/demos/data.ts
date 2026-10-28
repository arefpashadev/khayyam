/**
 * Everything the three studio demos show lives here, so real projects can replace the samples
 * without touching the components.
 *
 *  - SITE_DEMO.liveUrl: set to a real, embeddable project URL to show it in the browser frame
 *    instead of the built-in sample (leave "" to keep the sample).
 *  - APP_DEMO.screens: put real screenshot paths (e.g. "/demos/app-home.png") to show them in the
 *    phone instead of the built-in sample.
 *  - Text is per language; a language without an entry falls back to English.
 */

export type Lang = "fa" | "en";
export type Text = Record<Lang, string>;

export const pick = (text: Text, locale: string) => (locale === "fa" ? text.fa : text.en);

export type Item = { id: string; cat: "coffee" | "cake"; name: Text; price: number; tone: readonly [string, string] };

export const SITE_DEMO = {
  liveUrl: "",
  brand: { fa: "کافه سپیده", en: "Sepideh Café" } satisfies Text,
  url: "sepideh.cafe",
  accents: ["#c2410c", "#0e7490", "#6d28d9", "#be123c"],
  items: [
    { id: "1", cat: "coffee", name: { fa: "اسپرسو دبل", en: "Double espresso" }, price: 95000, tone: ["#78350f", "#c2410c"] },
    { id: "2", cat: "coffee", name: { fa: "لاته وانیل", en: "Vanilla latte" }, price: 135000, tone: ["#92400e", "#d97706"] },
    { id: "3", cat: "coffee", name: { fa: "قهوه دمی", en: "Filter brew" }, price: 110000, tone: ["#44403c", "#a8a29e"] },
    { id: "4", cat: "cake", name: { fa: "کیک هویج", en: "Carrot cake" }, price: 150000, tone: ["#9a3412", "#fb923c"] },
    { id: "5", cat: "cake", name: { fa: "چیزکیک تمشک", en: "Raspberry cheesecake" }, price: 180000, tone: ["#9f1239", "#fb7185"] },
    { id: "6", cat: "cake", name: { fa: "کروسان کره‌ای", en: "Butter croissant" }, price: 85000, tone: ["#a16207", "#facc15"] },
  ] satisfies Item[],
};

export const APP_DEMO = {
  screens: [] as string[],
  brand: { fa: "باشگاه سپیده", en: "Sepideh Club" } satisfies Text,
  stampsGoal: 6,
  items: [
    { id: "1", name: { fa: "لاته وانیل", en: "Vanilla latte" }, price: 135000, tone: ["#92400e", "#d97706"] },
    { id: "2", name: { fa: "چیزکیک تمشک", en: "Raspberry cheesecake" }, price: 180000, tone: ["#9f1239", "#fb7185"] },
    { id: "3", name: { fa: "کروسان کره‌ای", en: "Butter croissant" }, price: 85000, tone: ["#a16207", "#facc15"] },
  ],
};

export const AI_DEMO = {
  questions: [
    {
      id: "stock",
      q: { fa: "کیف چرمی قهوه‌ای موجوده؟", en: "Is the brown leather bag in stock?" },
      a: { fa: "بله، ۴ عدد در انبار تهران مانده. اگر تا ۱۲ ظهر سفارش بدهید، فردا درب منزل است.", en: "Yes, 4 left in the Tehran warehouse. Order before noon and it arrives tomorrow." },
      steps: [
        { fa: "موجودی انبار را بررسی کرد", en: "Checked warehouse stock" },
        { fa: "زمان ارسال را حساب کرد", en: "Worked out delivery time" },
      ],
    },
    {
      id: "order",
      q: { fa: "سفارش ۱۰۴۲ من کجاست؟", en: "Where is my order #1042?" },
      a: { fa: "بسته‌تان امروز صبح تحویل پست شد و کد رهگیری برایتان پیامک شد. فردا عصر می‌رسد.", en: "Your parcel was handed to the courier this morning and the tracking code was texted to you. Arrives tomorrow evening." },
      steps: [
        { fa: "سفارش را در فروشگاه پیدا کرد", en: "Found the order in the shop" },
        { fa: "وضعیت پست را گرفت", en: "Fetched courier status" },
        { fa: "پیامک رهگیری فرستاد", en: "Sent the tracking SMS" },
      ],
    },
    {
      id: "refund",
      q: { fa: "می‌خوام کالا رو پس بدم", en: "I want to return an item" },
      a: { fa: "حتماً. درخواست مرجوعی ثبت شد و مدیر فروش برای تایید نهایی خبر شد؛ تا یک ساعت دیگر خبر می‌دهیم.", en: "Of course. The return is logged and the sales manager was notified for final approval; you'll hear back within the hour." },
      steps: [
        { fa: "شرایط مرجوعی را سنجید", en: "Checked the return policy" },
        { fa: "درخواست را ثبت کرد", en: "Logged the request" },
        { fa: "مدیر را خبر کرد", en: "Notified the manager" },
      ],
    },
  ],
};
