"use client";

import { Check, Cloud, Server } from "lucide-react";
import type { ReactNode } from "react";

import { PlanChoice } from "../order-wizard/payment-ui";
import { Label, Tile, active, idle, ring } from "../order-wizard/steps";
import { aiEstimate, autonomyLevels, deliverables, fa, goals, languages, personas, tools, type AiStepKey } from "./config";
import { useAi } from "./store";

const field =
  "w-full rounded-2xl bg-[#171b22] px-4 text-[13px] text-white outline-none transition-colors placeholder:text-[#5d6573] hover:bg-[#1d222b] focus:bg-[#1d222b] focus:ring-2 focus:ring-[#4da3ff]/50";

const Picked = ({ on }: { on: boolean }) =>
  on ? (
    <span className="absolute left-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-[#4da3ff] text-white">
      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
    </span>
  ) : null;

const GoalsStep = () => {
  const picked = useAi((state) => state.config.goals);
  const toggle = useAi((state) => state.toggle);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {goals.map((goal) => {
        const on = picked.includes(goal.value);
        return (
          <Tile key={goal.value} selected={on} onClick={() => toggle("goals", goal.value)} className="flex flex-col gap-2.5 p-3.5">
            <span className={`flex size-9 items-center justify-center rounded-xl ${on ? "bg-[#4da3ff] text-white" : "bg-white/6"}`}>
              <goal.icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-[12.5px] leading-5 text-white">{goal.label}</strong>
              <span className="mt-0.5 block text-[10.5px] leading-[1.6] opacity-60">{goal.description}</span>
            </span>
            <Picked on={on} />
          </Tile>
        );
      })}
    </div>
  );
};

const ToolsStep = () => {
  const picked = useAi((state) => state.config.tools);
  const toggle = useAi((state) => state.toggle);
  const group = (side: "in" | "out", title: string, hint: string) => (
    <div>
      <Label hint={hint}>{title}</Label>
      <div className="grid grid-cols-3 gap-2">
        {tools
          .filter((tool) => tool.side === side)
          .map((tool) => {
            const on = picked.includes(tool.value);
            return (
              <Tile key={tool.value} selected={on} onClick={() => toggle("tools", tool.value)} className="flex h-[74px] flex-col items-center justify-center gap-2 px-1 text-center">
                <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${tool.color}22`, color: tool.color }}>
                  <tool.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-bold leading-4">{tool.label}</span>
              </Tile>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {group("in", "کانال‌ها و ورودی‌ها", "از کجا کار شروع می‌شود")}
      {group("out", "سیستم‌های مقصد", "نتیجه کجا ثبت شود")}
    </div>
  );
};

const Slider = ({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) => (
  <label className="block rounded-2xl bg-[#171b22] p-4">
    <span className="flex items-baseline justify-between">
      <span className="text-[12.5px] font-bold text-[#c9d0d9]">{label}</span>
      <span className="text-[18px] font-black text-white">
        {fa(value)} <span className="text-[11px] font-normal text-[#8a93a0]">{unit}</span>
      </span>
    </span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full accent-[#4da3ff]" dir="ltr" />
  </label>
);

const VolumeStep = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);

  return (
    <div className="flex flex-col gap-2.5">
      <Slider label="درخواست یا پیام در روز" value={config.requestsPerDay} min={10} max={2000} step={10} unit="مورد" onChange={(value) => update({ requestsPerDay: value })} />
      <Slider label="وقتی که این کارها در هفته می‌گیرد" value={config.hoursPerWeek} min={1} max={160} step={1} unit="ساعت" onChange={(value) => update({ hoursPerWeek: value })} />
      <Slider label="تعداد نفراتی که درگیرند" value={config.staff} min={1} max={50} step={1} unit="نفر" onChange={(value) => update({ staff: value })} />
      <Slider label="هزینه هر ساعت کار نیرو" value={config.hourlyCost} min={100} max={1500} step={50} unit="هزار تومان" onChange={(value) => update({ hourlyCost: value })} />
    </div>
  );
};

const BrainStep = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);
  const toggle = useAi((state) => state.toggle);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label>اختیار هوش مصنوعی</Label>
        <div className="flex flex-col gap-2">
          {autonomyLevels.map((level, index) => (
            <Tile key={level.value} selected={config.autonomy === level.value} onClick={() => update({ autonomy: level.value })} className="flex items-center gap-3 p-3">
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((bar) => (
                  <span key={bar} className={`h-5 w-1.5 rounded-full ${bar <= index ? "bg-[#4da3ff]" : "bg-white/10"}`} />
                ))}
              </span>
              <span className="flex-1">
                <strong className="block text-[13px] text-white">{level.label}</strong>
                <span className="text-[11px] opacity-60">{level.description}</span>
              </span>
            </Tile>
          ))}
        </div>
      </div>

      <div>
        <Label hint="در گفتگوی نمونه امتحان کنید">لحن گفتگو</Label>
        <div className="grid grid-cols-3 gap-2">
          {personas.map((persona) => (
            <button key={persona.value} type="button" aria-pressed={config.persona === persona.value} onClick={() => update({ persona: persona.value })} className={`h-11 rounded-2xl text-[12.5px] font-bold transition-colors ${ring} ${config.persona === persona.value ? active : idle}`}>
              {persona.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>زبان‌ها</Label>
        <div className="flex gap-2">
          {languages.map((language) => (
            <button key={language.value} type="button" aria-pressed={config.languages.includes(language.value)} onClick={() => toggle("languages", language.value)} className={`h-10 flex-1 rounded-2xl text-[12.5px] font-bold transition-colors ${ring} ${config.languages.includes(language.value) ? active : idle}`}>
              {language.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>محل نگهداری داده‌ها</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "cloud" as const, icon: Cloud, label: "ابری امن", text: "سریع‌تر و کم‌هزینه‌تر" },
            { value: "onprem" as const, icon: Server, label: "سرور خودتان", text: "داده از شرکت بیرون نمی‌رود" },
          ].map((option) => (
            <Tile key={option.value} selected={config.hosting === option.value} onClick={() => update({ hosting: option.value })} className="flex flex-col gap-2 p-3.5">
              <option.icon className="size-5" aria-hidden="true" />
              <strong className="text-[13px] text-white">{option.label}</strong>
              <span className="text-[11px] leading-5 opacity-60">{option.text}</span>
            </Tile>
          ))}
        </div>
      </div>
    </div>
  );
};

const OutcomeStep = () => {
  const config = useAi((state) => state.config);
  const update = useAi((state) => state.update);
  const cost = aiEstimate(config);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {deliverables.map((option) => (
          <Tile key={option.value} selected={config.deliverable === option.value} onClick={() => update({ deliverable: option.value })} className="p-4">
            <strong className="block text-[14px] text-white">{option.label}</strong>
            <span className="mt-1 block text-[12px] leading-6 opacity-70">{option.description}</span>
            <Picked on={config.deliverable === option.value} />
          </Tile>
        ))}
      </div>

      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(77,163,255,0.16),rgba(124,108,255,0.12))] p-4 ring-1 ring-[#4da3ff]/25">
        <span className="text-[11.5px] font-bold text-[#9ccbff]">برآورد اولیه</span>
        <div className="mt-1 flex items-baseline gap-2">
          <strong className="text-[24px] font-black text-white">
            {fa(cost.min)} تا {fa(cost.max)}
          </strong>
          <span className="text-[12px] text-[#a7b0bc]">میلیون تومان</span>
        </div>
        <span className="mt-1 block text-[12px] text-[#a7b0bc]">زمان تقریبی: {fa(cost.weeks)} هفته</span>
      </div>

      <PlanChoice plan={config.plan} estimateMin={cost.min} onChange={(plan) => update({ plan })} />

      <div className="grid gap-2.5">
        <label className="block">
          <Label>نام شرکت یا کسب‌وکار</Label>
          <input value={config.company} onChange={(event) => update({ company: event.target.value })} placeholder="مثلاً گروه آریا" className={`${field} h-12`} />
        </label>
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

export const aiPanels: Record<AiStepKey, () => ReactNode> = {
  goals: GoalsStep,
  tools: ToolsStep,
  volume: VolumeStep,
  brain: BrainStep,
  outcome: OutcomeStep,
};
