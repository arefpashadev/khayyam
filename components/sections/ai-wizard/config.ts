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
  MessagesSquare,
  Phone,
  Send,
  ShoppingBag,
  Sheet,
  Smartphone,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type GoalKey = "support" | "process" | "reports" | "documents" | "marketing" | "forecast" | "knowledge" | "voice";
export type ToolKey = "website" | "telegram" | "bale" | "whatsapp" | "instagram" | "email" | "sms" | "phone" | "sheets" | "crm" | "accounting" | "shop" | "docs";
export type Autonomy = "suggest" | "assisted" | "auto";
export type Hosting = "cloud" | "onprem";
export type Persona = "formal" | "friendly" | "expert";
export type Deliverable = "roadmap" | "poc" | "full";
export type AiStepKey = "goals" | "tools" | "volume" | "brain" | "outcome";

export type AiConfig = {
  company: string;
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
  contactName: string;
  contactPhone: string;
};

export const defaultAiConfig: AiConfig = {
  company: "",
  goals: ["support"],
  tools: ["website", "telegram", "crm"],
  requestsPerDay: 120,
  hoursPerWeek: 30,
  staff: 3,
  hourlyCost: 250,
  autonomy: "assisted",
  hosting: "cloud",
  persona: "friendly",
  languages: ["fa"],
  deliverable: "poc",
  contactName: "",
  contactPhone: "",
};

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export type AiView = "flow" | "chat" | "impact";

export const aiSteps: { key: AiStepKey; title: string; question: string; hint: string; view: AiView }[] = [
  { key: "goals", title: "هدف", question: "چه کارهایی را می‌خواهید هوشمند و خودکار کنید؟", hint: "هر چند مورد که بخواهید؛ هر کدام یک مسیر در نقشه کار اضافه می‌کند.", view: "flow" },
  { key: "tools", title: "ابزارها", question: "الان با چه ابزارها و کانال‌هایی کار می‌کنید؟", hint: "ما به همین‌ها وصل می‌شویم؛ لازم نیست چیزی را عوض کنید.", view: "flow" },
  { key: "volume", title: "حجم کار", question: "این کارها الان چقدر وقت می‌گیرد؟", hint: "تقریبی کافی است؛ صرفه‌جویی و بازگشت سرمایه زنده حساب می‌شود.", view: "impact" },
  { key: "brain", title: "رفتار هوش مصنوعی", question: "هوش مصنوعی چقدر اختیار داشته باشد و چطور حرف بزند؟", hint: "در گفتگوی نمونه کنار، لحن را همین حالا امتحان کنید.", view: "chat" },
  { key: "outcome", title: "تحویل", question: "از کجا شروع کنیم؟", hint: "با نقشه راه یا نمونه اولیه شروع کنید و بعد بزرگش کنیم.", view: "impact" },
];

/* ------------------------------------------------------------------ */
/* Goals: each adds its own outcomes to the workflow                    */
/* ------------------------------------------------------------------ */

export const goals: { value: GoalKey; label: string; description: string; icon: LucideIcon; actions: string[] }[] = [
  { value: "support", label: "پاسخ‌گویی به مشتری", description: "چت‌بات ۲۴ ساعته در سایت و پیام‌رسان‌ها", icon: Headset, actions: ["پاسخ فوری به مشتری", "ارجاع به کارشناس", "ثبت درخواست در CRM"] },
  { value: "process", label: "اتوماسیون فرایندها", description: "تأییدها، ثبت اسناد، گردش کار", icon: Workflow, actions: ["ثبت خودکار سند", "گرفتن تأیید مدیر", "به‌روزرسانی موجودی"] },
  { value: "reports", label: "گزارش خودکار", description: "داشبورد و گزارش بدون اکسل‌بازی", icon: BarChart3, actions: ["گزارش روزانه", "داشبورد زنده", "هشدار تغییرات مهم"] },
  { value: "documents", label: "خواندن اسناد", description: "فاکتور، قرارداد و فرم را خودش می‌خواند", icon: FileSearch, actions: ["استخراج اطلاعات فاکتور", "بایگانی هوشمند", "ورود به حسابداری"] },
  { value: "marketing", label: "بازاریابی و محتوا", description: "تولید پست، کپشن و پاسخ کامنت", icon: Megaphone, actions: ["تولید پست و کپشن", "زمان‌بندی انتشار", "پاسخ به کامنت‌ها"] },
  { value: "forecast", label: "پیش‌بینی و تحلیل", description: "فروش، موجودی و رفتار مشتری", icon: LineChart, actions: ["پیش‌بینی فروش", "پیشنهاد سفارش خرید", "شناسایی مشتری در خطر"] },
  { value: "knowledge", label: "دستیار دانش سازمان", description: "از اسناد خود شرکت جواب می‌دهد", icon: BrainCircuit, actions: ["جواب از اسناد شرکت", "خلاصه جلسات", "جستجوی هوشمند"] },
  { value: "voice", label: "تماس صوتی هوشمند", description: "پاسخ‌گوی تلفنی و تبدیل گفتار به متن", icon: Phone, actions: ["پاسخ تلفنی خودکار", "تبدیل تماس به متن", "ثبت درخواست تماس"] },
];

/* ------------------------------------------------------------------ */
/* Tools: channels feed the AI, systems receive its work               */
/* ------------------------------------------------------------------ */

export const tools: { value: ToolKey; label: string; icon: LucideIcon; color: string; side: "in" | "out" }[] = [
  { value: "website", label: "سایت", icon: Globe, color: "#4da3ff", side: "in" },
  { value: "telegram", label: "تلگرام", icon: Send, color: "#2aabee", side: "in" },
  { value: "bale", label: "بله / ایتا", icon: MessagesSquare, color: "#2fd08a", side: "in" },
  { value: "whatsapp", label: "واتس‌اپ", icon: MessageCircle, color: "#25d366", side: "in" },
  { value: "instagram", label: "اینستاگرام", icon: Smartphone, color: "#e1306c", side: "in" },
  { value: "email", label: "ایمیل", icon: Mail, color: "#f0b44a", side: "in" },
  { value: "phone", label: "تلفن", icon: Phone, color: "#a78bfa", side: "in" },
  { value: "shop", label: "فروشگاه آنلاین", icon: ShoppingBag, color: "#ef7d3c", side: "in" },
  { value: "docs", label: "اسناد و فایل‌ها", icon: FileText, color: "#94a3b8", side: "in" },
  { value: "sheets", label: "اکسل / شیت", icon: Sheet, color: "#21a366", side: "out" },
  { value: "crm", label: "CRM", icon: Users, color: "#7c6cff", side: "out" },
  { value: "accounting", label: "حسابداری", icon: Calculator, color: "#e5486f", side: "out" },
  { value: "sms", label: "پیامک", icon: Bot, color: "#64d2ff", side: "out" },
];

export const autonomyLevels: { value: Autonomy; label: string; description: string; rate: number }[] = [
  { value: "suggest", label: "فقط پیشنهاد", description: "همه‌چیز را شما تأیید می‌کنید", rate: 0.4 },
  { value: "assisted", label: "خودکار با نظارت", description: "موارد حساس با تأیید شما", rate: 0.65 },
  { value: "auto", label: "کاملاً خودکار", description: "شما فقط گزارش می‌بینید", rate: 0.85 },
];

export const personas: { value: Persona; label: string }[] = [
  { value: "friendly", label: "صمیمی" },
  { value: "formal", label: "رسمی" },
  { value: "expert", label: "متخصص و دقیق" },
];

export const languages = [
  { value: "fa", label: "فارسی" },
  { value: "en", label: "انگلیسی" },
  { value: "ar", label: "عربی" },
];

export const deliverables: { value: Deliverable; label: string; description: string }[] = [
  { value: "roadmap", label: "نقشه راه", description: "بررسی فرایندها و برنامه دقیق اجرا؛ حدود یک هفته" },
  { value: "poc", label: "نمونه اولیه", description: "یک مسیر کامل روی داده واقعی شما؛ حدود دو تا سه هفته" },
  { value: "full", label: "راه‌اندازی کامل", description: "همه مسیرها، اتصال‌ها، آموزش تیم و پشتیبانی" },
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
  voice: [60, 120, 7],
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

export const impact = (config: AiConfig) => {
  const rate = autonomyLevels.find((level) => level.value === config.autonomy)?.rate ?? 0.6;
  const hoursBefore = Math.round(config.hoursPerWeek * 4.3);
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
    responseBefore: config.requestsPerDay > 300 ? "چند ساعت" : "۳۰ دقیقه تا چند ساعت",
    responseAfter: "زیر ۱۰ ثانیه",
  };
};

export const fa = (value: number) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value);
