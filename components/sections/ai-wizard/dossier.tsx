"use client";

import { tx, studioDir, localDigits } from "@/lib/tx";
import { Check, Cloud, Server, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { autonomyLevels, fa, goals, impact, pains, personas, tools, type AiConfig, type GoalKey } from "./config";

/** What each teammate did during one ordinary day — the dossier's story. */
const dayLog: Record<GoalKey, { time: string; text: string }> = {
  support: { time: "03:12", text: tx("ساعت سه بامداد به سوال یک مشتری درباره سفارشش جواب داد.") },
  reports: { time: "08:00", text: tx("گزارش فروش دیروز پیش از رسیدن مدیر آماده بود.") },
  documents: { time: "08:30", text: tx("۴۲ فاکتور دیروز را خواند و در حسابداری ثبت کرد.") },
  process: { time: "10:40", text: tx("درخواست خرید را برای تأیید فرستاد و تا تأیید پیگیری کرد.") },
  knowledge: { time: "11:15", text: tx("به سوال همکار تازه‌وارد از روی آیین‌نامه شرکت جواب داد.") },
  marketing: { time: "13:00", text: tx("پست امروز را نوشت و برای ساعت پربازدید زمان‌بندی کرد.") },
  forecast: { time: "16:20", text: tx("خبر داد موجودی کالای پرفروش تا پنج روز دیگر تمام می‌شود.") },
};

const greeting = { friendly: tx("سلام! 😊 الان برایتان پیدا می‌کنم."), formal: tx("سلام. درخواست شما ثبت شد و پیگیری می‌شود."), expert: tx("سفارش ۱۰۴۲ امروز ۱۴:۰۲ ارسال شد؛ تحویل ۱۷:۳۰.") } as const;

const faTime = (time: string) => localDigits(time);

const Block = ({ title, children }: { title: string; children: ReactNode }) => {
  const reduce = useReducedMotion();
  return (
    <motion.section layout={!reduce} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="border-t border-white/[0.07] pt-6">
      <h3 className="mb-4 text-[12.5px] font-bold text-[#8a93a0]">{title}</h3>
      {children}
    </motion.section>
  );
};

/**
 * The customer's AI team as a living dossier: what changes, who is on the team,
 * a day in their life, where they work, how much they take on and the house rules.
 * Each part appears as soon as the answers for it exist.
 */
export const Dossier = ({ config, stage }: { config: AiConfig; stage: number }) => {
  const result = impact(config);
  const chosenPains = pains.filter((pain) => config.pains.includes(pain.value));
  const team = goals.filter((goal) => config.goals.includes(goal.value));
  const workplaces = tools.filter((tool) => config.tools.includes(tool.value));
  const day = team.map((member) => ({ ...dayLog[member.value], goal: member })).sort((a, b) => a.time.localeCompare(b.time));
  const empty = chosenPains.length === 0 && team.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col gap-6" dir={studioDir()}>
      <header className="flex items-center gap-3">
        <KhayyamMark size={34} />
        <div className="leading-tight">
          <strong className="block text-[17px] font-extrabold text-white">{tx("تیم هوش مصنوعی")}{" "}{config.company.trim() || tx("شما")}</strong>
          <span className="text-[12px] text-[#8a93a0]">{tx("با هر جواب کامل‌تر می‌شود")}</span>
        </div>
      </header>

      {empty && (
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-white/10 px-6 py-14 text-center">
          <KhayyamMark size={56} state="still" />
          <p className="max-w-[34ch] text-[13.5px] leading-7 text-[#a7b0bc]">{tx("به اولین سوال جواب دهید؛ اعضای تیم، کارهایشان و اثرشان بر کسب‌وکارتان اینجا شکل می‌گیرد.")}</p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {chosenPains.length > 0 && (
          <Block key="changes" title={tx("آنچه عوض می‌شود")}>
            <ul className="flex flex-col gap-3">
              {chosenPains.map((pain) => (
                <li key={pain.value} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[13px]">
                  <span className="text-[#6c7584] line-through decoration-white/20">{pain.label}</span>
                  <span className="h-px w-6 bg-white/15" aria-hidden="true" />
                  <span className="font-bold text-[#eef1f5]">{pain.fix}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {team.length > 0 && (
          <Block key="team" title={tx("اعضای تیم")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {team.map((member) => (
                <motion.article key={member.value} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[22px] bg-[#12151c] p-4 ring-1 ring-white/[0.07]">
                  <span className="absolute inset-y-4 start-0 w-[3px] rounded-e-full bg-[#f0b44a]" aria-hidden="true" />
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[14px] bg-white/[0.06] text-[#f3d9a4]">
                      <member.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="leading-tight">
                      <strong className="block text-[14px] text-white">{member.label}</strong>
                      <span className="text-[11px] text-[#8a93a0]">{tx("شبانه‌روزی")}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] leading-6 text-[#a7b0bc]">{member.actions.join(tx("، "))}</p>
                </motion.article>
              ))}
            </div>
          </Block>
        )}

        {day.length > 0 && (
          <Block key="day" title={tx("یک روز کاری این تیم")}>
            <ol className="relative flex flex-col gap-4 border-s border-white/10 ps-5">
              {day.map((entry) => (
                <li key={entry.goal.value} className="relative">
                  <span className="absolute -start-[25px] top-1.5 size-2.5 rounded-full bg-[#0b0d12] ring-2 ring-[#f0b44a]" aria-hidden="true" />
                  <span className="text-[12px] font-bold tabular-nums text-[#f3d9a4]" dir="ltr">
                    {faTime(entry.time)}
                  </span>
                  <p className="mt-0.5 text-[13.5px] leading-7 text-[#e1e6ec]">{entry.text}</p>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {workplaces.length > 0 && (
          <Block key="where" title={tx("جایی که کار می‌کنند")}>
            <div className="flex flex-wrap gap-2">
              {workplaces.map((tool) => (
                <span key={tool.value} className="flex items-center gap-2 rounded-full bg-[#12151c] py-1.5 pe-3.5 ps-2 text-[12.5px] font-bold text-white ring-1 ring-white/[0.07]">
                  <span className="flex size-6 items-center justify-center rounded-full" style={{ backgroundColor: `${tool.color}26`, color: tool.color }}>
                    <tool.icon className="size-3.5" aria-hidden="true" />
                  </span>
                  {tool.label}
                </span>
              ))}
            </div>
          </Block>
        )}

        {stage >= 5 && team.length > 0 && (
          <Block key="size" title={tx("صرفه‌جویی ماهانه")}>
            <div className="grid grid-cols-2 gap-3">
              <p className="rounded-[20px] bg-[#12151c] p-4 ring-1 ring-white/[0.07]">
                <span className="block text-[28px] font-black leading-tight text-[#f3d9a4]">{fa(result.hoursSaved)}</span>
                <span className="text-[12px] text-[#a7b0bc]">{tx("ساعت وقت آزاد")}</span>
              </p>
              <p className="rounded-[20px] bg-[#12151c] p-4 ring-1 ring-white/[0.07]">
                <span className="block text-[28px] font-black leading-tight text-[#f3d9a4]">{fa(result.monthlySaving)}</span>
                <span className="text-[12px] text-[#a7b0bc]">{tx("میلیون تومان کمتر هزینه")}</span>
              </p>
            </div>
            <p className="mt-2 text-[13px] leading-7 text-[#a7b0bc]">{tx("از {0} ساعتی که تیم {1} نفره شما هر ماه صرف این کارها می‌کند، {2} ساعتش را برمی‌دارد.", [fa(result.hoursBefore), fa(config.staff), fa(result.hoursSaved)])}</p>
          </Block>
        )}

        {stage >= 6 && (
          <Block key="rules" title={tx("قوانین کار")}>
            <dl className="grid gap-x-6 gap-y-3 text-[13px] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-[#8a93a0]" aria-hidden="true" />
                <dt className="text-[#8a93a0]">{tx("تصمیم آخر:")}</dt>
                <dd className="font-bold text-white">{autonomyLevels.find((level) => level.value === config.autonomy)?.label}</dd>
              </div>
              {stage >= 7 && (
                <div className="flex items-center gap-2">
                  {config.hosting === "onprem" ? <Server className="size-4 shrink-0 text-[#8a93a0]" aria-hidden="true" /> : <Cloud className="size-4 shrink-0 text-[#8a93a0]" aria-hidden="true" />}
                  <dt className="text-[#8a93a0]">{tx("داده‌ها:")}</dt>
                  <dd className="font-bold text-white">{config.hosting === "onprem" ? tx("روی سرور شما") : tx("ابری امن")}</dd>
                </div>
              )}
            </dl>
            {stage >= 8 && (
              <figure className="mt-5 rounded-[20px] bg-[#12151c] p-4 ring-1 ring-white/[0.07]">
                <figcaption className="mb-2 flex items-center gap-1.5 text-[11.5px] text-[#8a93a0]">
                  <Check className="size-3.5 text-[#f0b44a]" aria-hidden="true" />{tx("لحن {0} با مشتری", [personas.find((persona) => persona.value === config.persona)?.label])}</figcaption>
                <blockquote className="text-[14px] leading-7 text-white">«{greeting[config.persona]}»</blockquote>
              </figure>
            )}
          </Block>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Phones: a one-line summary of the dossier at the top of the chat; tap to open it. */
export const DossierStrip = ({ config, onOpen }: { config: AiConfig; onOpen: () => void }) => {
  const team = goals.filter((goal) => config.goals.includes(goal.value));
  const result = impact(config);
  return (
    <button type="button" data-guide="dossier" onClick={onOpen} className="flex w-full shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#0e1117] px-4 py-2.5 text-start">
      <span className="flex -space-x-2 rtl:space-x-reverse">
        {team.length === 0 ? (
          <KhayyamMark size={26} />
        ) : (
          team.slice(0, 4).map((member) => (
            <span key={member.value} className="flex size-7 items-center justify-center rounded-full bg-[#12151c] text-[#f3d9a4] ring-2 ring-[#0e1117]">
              <member.icon className="size-3.5" aria-hidden="true" />
            </span>
          ))
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-[#c9d0d9]">
        {team.length === 0 ? tx("پرونده تیم شما اینجا ساخته می‌شود") : tx("{0} هم‌تیمی{1}", [fa(team.length), result.hoursSaved > 0 ? tx("، {0} ساعت صرفه‌جویی در ماه", [fa(result.hoursSaved)]) : ""])}
      </span>
      <span className="shrink-0 text-[12px] font-bold text-[#f3d9a4]">{tx("دیدن پرونده")}</span>
    </button>
  );
};
