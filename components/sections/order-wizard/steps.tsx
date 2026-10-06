"use client";

import { Check, Droplet, EyeOff, Info, Link2, Moon, Pipette, Smartphone, Sparkles, Sun, Sunset, Waves, Wind, Zap } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import {
  appExtras,
  backdrops,
  buildPreviewVars,
  colors,
  faNumber,
  industries,
  motionLevels,
  radii,
  siteExtras,
  sectionOptions,
  estimate,
  projectTypes,
  suggestAccents,
  themes,
  typeStyles,
  type IndustryKey,
  type StepKey,
  type WizardConfig,
} from "./config";
import { APP_DESIGN_COUNT, artLabels, industryArts, SITE_DESIGN_COUNT, siteLayouts } from "./designs";
import { Backdrop } from "./preview/site-preview";
import { DesignThumb } from "./preview/thumbnail";
import { PlanChoice } from "./payment-ui";
import { useWizard } from "./store";

/* ------------------------------------------------------------------ */
/* Primitives — dark studio controls, selection by soft tint only      */
/* ------------------------------------------------------------------ */

export const ring = "outline-none focus-visible:ring-2 focus-visible:ring-[#4da3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111419]";
export const idle = "bg-[#171b22] text-[#c9d0d9] hover:bg-[#1d222b]";
export const active = "bg-[#4da3ff]/14 text-[#9ccbff]";

export const Tile = ({ selected, onClick, children, className = "", label }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string; label?: string }) => (
  <button type="button" aria-pressed={selected} aria-label={label} onClick={onClick} className={`relative rounded-2xl text-right transition-colors duration-150 ${ring} ${selected ? active : idle} ${className}`}>
    {children}
  </button>
);

export const Label = ({ children, hint }: { children: ReactNode; hint?: string }) => (
  <span className="mb-2.5 flex items-baseline justify-between gap-2">
    <span className="text-[12px] font-bold text-[#8a93a0]">{children}</span>
    {hint && <span className="text-[11px] text-[#5d6573]">{hint}</span>}
  </span>
);

const field = "w-full rounded-2xl bg-[#171b22] px-4 text-[13px] text-white outline-none transition-colors placeholder:text-[#5d6573] hover:bg-[#1d222b] focus:bg-[#1d222b] focus:ring-2 focus:ring-[#4da3ff]/50";

/** Colour dot; the last one in a row opens the system colour picker for any colour. */
const Swatch = ({ value, selected, label, onPick }: { value: string; selected: boolean; label: string; onPick: () => void }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={label}
    title={label}
    onClick={onPick}
    className={`relative flex aspect-square items-center justify-center rounded-full transition-transform active:scale-90 ${ring} ${selected ? "scale-110 shadow-[0_0_0_2px_#111419,0_0_0_4px_rgba(255,255,255,0.85)]" : "hover:scale-105"}`}
    style={{ backgroundColor: value }}
  >
    {selected && <Check className="size-3.5 text-white mix-blend-difference" strokeWidth={3} aria-hidden="true" />}
  </button>
);

const CustomColor = ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
  <label className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-[conic-gradient(from_0deg,#ff5f6d,#ffc371,#47e891,#3fb4ff,#a66cff,#ff5f6d)] ${ring}`} title={label}>
    <span className="flex size-[62%] items-center justify-center rounded-full bg-[#111419]">
      <Pipette className="size-3.5 text-white" aria-hidden="true" />
    </span>
    <input type="color" value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="absolute inset-0 cursor-pointer opacity-0" />
  </label>
);

/* ------------------------------------------------------------------ */
/* 1. Palette                                                          */
/* ------------------------------------------------------------------ */

const PaletteStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const accents = suggestAccents(config.color);
  const toneIcons = { light: <Sun className="size-3.5" />, tinted: <Droplet className="size-3.5" />, dark: <Moon className="size-3.5" />, midnight: <Sunset className="size-3.5" /> };
  const vars = buildPreviewVars(config) as Record<string, string>;
  const strip = [
    { label: "اصلی", value: config.color },
    { label: "دوم", value: config.accent },
    { label: "ملایم", value: vars["--pv-soft"] },
    { label: "زمینه", value: vars["--pv-bg"] },
    { label: "متن", value: vars["--pv-text"] },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* the palette being built */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/6">
        <div className="flex h-16">
          {strip.map((item) => (
            <span key={item.label} className="flex-1 transition-colors duration-300" style={{ backgroundColor: item.value }} />
          ))}
        </div>
        <div className="flex bg-[#171b22]">
          {strip.map((item) => (
            <span key={item.label} className="flex-1 px-1 py-2 text-center">
              <span className="block text-[10px] text-[#8a93a0]">{item.label}</span>
              <span className="block font-mono text-[10px] uppercase text-[#c9d0d9]" dir="ltr">{item.value}</span>
            </span>
          ))}
        </div>
      </div>

      <div>
        <Label hint="هر رنگی بخواهید">رنگ اصلی</Label>
        <div role="radiogroup" aria-label="رنگ اصلی" className="grid grid-cols-9 gap-2">
          {colors.map((color) => (
            <Swatch key={color.value} value={color.value} label={color.label} selected={config.color === color.value} onPick={() => update({ color: color.value, accent: suggestAccents(color.value)[0].value })} />
          ))}
          <CustomColor value={config.color} label="رنگ دلخواه" onChange={(value) => update({ color: value })} />
        </div>
      </div>

      <div>
        <Label hint="پیشنهاد هماهنگ با رنگ اصلی">رنگ دوم</Label>
        <div className="grid grid-cols-5 gap-2">
          {accents.map((accent) => {
            const selected = config.accent.toLowerCase() === accent.value.toLowerCase();
            return (
              <button key={accent.label} type="button" aria-pressed={selected} onClick={() => update({ accent: accent.value })} className={`flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-colors ${ring} ${selected ? active : idle}`}>
                <span className="flex h-8 w-full overflow-hidden rounded-lg">
                  <span className="flex-1" style={{ backgroundColor: config.color }} />
                  <span className="flex-1" style={{ backgroundColor: accent.value }} />
                </span>
                <span className="text-[10.5px] font-bold">{accent.label}</span>
              </button>
            );
          })}
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#171b22] p-2">
            <span className="w-8"><CustomColor value={config.accent} label="رنگ دوم دلخواه" onChange={(value) => update({ accent: value })} /></span>
            <span className="text-[10.5px] font-bold text-[#c9d0d9]">دلخواه</span>
          </div>
        </div>
      </div>

      <div>
        <Label>فضای کلی</Label>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((theme) => {
            const selected = config.theme === theme.value;
            return (
              <Tile key={theme.value} selected={selected} onClick={() => update({ theme: theme.value })} className="p-1.5">
                <div style={buildPreviewVars({ ...config, theme: theme.value })} className="flex h-14 flex-col justify-between rounded-xl bg-(--pv-bg) p-2">
                  <span className="h-1.5 w-2/3 rounded-full bg-(--pv-text) opacity-70" />
                  <span className="flex gap-1">
                    <span className="h-3 w-5 rounded-[4px] bg-(--pv-primary)" />
                    <span className="h-3 w-3 rounded-[4px] bg-(--pv-accent)" />
                  </span>
                </div>
                <span className="mt-1.5 flex items-center justify-center gap-1 pb-0.5 text-[11px] font-bold">
                  {toneIcons[theme.value]}
                  {theme.label}
                </span>
              </Tile>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Radius — each option is a complete little UI                     */
/* ------------------------------------------------------------------ */

const UiSpecimen = ({ config }: { config: WizardConfig }) => (
  <div style={buildPreviewVars(config)} className="flex flex-col gap-2 rounded-xl bg-(--pv-bg) p-2.5 text-(--pv-text)">
    <div className="flex items-center justify-between rounded-(--pv-r-ctrl) bg-(--pv-surface) px-2 py-1.5">
      <span className="size-3 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
      <span className="h-1 w-8 rounded-full bg-(--pv-text) opacity-30" />
    </div>
    <div className="flex items-center gap-2 rounded-(--pv-r-card) bg-(--pv-surface) p-2">
      <span className="size-6 shrink-0 rounded-(--pv-r-ctrl) bg-(--pv-accent)" />
      <span className="flex-1 space-y-1">
        <span className="block h-1.5 w-full rounded-full bg-(--pv-text) opacity-60" />
        <span className="block h-1 w-1/2 rounded-full bg-(--pv-text) opacity-25" />
      </span>
    </div>
    <span className="h-5 rounded-(--pv-r-ctrl) border border-(--pv-border) bg-(--pv-bg)" />
    <span className="flex gap-1.5">
      <span className="h-5 flex-1 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
      <span className="h-5 w-8 rounded-(--pv-r-ctrl) bg-(--pv-soft)" />
    </span>
  </div>
);

const RadiusStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {radii.map((radius) => {
        const selected = config.radius === radius.value;
        return (
          <Tile key={radius.value} selected={selected} onClick={() => update({ radius: radius.value })} className="p-2">
            <UiSpecimen config={{ ...config, radius: radius.value }} />
            <span className="flex items-center justify-between px-1 pb-0.5 pt-2.5">
              <span>
                <strong className="block text-[13px]">{radius.label}</strong>
                <span className="text-[11px] opacity-60">{radius.description}</span>
              </span>
              {selected && <span className="flex size-5 items-center justify-center rounded-full bg-[#4da3ff] text-white"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>}
            </span>
          </Tile>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Type                                                             */
/* ------------------------------------------------------------------ */

const TypeStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const sample: Record<string, CSSProperties> = {
    light: { fontWeight: 300, fontSize: 26, letterSpacing: 0 },
    balanced: { fontWeight: 700, fontSize: 26, letterSpacing: "-0.01em" },
    heavy: { fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em" },
  };

  return (
    <div className="flex flex-col gap-2.5">
      {typeStyles.map((type) => {
        const selected = config.type === type.value;
        return (
          <Tile key={type.value} selected={selected} onClick={() => update({ type: type.value })} className="flex items-center gap-4 p-4">
            <span className="w-16 shrink-0 text-center leading-none text-white" style={{ ...sample[type.value], fontSize: 44 }}>آب</span>
            <span className="min-w-0 flex-1">
              <span className="block leading-tight text-white" style={sample[type.value]}>{type.sample}</span>
              <span className="mt-1.5 block text-[11px] opacity-60">{type.label}</span>
            </span>
            {selected && <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4da3ff] text-white"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>}
          </Tile>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Backdrop + motion                                                */
/* ------------------------------------------------------------------ */

/** A tiny looping scene that shows what each motion level feels like. */
const MotionDemo = ({ level, config }: { level: WizardConfig["motion"]; config: WizardConfig }) => (
  <div style={buildPreviewVars(config)} className="relative flex h-20 items-center gap-2 overflow-hidden rounded-xl bg-(--pv-bg) px-3">
    <div className={`flex flex-1 flex-col gap-1.5 ${level === "none" ? "" : `pv-demo-${level}`}`}>
      <span className="block h-2 w-4/5 rounded-full bg-(--pv-text) opacity-80" />
      <span className="block h-1.5 w-3/5 rounded-full bg-(--pv-text) opacity-35" />
      <span className="mt-1 block h-3.5 w-10 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
    </div>
    <div className={`flex gap-1.5 ${level === "none" ? "" : `pv-demo-${level}`}`}>
      <span className="size-7 rounded-(--pv-r-ctrl) bg-(--pv-accent)" />
      <span className="size-7 rounded-(--pv-r-ctrl) bg-(--pv-soft)" />
    </div>
  </div>
);

const BackdropStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const motionIcons = { none: <Wind className="size-3.5" />, subtle: <Sparkles className="size-3.5" />, snappy: <Zap className="size-3.5" />, lively: <Waves className="size-3.5" /> };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label>پس‌زمینه بخش اول</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {backdrops.map((backdrop, index) => {
            const selected = config.backdrop === backdrop.value;
            return (
              <Tile key={backdrop.value} selected={selected} onClick={() => update({ backdrop: backdrop.value })} className={`p-1.5 ${index === backdrops.length - 1 ? "col-span-2" : ""}`}>
                <div style={buildPreviewVars(config)} className="relative flex h-20 items-center justify-center overflow-hidden rounded-xl bg-(--pv-bg)">
                  <Backdrop kind={backdrop.value} />
                  <span className="relative flex flex-col items-center gap-1.5">
                    <span className="h-2 w-20 rounded-full bg-(--pv-text) opacity-80" />
                    <span className="h-3 w-10 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
                  </span>
                </div>
                <span className="block pb-0.5 pt-2 text-center text-[12px] font-bold">{backdrop.label}</span>
              </Tile>
            );
          })}
        </div>
      </div>
      <div>
        <Label hint="هر کارت حرکت خودش را نشان می‌دهد">انیمیشن و حرکت</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {motionLevels.map((level) => {
            const selected = config.motion === level.value;
            return (
              <Tile key={level.value} selected={selected} onClick={() => update({ motion: level.value }, "hero")} className="p-1.5">
                <MotionDemo level={level.value} config={config} />
                <span className="flex items-center justify-between px-1 pb-0.5 pt-2">
                  <span>
                    <strong className="flex items-center gap-1.5 text-[12.5px]">{motionIcons[level.value]}{level.label}</strong>
                    <span className="text-[10.5px] opacity-60">{level.description}</span>
                  </span>
                  {selected && <span className="flex size-5 items-center justify-center rounded-full bg-[#4da3ff] text-white"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>}
                </span>
              </Tile>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Business                                                         */
/* ------------------------------------------------------------------ */

const BusinessStep = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const setIndustry = useWizard((state) => state.setIndustry);
  const setProjectType = useWizard((state) => state.setProjectType);
  const types = projectTypes.filter((type) => kind !== "app" || type.forApp);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label>نوع پروژه</Label>
        <div className="grid grid-cols-2 gap-2">
          {types.map((type) => {
            const selected = config.projectType === type.value;
            return (
              <Tile key={type.value} selected={selected} onClick={() => setProjectType(type.value)} className="flex items-start gap-2.5 p-3">
                <type.icon className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <strong className="block text-[12.5px] leading-5">{type.label}</strong>
                  <span className="block text-[10.5px] leading-4 opacity-60">{type.description}</span>
                </span>
              </Tile>
            );
          })}
        </div>
      </div>
      {kind === "site" && (
        <Tile selected={config.webApp} onClick={() => update({ webApp: !config.webApp }, "top")} className="flex items-center gap-3 p-3.5">
          <Smartphone className="size-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <strong className="block text-[13px] text-white">نسخه وب‌اپ هم داشته باشد</strong>
            <span className="text-[11px] opacity-60">روی گوشی نصب می‌شود و مثل اپ کار می‌کند؛ بدون فروشگاه</span>
          </span>
          <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${config.webApp ? "bg-[#4da3ff]" : "bg-[#2a303b]"}`} aria-hidden="true">
            <span className="absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]" style={{ left: config.webApp ? 2 : 18 }} />
          </span>
        </Tile>
      )}
      <div>
        <Label>حوزه فعالیت</Label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(industries) as IndustryKey[]).map((key) => {
            const item = industries[key];
            const selected = config.industry === key;
            return (
              <Tile key={key} selected={selected} onClick={() => setIndustry(key)} className="flex h-[76px] flex-col items-center justify-center gap-2 px-1 text-center">
                <item.icon className="size-5" aria-hidden="true" />
                <span className="text-[11.5px] font-bold leading-4">{item.label}</span>
              </Tile>
            );
          })}
        </div>
      </div>
      <label className="block">
        <Label>نام برند</Label>
        <input value={config.brandName} onChange={(event) => update({ brandName: event.target.value }, "top")} placeholder="مثلاً کافه خیام" maxLength={28} className={`${field} h-12 font-bold placeholder:font-normal`} />
      </label>
      <label className="block">
        <Label hint="اختیاری">جمله اصلی صفحه</Label>
        <input value={config.tagline} onChange={(event) => update({ tagline: event.target.value }, "hero")} placeholder={industries[config.industry].headline} maxLength={48} className={`${field} h-12`} />
      </label>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Design — the whole page                                          */
/* ------------------------------------------------------------------ */

const DesignStep = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const setVariant = useWizard((state) => state.setVariant);
  const update = useWizard((state) => state.update);
  const count = kind === "app" ? APP_DESIGN_COUNT : SITE_DESIGN_COUNT;

  if (kind === "site" && (config.projectType === "dashboard" || config.projectType === "community")) {
    return (
      <p className="flex gap-2 rounded-2xl bg-[#171b22] px-4 py-4 text-[12.5px] leading-7 text-[#a7b0bc]">
        <Info className="mt-1.5 size-4 shrink-0 text-[#4da3ff]" aria-hidden="true" />
        {config.projectType === "dashboard" ? "پنل‌های داخلی چیدمان استاندارد و کاربردی دارند" : "پلتفرم‌های جامعه چیدمان فید و گروه دارند"}؛ ظاهرش با پالت، گوشه‌ها و نوشته‌هایی که انتخاب کردید ساخته می‌شود. ماژول‌ها را در مرحله بعد انتخاب کنید.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label hint={`${faNumber(count)} چیدمان`}>چیدمان صفحه</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: count }, (_, design) => {
            const selected = design === config.variant;
            return (
              <button
                key={design}
                type="button"
                aria-pressed={selected}
                aria-label={kind === "app" ? `طرح ${faNumber(design + 1)}` : siteLayouts[design].label}
                onClick={() => setVariant(design)}
                className={`overflow-hidden rounded-2xl p-1.5 text-right transition-colors ${ring} ${selected ? active : idle}`}
              >
                <div className="overflow-hidden rounded-xl">
                  <DesignThumb kind={kind} config={{ ...config, variant: design }} />
                </div>
                <span className="flex items-center justify-between px-1 pb-0.5 pt-2 text-[12px] font-bold">
                  {kind === "app" ? `طرح ${faNumber(design + 1)}` : siteLayouts[design].label}
                  {selected && <span className="flex size-5 items-center justify-center rounded-full bg-[#4da3ff] text-white"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label>تصویر اصلی</Label>
        <div className="flex flex-wrap gap-1.5">
          {industryArts[config.industry].map((art, index) => (
            <button key={art} type="button" aria-pressed={config.art === index} onClick={() => update({ art: index }, "hero")} className={`h-9 rounded-full px-3.5 text-[12px] font-bold transition-colors ${ring} ${config.art === index ? active : idle}`}>
              {artLabels[art]}
            </button>
          ))}
        </div>
      </div>
      <p className="flex gap-2 rounded-2xl bg-[#171b22] px-3.5 py-3 text-[11.5px] leading-6 text-[#8a93a0]">
        <Info className="mt-1 size-3.5 shrink-0 text-[#4da3ff]" aria-hidden="true" />
        این‌ها همه کارهایی نیست که می‌توانیم انجام دهیم. نزدیک‌ترین را انتخاب کنید؛ بعد از ثبت درخواست هر تغییری بخواهید اعمال می‌کنیم.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 7–9. Sections, extras, references                                   */
/* ------------------------------------------------------------------ */

const SectionsStep = () => {
  const kind = useWizard((state) => state.kind);
  const sections = useWizard((state) => state.config.sections);
  const toggle = useWizard((state) => state.toggleSection);
  const projectType = useWizard((state) => state.config.projectType);
  const options = sectionOptions(kind, projectType);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = sections.includes(option.value);
          return (
            <button key={option.value} type="button" aria-pressed={selected} onClick={() => toggle(option.value)} className={`flex h-10 items-center gap-2 rounded-full px-4 text-[12px] font-bold transition-colors active:scale-95 ${ring} ${selected ? active : idle}`}>
              {selected ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <option.icon className="size-3.5 opacity-60" aria-hidden="true" />}
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[#5d6573]">{faNumber(sections.length)} مورد انتخاب شده</p>
    </div>
  );
};

const ExtrasStep = () => {
  const kind = useWizard((state) => state.kind);
  const extras = useWizard((state) => state.config.extras);
  const update = useWizard((state) => state.update);
  const options = kind === "app" ? appExtras : siteExtras;

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
      {options.map((option) => {
        const selected = extras.includes(option.value);
        return (
          <Tile
            key={option.value}
            selected={selected}
            onClick={() => update({ extras: selected ? extras.filter((item) => item !== option.value) : [...extras, option.value] }, option.visible ? "top" : undefined)}
            className="flex items-center gap-3 p-3"
          >
            <option.icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <strong className="flex items-center gap-1.5 text-[12.5px] leading-5">
                {option.label}
                {!option.visible && (
                  <span className="hidden items-center gap-0.5 rounded-full bg-white/6 px-1.5 text-[10px] font-normal text-[#8a93a0] lg:inline-flex" title="در پیش‌نمایش دیده نمی‌شود">
                    <EyeOff className="size-2.5" aria-hidden="true" /> پشت صحنه
                  </span>
                )}
              </strong>
              <span className="hidden text-[11px] text-[#8a93a0] lg:block">{option.description}</span>
            </span>
            <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${selected ? "bg-[#4da3ff]" : "bg-[#2a303b]"}`} aria-hidden="true">
              {/* RTL switch: off sits on the right, on slides to the left */}
              <span className="absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]" style={{ left: selected ? 2 : 18 }} />
            </span>
          </Tile>
        );
      })}
    </div>
  );
};

const ReferencesStep = () => {
  const references = useWizard((state) => state.config.references);
  const notes = useWizard((state) => state.config.notes);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label hint="اختیاری">لینک نمونه‌ها</Label>
        {references.map((value, index) => (
          <label key={index} className="relative block">
            <span className="sr-only">لینک نمونه {faNumber(index + 1)}</span>
            <Link2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#5d6573]" aria-hidden="true" />
            <input
              dir="ltr"
              type="url"
              inputMode="url"
              value={value}
              placeholder={["dribbble.com/...", "digikala.com", "..."][index]}
              onChange={(event) => update({ references: references.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) }, "top")}
              className={`${field} h-11 pl-11 text-left`}
            />
          </label>
        ))}
      </div>
      <label className="block">
        <Label>چه چیزی در آن‌ها دوست دارید؟</Label>
        <textarea value={notes} rows={3} onChange={(event) => update({ notes: event.target.value }, "top")} placeholder="مثلاً رنگ‌های سایت اول و منوی ساده سایت دوم" className={`${field} resize-none py-3 leading-6`} />
      </label>
      <p className="flex gap-2 rounded-2xl bg-[#3a2c10]/60 px-3.5 py-3 text-[11.5px] leading-6 text-[#f2cf8a]">
        <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
        همه این مقادیر طبق خواسته شما قابل تغییر است. بعد از ثبت درخواست هم می‌توانید هر تغییری را برایمان بفرستید.
      </p>
    </div>
  );
};

/** Last step: Figma design to review, or the full build; plus contact details and a live estimate. */
export const OutcomeStep = () => {
  const kind = useWizard((state) => state.kind);
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const cost = estimate(kind, config);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(77,163,255,0.16),rgba(124,108,255,0.12))] p-4 ring-1 ring-[#4da3ff]/25">
        <span className="text-[11.5px] font-bold text-[#9ccbff]">برآورد اولیه</span>
        <div className="mt-1 flex items-baseline gap-2">
          <strong className="text-[24px] font-black text-white">
            {faNumber(cost.min)} تا {faNumber(cost.max)}
          </strong>
          <span className="text-[12px] text-[#a7b0bc]">میلیون تومان</span>
        </div>
        <span className="mt-1 block text-[12px] text-[#a7b0bc]">زمان تقریبی: {faNumber(Math.max(1, cost.weeks))} هفته</span>
        <span className="mt-2 block text-[11px] leading-5 text-[#8a93a0]">شامل طراحی فیگما؛ با هر انتخاب به‌روز می‌شود و قیمت نهایی را مشاور بعد از بررسی اعلام می‌کند.</span>
      </div>

      <PlanChoice plan={config.plan} estimateMin={cost.min} onChange={(plan) => update({ plan })} />

      <div className="grid grid-cols-1 gap-2.5">
        <label className="block">
          <Label>نام شما</Label>
          <input value={config.contactName} onChange={(event) => update({ contactName: event.target.value })} placeholder="مثلاً سارا محمدی" autoComplete="name" className={`${field} h-12`} />
        </label>
        <label className="block">
          <Label>شماره تماس</Label>
          <input value={config.contactPhone} onChange={(event) => update({ contactPhone: event.target.value })} placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} h-12 text-left`} />
        </label>
      </div>
    </div>
  );
};

export const stepPanels: Partial<Record<StepKey, () => ReactNode>> = {
  palette: PaletteStep,
  radius: RadiusStep,
  type: TypeStep,
  backdrop: BackdropStep,
  business: BusinessStep,
  design: DesignStep,
  sections: SectionsStep,
  extras: ExtrasStep,
  references: ReferencesStep,
  outcome: OutcomeStep,
};
