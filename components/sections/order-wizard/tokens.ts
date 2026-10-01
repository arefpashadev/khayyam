export type OrderKind = "site" | "app";
export type PaletteKey = "blue" | "warm" | "nature";
export type ComplexityKey = "simple" | "balanced" | "advanced";

export type Palette = {
  key: PaletteKey;
  title: string;
  primary: string;
  primarySoft: string;
  deep: string;
};

export const palettes: Palette[] = [
  { key: "blue", title: "اعتماد و فناوری", primary: "#078ef0", primarySoft: "#eaf6ff", deep: "#07162b" },
  { key: "warm", title: "گرم و صمیمی", primary: "#f08b4b", primarySoft: "#fff1e3", deep: "#5c2a1a" },
  { key: "nature", title: "طبیعی و آرام", primary: "#20aa77", primarySoft: "#e7f8f1", deep: "#123c32" },
];

export type StylePreset = {
  title: string;
  description: string;
  image: string;
  /** tailwind radius classes applied to the preview frame/cards */
  frameRadius: string;
  cardRadius: string;
  controlRadius: string;
  shadow: string;
  /** visual density of the mock content */
  density: "airy" | "balanced" | "compact";
};

export const sitePresets: StylePreset[] = [
  {
    title: "گرم و صمیمی",
    description: "مناسب برندهای خانوادگی و فروشگاهی",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-[28px]",
    cardRadius: "rounded-2xl",
    controlRadius: "rounded-full",
    shadow: "shadow-lg",
    density: "airy",
  },
  {
    title: "لوکس و حرفه‌ای",
    description: "مناسب برندهای پریمیوم و شرکتی",
    image: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-md",
    cardRadius: "rounded-lg",
    controlRadius: "rounded-md",
    shadow: "shadow-xl",
    density: "balanced",
  },
  {
    title: "ساده و کاربردی",
    description: "مناسب خدمات و محصولات دیجیتال",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-2xl",
    cardRadius: "rounded-xl",
    controlRadius: "rounded-lg",
    shadow: "shadow-sm",
    density: "compact",
  },
];

export const appPresets: StylePreset[] = [
  {
    title: "ساده و سریع",
    description: "رابطی روشن برای انجام سریع کارها",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-[40px]",
    cardRadius: "rounded-2xl",
    controlRadius: "rounded-full",
    shadow: "shadow-md",
    density: "airy",
  },
  {
    title: "مدرن و پویا",
    description: "مناسب اپلیکیشن‌های محصول‌محور",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-[32px]",
    cardRadius: "rounded-[22px]",
    controlRadius: "rounded-2xl",
    shadow: "shadow-lg",
    density: "balanced",
  },
  {
    title: "حرفه‌ای و داده‌محور",
    description: "مناسب پنل‌ها و ابزارهای سازمانی",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=900&q=85",
    frameRadius: "rounded-[26px]",
    cardRadius: "rounded-lg",
    controlRadius: "rounded-md",
    shadow: "shadow-sm",
    density: "compact",
  },
];

export const complexityOptions: { value: ComplexityKey; title: string; text: string; itemCount: number }[] = [
  { value: "simple", title: "اقتصادی و ساده", text: "امکانات ضروری و تحویل سریع", itemCount: 2 },
  { value: "balanced", title: "متعادل", text: "تعادل مناسب امکانات و بودجه", itemCount: 3 },
  { value: "advanced", title: "پیشرفته", text: "جزئیات بیشتر و قابلیت‌های اختصاصی", itemCount: 4 },
];

export const getPresets = (kind: OrderKind) => (kind === "app" ? appPresets : sitePresets);

export const getPalette = (key: PaletteKey) => palettes.find((item) => item.key === key) ?? palettes[0];
