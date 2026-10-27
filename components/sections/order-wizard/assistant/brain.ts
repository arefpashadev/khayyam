import { tx } from "@/lib/tx";
import { appSteps, industries, siteSteps, suggestAccents, type IndustryKey, type OrderKind, type PreviewTarget, type StepKey, type WizardConfig } from "../config";
import { siteLayouts } from "../designs";

/**
 * The assistant's "brain". For now everything is answered locally from rules so the UI
 * can be built and tested; `askAssistant` is the single place to swap in the real API later
 * (send `{ message, context }` to the backend and map its reply to `AssistantReply`).
 */

export type AssistantAction = {
  label: string;
  /** Changes applied to the wizard when the user taps the action. */
  patch: Partial<WizardConfig>;
  target?: PreviewTarget;
  /** Optional colour chips drawn on the action button. */
  swatches?: string[];
};

export type AssistantReply = { text: string; actions?: AssistantAction[] };

export type AssistantContext = { kind: OrderKind; step: StepKey; config: WizardConfig };

/* ------------------------------------------------------------------ */
/* Field knowledge                                                     */
/* ------------------------------------------------------------------ */

const palettes: Record<IndustryKey, { label: string; color: string; theme: WizardConfig["theme"] }[]> = {
  shop: [
    { label: tx("پرانرژی و فروش‌محور"), color: "#ef7d3c", theme: "light" },
    { label: tx("مد و سبک"), color: "#e5486f", theme: "tinted" },
    { label: tx("لوکس"), color: "#b08a3e", theme: "midnight" },
  ],
  company: [
    { label: tx("اعتماد و حرفه‌ای"), color: "#078ef0", theme: "light" },
    { label: tx("رسمی و جدی"), color: "#0f172a", theme: "light" },
    { label: tx("فناوری مدرن"), color: "#4f46e5", theme: "dark" },
  ],
  restaurant: [
    { label: tx("گرم و اشتهاآور"), color: "#ef7d3c", theme: "tinted" },
    { label: tx("سنتی و باوقار"), color: "#b08a3e", theme: "dark" },
    { label: tx("تازه و سالم"), color: "#16a37a", theme: "light" },
  ],
  education: [
    { label: tx("آموزشی و قابل اعتماد"), color: "#4f46e5", theme: "light" },
    { label: tx("پرانرژی و جوان"), color: "#7c3aed", theme: "tinted" },
    { label: tx("آرام و متمرکز"), color: "#078ef0", theme: "light" },
  ],
  health: [
    { label: tx("آرامش و سلامت"), color: "#16a37a", theme: "light" },
    { label: tx("پزشکی و دقیق"), color: "#078ef0", theme: "light" },
    { label: tx("مراقبت صمیمی"), color: "#e5486f", theme: "tinted" },
  ],
  personal: [
    { label: tx("خلاق و متفاوت"), color: "#7c3aed", theme: "midnight" },
    { label: tx("مینیمال"), color: "#0f172a", theme: "light" },
    { label: tx("جسور"), color: "#e5486f", theme: "light" },
  ],
};

export const recommended: Record<IndustryKey, { radius: WizardConfig["radius"]; type: WizardConfig["type"]; layouts: string[]; sections: string[]; extras: string[]; taglines: string[] }> = {
  shop: { radius: "round", type: "heavy", layouts: ["bento", "marquee", "split"], sections: ["features", "testimonials", "faq", "contact"], extras: ["seo", "admin", "payment", "chat"], taglines: [tx("هر روز یک تخفیف تازه"), tx("خرید مطمئن، تحویل سریع"), tx("استایل شما، انتخاب ما")] },
  company: { radius: "soft", type: "balanced", layouts: ["editorial", "split", "glass"], sections: ["features", "testimonials", "pricing", "contact"], extras: ["seo", "admin", "multilang", "analytics"], taglines: [tx("رشد کسب‌وکار شما، تخصص ما"), tx("از ایده تا اجرا کنار شما"), tx("راهکار دقیق برای چالش واقعی")] },
  restaurant: { radius: "soft", type: "balanced", layouts: ["media", "glass", "centered"], sections: ["gallery", "testimonials", "contact"], extras: ["seo", "admin", "payment"], taglines: [tx("طعمی که فراموش نمی‌شود"), tx("سفره‌ای گرم برای هر روز"), tx("میز شما آماده است")] },
  education: { radius: "round", type: "balanced", layouts: ["bento", "split", "stack3d"], sections: ["features", "pricing", "testimonials", "faq"], extras: ["seo", "admin", "payment", "analytics"], taglines: [tx("یاد بگیرید، بسازید، رشد کنید"), tx("مهارتی که بازار می‌خواهد"), tx("کلاس شما، هر جا که باشید")] },
  health: { radius: "round", type: "balanced", layouts: ["split", "centered", "glass"], sections: ["features", "testimonials", "faq", "contact"], extras: ["seo", "admin", "chat"], taglines: [tx("سلامت شما، اولویت ما"), tx("نوبت بگیرید، منتظر نمانید"), tx("مراقبتی که شایسته شماست")] },
  personal: { radius: "pill", type: "heavy", layouts: ["editorial", "stack3d", "mirror"], sections: ["gallery", "testimonials", "contact"], extras: ["seo", "multilang", "darkmode"], taglines: [tx("طراحی که دیده می‌شود"), tx("ایده‌ها را به محصول تبدیل می‌کنم"), tx("کار خوب، خودش حرف می‌زند")] },
};

const layoutIndex = (value: string) => siteLayouts.findIndex((layout) => layout.value === value);
const layoutLabel = (value: string) => siteLayouts.find((layout) => layout.value === value)?.label ?? value;

/* ------------------------------------------------------------------ */
/* Step guides                                                         */
/* ------------------------------------------------------------------ */

/** What the assistant says when the user arrives at a step, with one-tap suggestions. */
export const stepGuide = ({ kind, step, config }: AssistantContext): AssistantReply => {
  const field = industries[config.industry].label;
  const tips = recommended[config.industry];

  switch (step) {
    case "palette":
      return {
        text: tx("برای حوزه «{0}» این پالت‌ها خوب جواب می‌دهند. هر کدام را بزنید، روی پیش‌نمایش اعمال می‌شود. اگر رنگ سازمانی دارید با قطره‌چکان همان را انتخاب کنید.", [field]),
        actions: palettes[config.industry].map((palette) => {
          const accent = suggestAccents(palette.color)[0].value;
          return { label: palette.label, patch: { color: palette.color, accent, theme: palette.theme }, target: "hero", swatches: [palette.color, accent] };
        }),
      };
    case "radius":
      return {
        text: tx("گوشه‌ها حس کلی را عوض می‌کنند: تیز رسمی‌تر است، گرد و کپسولی صمیمی‌تر. برای این حوزه پیشنهاد من این است:"),
        actions: [{ label: tx("گوشه {0}", [({ sharp: tx("تیز"), soft: tx("نرم"), round: tx("گرد"), pill: tx("کپسولی") } as const)[tips.radius]]), patch: { radius: tips.radius }, target: "showcase" }],
      };
    case "type":
      return {
        text: tx("تیتر درشت و پررنگ برای جلب توجه سریع خوب است؛ نوشته ظریف حس لوکس و آرام می‌دهد."),
        actions: [{ label: tips.type === "heavy" ? tx("تیتر درشت و پررنگ") : tx("نوشته متعادل"), patch: { type: tips.type }, target: "hero" }, { label: tx("ظریف و لوکس"), patch: { type: "light" }, target: "hero" }],
      };
    case "backdrop":
      return {
        text: tx("پس‌زمینه «شفق رنگی» با حرکت ملایم الان در سایت‌های مدرن خیلی رایج است. اگر ظاهر رسمی می‌خواهید «ساده» یا «خطوط شبکه» بهتر است."),
        actions: [
          { label: tx("مدرن: شفق + حرکت ملایم"), patch: { backdrop: "aurora", motion: "subtle" }, target: "hero" },
          { label: tx("رسمی: شبکه بدون حرکت"), patch: { backdrop: "grid", motion: "none" }, target: "hero" },
          { label: tx("پرهیجان: درخشش + پرجنب‌وجوش"), patch: { backdrop: "glow", motion: "lively" }, target: "hero" },
        ],
      };
    case "business":
      return {
        text: tx("اسم برند را کوتاه بنویسید تا در منو و آدرس خوانا باشد. چند جمله اصلی هم برایتان نوشته‌ام:"),
        actions: tips.taglines.map((tagline) => ({ label: tagline, patch: { tagline }, target: "hero" })),
      };
    case "design":
      return kind === "app"
        ? { text: tx("برای اپ، چیدمان کارتی برای فروشگاه و فهرستی برای خدمات و نوبت‌دهی بهتر جواب می‌دهد. چند طرح را امتحان کنید؛ رنگ‌ها و گوشه‌ها حفظ می‌شوند.") }
        : {
            text: tx("برای «{0}» این چیدمان‌ها بیشترین تأثیر را دارند:", [field]),
            actions: tips.layouts.map((layout) => ({ label: layoutLabel(layout), patch: { variant: layoutIndex(layout) }, target: "hero" })),
          };
    case "sections":
      return kind === "app"
        ? { text: tx("امکاناتی را انتخاب کنید که کاربر هر روز با آن‌ها کار دارد؛ بقیه را بعداً هم می‌شود اضافه کرد.") }
        : { text: tx("بخش‌های پیشنهادی برای این حوزه را یک‌جا اضافه کنم؟"), actions: [{ label: tx("اعمال بخش‌های پیشنهادی"), patch: { sections: tips.sections }, target: "features" }] };
    case "extras":
      return {
        text: tx("سئو و پنل مدیریت تقریباً برای همه لازم است. برای این حوزه این ترکیب را پیشنهاد می‌کنم:"),
        actions: kind === "app" ? [{ label: tx("ورود با شماره + نوتیفیکیشن + پرداخت"), patch: { extras: ["otp", "push", "payment"] } }] : [{ label: tx("اعمال امکانات پیشنهادی"), patch: { extras: tips.extras }, target: "top" }],
      };
    case "platform":
      return {
        text: tx("اگر مشتری‌هایتان هم آیفون دارند هم اندروید، «هر دو» را بزنید؛ با یک کد مشترک ساخته می‌شود. برای شروع کم‌هزینه و سریع، وب‌اپ گزینه خوبی است."),
        actions: [
          { label: tx("هر دو (پیشنهادی)"), patch: { platform: "both" } },
          { label: tx("شروع سریع با وب‌اپ"), patch: { platform: "pwa" } },
        ],
      };
    case "navigation":
      return {
        text: tx("نوار پایین برای ۳ تا ۵ صفحه اصلی بهترین است؛ اگر صفحه‌ها زیاد است منوی کشویی را امتحان کنید. روی گوشی بزنید و حسش کنید."),
        actions: [
          { label: tx("نوار پایین"), patch: { appNav: "tabs" } },
          { label: tx("نوار شناور مدرن"), patch: { appNav: "floating" } },
        ],
      };
    case "screens":
      return {
        text: tx("برای «{0}» این صفحه‌ها معمولاً لازم است. هر صفحه را روشن کنید و روی چشم بزنید تا در گوشی باز شود.", [field]),
        actions: [{ label: tx("اعمال صفحه‌های پیشنهادی"), patch: { screens: config.projectType === "booking" ? ["home", "booking", "notifications", "profile"] : config.projectType === "community" ? ["home", "chat", "notifications", "profile"] : ["home", "catalog", "detail", "cart", "profile"] } }],
      };
    case "features":
      return {
        text: tx("حالت تیره و باشگاه مشتریان تقریباً برای هر اپی جواب می‌دهد؛ استوری و پیشنهاد شخصی کاربر را بیشتر برمی‌گرداند. هر کدام را روشن کنید تا روی گوشی ببینید."),
        actions: [
          { label: tx("ترکیب پیشنهادی"), patch: { features: ["onboarding", "biometric", "darkmode", "loyalty", "forYou", "push"] } },
          { label: tx("همه قابلیت‌ها"), patch: { features: ["onboarding", "biometric", "darkmode", "stories", "loyalty", "forYou", "voice", "push", "widget", "language"] } },
        ],
      };
    case "icon":
      return {
        text: tx("آیکون گرادیان روی هر پس‌زمینه‌ای دیده می‌شود؛ تک‌رنگ رسمی‌تر است. روی آیکون در گوشی بزنید تا ورود به اپ را ببینید."),
        actions: [
          { label: tx("گرادیان"), patch: { iconStyle: "gradient" } },
          { label: tx("تک‌رنگ"), patch: { iconStyle: "solid" } },
        ],
      };
    case "outcome":
      return {
        text: tx("طراحی فیگما همیشه جزو پروژه است و جدا حساب نمی‌شود. اگر تصمیمتان قطعی است با پیش‌پرداخت شروع کنید؛ اگر هنوز سوال دارید، مشاوره بگیرید. مبلغ مشاوره از قرارداد کم می‌شود."),
        actions: [
          { label: tx("شروع پروژه"), patch: { plan: "start" } },
          { label: tx("اول مشاوره"), patch: { plan: "consult" } },
        ],
      };
    case "references":
      return { text: tx("لینک دو یا سه سایتی که دوست دارید را بگذارید و بنویسید دقیقاً چه چیزشان را می‌پسندید: رنگ، چیدمان یا حس کلی. همین کافی است؛ بقیه را مشاور با شما هماهنگ می‌کند.") };
  }
};

/* ------------------------------------------------------------------ */
/* Free-form questions (rule-based placeholder)                         */
/* ------------------------------------------------------------------ */

const rules: { test: RegExp; reply: (context: AssistantContext) => AssistantReply }[] = [
  { test: /قیمت|هزینه|تومان|چقدر میشه|چند میشه/, reply: () => ({ text: tx("هزینه به امکانات و تعداد بخش‌ها بستگی دارد. بعد از ثبت درخواست، مشاور دقیق‌ترین برآورد را بر اساس همین انتخاب‌ها می‌دهد؛ ثبت درخواست هیچ تعهدی ندارد.") }) },
  { test: /زمان|طول|کی آماده|چند روز/, reply: () => ({ text: tx("طرح‌های آماده معمولاً بین یک تا سه هفته تحویل می‌شوند؛ امکانات خاص مثل پرداخت یا چندزبانه ممکن است کمی زمان اضافه کنند.") }) },
  { test: /سئو|گوگل/, reply: () => ({ text: tx("سئو یعنی سایت شما در نتایج گوگل بهتر دیده شود: عنوان و توضیح هر صفحه، سرعت بالا و ساختار درست. پشت صحنه انجام می‌شود و در پیش‌نمایش دیده نمی‌شود.") }) },
  { test: /رنگ|پالت/, reply: (context) => stepGuide({ ...context, step: "palette" }) },
  { test: /چیدمان|طرح|قالب/, reply: (context) => stepGuide({ ...context, step: "design" }) },
  { test: /تغییر|بعدا|بعداً/, reply: () => ({ text: tx("بله، همه این مقادیر طبق خواسته شما قابل تغییر است؛ هم الان و هم بعد از ثبت درخواست.") }) },
  { test: /پیشنهاد|کمک|چی کار|راهنما/, reply: (context) => stepGuide(context) },
];

export const quickQuestions = (step: StepKey) => {
  const title = [...siteSteps, ...appSteps].find((item) => item.key === step)?.title ?? "";
  return [tx("برای «{0}» پیشنهاد بده", [title]), tx("هزینه چقدر می‌شود؟"), tx("چقدر طول می‌کشد؟"), tx("بعداً می‌شود تغییر داد؟")];
};

/** Single integration point for the real API. Keep the signature; replace the body. */
export const askAssistant = async (message: string, context: AssistantContext): Promise<AssistantReply> => {
  // TODO(api): POST { message, context } to the assistant endpoint and return its reply.
  await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 500));
  const rule = rules.find((item) => item.test.test(message));
  if (rule) return rule.reply(context);
  return {
    text: tx("این نسخه آزمایشی دستیار است و هنوز به هوش مصنوعی کامل وصل نشده. فعلاً می‌توانم برای همین مرحله پیشنهاد بدهم یا درباره هزینه، زمان و سئو توضیح بدهم."),
    actions: stepGuide(context).actions?.slice(0, 2),
  };
};
