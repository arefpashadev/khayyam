"use client";

import { Bell, Check, Coffee, Gift, Home, Monitor, Receipt, Send, ShoppingBag, Smartphone, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { dirOf, formatNumber } from "@/lib/locale";

import { ease, Reveal } from "../shared";

import { AI_DEMO, APP_DEMO, pick, SITE_DEMO, type Text } from "./data";

type Kind = "site" | "app" | "ai";

const ui = {
  site: {
    title: { fa: "یک سایت واقعی؛ همین‌جا امتحانش کنید", en: "A real site. Try it right here." },
    sub: { fa: "رنگ را عوض کنید، به سبد اضافه کنید، گوشی و کامپیوتر را مقایسه کنید. آنچه می‌بینید همان تجربهٔ مشتری شماست.", en: "Switch the colour, fill the cart, compare phone and desktop. This is what your customers get." },
    desktop: { fa: "کامپیوتر", en: "Desktop" },
    phone: { fa: "گوشی", en: "Phone" },
    colour: { fa: "رنگ برند", en: "Brand colour" },
    all: { fa: "همه", en: "All" },
    coffee: { fa: "قهوه", en: "Coffee" },
    cake: { fa: "کیک", en: "Cake" },
    book: { fa: "رزرو میز", en: "Book a table" },
    booked: { fa: "میز شما ثبت شد", en: "Table booked" },
    hero: { fa: "قهوه‌ای که صبح را می‌سازد", en: "Coffee that makes the morning" },
    heroSub: { fa: "تازه برشته، هر روز از ۸ صبح", en: "Freshly roasted, every day from 8am" },
    cart: { fa: "سبد", en: "Cart" },
    currency: { fa: "تومان", en: "IRT" },
    live: { fa: "نمونهٔ زنده", en: "Live preview" },
  },
  app: {
    title: { fa: "یک اپ واقعی؛ توی گوشی امتحانش کنید", en: "A real app. Try it in the phone." },
    sub: { fa: "سفارش بدهید، تمبر بگیرید، اعلان بفرستید. همان لحظه‌ای که مشتری حس می‌کند.", en: "Order, collect a stamp, send a push. The exact moment your customer feels." },
    t1: { fa: "سفارش بده", en: "Place an order" },
    t1s: { fa: "یک لمس تا پرداخت", en: "One tap to pay" },
    t2: { fa: "تمبر بگیر", en: "Collect a stamp" },
    t2s: { fa: "باشگاه مشتریان", en: "Loyalty club" },
    t3: { fa: "اعلان بفرست", en: "Send a push" },
    t3s: { fa: "درست وقتش", en: "At the right time" },
    home: { fa: "خانه", en: "Home" },
    club: { fa: "باشگاه", en: "Club" },
    orders: { fa: "سفارش", en: "Orders" },
    hello: { fa: "سلام، سارا", en: "Hi, Sara" },
    pick: { fa: "چی میل دارید؟", en: "What are you having?" },
    stamps: { fa: "تمبر شما", en: "Your stamps" },
    free: { fa: "قهوهٔ بعدی رایگان!", en: "Next coffee is free!" },
    scan: { fa: "اسکن کد کافه", en: "Scan café code" },
    empty: { fa: "هنوز سفارشی نداری", en: "No orders yet" },
    pay: { fa: "پرداخت با یک لمس", en: "Pay with one touch" },
    paid: { fa: "پرداخت شد", en: "Paid" },
    total: { fa: "جمع", en: "Total" },
    push: { fa: "قهوه‌ات آماده است ☕", en: "Your coffee is ready ☕" },
    pushSub: { fa: "کافه سپیده · همین حالا", en: "Sepideh Café · now" },
    currency: { fa: "تومان", en: "IRT" },
  },
  ai: {
    title: { fa: "با یک دستیار واقعی گفتگو کنید", en: "Talk to a real assistant" },
    sub: { fa: "یکی از سوال‌ها را بزنید؛ هم جواب را می‌بینید، هم کارهایی که پشت صحنه کرد.", en: "Tap a question. See the answer and the work the agent did behind the scenes." },
    channel: { fa: "پیام‌رسان فروشگاه", en: "Shop messenger" },
    online: { fa: "آنلاین · ۲۴ ساعته", en: "Online · 24/7" },
    behind: { fa: "پشت صحنه", en: "Behind the scenes" },
    idle: { fa: "هنوز کاری نکرده؛ یک سوال بپرسید.", en: "Nothing yet. Ask something." },
    hand: { fa: "ارجاع به انسان فقط وقتی لازم باشد", en: "Hands over to a human only when needed" },
    reset: { fa: "از اول", en: "Reset" },
  },
} satisfies Record<Kind, Record<string, Text>>;

const Shell = ({ title, sub, children }: { title: string; sub: string; children: ReactNode }) => (
  <section className="border-t border-[#f2ecdf]/[0.07] py-20 lg:py-28">
    <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
      <Reveal className="max-w-[640px]">
        <h2 className="text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{title}</h2>
        <p className="mt-3 text-[15px] leading-8 text-[#9aa3b8]">{sub}</p>
      </Reveal>
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

const Stage = ({ children, className = "", inner = "" }: { children: ReactNode; className?: string; inner?: string }) => (
  <div className={`relative overflow-hidden rounded-[32px] bg-[radial-gradient(90%_80%_at_50%_40%,rgba(217,166,72,0.14),transparent_65%),#0e1527] ring-1 ring-[#f2ecdf]/[0.07] ${className}`}>
    <span className="absolute inset-0 bg-[linear-gradient(rgba(242,236,223,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(242,236,223,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden="true" />
    <div className={`relative ${inner}`}>{children}</div>
  </div>
);

const pill = (on: boolean) =>
  `inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-colors ${on ? "bg-[#d9a648] text-[#1c1406]" : "text-[#f2ecdf] ring-1 ring-[#f2ecdf]/20 hover:bg-[#f2ecdf]/[0.06]"}`;

/* ------------------------------------------------------------------ */
/* Site: a café website you can actually use                           */
/* ------------------------------------------------------------------ */

const SiteDemo = () => {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const l = (text: Text) => pick(text, locale);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [accent, setAccent] = useState(0);
  const [cat, setCat] = useState<"all" | "coffee" | "cake">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [booked, setBooked] = useState(false);
  const color = SITE_DEMO.accents[accent];
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = SITE_DEMO.items.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);
  const money = (value: number) => `${formatNumber(locale, value)} ${l(ui.site.currency)}`;
  const items = SITE_DEMO.items.filter((item) => cat === "all" || item.cat === cat);
  const phone = device === "phone";

  return (
    <Shell title={l(ui.site.title)} sub={l(ui.site.sub)}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button type="button" className={pill(!phone)} onClick={() => setDevice("desktop")}>
            <Monitor className="size-4" aria-hidden="true" /> {l(ui.site.desktop)}
          </button>
          <button type="button" className={pill(phone)} onClick={() => setDevice("phone")}>
            <Smartphone className="size-4" aria-hidden="true" /> {l(ui.site.phone)}
          </button>
        </div>
        <div className="flex items-center gap-2 ms-auto" role="group" aria-label={l(ui.site.colour)}>
          <span className="text-[12.5px] text-[#9aa3b8]">{l(ui.site.colour)}</span>
          {SITE_DEMO.accents.map((value, index) => (
            <button
              key={value}
              type="button"
              aria-label={value}
              aria-pressed={index === accent}
              onClick={() => setAccent(index)}
              className={`size-7 rounded-full ring-2 ring-offset-2 ring-offset-[#0c1222] transition-all ${index === accent ? "ring-[#f2ecdf]" : "ring-transparent hover:ring-[#f2ecdf]/40"}`}
              style={{ background: value }}
            />
          ))}
        </div>
      </div>

      <Stage className="px-3 py-8 sm:px-8 lg:py-12">
        <motion.div layout={!reduce} transition={{ duration: 0.5, ease }} className={`mx-auto overflow-hidden bg-[#faf7f0] text-[#1c1c1c] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ${phone ? "w-[300px] rounded-[34px] ring-[6px] ring-[#1a2238]" : "w-full max-w-[860px] rounded-[18px]"}`} style={{ borderRadius: phone ? 34 : 18 }}>
          <div className="flex items-center gap-1.5 bg-[#e8e3d8] px-4 py-2.5" dir="ltr">
            <span className="size-2.5 rounded-full bg-black/15" />
            <span className="size-2.5 rounded-full bg-black/15" />
            <span className="size-2.5 rounded-full bg-black/15" />
            <span className="mx-auto flex h-6 w-2/3 max-w-[260px] items-center justify-center gap-1 rounded-full bg-white/80 text-[11px] text-black/50">
              <span className="size-1.5 rounded-full bg-[#2fd08a]" /> {SITE_DEMO.url}
            </span>
          </div>

          {SITE_DEMO.liveUrl ? (
            <iframe title="live" src={SITE_DEMO.liveUrl} className={`w-full border-0 ${phone ? "h-[520px]" : "h-[560px]"}`} />
          ) : (
            <div dir={dirOf(locale)}>
              <div className="flex items-center justify-between px-5 py-3.5">
                <strong className="text-[15px] font-extrabold transition-colors" style={{ color }}>{l(SITE_DEMO.brand)}</strong>
                <span className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-white transition-colors" style={{ background: color }}>
                  <ShoppingBag className="size-3.5" aria-hidden="true" /> {l(ui.site.cart)}
                  <AnimatePresence mode="popLayout">
                    <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="min-w-4 rounded-full bg-white px-1 text-center text-[10.5px]" style={{ color }}>
                      {formatNumber(locale, count)}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <div className="relative mx-4 overflow-hidden rounded-[20px] p-6 text-white transition-[background] duration-500 sm:p-8" style={{ background: `linear-gradient(135deg, ${color}, #1c1406)` }}>
                <span className="absolute -bottom-12 -end-8 size-44 rounded-full bg-white/10" aria-hidden="true" />
                <span className="absolute -top-10 end-1/3 size-24 rounded-full bg-white/10" aria-hidden="true" />
                <h3 className={`relative max-w-[16ch] font-extrabold leading-[1.35] ${phone ? "text-[22px]" : "text-[30px]"}`}>{l(ui.site.hero)}</h3>
                <p className="relative mt-1 text-[12.5px] text-white/80">{l(ui.site.heroSub)}</p>
                <button type="button" onClick={() => setBooked((value) => !value)} className="relative mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-extrabold text-[#1c1406]">
                  {booked ? <Check className="size-4 text-[#16a34a]" strokeWidth={3} aria-hidden="true" /> : null}
                  {booked ? l(ui.site.booked) : l(ui.site.book)}
                </button>
              </div>

              <div className="flex gap-2 px-4 pt-5">
                {(["all", "coffee", "cake"] as const).map((key) => (
                  <button key={key} type="button" onClick={() => setCat(key)} className="rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors" style={cat === key ? { background: color, color: "#fff" } : { background: "rgba(0,0,0,0.06)" }}>
                    {l(ui.site[key])}
                  </button>
                ))}
              </div>

              <ul className={`grid gap-3 p-4 ${phone ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {items.map((item) => (
                    <motion.li key={item.id} layout={!reduce} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3, ease }} className="overflow-hidden rounded-[16px] bg-white shadow-[0_6px_20px_-12px_rgba(0,0,0,0.3)]">
                      <span className="block h-20 sm:h-24" style={{ background: `linear-gradient(135deg, ${item.tone[0]}, ${item.tone[1]})` }} />
                      <div className="p-3">
                        <strong className="block text-[12.5px] font-extrabold leading-5">{l(item.name)}</strong>
                        <div className="mt-1.5 flex items-center justify-between gap-1">
                          <span className="text-[11px] text-black/55">{money(item.price)}</span>
                          <button type="button" aria-label="+" onClick={() => setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }))} className="flex size-7 items-center justify-center rounded-full text-[16px] font-bold leading-none text-white transition-transform active:scale-90" style={{ background: color }}>
                            +
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 text-[12.5px]">
                <span className="text-black/55">{formatNumber(locale, count)} × {l(ui.site.cart)}</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
          )}
        </motion.div>
      </Stage>
    </Shell>
  );
};

/* ------------------------------------------------------------------ */
/* App: a café loyalty app in a phone                                  */
/* ------------------------------------------------------------------ */

type Tab = "home" | "club" | "orders";

const AppDemo = () => {
  const locale = useLocale();
  const l = (text: Text) => pick(text, locale);
  const [tab, setTab] = useState<Tab>("home");
  const [cart, setCart] = useState<string[]>([]);
  const [stamps, setStamps] = useState(2);
  const [paid, setPaid] = useState(false);
  const [push, setPush] = useState(false);
  const [pushKey, setPushKey] = useState(0);
  useEffect(() => {
    if (!push) return;
    const id = window.setTimeout(() => setPush(false), 3200);
    return () => window.clearTimeout(id);
  }, [push, pushKey]);

  const goal = APP_DEMO.stampsGoal;
  const total = cart.reduce((sum, id) => sum + (APP_DEMO.items.find((item) => item.id === id)?.price ?? 0), 0);
  const money = (value: number) => `${formatNumber(locale, value)} ${l(ui.app.currency)}`;

  const sendPush = () => {
    setPush(true);
    setPushKey((value) => value + 1);
  };
  const order = () => {
    setPaid(false);
    setCart((prev) => (prev.length ? prev : ["1"]));
    setTab("orders");
  };
  const stamp = () => {
    setTab("club");
    setStamps((value) => (value >= goal ? 1 : value + 1));
  };

  const tasks = [
    { icon: ShoppingBag, title: ui.app.t1, sub: ui.app.t1s, run: order },
    { icon: Gift, title: ui.app.t2, sub: ui.app.t2s, run: stamp },
    { icon: Bell, title: ui.app.t3, sub: ui.app.t3s, run: sendPush },
  ];
  const tabs: { id: Tab; icon: typeof Home; label: Text }[] = [
    { id: "home", icon: Home, label: ui.app.home },
    { id: "club", icon: Gift, label: ui.app.club },
    { id: "orders", icon: Receipt, label: ui.app.orders },
  ];

  const ring = () => {
    const circumference = 2 * Math.PI * 52;
    return (
      <div className="relative mx-auto size-[132px]">
        <svg viewBox="0 0 120 120" className="-rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="9" />
          <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#c2410c" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: circumference * (1 - stamps / goal) }} transition={{ duration: 0.6, ease }} />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-[26px] font-extrabold leading-none">{formatNumber(locale, stamps)}<span className="text-[14px] text-black/40">/{formatNumber(locale, goal)}</span></strong>
          <span className="mt-1 text-[10.5px] text-black/50">{l(ui.app.stamps)}</span>
        </span>
      </div>
    );
  };

  return (
    <Shell title={l(ui.app.title)} sub={l(ui.app.sub)}>
      <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {tasks.map((task) => (
            <button key={task.title.en} type="button" onClick={task.run} className="group flex w-[230px] shrink-0 items-center gap-4 rounded-[22px] lg:w-auto bg-[#121a2e] p-4 text-start ring-1 ring-[#f2ecdf]/[0.08] transition-colors hover:ring-[#d9a648]/45">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d9a648]/15 text-[#e9c27a] transition-transform group-hover:scale-105">
                <task.icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-[15.5px] font-extrabold">{l(task.title)}</strong>
                <span className="text-[13px] text-[#9aa3b8]">{l(task.sub)}</span>
              </span>
            </button>
          ))}
        </div>

        <Stage className="flex justify-center py-10">
          <div className="relative w-[272px] rounded-[40px] bg-[#1a2238] p-2 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-[#f2ecdf]/15">
            <div dir={dirOf(locale)} className="relative flex h-[540px] flex-col overflow-hidden rounded-[32px] bg-[#faf7f0] text-[#1c1c1c]">
              <span className="absolute inset-x-0 top-2 z-20 mx-auto h-5 w-20 rounded-full bg-black" aria-hidden="true" />

              <AnimatePresence>
                {push && (
                  <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.45, ease }} className="absolute inset-x-3 top-9 z-30 flex items-center gap-3 rounded-[18px] bg-white/95 p-3 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.5)] backdrop-blur">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#c2410c] text-white"><Coffee className="size-4" aria-hidden="true" /></span>
                    <span className="min-w-0">
                      <strong className="block truncate text-[12.5px] font-extrabold">{l(ui.app.push)}</strong>
                      <span className="text-[10.5px] text-black/50">{l(ui.app.pushSub)}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-hidden px-4 pt-11">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    {tab === "home" && (
                      <>
                        <p className="text-[12px] text-black/50">{l(ui.app.hello)}</p>
                        <h4 className="text-[19px] font-extrabold">{l(ui.app.pick)}</h4>
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {APP_DEMO.items.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 rounded-[16px] bg-white p-2.5 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.3)]">
                              <span className="size-12 shrink-0 rounded-[12px]" style={{ background: `linear-gradient(135deg, ${item.tone[0]}, ${item.tone[1]})` }} />
                              <span className="min-w-0 flex-1">
                                <strong className="block truncate text-[12.5px] font-extrabold">{l(item.name)}</strong>
                                <span className="text-[11px] text-black/50">{money(item.price)}</span>
                              </span>
                              <button type="button" aria-label="+" onClick={() => { setPaid(false); setCart((prev) => [...prev, item.id]); }} className="flex size-8 items-center justify-center rounded-full bg-[#c2410c] text-[18px] font-bold leading-none text-white active:scale-90">+</button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {tab === "club" && (
                      <div className="pt-2 text-center">
                        {ring()}
                        <p className="mt-3 min-h-6 text-[13px] font-extrabold text-[#c2410c]">{stamps >= goal ? l(ui.app.free) : ""}</p>
                        <button type="button" onClick={() => setStamps((value) => (value >= goal ? 1 : value + 1))} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-[#1c1406] px-5 text-[12.5px] font-bold text-white active:scale-95">
                          <Sparkles className="size-4" aria-hidden="true" /> {l(ui.app.scan)}
                        </button>
                        <div className="mt-5 flex justify-center gap-1.5">
                          {Array.from({ length: goal }, (_, index) => (
                            <span key={index} className={`size-7 rounded-full transition-colors ${index < stamps ? "bg-[#c2410c]" : "bg-black/10"}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    {tab === "orders" && (
                      <div>
                        <h4 className="text-[19px] font-extrabold">{l(ui.app.orders)}</h4>
                        {cart.length === 0 ? (
                          <p className="mt-10 text-center text-[12.5px] text-black/45">{l(ui.app.empty)}</p>
                        ) : (
                          <>
                            <ul className="mt-3 flex flex-col gap-2">
                              {cart.map((id, index) => {
                                const item = APP_DEMO.items.find((entry) => entry.id === id);
                                if (!item) return null;
                                return (
                                  <li key={`${id}-${index}`} className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2.5 text-[12px] shadow-[0_6px_18px_-12px_rgba(0,0,0,0.3)]">
                                    <strong>{l(item.name)}</strong>
                                    <span className="text-black/55">{money(item.price)}</span>
                                  </li>
                                );
                              })}
                            </ul>
                            <div className="mt-3 flex items-center justify-between text-[12.5px]"><span className="text-black/55">{l(ui.app.total)}</span><strong>{money(total)}</strong></div>
                            <button type="button" onClick={() => { setPaid(true); setStamps((value) => Math.min(goal, value + 1)); sendPush(); }} className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[13px] font-extrabold text-white transition-colors ${paid ? "bg-[#16a34a]" : "bg-[#c2410c]"}`}>
                              {paid ? <><Check className="size-4" strokeWidth={3} aria-hidden="true" /> {l(ui.app.paid)}</> : l(ui.app.pay)}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <nav className="flex justify-around border-t border-black/5 bg-white/70 py-2.5">
                {tabs.map((entry) => (
                  <button key={entry.id} type="button" onClick={() => setTab(entry.id)} aria-current={tab === entry.id} className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold ${tab === entry.id ? "text-[#c2410c]" : "text-black/40"}`}>
                    <entry.icon className="size-[18px]" aria-hidden="true" />
                    {l(entry.label)}
                    {entry.id === "orders" && cart.length > 0 && <span className="absolute -top-0.5 end-1 size-2 rounded-full bg-[#c2410c]" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </Stage>
      </div>
    </Shell>
  );
};

/* ------------------------------------------------------------------ */
/* AI: a shop assistant, with its work shown beside the chat           */
/* ------------------------------------------------------------------ */

type Turn = { id: string; phase: "typing" | "done"; steps: number };

const AiDemo = () => {
  const locale = useLocale();
  const l = (text: Text) => pick(text, locale);
  const [turns, setTurns] = useState<Turn[]>([]);
  const timers = useRef<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const ask = (id: string) => {
    if (turns.some((turn) => turn.phase === "typing")) return;
    const item = AI_DEMO.questions.find((entry) => entry.id === id);
    if (!item) return;
    setTurns((prev) => [...prev.filter((turn) => turn.id !== id), { id, phase: "typing", steps: 0 }]);
    item.steps.forEach((_, index) => later(() => setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, steps: index + 1 } : turn))), 500 + index * 550));
    later(() => setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, phase: "done" } : turn))), 600 + item.steps.length * 550);
  };
  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setTurns([]);
  };
  const busy = turns.some((turn) => turn.phase === "typing");
  const last = turns[turns.length - 1];
  const lastItem = last ? AI_DEMO.questions.find((entry) => entry.id === last.id) : undefined;

  return (
    <Shell title={l(ui.ai.title)} sub={l(ui.ai.sub)}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Stage className="h-[480px]" inner="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-[#f2ecdf]/[0.08] bg-[#121a2e]/80 px-5 py-3.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#d9a648]/15 text-[#e9c27a]"><Send className="size-4" aria-hidden="true" /></span>
            <span>
              <strong className="block text-[14.5px] font-extrabold">{l(ui.ai.channel)}</strong>
              <span className="flex items-center gap-1.5 text-[11.5px] text-[#7fd6a8]"><span className="size-1.5 animate-pulse rounded-full bg-[#2fd08a]" /> {l(ui.ai.online)}</span>
            </span>
            <button type="button" onClick={reset} className="ms-auto text-[12px] font-bold text-[#9aa3b8] hover:text-[#f2ecdf]">{l(ui.ai.reset)}</button>
          </div>

          <div ref={scroller} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5" aria-live="polite">
            {turns.map((turn) => {
              const item = AI_DEMO.questions.find((entry) => entry.id === turn.id);
              if (!item) return null;
              return (
                <div key={turn.id} className="flex flex-col gap-3">
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[80%] self-start rounded-[20px] rounded-ss-md bg-[#d9a648] px-4 py-2.5 text-[14px] font-bold leading-7 text-[#1c1406]">{l(item.q)}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[88%] self-end rounded-[20px] rounded-se-md bg-[#1a2238] px-4 py-2.5 text-[14px] leading-7 text-[#e8e3d8] ring-1 ring-[#f2ecdf]/[0.08]">
                    {turn.phase === "typing" ? (
                      <span className="flex h-7 items-center gap-1" aria-label="…">
                        {[0, 1, 2].map((dot) => (
                          <motion.span key={dot} className="size-1.5 rounded-full bg-[#9aa3b8]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }} />
                        ))}
                      </span>
                    ) : (
                      l(item.a)
                    )}
                  </motion.div>
                </div>
              );
            })}
            {turns.length === 0 && <p className="m-auto max-w-[28ch] text-center text-[13px] leading-7 text-[#6f788d]">{l(ui.ai.idle)}</p>}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[#f2ecdf]/[0.08] bg-[#121a2e]/80 p-3.5">
            {AI_DEMO.questions.map((item) => (
              <button key={item.id} type="button" disabled={busy} onClick={() => ask(item.id)} className="rounded-full px-4 py-2 text-[13px] font-bold text-[#f2ecdf] ring-1 ring-[#f2ecdf]/20 transition-colors hover:bg-[#d9a648] hover:text-[#1c1406] hover:ring-[#d9a648] disabled:opacity-40">
                {l(item.q)}
              </button>
            ))}
          </div>
        </Stage>

        <div className="rounded-[32px] bg-[#121a2e] p-6 ring-1 ring-[#f2ecdf]/[0.07]">
          <h3 className="text-[13px] font-bold text-[#e9c27a]">{l(ui.ai.behind)}</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {lastItem && last ? (
              lastItem.steps.slice(0, last.steps).map((step, index) => (
                <motion.li key={`${last.id}-${index}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-[14px] text-[#e8e3d8]">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#2fd08a]/15 text-[#7fd6a8]"><Check className="size-4" strokeWidth={3} aria-hidden="true" /></span>
                  {l(step)}
                </motion.li>
              ))
            ) : (
              <li className="text-[13px] leading-7 text-[#6f788d]">{l(ui.ai.idle)}</li>
            )}
          </ol>
          <p className="mt-8 flex items-center gap-2 border-t border-[#f2ecdf]/[0.08] pt-5 text-[12.5px] leading-6 text-[#9aa3b8]">
            <User className="size-4 shrink-0 text-[#e9c27a]" aria-hidden="true" /> {l(ui.ai.hand)}
          </p>
        </div>
      </div>
    </Shell>
  );
};

/** The one interactive sample each studio page shows in place of the shared showcase. */
export const StudioDemo = ({ kind }: { kind: Kind }) => (kind === "site" ? <SiteDemo /> : kind === "app" ? <AppDemo /> : <AiDemo />);
