import { tx, numberTag } from "@/lib/tx";
import { goals, pains, tools, type AiConfig, type GoalKey, type PainKey, type ToolKey } from "./config";

/**
 * Understands what the customer writes in their own words and turns it into a suggestion
 * for their AI team. Rule-based for now so the UI can be built and tested; `askKhayyam`
 * is the single place to call the real model later (send `{ message, config }`, map the
 * reply to `KhayyamReply`).
 */

export type KhayyamReply = {
  text: string;
  /** what applying the suggestion changes */
  patch?: Partial<AiConfig>;
  actionLabel?: string;
  /** the need is specialised: offer the custom-AI request instead */
  custom?: boolean;
};

const toLatinDigits = (text: string) => text.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const painWords: [RegExp, PainKey][] = [
  [/منتظر|دیر جواب|جواب ندادن|جواب می.?دهند|پاسخ.?گو|پشتیبانی|پیام/, "wait"],
  [/تکراری|دستی|وقت.?گیر|خسته|فقط جواب/, "repeat"],
  [/خطا|اشتباه|دوباره.?کاری|غلط/, "errors"],
  [/شب|تعطیل|آخر هفته|۲۴|24 ساعت/, "night"],
  [/گزارش|پراکنده|اکسل.?بازی|آمار|داشبورد/, "scattered"],
  [/رشد|استخدام|نیرو کم|نیروی بیشتر|شلوغ/, "growth"],
];

const goalWords: [RegExp, GoalKey][] = [
  [/مشتری|پشتیبانی|چت|پیام|جواب/, "support"],
  [/تأیید|تایید|گردش کار|اداری|درخواست/, "process"],
  [/گزارش|آمار|داشبورد|اکسل/, "reports"],
  [/فاکتور|سند|قرارداد|فرم|رسید/, "documents"],
  [/پست|محتوا|کپشن|تبلیغ|کامنت/, "marketing"],
  [/انبار|موجودی|پیش.?بینی|سفارش خرید/, "forecast"],
  [/آیین.?نامه|دانش|راهنمای داخلی|اسناد شرکت|سوال همکار/, "knowledge"],
];

const toolWords: [RegExp, ToolKey][] = [
  [/سایت|وب/, "website"],
  [/تلگرام/, "telegram"],
  [/بله|ایتا/, "bale"],
  [/واتس/, "whatsapp"],
  [/اینستا/, "instagram"],
  [/ایمیل|جیمیل/, "email"],
  [/فروشگاه|ووکامرس|دیجی/, "shop"],
  [/اکسل|شیت|گوگل شیت/, "sheets"],
  [/crm|سی.?آر.?ام|مشتریان/i, "crm"],
  [/حسابداری|هلو|سپیدار|محک/, "accounting"],
  [/پیامک|sms/i, "sms"],
];

const customWords = /کارخانه|خط تولید|تولیدی|پزشک|بیمارستان|کلینیک|تصویر پزشکی|بانک|اعتبارسنجی|کشاورز|گلخانه|دوربین|نظارت|سنسور|نیروگاه|معدن|پتروشیمی/;

const unique = <T,>(list: T[]) => [...new Set(list)];

/** Reads a free-text message and suggests changes to the AI team. */
export const understand = (message: string, config: AiConfig): KhayyamReply => {
  const text = toLatinDigits(message.trim());

  if (customWords.test(text)) {
    return {
      text: tx("این کار تخصصی است و قبل از قیمت دادن باید داده‌ها و فرایندتان را ببینیم. برای این نوع پروژه‌ها مسیر «هوش مصنوعی اختصاصی» داریم: مسئله را می‌نویسید و کارشناس ما برای جلسه با شما تماس می‌گیرد."),
      custom: true,
    };
  }
  if (/قیمت|هزینه|چقدر می.?شود|تومان/.test(text)) {
    return { text: tx("هزینه به تعداد هم‌تیمی‌ها و اتصال‌ها بستگی دارد. وقتی سوال‌ها تمام شود، برآورد دقیق و زمان بازگشت سرمایه را در پیشنهاد نهایی می‌بینید. طراحی و نقشه اجرا هم جزو پروژه است.") };
  }
  if (/امن|امنیت|داده.?ها|محرمانه|سرور/.test(text)) {
    return {
      text: tx("اگر نمی‌خواهید اطلاعات از سازمان بیرون برود، همه‌چیز را روی سرور خودتان راه‌اندازی می‌کنیم."),
      patch: { hosting: "onprem" },
      actionLabel: tx("روی سرور خودمان باشد"),
    };
  }

  const foundPains = painWords.filter(([pattern]) => pattern.test(text)).map(([, pain]) => pain);
  const foundGoals = goalWords.filter(([pattern]) => pattern.test(text)).map(([, goal]) => goal);
  const foundTools = toolWords.filter(([pattern]) => pattern.test(text)).map(([, tool]) => tool);
  const staffMatch = text.match(/(\d+)\s*(نفر|کارمند|همکار|نیرو)/);
  const staff = staffMatch ? Math.min(200, Math.max(1, Number(staffMatch[1]))) : undefined;

  if (!foundPains.length && !foundGoals.length && !foundTools.length && staff === undefined) {
    return {
      text: tx("برای اینکه دقیق‌تر کمکتان کنم، بنویسید روزانه چه کاری بیشترین وقت تیم را می‌گیرد، یا مشتری‌ها از کجا با شما در ارتباطند. مثلاً: «روزی ۲۰۰ پیام در اینستاگرام و تلگرام می‌گیریم و ۳ نفر فقط جواب می‌دهند.»"),
    };
  }

  const patch: Partial<AiConfig> = {};
  const parts: string[] = [];
  if (foundPains.length) {
    patch.pains = unique([...config.pains, ...foundPains]);
    parts.push(pains.filter((pain) => foundPains.includes(pain.value)).map((pain) => pain.label).join(tx("، ")));
  }
  const goalList = unique([...foundGoals, ...pains.filter((pain) => foundPains.includes(pain.value)).flatMap((pain) => pain.suggests)]);
  if (goalList.length) {
    patch.goals = unique([...config.goals, ...goalList]);
    parts.push(tx("هم‌تیمی {0}", [goals.filter((goal) => goalList.includes(goal.value)).map((goal) => `«${goal.label}»`).join(tx(" و "))]));
  }
  if (foundTools.length) {
    patch.tools = unique([...config.tools, ...foundTools]);
    parts.push(tx("کار در {0}", [tools.filter((tool) => foundTools.includes(tool.value)).map((tool) => tool.label).join(tx("، "))]));
  }
  if (staff !== undefined) {
    patch.staff = staff;
    parts.push(tx("{0} نفر درگیر این کارها", [staff.toLocaleString(numberTag())]));
  }

  return {
    text: tx("متوجه شدم. پیشنهادم: {0}.", [parts.join(tx("؛ "))]),
    patch,
    actionLabel: tx("اضافه کن به پرونده"),
  };
};

/** Single integration point for the real model. Keep the signature; replace the body. */
export const askKhayyam = async (message: string, config: AiConfig): Promise<KhayyamReply> => {
  // TODO(api): POST { message, config } to the assistant endpoint and return its reply.
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 400));
  return understand(message, config);
};
