"use client";

import { Check, Droplet, EyeOff, Info, Link2, Moon, Sparkles, Sun, Wind, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import {
  appFeatures,
  appExtras,
  buildPreviewVars,
  colors,
  faNumber,
  industries,
  moods,
  radii,
  motionLevels,
  siteExtras,
  siteSections,
  themes,
  typeStyles,
  type StepKey,
} from "./config";
import { useWizard } from "./store";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] focus-visible:ring-offset-1";
// No borders: selection is a soft tinted background, hover a slightly deeper grey.
const idle = "bg-[#f5f7f8] hover:bg-[#edf1f3]";
const active = "bg-[#e6f2fc] text-[#0a5a9c]";

const Tile = ({ selected, onClick, children, className = "", label }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string; label?: string }) => (
  <button type="button" aria-pressed={selected} aria-label={label} onClick={onClick} className={`relative rounded-xl text-right transition-colors duration-150 ${ring} ${selected ? active : idle} ${className}`}>
    {children}
  </button>
);

const Label = ({ children }: { children: ReactNode }) => <span className="mb-2 block text-[12px] font-bold text-[#6b7780]">{children}</span>;

function Segmented<T extends string>({ id, label, options, value, onChange }: { id: string; label: string; options: { value: T; label: string; icon?: ReactNode }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div role="radiogroup" aria-label={label} className="grid gap-1 rounded-xl bg-[#f3f5f7] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => onChange(option.value)} className={`relative flex h-10 items-center justify-center rounded-lg text-[12px] font-bold ${ring}`}>
              {selected && <motion.span layoutId={id} className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_2px_rgba(20,32,43,0.08)]" transition={{ type: "spring", bounce: 0.18, duration: 0.35 }} />}
              <span className={`relative flex items-center gap-1.5 transition-colors ${selected ? "text-[#0a5a9c]" : "text-[#7a868d]"}`}>
                {option.icon}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const field =
  "w-full rounded-xl bg-[#f5f7f8] px-3.5 text-[13px] outline-none transition-colors placeholder:text-[#a3aeb4] hover:bg-[#edf1f3] focus:bg-[#e6f2fc]";

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

const BrandStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const content = industries[config.industry];

  return (
    <div className="flex flex-col gap-5">
      <label className="block">
        <Label>نام برند</Label>
        <input value={config.brandName} onChange={(event) => update({ brandName: event.target.value }, "top")} placeholder="مثلاً کافه خیام" maxLength={28} className={`${field} h-11 font-bold placeholder:font-normal`} />
      </label>
      <label className="block">
        <Label>جمله اصلی صفحه (اختیاری)</Label>
        <input value={config.tagline} onChange={(event) => update({ tagline: event.target.value }, "hero")} placeholder={content.headline} maxLength={48} className={`${field} h-11`} />
        <span className="mt-1.5 block text-[11px] text-[#8a959b]">اگر خالی بماند، متن پیشنهادی ما نمایش داده می‌شود.</span>
      </label>
    </div>
  );
};

const MoodStep = () => {
  const mood = useWizard((state) => state.config.mood);
  const update = useWizard((state) => state.update);

  return (
    <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
      {moods.map((item) => {
        const selected = mood === item.value;
        return (
          <Tile key={item.value} selected={selected} onClick={() => update({ mood: item.value, ...item.tokens }, "hero")} className="flex items-center gap-2 p-1.5 lg:gap-3 lg:p-2 lg:pe-3">
            {/* a tiny live sample of the mood */}
            <span style={buildPreviewVars(item.tokens)} className="flex h-9 w-11 shrink-0 flex-col justify-center gap-1.5 rounded-lg bg-(--pv-bg) px-1.5 ring-1 ring-black/8 lg:h-10 lg:w-16 lg:px-2">
              <span className="block w-4/5 rounded-full bg-(--pv-text)" style={{ height: item.tokens.type === "heavy" ? 5 : 4, opacity: item.tokens.type === "light" ? 0.4 : 0.85 }} />
              <span className="block h-2.5 w-6 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[12px] leading-5 lg:text-[13px]">{item.label}</strong>
              <span className="hidden text-[11px] text-[#7a868d] lg:block">{item.description}</span>
            </span>
            <span className={`hidden size-5 items-center justify-center rounded-full transition lg:flex ${selected ? "bg-[#078ef0] text-white" : "bg-[#e9edf0]"}`}>{selected && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}</span>
          </Tile>
        );
      })}
    </div>
  );
};

const ColorStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const themeIcons = { light: <Sun className="size-3.5" />, tinted: <Droplet className="size-3.5" />, dark: <Moon className="size-3.5" /> };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>رنگ اصلی</Label>
        <div role="radiogroup" aria-label="رنگ اصلی" className="grid grid-cols-8 gap-2">
          {colors.map((color) => {
            const selected = config.color === color.value;
            return (
              <button
                key={color.value}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={color.label}
                title={color.label}
                onClick={() => update({ color: color.value, mood: null })}
                className={`flex aspect-square items-center justify-center rounded-full transition active:scale-90 ${ring} ${selected ? "scale-110" : "opacity-90 hover:opacity-100"}`}
                style={{ backgroundColor: color.value }}
              >
                {selected && <Check className="size-3.5 text-white" strokeWidth={3} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
      <Segmented id="seg-theme" label="حالت نمایش" value={config.theme} onChange={(theme) => update({ theme, mood: null })} options={themes.map((theme) => ({ ...theme, icon: themeIcons[theme.value] }))} />
    </div>
  );
};

const ShapeStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const corner = { sharp: 2, soft: 6, round: 12 };
  const weight = { light: 300, balanced: 700, heavy: 800 };

  return (
    <div className="flex flex-col gap-5">
      <Segmented
        id="seg-radius"
        label="گوشه‌ها"
        value={config.radius}
        onChange={(radius) => update({ radius, mood: null })}
        options={radii.map((radius) => ({ ...radius, icon: <span className="block size-3.5 border-2 border-current border-b-transparent border-l-transparent" style={{ borderTopRightRadius: corner[radius.value] }} /> }))}
      />
      <Segmented
        id="seg-type"
        label="نوشته‌ها"
        value={config.type}
        onChange={(type) => update({ type, mood: null })}
        options={typeStyles.map((type) => ({ value: type.value, label: type.value === "heavy" ? "پررنگ" : type.label, icon: <span className="text-[15px] leading-none" style={{ fontWeight: weight[type.value] }}>آ</span> }))}
      />
    </div>
  );
};

const SectionsStep = () => {
  const kind = useWizard((state) => state.kind);
  const sections = useWizard((state) => state.config.sections);
  const toggle = useWizard((state) => state.toggleSection);
  const options = kind === "app" ? appFeatures : siteSections;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = sections.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
              className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition active:scale-95 ${ring} ${selected ? "bg-[#e6f2fc] text-[#0a5a9c]" : "bg-[#f5f7f8] text-[#33414b] hover:bg-[#edf1f3]"}`}
            >
              {selected ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <option.icon className="size-3.5 text-[#8a959b]" aria-hidden="true" />}
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[#7a868d]">{faNumber(sections.length)} مورد انتخاب شده</p>
    </div>
  );
};

const ExtrasStep = () => {
  const kind = useWizard((state) => state.kind);
  const motionLevel = useWizard((state) => state.config.motion);
  const extras = useWizard((state) => state.config.extras);
  const update = useWizard((state) => state.update);
  const options = kind === "app" ? appExtras : siteExtras;
  const motionIcons = { none: <Wind className="size-3.5" />, subtle: <Sparkles className="size-3.5" />, lively: <Zap className="size-3.5" /> };

  return (
    <div className="flex flex-col gap-5">
      <Segmented id="seg-motion" label="انیمیشن و حرکت" value={motionLevel} onChange={(value) => update({ motion: value }, "hero")} options={motionLevels.map((level) => ({ ...level, icon: motionIcons[level.value] }))} />
      <div>
        <Label>امکانات فنی</Label>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {options.map((option) => {
            const selected = extras.includes(option.value);
            return (
              <Tile
                key={option.value}
                selected={selected}
                onClick={() => update({ extras: selected ? extras.filter((item) => item !== option.value) : [...extras, option.value] }, option.visible ? "top" : undefined)}
                className="flex items-center gap-2.5 p-2.5 lg:gap-3 lg:p-3"
              >
                <option.icon className={`size-4 shrink-0 ${selected ? "text-[#078ef0]" : "text-[#8a959b]"}`} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <strong className="flex items-center gap-1.5 text-[12px] leading-5 lg:text-[13px]">
                    {option.label}
                    {!option.visible && (
                      <span className="hidden items-center gap-0.5 rounded-full bg-black/5 px-1.5 text-[10px] font-normal text-[#7a868d] lg:inline-flex" title="در پیش‌نمایش دیده نمی‌شود">
                        <EyeOff className="size-2.5" aria-hidden="true" /> پشت صحنه
                      </span>
                    )}
                  </strong>
                  <span className="hidden text-[11px] text-[#8a959b] lg:block">{option.description}</span>
                </span>
                <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${selected ? "bg-[#078ef0]" : "bg-[#d6dde1]"}`} aria-hidden="true">
                  {/* RTL switch: off sits on the right, on slides to the left */}
                  <span className="absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]" style={{ left: selected ? 2 : 18 }} />
                </span>
              </Tile>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReferencesStep = () => {
  const references = useWizard((state) => state.config.references);
  const notes = useWizard((state) => state.config.notes);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>لینک نمونه‌ها (اختیاری)</Label>
        {references.map((value, index) => (
          <label key={index} className="relative block">
            <span className="sr-only">لینک نمونه {faNumber(index + 1)}</span>
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a3aeb4]" aria-hidden="true" />
            <input
              dir="ltr"
              type="url"
              inputMode="url"
              value={value}
              placeholder={["dribbble.com/...", "digikala.com", "..."][index]}
              onChange={(event) => update({ references: references.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) }, "top")}
              className={`${field} h-10 pl-10 text-left`}
            />
          </label>
        ))}
      </div>
      <label className="block">
        <Label>چه چیزی در آن‌ها دوست دارید؟</Label>
        <textarea value={notes} rows={2} onChange={(event) => update({ notes: event.target.value }, "top")} placeholder="مثلاً رنگ‌های سایت اول و منوی ساده سایت دوم" className={`${field} resize-none py-2.5 leading-6`} />
      </label>
      <p className="flex gap-2 rounded-xl bg-[#fff7e8] px-3 py-2.5 text-[11.5px] leading-6 text-[#7a5a1c]">
        <Info className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
        همه این مقادیر طبق خواسته شما قابل تغییر است. بعد از ثبت درخواست هم می‌توانید هر تغییری را برایمان بفرستید.
      </p>
    </div>
  );
};

/** Editor-phase panels; the gallery steps live in gallery.tsx. */
export const stepPanels: Partial<Record<StepKey, () => ReactNode>> = {
  brand: BrandStep,
  mood: MoodStep,
  color: ColorStep,
  shape: ShapeStep,
  sections: SectionsStep,
  extras: ExtrasStep,
  references: ReferencesStep,
};
