"use client";

import { Check, Link2 } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

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

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#078ef0] focus-visible:ring-offset-2";

const Option = ({ selected, onClick, children, className = "", label }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string; label?: string }) => (
  <button
    type="button"
    aria-pressed={selected}
    aria-label={label}
    onClick={onClick}
    className={`relative rounded-2xl border text-right transition duration-200 active:scale-[0.98] ${focusRing} ${
      selected ? "border-[#14202b] bg-white shadow-[0_0_0_1px_#14202b]" : "border-[#e2e8eb] bg-white hover:border-[#b9c5cc]"
    } ${className}`}
  >
    {children}
  </button>
);

const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <fieldset className="flex flex-col gap-2.5">
    <legend className="mb-2.5 text-[13px] font-bold text-[#4d5b65]">{label}</legend>
    {children}
  </fieldset>
);

const SelectedDot = ({ show }: { show: boolean }) =>
  show ? (
    <span className="absolute left-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#14202b] text-white">
      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
    </span>
  ) : null;

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

const BrandStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-[#4d5b65]">نام برند</span>
        <input
          value={config.brandName}
          onChange={(event) => update({ brandName: event.target.value }, "top")}
          placeholder="مثلاً کافه خیام"
          maxLength={28}
          className="h-12 rounded-xl border border-[#e2e8eb] bg-white px-4 text-[15px] font-bold outline-none transition placeholder:font-normal placeholder:text-[#a3aeb4] focus:border-[#14202b] focus:shadow-[0_0_0_1px_#14202b]"
        />
      </label>

      <Group label="حوزه فعالیت">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(industries) as IndustryKey[]).map((key) => {
            const item = industries[key];
            const selected = config.industry === key;
            return (
              <Option key={key} selected={selected} onClick={() => update({ industry: key }, "hero")} className="flex items-center gap-3 p-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition ${selected ? "bg-[#14202b] text-white" : "bg-[#f1f4f6] text-[#4d5b65]"}`}>
                  <item.icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="text-[13px] font-bold leading-5">{item.label}</span>
              </Option>
            );
          })}
        </div>
      </Group>
    </div>
  );
};

const MoodStep = () => {
  const mood = useWizard((state) => state.config.mood);
  const update = useWizard((state) => state.update);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {moods.map((item, index) => {
        const vars = buildPreviewVars(item.tokens);
        return (
          <Option
            key={item.value}
            selected={mood === item.value}
            onClick={() => update({ mood: item.value, ...item.tokens }, "hero")}
            className={`overflow-hidden p-2 ${index === moods.length - 1 ? "col-span-2" : ""}`}
          >
            {/* tiny live render of the mood itself */}
            <div style={vars} className="flex h-16 flex-col justify-center gap-2 rounded-xl bg-(--pv-bg) px-3 ring-1 ring-black/5">
              <span className="block h-2.5 w-3/4 rounded-full bg-(--pv-text)" style={{ opacity: item.tokens.type === "light" ? 0.45 : item.tokens.type === "heavy" ? 1 : 0.75, height: item.tokens.type === "heavy" ? 12 : 9 }} />
              <span className="flex items-center gap-1.5">
                <span className="h-5 w-12 rounded-(--pv-r-ctrl) bg-(--pv-primary)" />
                <span className="h-5 w-8 rounded-(--pv-r-ctrl) border border-(--pv-border)" />
              </span>
            </div>
            <span className="block px-1 pb-1 pt-2.5">
              <strong className="block text-[13px]">{item.label}</strong>
              <span className="mt-0.5 block text-[11px] text-[#7a868d]">{item.description}</span>
            </span>
            <SelectedDot show={mood === item.value} />
          </Option>
        );
      })}
    </div>
  );
};

const ColorStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-7">
      <Group label="رنگ اصلی">
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
                className={`flex aspect-square items-center justify-center rounded-full transition active:scale-90 ${focusRing} ${selected ? "scale-110 shadow-[0_0_0_2px_#fff,0_0_0_4px_#14202b]" : "hover:scale-105"}`}
                style={{ backgroundColor: color.value }}
              >
                {selected && <Check className="size-4 text-white" strokeWidth={3} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Group>

      <Group label="حالت نمایش">
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const vars = buildPreviewVars({ ...config, theme: theme.value });
            return (
              <Option key={theme.value} selected={config.theme === theme.value} onClick={() => update({ theme: theme.value, mood: null })} className="p-2">
                <div style={vars} className="flex h-12 items-end gap-1 rounded-lg bg-(--pv-bg) p-2 ring-1 ring-black/5">
                  <span className="h-3 flex-1 rounded-sm bg-(--pv-surface) ring-1 ring-(--pv-border)" />
                  <span className="h-3 w-4 rounded-sm bg-(--pv-primary)" />
                </div>
                <span className="mt-2 block text-center text-[12px] font-bold">{theme.label}</span>
              </Option>
            );
          })}
        </div>
      </Group>
    </div>
  );
};

const ShapeStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);
  const cornerRadius = { sharp: 3, soft: 10, round: 22 };
  const typeStyle: Record<string, CSSProperties> = {
    light: { fontWeight: 300, fontSize: 17 },
    balanced: { fontWeight: 700, fontSize: 17 },
    heavy: { fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" },
  };

  return (
    <div className="flex flex-col gap-7">
      <Group label="گوشه‌ها">
        <div className="grid grid-cols-3 gap-2">
          {radii.map((radius) => (
            <Option key={radius.value} selected={config.radius === radius.value} onClick={() => update({ radius: radius.value, mood: null })} className="flex flex-col items-center gap-2.5 py-4">
              <span className="block size-10 border-[2.5px] border-[#14202b] border-b-transparent border-l-transparent" style={{ borderTopRightRadius: cornerRadius[radius.value] }} />
              <span className="text-[12px] font-bold">{radius.label}</span>
            </Option>
          ))}
        </div>
      </Group>

      <Group label="نوشته‌ها">
        <div className="flex flex-col gap-2">
          {typeStyles.map((type) => (
            <Option key={type.value} selected={config.type === type.value} onClick={() => update({ type: type.value, mood: null })} className="flex items-center justify-between px-4 py-3">
              <span style={typeStyle[type.value]}>{type.sample}</span>
              <span className="text-[11px] text-[#7a868d]">{type.label}</span>
            </Option>
          ))}
        </div>
      </Group>
    </div>
  );
};

/** Tiny wireframe drawing of each layout. */
const LayoutGlyph = ({ value }: { value: LayoutKey }) => {
  const bar = "rounded-sm bg-current";
  const block = "rounded-[3px] bg-current opacity-25";
  const glyphs: Record<LayoutKey, ReactNode> = {
    split: (
      <div className="flex size-full items-center gap-1.5 p-2">
        <div className="flex flex-1 flex-col gap-1"><span className={`${bar} h-1.5 w-full`} /><span className={`${bar} h-1.5 w-2/3`} /><span className={`${bar} mt-1 h-2 w-1/2 opacity-60`} /></div>
        <div className={`${block} h-full flex-1`} />
      </div>
    ),
    centered: (
      <div className="flex size-full flex-col items-center gap-1 p-2">
        <span className={`${bar} h-1.5 w-2/3`} /><span className={`${bar} h-1.5 w-1/3`} /><div className={`${block} mt-1 w-full flex-1`} />
      </div>
    ),
    fullbleed: (
      <div className="relative size-full p-1">
        <div className="flex size-full flex-col items-center justify-center gap-1 rounded-[3px] bg-current"><span className="h-1.5 w-2/3 rounded-sm bg-white" /><span className="h-1.5 w-1/3 rounded-sm bg-white/70" /></div>
      </div>
    ),
    cards: (
      <div className="grid size-full grid-cols-2 gap-1 p-2"><div className={block} /><div className={block} /><div className={block} /><div className={block} /></div>
    ),
    list: (
      <div className="flex size-full flex-col gap-1 p-2">
        {[0, 1, 2].map((row) => (<div key={row} className="flex flex-1 items-center gap-1"><span className={`${block} aspect-square h-full`} /><span className={`${bar} h-1.5 flex-1`} /></div>))}
      </div>
    ),
    feed: (
      <div className="flex size-full flex-col gap-1 p-2">
        <div className="flex gap-1">{[0, 1, 2, 3].map((dot) => (<span key={dot} className="size-2.5 rounded-full bg-current" />))}</div>
        <div className={`${block} w-full flex-1`} />
      </div>
    ),
  };
  return <div className="h-16 w-full rounded-lg bg-[#f1f4f6] text-[#14202b]">{glyphs[value]}</div>;
};

const LayoutStep = () => {
  const kind = useWizard((state) => state.kind);
  const layout = useWizard((state) => state.config.layout);
  const update = useWizard((state) => state.update);
  const options = kind === "app" ? appLayouts : siteLayouts;

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <Option key={option.value} selected={layout === option.value} onClick={() => update({ layout: option.value }, "hero")} className="p-2">
          <LayoutGlyph value={option.value} />
          <span className="mt-2 block text-center text-[12px] font-bold leading-5">{option.label}</span>
        </Option>
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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = sections.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option.value)}
            className={`flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition active:scale-95 ${focusRing} ${
              selected ? "border-[#14202b] bg-[#14202b] text-white" : "border-[#e2e8eb] bg-white text-[#33414b] hover:border-[#b9c5cc]"
            }`}
          >
            {selected ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : <option.icon className="size-4 text-[#7a868d]" aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
      <p className="mt-2 w-full text-[12px] text-[#7a868d]">{faNumber(sections.length)} مورد انتخاب شده</p>
    </div>
  );
};

const ReferencesStep = () => {
  const references = useWizard((state) => state.config.references);
  const notes = useWizard((state) => state.config.notes);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-6">
      <Group label="لینک نمونه‌ها (اختیاری)">
        {references.map((value, index) => (
          <label key={index} className="flex h-12 items-center gap-3 rounded-xl border border-[#e2e8eb] bg-white px-4 transition focus-within:border-[#14202b] focus-within:shadow-[0_0_0_1px_#14202b]">
            <Link2 className="size-4 shrink-0 text-[#a3aeb4]" aria-hidden="true" />
            <span className="sr-only">لینک نمونه {faNumber(index + 1)}</span>
            <input
              dir="ltr"
              type="url"
              inputMode="url"
              value={value}
              placeholder={["https://dribbble.com/...", "https://digikala.com", "https://..."][index]}
              onChange={(event) => update({ references: references.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) }, "top")}
              className="h-full flex-1 bg-transparent text-left text-[13px] outline-none placeholder:text-[#b4bec3]"
            />
          </label>
        ))}
      </Group>

      <label className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-[#4d5b65]">چه چیزی در آن‌ها دوست دارید؟</span>
        <textarea
          value={notes}
          rows={3}
          onChange={(event) => update({ notes: event.target.value }, "top")}
          placeholder="مثلاً رنگ‌بندی سایت اول و منوی ساده سایت دوم"
          className="resize-none rounded-xl border border-[#e2e8eb] bg-white px-4 py-3 text-[13px] leading-6 outline-none transition placeholder:text-[#a3aeb4] focus:border-[#14202b] focus:shadow-[0_0_0_1px_#14202b]"
        />
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
