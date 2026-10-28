import { tx, numberTag } from "@/lib/tx";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Calculator,
  FileSearch,
  FileText,
  Globe,
  Headset,
  LineChart,
  Mail,
  Megaphone,
  MessageCircle,
  Send,
  ShoppingBag,
  Sheet,
  Smartphone,
  Users,
  Workflow,
  Factory,
  Stethoscope,
  Landmark,
  Sprout,
  Truck,
  Cctv,
  Zap,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import type { Plan } from "../order-wizard/payments";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type GoalKey = "support" | "process" | "reports" | "documents" | "marketing" | "forecast" | "knowledge";
export type ToolKey = "website" | "telegram" | "whatsapp" | "instagram" | "email" | "sms" | "sheets" | "crm" | "accounting" | "shop" | "docs";
export type Autonomy = "suggest" | "assisted" | "auto";
export type Hosting = "cloud" | "onprem";
export type Persona = "formal" | "friendly" | "expert";
export type Deliverable = "roadmap" | "poc" | "full";

export type PainKey = "wait" | "repeat" | "errors" | "night" | "scattered" | "growth";

export type AiConfig = {
  company: string;
  pains: PainKey[];
  /** share of the team's week spent on these tasks (0–1) */
  share: number;
  goals: GoalKey[];
  tools: ToolKey[];
  requestsPerDay: number;
  hoursPerWeek: number;
  staff: number;
  /** thousand tomans per staff hour */
  hourlyCost: number;
  autonomy: Autonomy;
  hosting: Hosting;
  persona: Persona;
  languages: string[];
  deliverable: Deliverable;
  plan: Plan;
  contactName: string;
  contactPhone: string;
};

export const defaultAiConfig: AiConfig = {
  company: "",
  pains: [],
  share: 0.5,
  goals: ["support"],
  tools: ["website", "telegram", "crm"],
  requestsPerDay: 120,
  hoursPerWeek: 30,
  staff: 3,
  hourlyCost: 150,
  autonomy: "assisted",
  hosting: "cloud",
  persona: "friendly",
  languages: ["fa"],
  deliverable: "poc",
  plan: "start",
  contactName: "",
  contactPhone: "",
};

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* Goals: each adds its own outcomes to the workflow                    */
/* ------------------------------------------------------------------ */

export const goals: { value: GoalKey; label: string; description: string; icon: LucideIcon; actions: string[]; role?: string }[] = [
  { value: "support", label: tx("پاسخ‌گوی ۲۴ ساعته"), description: tx("چت‌بات ۲۴ ساعته در سایت و پیام‌رسان‌ها"), icon: Headset, actions: [tx("پاسخ فوری به مشتری"), tx("ارجاع به کارشناس"), tx("ثبت درخواست در CRM")] },
  { value: "process", label: tx("کارمند اداری خودکار"), description: tx("تأییدها، ثبت اسناد، گردش کار"), icon: Workflow, actions: [tx("ثبت خودکار سند"), tx("گرفتن تأیید مدیر"), tx("به‌روزرسانی موجودی")] },
  { value: "reports", label: tx("تحلیل‌گر گزارش"), description: tx("داشبورد و گزارش بدون اکسل‌بازی"), icon: BarChart3, actions: [tx("گزارش روزانه"), tx("داشبورد زنده"), tx("هشدار تغییرات مهم")] },
  { value: "documents", label: tx("کارشناس اسناد"), description: tx("فاکتور، قرارداد و فرم را خودش می‌خواند"), icon: FileSearch, actions: [tx("استخراج اطلاعات فاکتور"), tx("بایگانی هوشمند"), tx("ورود به حسابداری")] },
  { value: "marketing", label: tx("تولیدکننده محتوا"), description: tx("تولید پست، کپشن و پاسخ کامنت"), icon: Megaphone, actions: [tx("تولید پست و کپشن"), tx("زمان‌بندی انتشار"), tx("پاسخ به کامنت‌ها")] },
  { value: "forecast", label: tx("پیش‌بین فروش و انبار"), description: tx("فروش، موجودی و رفتار مشتری"), icon: LineChart, actions: [tx("پیش‌بینی فروش"), tx("پیشنهاد سفارش خرید"), tx("شناسایی مشتری در خطر")] },
  { value: "knowledge", label: tx("مشاور دانش سازمان"), description: tx("از اسناد خود شرکت جواب می‌دهد"), icon: BrainCircuit, actions: [tx("جواب از اسناد شرکت"), tx("خلاصه جلسات"), tx("جستجوی هوشمند")] },
];

/* ------------------------------------------------------------------ */
/* Tools: channels feed the AI, systems receive its work               */
/* ------------------------------------------------------------------ */

export const tools: { value: ToolKey; label: string; icon: LucideIcon; color: string; side: "in" | "out" }[] = [
  { value: "website", label: tx("سایت"), icon: Globe, color: "#4da3ff", side: "in" },
  { value: "telegram", label: tx("تلگرام"), icon: Send, color: "#2aabee", side: "in" },
  { value: "whatsapp", label: tx("واتس‌اپ"), icon: MessageCircle, color: "#25d366", side: "in" },
  { value: "instagram", label: tx("اینستاگرام"), icon: Smartphone, color: "#e1306c", side: "in" },
  { value: "email", label: tx("ایمیل"), icon: Mail, color: "#f0b44a", side: "in" },
  { value: "shop", label: tx("فروشگاه آنلاین"), icon: ShoppingBag, color: "#ef7d3c", side: "in" },
  { value: "docs", label: tx("اسناد و فایل‌ها"), icon: FileText, color: "#94a3b8", side: "in" },
  { value: "sheets", label: tx("اکسل / شیت"), icon: Sheet, color: "#21a366", side: "out" },
  { value: "crm", label: "CRM", icon: Users, color: "#7c6cff", side: "out" },
  { value: "accounting", label: tx("حسابداری"), icon: Calculator, color: "#e5486f", side: "out" },
  { value: "sms", label: tx("پیامک"), icon: Bot, color: "#64d2ff", side: "out" },
];

export const autonomyLevels: { value: Autonomy; label: string; description: string; rate: number }[] = [
  { value: "suggest", label: tx("فقط پیشنهاد"), description: tx("همه‌چیز را شما تأیید می‌کنید"), rate: 0.4 },
  { value: "assisted", label: tx("خودکار با نظارت"), description: tx("موارد حساس با تأیید شما"), rate: 0.65 },
  { value: "auto", label: tx("کاملاً خودکار"), description: tx("شما فقط گزارش می‌بینید"), rate: 0.85 },
];

export const personas: { value: Persona; label: string }[] = [
  { value: "friendly", label: tx("صمیمی") },
  { value: "formal", label: tx("رسمی") },
  { value: "expert", label: tx("متخصص و دقیق") },
];

export const languages = [
  { value: "fa", label: tx("فارسی") },
  { value: "en", label: tx("انگلیسی") },
  { value: "ar", label: tx("عربی") },
];

export const deliverables: { value: Deliverable; label: string; description: string }[] = [
  { value: "roadmap", label: tx("نقشه راه"), description: tx("بررسی فرایندها و برنامه دقیق اجرا؛ حدود یک هفته") },
  { value: "poc", label: tx("نمونه اولیه"), description: tx("یک مسیر کامل روی داده واقعی شما؛ حدود دو تا سه هفته") },
  { value: "full", label: tx("راه‌اندازی کامل"), description: tx("همه مسیرها، اتصال‌ها، آموزش تیم و پشتیبانی") },
];

/* ------------------------------------------------------------------ */
/* Estimate and impact (placeholders in million tomans — tune freely)  */
/* ------------------------------------------------------------------ */

const goalCost: Record<GoalKey, [number, number, number]> = {
  support: [25, 45, 3],
  process: [30, 60, 4],
  reports: [20, 40, 3],
  documents: [40, 80, 5],
  marketing: [20, 35, 2],
  forecast: [50, 100, 6],
  knowledge: [45, 90, 5],
  };

export const aiEstimate = (config: AiConfig) => {
  if (config.deliverable === "roadmap") return { min: 5, max: 9, weeks: 1 };
  const picked = config.goals.length ? config.goals : (["support"] as GoalKey[]);
  let min = picked.reduce((sum, goal) => sum + goalCost[goal][0], 0) + config.tools.length * 4;
  let max = picked.reduce((sum, goal) => sum + goalCost[goal][1], 0) + config.tools.length * 6;
  let weeks = Math.max(...picked.map((goal) => goalCost[goal][2])) + Math.ceil(config.tools.length / 3);
  if (config.hosting === "onprem") {
    min *= 1.4;
    max *= 1.4;
    weeks += 2;
  }
  if (config.deliverable === "poc") {
    min *= 0.3;
    max *= 0.35;
    weeks = Math.max(2, Math.round(weeks * 0.4));
  }
  return { min: Math.round(min), max: Math.round(max), weeks };
};

/** What hurts today — asked first, so the result speaks to it. */
export const pains: { value: PainKey; label: string; fix: string; suggests: GoalKey[] }[] = [
  { value: "wait", label: tx("مشتری‌ها منتظر جواب می‌مانند"), fix: tx("هیچ مشتری‌ای دیگر منتظر نمی‌ماند"), suggests: ["support"] },
  { value: "repeat", label: tx("تیم درگیر کارهای تکراری است"), fix: tx("کارهای تکراری از دوش تیم برداشته می‌شود"), suggests: ["process", "documents"] },
  { value: "errors", label: tx("خطای انسانی و دوباره‌کاری داریم"), fix: tx("ورود دستی و خطای تایپی تقریباً حذف می‌شود"), suggests: ["documents", "process"] },
  { value: "night", label: tx("شب‌ها و تعطیلات کسی پاسخ نمی‌دهد"), fix: tx("شب و تعطیل هم کسب‌وکارتان باز است"), suggests: ["support"] },
  { value: "scattered", label: tx("اطلاعات پراکنده است و گزارش دیر می‌رسد"), fix: tx("هر صبح گزارش آماده روی میزتان است"), suggests: ["reports", "knowledge"] },
  { value: "growth", label: tx("برای رشد باید نیروی بیشتری بگیریم"), fix: tx("بدون استخدام تازه، چند برابر کار انجام می‌شود"), suggests: ["support", "marketing", "forecast"] },
];

export const shareChoices = [
  { value: 0.25, label: tx("کمی از وقتشان"), hint: tx("حدود یک چهارم") },
  { value: 0.5, label: tx("نصف وقتشان"), hint: "" },
  { value: 0.75, label: tx("بیشتر وقتشان"), hint: "" },
  { value: 1, label: tx("تمام وقتشان"), hint: tx("کارشان همین است") },
];

/** A full-time person works about 176 hours a month. */
const FTE_HOURS = 176;

export const impact = (config: AiConfig) => {
  const rate = autonomyLevels.find((level) => level.value === config.autonomy)?.rate ?? 0.6;
  const hoursBefore = Math.round(config.staff * 44 * config.share * 4.3);
  const hoursSaved = Math.round(hoursBefore * rate);
  const monthlySaving = (hoursSaved * config.hourlyCost) / 1000; // million tomans
  const cost = aiEstimate({ ...config, deliverable: "full" });
  const payback = monthlySaving > 0 ? (cost.min + cost.max) / 2 / monthlySaving : 0;
  return {
    hoursBefore,
    hoursSaved,
    hoursAfter: hoursBefore - hoursSaved,
    monthlySaving: Math.round(monthlySaving * 10) / 10,
    paybackMonths: Math.max(1, Math.round(payback)),
    responseBefore: config.requestsPerDay / Math.max(1, config.staff) > 60 ? tx("چند ساعت") : tx("۲۰ تا ۴۵ دقیقه"),
    responseAfter: tx("زیر ۱۰ ثانیه"),
    /** people's worth of work the AI takes on */
    fte: Math.round((hoursSaved / FTE_HOURS) * 2) / 2,
    /** requests handled per month */
    monthlyRequests: config.requestsPerDay * 30,
  };
};

export const fa = (value: number) => new Intl.NumberFormat(numberTag(), { maximumFractionDigits: 1 }).format(value);

/* ------------------------------------------------------------------ */
/* Custom AI: problems that need a conversation before a quote          */
/* ------------------------------------------------------------------ */

export const customDomains: { value: string; label: string; example: string; icon: LucideIcon }[] = [
  { value: "factory", label: tx("خط تولید و کارخانه"), example: tx("تشخیص عیب محصول با دوربین، پیش‌بینی خرابی دستگاه"), icon: Factory },
  { value: "medical", label: tx("پزشکی و درمان"), example: tx("تحلیل تصاویر پزشکی، خلاصه پرونده بیمار"), icon: Stethoscope },
  { value: "finance", label: tx("مالی و بانکی"), example: tx("تشخیص تقلب، اعتبارسنجی، تحلیل ریسک"), icon: Landmark },
  { value: "agriculture", label: tx("کشاورزی"), example: tx("پایش سلامت گیاه، پیش‌بینی برداشت"), icon: Sprout },
  { value: "logistics", label: tx("لجستیک و حمل‌ونقل"), example: tx("بهینه‌سازی مسیر، پیش‌بینی تقاضا"), icon: Truck },
  { value: "security", label: tx("امنیت و نظارت تصویری"), example: tx("شناسایی رویداد، شمارش و تحلیل رفت‌وآمد"), icon: Cctv },
  { value: "energy", label: tx("انرژی و صنایع سنگین"), example: tx("پایش مصرف، نگهداری پیش‌گویانه"), icon: Zap },
  { value: "other", label: tx("ایده دیگری دارم"), example: tx("هر مسئله‌ای که داده و هدف روشن دارد"), icon: Lightbulb },
];

export const customData = [
  { value: "images", label: tx("عکس و ویدیو") },
  { value: "sensors", label: tx("سنسور و IoT") },
  { value: "documents", label: tx("اسناد و فرم‌ها") },
  { value: "database", label: tx("پایگاه داده") },
  { value: "audio", label: tx("صدا و تماس") },
  { value: "none", label: tx("هنوز داده نداریم") },
];

export const customProcess = [
  { title: tx("گفتگو و شناخت"), text: tx("مسئله، هدف و معیار موفقیت را با هم دقیق می‌کنیم.") },
  { title: tx("بررسی داده"), text: tx("داده‌های موجود را می‌سنجیم و کمبودها را مشخص می‌کنیم.") },
  { title: tx("نمونه اولیه"), text: tx("روی داده واقعی شما یک نسخه آزمایشی می‌سازیم و نتیجه را اندازه می‌گیریم.") },
  { title: tx("استقرار و آموزش"), text: tx("در سازمان راه‌اندازی، تیم را آموزش و سیستم را پایش می‌کنیم.") },
];


export const staffChoices = [1, 3, 5, 10, 25];
