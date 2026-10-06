"use client";

import { ArrowRight, Award, Bell, Check, ChevronLeft, Fingerprint, Heart, Languages, Menu, Mic, Minus, Moon, Plus, ScanFace, Search, Send, Sparkles, Star, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { appScreens, buildPreviewVars, faNumber, industries, isDark, mix, type WizardConfig } from "../config";
import { AppIcon } from "./app-icon";
import { useAppPreview } from "./state";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const press = "transition-transform duration-150 active:scale-95";
const card = "rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface)";

/**
 * A small but real app: tap cards to open details, add to cart, pick a booking slot,
 * send a chat message, flip settings. Anything that would talk to a server shows a
 * friendly note that the real version will be built to the customer's needs.
 */
export const InteractiveApp = ({ config, listen = false, springboard = false }: { config: WizardConfig; listen?: boolean; springboard?: boolean }) => {
  const reduce = useReducedMotion();
  const content = industries[config.industry];
  const name = config.brandName.trim() || content.label;
  const enabled = appScreens.filter((screen) => config.screens.includes(screen.value));
  const navScreens = enabled.filter((screen) => screen.value !== "detail");
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState<string[]>([]);
  const [item, setItem] = useState(0);
  const [cart, setCart] = useState<Record<number, number>>({ 0: 1 });
  const [slot, setSlot] = useState(2);
  const [day, setDay] = useState(1);
  const [messages, setMessages] = useState<string[]>([]);
  const [settings, setSettings] = useState({ notify: true });
  const [liked, setLiked] = useState<number[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [phase, setPhase] = useState<"home" | "splash" | "onboarding" | "lock" | "app">(springboard ? "home" : "app");
  const [slide, setSlide] = useState(0);
  const [dark, setDark] = useState(false);
  const [listening, setListening] = useState(false);
  const [banner, setBanner] = useState(false);
  const [lang, setLang] = useState("فارسی");
  const has = (feature: string) => config.features.includes(feature);
  const demo = useAppPreview((state) => state.demo);
  const toastTimer = useRef<number | undefined>(undefined);
  const request = useAppPreview((state) => state.request);
  const shade = (amount: number) => mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount);

  const items = content.features.map((feature, index) => ({ ...feature, price: [890, 1240, 2390, 320][index] ?? 500 }));
  const total = Object.entries(cart).reduce((sum, [index, count]) => sum + (items[Number(index)]?.price ?? 0) * count, 0);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  const go = (next: string) => {
    if (next === screen) return;
    setHistory((stack) => [...stack, screen]);
    setScreen(next);
    setDrawer(false);
  };
  const back = () => {
    setScreen(history[history.length - 1] ?? "home");
    setHistory(history.slice(0, -1));
  };
  const notify = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  // The screens rail in the studio can ask the phone to open a screen.
  useEffect(() => {
    if (!listen || request.tick === 0) return;
    const timeout = window.setTimeout(() => {
      setPhase("app");
      setScreen(request.screen);
      setHistory([]);
      setDrawer(false);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [listen, request]);

  // Back to the home screen whenever the icon step asks for it.
  useEffect(() => {
    const timeout = window.setTimeout(() => setPhase(springboard ? "home" : "app"), 0);
    return () => window.clearTimeout(timeout);
  }, [springboard]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // The features step asks the phone to act a feature out as soon as it's switched on.
  useEffect(() => {
    if (!listen || demo.tick === 0) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    later(() => {
      setDrawer(false);
      setHistory([]);
      switch (demo.feature) {
        case "onboarding":
          setSlide(0);
          setPhase("onboarding");
          break;
        case "biometric":
          setPhase("lock");
          later(() => setPhase("app"), reduce ? 300 : 1800);
          break;
        case "darkmode":
          setPhase("app");
          setDark((value) => !value);
          break;
        case "voice":
          setPhase("app");
          setScreen(config.screens.includes("catalog") ? "catalog" : "home");
          setListening(true);
          later(() => setListening(false), 2400);
          break;
        case "push":
          setPhase("app");
          setBanner(true);
          later(() => setBanner(false), 3400);
          break;
        case "widget":
          setPhase("home");
          break;
        case "loyalty":
        case "language":
          setPhase("app");
          setScreen("profile");
          break;
        default:
          setPhase("app");
          setScreen("home");
      }
    }, 0);
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [listen, demo, reduce, config.screens]);

  const launch = () => {
    setPhase("splash");
    window.setTimeout(() => {
      if (has("biometric")) {
        setPhase("lock");
        window.setTimeout(() => setPhase(has("onboarding") ? "onboarding" : "app"), reduce ? 300 : 1600);
      } else setPhase(has("onboarding") ? "onboarding" : "app");
      setSlide(0);
    }, reduce ? 200 : 1500);
  };

  /* ---------------- home screen of the phone (springboard) ---------------- */
  if (phase === "home") {
    const others = ["#ff9f0a", "#30d158", "#0a84ff", "#ff375f", "#bf5af2", "#64d2ff", "#ffd60a", "#8e8e93", "#ff6482", "#32ade6", "#5e5ce6"];
    return (
      <div className="absolute inset-0 flex flex-col px-6 pt-6" style={{ background: `linear-gradient(170deg, ${mix(config.color, "#0b1020", 0.55)}, ${mix(config.accent, "#05060c", 0.6)})` }}>
        {has("widget") && (
          <motion.button type="button" onClick={launch} initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 flex items-center gap-3 rounded-[22px] bg-white/18 p-4 text-right text-white backdrop-blur-xl">
            <AppIcon config={config} size={44} />
            <span className="flex-1">
              <span className="block text-[11px] opacity-80">{name}</span>
              <strong className="block text-[15px]">{content.badge}</strong>
            </span>
            <span className="rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-bold">باز کن</span>
          </motion.button>
        )}
        <div className="grid grid-cols-4 gap-x-4 gap-y-5">
          {(has("widget") ? others.slice(0, 8) : others).map((color, index) =>
            index === 5 ? (
              <button key="app" type="button" onClick={launch} className={`flex flex-col items-center gap-1.5 ${press}`} aria-label={`باز کردن ${name}`}>
                <span className="relative">
                  <AppIcon config={config} size={62} />
                  <span className="absolute -inset-1.5 rounded-[20px] ring-2 ring-white/70 motion-safe:animate-pulse" />
                </span>
                <span className="max-w-[72px] truncate text-[11px] font-bold text-white">{name}</span>
              </button>
            ) : (
              <span key={color} className="flex flex-col items-center gap-1.5 opacity-80">
                <span className="size-[62px] rounded-[15px]" style={{ backgroundColor: color }} />
                <span className="h-1.5 w-10 rounded-full bg-white/40" />
              </span>
            ),
          )}
        </div>
        <span className="mx-auto mt-auto mb-10 rounded-full bg-white/15 px-4 py-2 text-[12px] font-bold text-white backdrop-blur">روی آیکون بزنید تا اپ باز شود</span>
      </div>
    );
  }

  if (phase === "onboarding") {
    const slides = [
      { title: `به ${name} خوش آمدید`, text: content.sub },
      { title: "همه‌چیز در یک جا", text: content.features.map((feature) => feature.label).join("، ") },
      { title: "مخصوص شما", text: "پیشنهادها کم‌کم با سلیقه شما شخصی می‌شود." },
    ];
    return (
      <div className="absolute inset-0 flex flex-col bg-(--pv-bg) px-7 pb-10 pt-6" dir="rtl" style={buildPreviewVars(config)}>
        <button type="button" onClick={() => setPhase("app")} className="self-start text-[12px] font-bold text-(--pv-muted)">رد کردن</button>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={reduce ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: 30 }} className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <span className="flex size-40 items-center justify-center rounded-full" style={{ background: `linear-gradient(140deg, ${config.color}, ${config.accent})` }}>
              {slide === 0 ? <AppIcon config={{ ...config, iconStyle: "glyph" }} size={72} /> : slide === 1 ? <Star className="size-16 text-white" /> : <Sparkles className="size-16 text-white" />}
            </span>
            <strong className="text-(--pv-text)" style={heading(22)}>{slides[slide].title}</strong>
            <p className="text-[13px] leading-7 text-(--pv-muted)">{slides[slide].text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mb-5 flex justify-center gap-1.5">
          {slides.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === slide ? "w-6 bg-(--pv-primary)" : "w-1.5 bg-(--pv-border)"}`} />)}
        </div>
        <button type="button" onClick={() => (slide < 2 ? setSlide(slide + 1) : setPhase("app"))} className={`h-13 rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[14px] font-extrabold text-(--pv-on-primary) ${press}`}>
          {slide < 2 ? "بعدی" : "شروع کنیم"}
        </button>
      </div>
    );
  }

  if (phase === "lock") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#06070d] text-white" dir="rtl">
        <AppIcon config={config} size={64} />
        <strong className="text-[16px]">{name}</strong>
        <motion.span className="relative mt-6 flex size-24 items-center justify-center rounded-[28px] border-2 border-white/30" animate={reduce ? undefined : { borderColor: ["rgba(255,255,255,0.3)", config.color, "#2fd08a"] }} transition={{ duration: 1.4 }}>
          <ScanFace className="size-12" strokeWidth={1.3} aria-hidden="true" />
          {!reduce && <motion.span className="absolute inset-x-3 h-0.5 rounded-full bg-(--pv-primary)" style={{ background: config.color }} initial={{ top: 12 }} animate={{ top: [12, 80, 12] }} transition={{ duration: 1.2 }} />}
        </motion.span>
        <span className="flex items-center gap-1.5 text-[12px] text-white/70"><Fingerprint className="size-4" aria-hidden="true" /> در حال شناسایی…</span>
      </div>
    );
  }

  if (phase === "splash") {
    return (
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5" style={{ background: `linear-gradient(160deg, ${config.color}, ${config.accent})` }} initial={reduce ? false : { opacity: 0, scale: 0.6, borderRadius: 40 }} animate={{ opacity: 1, scale: 1, borderRadius: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <motion.span initial={reduce ? false : { scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}>
          <AppIcon config={{ ...config, iconStyle: "glyph" }} size={92} />
        </motion.span>
        <strong className="text-[22px] text-white">{name}</strong>
        <span className="absolute bottom-16"><KhayyamMark size={26} state="thinking" /></span>
      </motion.div>
    );
  }

  /* ---------------- screens ---------------- */
  const header = (title: string, withBack = false, action?: ReactNode) => (
    <div className="flex items-center gap-3 px-5 pb-3 pt-1">
      {withBack ? (
        <button type="button" onClick={back} aria-label="برگشت" className={`flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface) ${press}`}>
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      ) : config.appNav === "drawer" ? (
        <button type="button" onClick={() => setDrawer(true)} aria-label="منو" className={`flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface) ${press}`}>
          <Menu className="size-5" aria-hidden="true" />
        </button>
      ) : null}
      <strong className="flex-1 truncate" style={heading(20)}>{title}</strong>
      {action}
    </div>
  );

  const itemCard = (index: number, compact = false) => {
    const entry = items[index];
    return (
      <button
        key={entry.label}
        type="button"
        onClick={() => {
          setItem(index);
          if (config.screens.includes("detail")) go("detail");
          else notify("صفحه جزئیات را در مرحله «صفحه‌ها» روشن کنید.");
        }}
        className={`${card} overflow-hidden text-right ${press} ${compact ? "flex items-center gap-3 p-2.5" : ""}`}
      >
        <span className={`relative block ${compact ? "size-14 shrink-0 rounded-(--pv-r-ctrl)" : "aspect-square"}`} style={{ backgroundColor: shade(0.22 + index * 0.14) }}>
          {!compact && (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                setLiked((list) => (list.includes(index) ? list.filter((value) => value !== index) : [...list, index]));
              }}
              className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/20 backdrop-blur"
              aria-label="پسندیدن"
            >
              <Heart className={`size-4 text-white transition-transform ${liked.includes(index) ? "scale-110 fill-white" : ""}`} aria-hidden="true" />
            </span>
          )}
        </span>
        <span className={compact ? "flex-1" : "block p-3"}>
          <strong className="block text-[13px]">{entry.label}</strong>
          <span className="mt-1 block text-[12px] font-bold text-(--pv-primary)">{faNumber(entry.price)} هزار تومان</span>
        </span>
        {compact && <ChevronLeft className="size-4 text-(--pv-muted)" aria-hidden="true" />}
      </button>
    );
  };

  const screens: Record<string, ReactNode> = {
    home: (
      <>
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          {config.appNav === "drawer" && (
            <button type="button" onClick={() => setDrawer(true)} aria-label="منو" className={`flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface) ${press}`}>
              <Menu className="size-5" aria-hidden="true" />
            </button>
          )}
          <div className="flex-1 px-2">
            <span className="block text-[12px] text-(--pv-muted)">سلام، خوش آمدید 👋</span>
            <strong style={heading(21)}>{name}</strong>
          </div>
          <button type="button" onClick={() => (config.screens.includes("notifications") ? go("notifications") : notify("اعلان‌ها را در مرحله «صفحه‌ها» روشن کنید."))} aria-label="اعلان‌ها" className={`relative flex size-10 items-center justify-center rounded-full bg-(--pv-soft) text-(--pv-primary) ${press}`}>
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-(--pv-accent)" />
          </button>
        </div>
        <div className="flex flex-col gap-5 px-5 pb-28">
          <button type="button" onClick={() => go(config.screens.includes("catalog") ? "catalog" : "home")} className={`flex h-12 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-4 text-[13px] text-(--pv-muted) ${press}`}>
            <Search className="size-4" aria-hidden="true" /> <span className="flex-1 text-right">جستجو در {name}</span>
            {has("voice") && <Mic className="size-4 text-(--pv-primary)" aria-hidden="true" />}
          </button>
          {has("stories") && (
            <div className="-mx-1 flex gap-3 overflow-hidden px-1">
              {["جدید", ...content.features.map((feature) => feature.label)].slice(0, 5).map((label, index) => (
                <button key={label} type="button" onClick={() => notify("استوری‌ها را از پنل مدیریت خودتان منتشر می‌کنید.")} className={`flex w-16 shrink-0 flex-col items-center gap-1.5 ${press}`}>
                  <span className="flex size-16 items-center justify-center rounded-full p-[3px]" style={{ background: index < 3 ? `linear-gradient(140deg, ${config.color}, ${config.accent})` : "var(--pv-border)" }}>
                    <span className="size-full rounded-full border-[3px] border-(--pv-bg)" style={{ backgroundColor: shade(0.2 + index * 0.15) }} />
                  </span>
                  <span className="w-full truncate text-center text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          )}
          {has("loyalty") && (
            <button type="button" onClick={() => go("profile")} className={`flex items-center gap-3 rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-surface) p-3.5 text-right ${press}`}>
              <span className="flex size-11 items-center justify-center rounded-full bg-(--pv-soft) text-(--pv-primary)"><Award className="size-5" aria-hidden="true" /></span>
              <span className="flex-1">
                <strong className="block text-[13px]">۱٬۲۵۰ امتیاز · سطح نقره‌ای</strong>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-(--pv-border)"><span className="block h-full w-[62%] rounded-full bg-(--pv-primary)" /></span>
              </span>
            </button>
          )}
          <div className="relative overflow-hidden rounded-(--pv-r-card) p-5 text-white" style={{ background: `linear-gradient(130deg, ${config.color}, ${config.accent})` }}>
            <span className="absolute -left-8 -top-8 size-32 rounded-full bg-white/15" />
            <span className="relative text-[11px] font-bold opacity-85">{content.badge}</span>
            <p className="relative mt-1.5 max-w-[16ch]" style={heading(19)}>{config.tagline.trim() || content.headline}</p>
            <button type="button" onClick={() => {
                setItem(0);
                go(config.screens.includes("detail") ? "detail" : config.screens.includes("catalog") ? "catalog" : "home");
              }} className={`relative mt-4 inline-flex h-9 items-center rounded-(--pv-r-ctrl) bg-white px-4 text-[12px] font-bold text-[#14202b] ${press}`}>
              {content.cta}
            </button>
          </div>
          <div className="flex gap-2 overflow-hidden">
            {["همه", ...content.features.slice(0, 3).map((feature) => feature.label)].map((chip, index) => (
              <span key={chip} className={`shrink-0 rounded-(--pv-r-ctrl) px-3.5 py-2 text-[12px] font-bold ${index === 0 ? "bg-(--pv-text) text-(--pv-bg)" : "bg-(--pv-surface) text-(--pv-muted)"}`}>{chip}</span>
            ))}
          </div>
          {has("forYou") && (
            <div>
              <strong className="mb-2.5 flex items-center gap-1.5 text-[14px]"><Sparkles className="size-4 text-(--pv-accent)" aria-hidden="true" /> مخصوص شما</strong>
              <div className="flex flex-col gap-2.5">{[2, 0].map((index) => itemCard(index, true))}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">{items.map((_, index) => itemCard(index))}</div>
        </div>
      </>
    ),
    catalog: (
      <>
        {header("فهرست")}
        <div className="flex flex-col gap-3 px-5 pb-28">
          <div className="flex h-12 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-4 text-[13px] text-(--pv-muted)">
            <Search className="size-4" aria-hidden="true" /> چه چیزی می‌خواهید؟
          </div>
          {items.map((_, index) => itemCard(index, true))}
          {items.map((_, index) => itemCard((index + 2) % items.length, true))}
        </div>
      </>
    ),
    detail: (
      <>
        {header(items[item].label, true, <button type="button" onClick={() => setLiked((list) => (list.includes(item) ? list : [...list, item]))} aria-label="پسندیدن" className={`flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface) ${press}`}><Heart className={`size-5 ${liked.includes(item) ? "fill-(--pv-accent) text-(--pv-accent)" : ""}`} aria-hidden="true" /></button>)}
        <div className="flex flex-col gap-4 px-5 pb-32">
          <div className="flex aspect-[4/3.2] items-center justify-center rounded-(--pv-r-card)" style={{ backgroundColor: shade(0.25 + item * 0.12) }}>
            {(() => {
              const Glyph = items[item].icon;
              return <Glyph className="size-20 text-white/80" strokeWidth={1.3} aria-hidden="true" />;
            })()}
          </div>
          <div className="flex items-center justify-between">
            <strong style={heading(20)}>{items[item].label}</strong>
            <span className="flex items-center gap-1 text-[13px] font-bold"><Star className="size-4 fill-(--pv-accent) text-(--pv-accent)" aria-hidden="true" />۴٫۸</span>
          </div>
          <p className="text-[13px] leading-7 text-(--pv-muted)">توضیح کوتاه درباره این مورد و مزیت‌هایش. در نسخه واقعی، این متن‌ها از پنل مدیریت خودتان می‌آید.</p>
          <div className="flex items-center justify-between rounded-(--pv-r-card) bg-(--pv-surface) p-4">
            <span className="text-[12px] text-(--pv-muted)">قیمت</span>
            <strong className="text-[18px] text-(--pv-primary)">{faNumber(items[item].price)} <span className="text-[11px] font-normal">هزار تومان</span></strong>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-(--pv-bg)/90 px-5 pb-8 pt-3 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              if (config.screens.includes("booking")) return go("booking");
              setCart((current) => ({ ...current, [item]: (current[item] ?? 0) + 1 }));
              notify("به سبد اضافه شد ✓");
            }}
            className={`flex h-13 w-full items-center justify-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[14px] font-extrabold text-(--pv-on-primary) ${press}`}
          >
            {config.screens.includes("booking") ? "رزرو کنید" : "افزودن به سبد"}
          </button>
        </div>
      </>
    ),
    cart: (
      <>
        {header("سبد خرید")}
        <div className="flex flex-col gap-3 px-5 pb-40">
          {Object.entries(cart).filter(([, count]) => count > 0).length === 0 && <p className="py-10 text-center text-[13px] text-(--pv-muted)">سبد خالی است؛ از خانه چیزی اضافه کنید.</p>}
          {Object.entries(cart)
            .filter(([, count]) => count > 0)
            .map(([index, count]) => {
              const entry = items[Number(index)];
              return (
                <div key={index} className={`${card} flex items-center gap-3 p-3`}>
                  <span className="size-14 shrink-0 rounded-(--pv-r-ctrl)" style={{ backgroundColor: shade(0.25 + Number(index) * 0.14) }} />
                  <div className="flex-1">
                    <strong className="block text-[13px]">{entry.label}</strong>
                    <span className="text-[12px] text-(--pv-primary)">{faNumber(entry.price * count)}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-bg) p-1">
                    <button type="button" aria-label="کم کردن" onClick={() => setCart((current) => ({ ...current, [index]: Math.max(0, count - 1) }))} className={`flex size-7 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface) ${press}`}><Minus className="size-3.5" aria-hidden="true" /></button>
                    <strong className="w-4 text-center text-[13px]">{faNumber(count)}</strong>
                    <button type="button" aria-label="زیاد کردن" onClick={() => setCart((current) => ({ ...current, [index]: count + 1 }))} className={`flex size-7 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary) ${press}`}><Plus className="size-3.5" aria-hidden="true" /></button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-(--pv-bg)/90 px-5 pb-8 pt-3 backdrop-blur">
          <div className="mb-3 flex justify-between text-[13px]"><span className="text-(--pv-muted)">جمع کل</span><strong>{faNumber(total)} هزار تومان</strong></div>
          <button type="button" onClick={() => notify("در نسخه واقعی، درگاه پرداخت شما اینجا وصل می‌شود.")} className={`flex h-13 w-full items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[14px] font-extrabold text-(--pv-on-primary) ${press}`}>
            پرداخت
          </button>
        </div>
      </>
    ),
    booking: (
      <>
        {header("رزرو نوبت", history.length > 0)}
        <div className="flex flex-col gap-5 px-5 pb-36">
          <div className="flex gap-2">
            {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"].map((label, index) => (
              <button key={label} type="button" onClick={() => setDay(index)} className={`flex flex-1 flex-col items-center gap-1 rounded-(--pv-r-ctrl) py-3 text-[11px] ${press} ${day === index ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-surface)"}`}>
                {label.slice(0, 3)}
                <strong className="text-[16px]">{faNumber(12 + index)}</strong>
              </button>
            ))}
          </div>
          <span className="text-[13px] font-bold text-(--pv-muted)">ساعت‌های خالی</span>
          <div className="grid grid-cols-3 gap-2">
            {["۹:۰۰", "۱۰:۳۰", "۱۲:۰۰", "۱۵:۰۰", "۱۶:۳۰", "۱۸:۰۰"].map((time, index) => (
              <button key={time} type="button" onClick={() => setSlot(index)} className={`h-11 rounded-(--pv-r-ctrl) text-[13px] font-bold ${press} ${slot === index ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-surface)"}`}>{time}</button>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-(--pv-bg)/90 px-5 pb-8 pt-3 backdrop-blur">
          <button type="button" onClick={() => notify("نوبت رزرو شد ✓ پیامک یادآوری هم می‌تواند ارسال شود.")} className={`flex h-13 w-full items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-[14px] font-extrabold text-(--pv-on-primary) ${press}`}>
            تأیید رزرو
          </button>
        </div>
      </>
    ),
    chat: (
      <>
        {header("گفتگو با پشتیبانی")}
        <div className="flex flex-col gap-2.5 px-5 pb-36">
          <p className="max-w-[80%] self-start rounded-(--pv-r-card) bg-(--pv-surface) px-3.5 py-2.5 text-[13px] leading-6">سلام! چطور می‌توانیم کمکتان کنیم؟</p>
          {messages.map((message, index) => (
            <motion.p key={index} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[80%] self-end rounded-(--pv-r-card) bg-(--pv-primary) px-3.5 py-2.5 text-[13px] leading-6 text-(--pv-on-primary)">
              {message}
            </motion.p>
          ))}
          {messages.length > 0 && <p className="max-w-[80%] self-start rounded-(--pv-r-card) bg-(--pv-surface) px-3.5 py-2.5 text-[13px] leading-6">ممنون؛ همکارمان تا چند دقیقه دیگر جواب می‌دهد.</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-(--pv-bg)/90 px-5 pb-8 pt-3 backdrop-blur">
          <span className="flex h-12 flex-1 items-center rounded-(--pv-r-ctrl) bg-(--pv-surface) px-4 text-[13px] text-(--pv-muted)">پیام شما…</span>
          <button type="button" aria-label="ارسال" onClick={() => setMessages((list) => [...list, ["سلام، سفارشم کی می‌رسد؟", "امکان تغییر ساعت هست؟", "ممنون از راهنمایی 🙏"][list.length % 3]])} className={`flex size-12 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary) ${press}`}>
            <Send className="size-5" aria-hidden="true" />
          </button>
        </div>
      </>
    ),
    notifications: (
      <>
        {header("اعلان‌ها", history.length > 0)}
        <div className="flex flex-col gap-2.5 px-5 pb-28">
          {[content.badge, "سفارش شما ارسال شد", "یادآوری: نوبت فردا ساعت ۱۰", "پیشنهاد ویژه آخر هفته"].map((text, index) => (
            <div key={text} className={`${card} flex items-center gap-3 p-3.5 ${index === 0 ? "!border-(--pv-primary)" : ""}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--pv-soft) text-(--pv-primary)"><Bell className="size-4" aria-hidden="true" /></span>
              <div className="flex-1 text-[13px]"><strong className="block">{text}</strong><span className="text-[11px] text-(--pv-muted)">{faNumber(index * 3 + 2)} دقیقه پیش</span></div>
            </div>
          ))}
        </div>
      </>
    ),
    profile: (
      <>
        {header("پروفایل")}
        <div className="flex flex-col items-center gap-2 px-5 pb-28">
          <span className="flex size-24 items-end justify-center overflow-hidden rounded-full" style={{ background: `linear-gradient(140deg, ${config.color}, ${config.accent})` }}>
            <UserRound className="mb-[-10%] size-[80%] text-white/85" strokeWidth={1.2} aria-hidden="true" />
          </span>
          <strong className="mt-2 text-[17px]">سارا محمدی</strong>
          <span className="text-[12px] text-(--pv-muted)">عضو از مهر ۱۴۰۴</span>
          {has("loyalty") && (
            <div className="mt-3 w-full rounded-(--pv-r-card) p-4 text-white" style={{ background: `linear-gradient(130deg, ${config.color}, ${config.accent})` }}>
              <span className="flex items-center gap-1.5 text-[12px] opacity-85"><Award className="size-4" aria-hidden="true" /> باشگاه مشتریان</span>
              <strong className="mt-1 block text-[22px]">۱٬۲۵۰ امتیاز</strong>
              <span className="text-[11px] opacity-85">۷۵۰ امتیاز تا سطح طلایی</span>
            </div>
          )}
          <div className="mt-4 grid w-full grid-cols-3 gap-2">
            {content.stats.map(([value, label]) => (
              <span key={label} className="rounded-(--pv-r-card) bg-(--pv-surface) py-3 text-center"><strong className="block text-[15px]">{value}</strong><span className="text-[10px] text-(--pv-muted)">{label}</span></span>
            ))}
          </div>
          <div className="mt-3 w-full divide-y divide-(--pv-border) rounded-(--pv-r-card) bg-(--pv-surface)">
            {[
              { key: "notify", label: "دریافت اعلان", on: settings.notify, flip: () => setSettings((current) => ({ notify: !current.notify })) },
              ...(has("darkmode") ? [{ key: "dark", label: "حالت تیره", on: dark, flip: () => setDark((value) => !value) }] : []),
            ].map((row) => (
              <button key={row.key} type="button" onClick={row.flip} className="flex w-full items-center justify-between px-4 py-3.5 text-[13px]">
                <span className="flex items-center gap-2">{row.key === "dark" && <Moon className="size-4" aria-hidden="true" />}{row.label}</span>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${row.on ? "bg-(--pv-primary)" : "bg-(--pv-border)"}`}>
                  <span className="absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]" style={{ left: row.on ? 2 : 22 }} />
                </span>
              </button>
            ))}
            {has("language") && (
              <button type="button" onClick={() => setLang((current) => (current === "فارسی" ? "English" : current === "English" ? "العربية" : "فارسی"))} className="flex w-full items-center justify-between px-4 py-3.5 text-[13px]">
                <span className="flex items-center gap-2"><Languages className="size-4" aria-hidden="true" />زبان</span>
                <span className="font-bold text-(--pv-primary)">{lang}</span>
              </button>
            )}
          </div>
        </div>
      </>
    ),
  };

  const current = screens[screen] ?? screens.home;

  /* ---------------- navigation chrome ---------------- */
  const navItems = navScreens.slice(0, 5);
  const iconFor = (value: string) => appScreens.find((entry) => entry.value === value)?.icon ?? Star;
  const showNav = screen !== "detail" && !(screen === "booking" && history.length > 0);

  return (
    <div dir="rtl" data-motion={config.motion} className="absolute inset-0 overflow-hidden bg-(--pv-bg) text-(--pv-text)" style={dark ? buildPreviewVars({ ...config, theme: "dark" }) : undefined}>
      {config.appNav === "top" && showNav && (
        <div className="flex gap-1.5 overflow-hidden px-5 pb-2">
          {navItems.map((entry) => (
            <button key={entry.value} type="button" onClick={() => go(entry.value)} className={`shrink-0 rounded-(--pv-r-ctrl) px-3.5 py-2 text-[12px] font-bold ${press} ${screen === entry.value ? "bg-(--pv-primary) text-(--pv-on-primary)" : "bg-(--pv-surface) text-(--pv-muted)"}`}>
              {entry.label}
            </button>
          ))}
        </div>
      )}

      <div className="pv-scroller absolute inset-x-0 bottom-0 overflow-y-auto" style={{ top: config.appNav === "top" && showNav ? 48 : 0 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={screen} initial={reduce ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: 24 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            {current}
          </motion.div>
        </AnimatePresence>
      </div>

      {(config.appNav === "tabs" || config.appNav === "floating") && showNav && (
        <nav className={config.appNav === "floating" ? "absolute inset-x-5 bottom-7 z-20" : "absolute inset-x-0 bottom-0 z-20 border-t border-(--pv-border) bg-(--pv-bg)/95 pb-6 pt-2 backdrop-blur"}>
          <div className={`flex items-center justify-around ${config.appNav === "floating" ? "rounded-full bg-(--pv-text) p-2 shadow-xl" : ""}`}>
            {navItems.map((entry) => {
              const Icon = iconFor(entry.value);
              const active = screen === entry.value;
              return config.appNav === "floating" ? (
                <button key={entry.value} type="button" onClick={() => go(entry.value)} aria-label={entry.label} className={`relative flex size-11 items-center justify-center rounded-full ${press}`}>
                  {active && <motion.span layoutId={`fab-${config.color}`} className="absolute inset-0 rounded-full bg-(--pv-primary)" transition={{ type: "spring", bounce: 0.25, duration: 0.4 }} />}
                  <Icon className={`relative size-5 ${active ? "text-(--pv-on-primary)" : "text-(--pv-bg) opacity-60"}`} aria-hidden="true" />
                  {entry.value === "cart" && cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-(--pv-accent) text-[9px] font-bold text-white">{faNumber(cartCount)}</span>}
                </button>
              ) : (
                <button key={entry.value} type="button" onClick={() => go(entry.value)} className={`relative flex flex-col items-center gap-1 px-2 text-[10px] ${press} ${active ? "font-bold text-(--pv-primary)" : "text-(--pv-muted)"}`}>
                  <Icon className="size-5" aria-hidden="true" />
                  {entry.label.split(" ")[0]}
                  {entry.value === "cart" && cartCount > 0 && <span className="absolute -top-1 right-1 flex size-4 items-center justify-center rounded-full bg-(--pv-accent) text-[9px] font-bold text-white">{faNumber(cartCount)}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* drawer */}
      <AnimatePresence>
        {config.appNav === "drawer" && drawer && (
          <>
            <motion.button type="button" aria-label="بستن منو" className="absolute inset-0 z-30 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.nav className="absolute inset-y-0 right-0 z-40 flex w-[74%] flex-col gap-1 bg-(--pv-bg) p-5 shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
              <div className="mb-5 flex items-center gap-3">
                <AppIcon config={config} size={44} />
                <strong className="flex-1 text-[15px]">{name}</strong>
                <button type="button" aria-label="بستن" onClick={() => setDrawer(false)}><X className="size-5" aria-hidden="true" /></button>
              </div>
              {navItems.map((entry) => {
                const Icon = iconFor(entry.value);
                return (
                  <button key={entry.value} type="button" onClick={() => go(entry.value)} className={`flex items-center gap-3 rounded-(--pv-r-ctrl) px-3 py-3 text-[14px] ${press} ${screen === entry.value ? "bg-(--pv-soft) font-bold text-(--pv-primary)" : ""}`}>
                    <Icon className="size-5" aria-hidden="true" /> {entry.label}
                  </button>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* voice search */}
      <AnimatePresence>
        {listening && (
          <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-(--pv-bg)/95 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="relative flex size-24 items-center justify-center rounded-full bg-(--pv-primary) text-(--pv-on-primary)">
              {!reduce && [0, 1].map((ring) => <motion.span key={ring} className="absolute inset-0 rounded-full bg-(--pv-primary)" initial={{ opacity: 0.4, scale: 1 }} animate={{ opacity: 0, scale: 1.9 }} transition={{ duration: 1.4, repeat: Infinity, delay: ring * 0.7 }} />)}
              <Mic className="relative size-10" aria-hidden="true" />
            </span>
            <strong className="text-[16px]">در حال گوش دادن…</strong>
            <span className="text-[13px] text-(--pv-muted)">«{items[0].label}»</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* push notification */}
      <AnimatePresence>
        {banner && (
          <motion.button type="button" onClick={() => { setBanner(false); go(config.screens.includes("notifications") ? "notifications" : "home"); }} className="absolute inset-x-3 top-2 z-50 flex items-center gap-3 rounded-[22px] bg-white/90 p-3 text-right text-[#14202b] shadow-2xl backdrop-blur-xl" initial={{ y: -90 }} animate={{ y: 0 }} exit={{ y: -90 }} transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}>
            <AppIcon config={config} size={38} />
            <span className="min-w-0 flex-1">
              <span className="flex justify-between text-[11px] text-black/50"><strong className="text-black/80">{name}</strong>اکنون</span>
              <span className="block truncate text-[12.5px] font-bold">{content.badge} 🎉</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="absolute inset-x-4 top-3 z-50 flex items-start gap-2 rounded-(--pv-r-card) bg-(--pv-text) px-4 py-3 text-[12.5px] leading-6 text-(--pv-bg) shadow-2xl" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
