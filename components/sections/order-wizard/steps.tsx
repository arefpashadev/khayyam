"use client";

import { Check, Link2, Moon, Droplet, Sun } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import {
  appFeatures,
  appLayouts,
  buildPreviewVars,
  colors,
  faNumber,
  industries,
  moods,
  radii,
  siteLayouts,
  siteSections,
  themes,
  typeStyles,
  type IndustryKey,
  type LayoutKey,
  type StepKey,
} from "./config";
import { useWizard } from "./store";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] focus-visible:ring-offset-1";
const idle = "border-transparent bg-[#f3f5f7] hover:bg-[#eaeef1]";
const active = "border-[#14202b] bg-white shadow-[0_1px_0_1px_#14202b]";

const Tile = ({ selected, onClick, children, className = "", label }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string; label?: string }) => (
  <button type="button" aria-pressed={selected} aria-label={label} onClick={onClick} className={`relative rounded-xl border text-right transition duration-150 active:scale-[0.97] ${ring} ${selected ? active : idle} ${className}`}>
    {children}
  </button>
);

const Label = ({ children }: { children: ReactNode }) => <span className="mb-2 block text-[12px] font-bold text-[#6b7780]">{children}</span>;

function Segmented<T extends string>({ id, label, options, value, onChange }: { id: string; label: string; options: { value: T; label: string; icon?: ReactNode }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div role="radiogroup" aria-label={label} className="grid gap-1 rounded-xl bg-[#f0f3f5] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => onChange(option.value)} className={`relative flex h-10 items-center justify-center rounded-lg text-[12px] font-bold ${ring}`}>
              {selected && <motion.span layoutId={id} className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_3px_rgba(20,32,43,0.12)] ring-1 ring-black/5" transition={{ type: "spring", bounce: 0.18, duration: 0.35 }} />}
              <span className={`relative flex items-center gap-1.5 transition-colors ${selected ? "text-[#14202b]" : "text-[#7a868d]"}`}>
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
  "w-full rounded-xl border border-transparent bg-[#f3f5f7] px-3.5 text-[13px] outline-none transition placeholder:text-[#a3aeb4] focus:border-[#14202b] focus:bg-white";

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

const BrandStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-5">
      <label className="block">
        <Label>نام برند</Label>
        <input value={config.brandName} onChange={(event) => update({ brandName: event.target.value }, "top")} placeholder="مثلاً کافه خیام" maxLength={28} className={`${field} h-11 font-bold placeholder:font-normal`} />
      </label>
      <div>
        <Label>حوزه فعالیت</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(industries) as IndustryKey[]).map((key) => {
            const item = industries[key];
            return (
              <Tile key={key} selected={config.industry === key} onClick={() => update({ industry: key }, "hero")} className="flex h-[68px] flex-col items-center justify-center gap-1.5 px-1 text-center">
                <item.icon className={`size-[18px] ${config.industry === key ? "text-[#078ef0]" : "text-[#5b6872]"}`} aria-hidden="true" />
                <span className="text-[11px] font-bold leading-4">{item.label}</span>
              </Tile>
            );
          })}
        </div>
      </div>
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
            <span className={`hidden size-5 items-center justify-center rounded-full transition lg:flex ${selected ? "bg-[#14202b] text-white" : "ring-1 ring-[#d3dadf]"}`}>{selected && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}</span>
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
                className={`flex aspect-square items-center justify-center rounded-full transition active:scale-90 ${ring} ${selected ? "shadow-[0_0_0_2px_#fff,0_0_0_4px_#14202b]" : "hover:scale-110"}`}
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

/** Tiny wireframe drawing of each layout. */
const LayoutGlyph = ({ value }: { value: LayoutKey }) => {
  const bar = "rounded-sm bg-current";
  const block = "rounded-[3px] bg-current opacity-25";
  const glyphs: Record<LayoutKey, ReactNode> = {
    split: (
      <div className="flex size-full items-center gap-1.5 p-1.5">
        <div className="flex flex-1 flex-col gap-1"><span className={`${bar} h-1 w-full`} /><span className={`${bar} h-1 w-2/3`} /><span className={`${bar} mt-0.5 h-1.5 w-1/2 opacity-60`} /></div>
        <div className={`${block} h-full flex-1`} />
      </div>
    ),
    centered: (
      <div className="flex size-full flex-col items-center gap-1 p-1.5"><span className={`${bar} h-1 w-2/3`} /><span className={`${bar} h-1 w-1/3`} /><div className={`${block} mt-0.5 w-full flex-1`} /></div>
    ),
    fullbleed: (
      <div className="size-full p-1"><div className="flex size-full flex-col items-center justify-center gap-1 rounded-[3px] bg-current"><span className="h-1 w-2/3 rounded-sm bg-white" /><span className="h-1 w-1/3 rounded-sm bg-white/70" /></div></div>
    ),
    cards: <div className="grid size-full grid-cols-2 gap-1 p-1.5"><div className={block} /><div className={block} /><div className={block} /><div className={block} /></div>,
    list: (
      <div className="flex size-full flex-col gap-1 p-1.5">
        {[0, 1, 2].map((row) => (<div key={row} className="flex flex-1 items-center gap-1"><span className={`${block} aspect-square h-full`} /><span className={`${bar} h-1 flex-1`} /></div>))}
      </div>
    ),
    feed: (
      <div className="flex size-full flex-col gap-1 p-1.5"><div className="flex gap-1">{[0, 1, 2, 3].map((dot) => (<span key={dot} className="size-2 rounded-full bg-current" />))}</div><div className={`${block} w-full flex-1`} /></div>
    ),
  };
  return <div className="h-12 w-full rounded-lg bg-white text-[#14202b] ring-1 ring-black/5">{glyphs[value]}</div>;
};

const LayoutStep = () => {
  const kind = useWizard((state) => state.kind);
  const layout = useWizard((state) => state.config.layout);
  const update = useWizard((state) => state.update);
  const options = kind === "app" ? appLayouts : siteLayouts;

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {options.map((option) => (
        <Tile key={option.value} selected={layout === option.value} onClick={() => update({ layout: option.value }, "hero")} className="p-1.5">
          <LayoutGlyph value={option.value} />
          <span className="mt-1.5 block pb-0.5 text-center text-[11px] font-bold">{option.label}</span>
        </Tile>
      ))}
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
              className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition active:scale-95 ${ring} ${selected ? "bg-[#14202b] text-white" : "bg-[#f3f5f7] text-[#33414b] hover:bg-[#eaeef1]"}`}
            >
              {selected ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <option.icon className="size-3.5 text-[#7a868d]" aria-hidden="true" />}
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[#7a868d]">{faNumber(sections.length)} مورد انتخاب شده</p>
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
    </div>
  );
};

export const stepPanels: Record<StepKey, () => ReactNode> = {
  brand: BrandStep,
  mood: MoodStep,
  color: ColorStep,
  shape: ShapeStep,
  layout: LayoutStep,
  sections: SectionsStep,
  references: ReferencesStep,
};
