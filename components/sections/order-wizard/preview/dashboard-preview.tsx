import { tx, studioDir, ld } from "@/lib/tx";
import { Bell, CheckCircle2, CircleDashed, LayoutDashboard, Menu, Search, TrendingUp } from "lucide-react";
import type { CSSProperties } from "react";

import { ActionLayer } from "./action-layer";

import { dashboardModules, faNumber, industries, isDark, mix, type WizardConfig } from "../config";

const heading = (size: number): CSSProperties => ({
  fontSize: `calc(${size}px * var(--pv-hs))`,
  fontWeight: "var(--pv-hw)" as CSSProperties["fontWeight"],
  letterSpacing: "var(--pv-ht)",
  lineHeight: 1.35,
});

const card = "pv-act rounded-(--pv-r-card) border border-(--pv-border) bg-(--pv-bg)";

/** An internal panel: what a company sees for automation, reports and workflows. */
export const DashboardPreview = ({ config, compact }: { config: WizardConfig; compact: boolean }) => {
  const name = config.brandName.trim() || industries[config.industry].label;
  const modules = dashboardModules.filter((module) => config.sections.includes(module.value));
  const shade = (amount: number) => mix(config.color, isDark(config.theme) ? "#0f151c" : "#ffffff", amount);
  const bars = [42, 58, 47, 70, 63, 82, 76, 94, 88, 100, 92, 110];

  const kpis = [
    { label: tx("درخواست‌های امروز"), value: ld("۱۲۸"), delta: ld("+۱۲٪") },
    { label: tx("در انتظار تأیید"), value: ld("۲۴"), delta: ld("−۸٪") },
    { label: tx("رضایت مشتری"), value: ld("۹۴٪"), delta: ld("+۳٪") },
  ];

  return (
    <ActionLayer><div dir={studioDir()} data-motion={config.motion} className="pv-root flex min-h-full flex-1 bg-(--pv-surface) font-sans text-(--pv-text)">
      {!compact && (
        <aside className="flex w-64 shrink-0 flex-col gap-1 border-e border-(--pv-border) bg-(--pv-bg) p-5">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-primary) text-(--pv-on-primary)">
              <LayoutDashboard className="size-5" aria-hidden="true" />
            </span>
            <strong className="text-[15px]">{name}</strong>
          </div>
          <span className="flex items-center gap-3 rounded-(--pv-r-ctrl) bg-(--pv-soft) px-3 py-2.5 text-[13px] font-bold text-(--pv-primary)">
            <LayoutDashboard className="size-4" aria-hidden="true" />{" "}{tx("داشبورد")}</span>
          {modules.map((module) => (
            <span key={module.value} data-pv={module.value} className="pv-section flex items-center gap-3 rounded-(--pv-r-ctrl) px-3 py-2.5 text-[13px] text-(--pv-muted)">
              <module.icon className="size-4" aria-hidden="true" /> {module.label}
            </span>
          ))}
        </aside>
      )}

      <main className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-(--pv-border) bg-(--pv-bg) px-5 py-3.5">
          {compact && <Menu className="size-5" aria-hidden="true" />}
          <div className={`flex h-10 items-center gap-2 rounded-(--pv-r-ctrl) bg-(--pv-surface) px-3 text-[12px] text-(--pv-muted) ${compact ? "flex-1" : "w-80"}`}>
            <Search className="size-4" aria-hidden="true" />{" "}{tx("جستجو در پرونده‌ها…")}</div>
          <span className="ms-auto flex size-10 items-center justify-center rounded-(--pv-r-ctrl) bg-(--pv-surface)"><Bell className="size-4" aria-hidden="true" /></span>
          <span className="size-10 rounded-full" style={{ backgroundColor: shade(0.35) }} />
        </header>

        <div key={config.motion} data-pv="hero" className={`pv-section pv-rise flex flex-col gap-5 ${compact ? "p-4" : "p-8"}`}>
          <div>
            <h1 style={heading(compact ? 20 : 28)}>{tx("صبح بخیر، تیم {0}", [name])}</h1>
            <p className="mt-1 text-[13px] text-(--pv-muted)">{tx("۸ کار امروز منتظر شماست.")}</p>
          </div>

          <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
            {kpis.map((kpi, index) => (
              <div key={kpi.label} className={`${card} p-5 ${index === 0 ? "!border-transparent bg-(--pv-primary) text-(--pv-on-primary)" : ""}`}>
                <span className="text-[12px] opacity-75">{kpi.label}</span>
                <div className="mt-2 flex items-end justify-between">
                  <strong style={heading(30)}>{kpi.value}</strong>
                  <span className={`text-[12px] font-bold ${index === 0 ? "" : "text-(--pv-primary)"}`}>{kpi.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`grid gap-4 ${compact ? "" : "grid-cols-[1.6fr_1fr]"}`}>
            <div data-pv="reports" className={`pv-section ${card} p-5`}>
              <div className="flex items-center justify-between">
                <strong className="text-[14px]">{tx("روند درخواست‌ها")}</strong>
                <span className="flex items-center gap-1 text-[12px] font-bold text-(--pv-primary)"><TrendingUp className="size-3.5" aria-hidden="true" />{tx("۳۲٪ رشد")}</span>
              </div>
              <div className="mt-5 flex h-40 items-end gap-2">
                {bars.map((height, index) => (
                  <span key={index} className="flex-1 rounded-t-[4px]" style={{ height: `${(height / 110) * 100}%`, backgroundColor: index > 8 ? "var(--pv-primary)" : shade(0.6) }} />
                ))}
              </div>
            </div>

            <div data-pv="workflow" className={`pv-section ${card} p-5`}>
              <strong className="text-[14px]">{tx("گردش کار خرید")}</strong>
              <div className="mt-4 flex flex-col gap-3">
                {[[tx("ثبت درخواست"), true], [tx("تأیید مدیر واحد"), true], [tx("تأیید مالی"), false], [tx("صدور سفارش"), false]].map(([label, done]) => (
                  <div key={label as string} className="flex items-center gap-3 text-[13px]">
                    {done ? <CheckCircle2 className="size-5 text-(--pv-primary)" aria-hidden="true" /> : <CircleDashed className="size-5 text-(--pv-muted)" aria-hidden="true" />}
                    <span className={done ? "" : "text-(--pv-muted)"}>{label as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-pv="users" className={`pv-section ${card} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-(--pv-border) px-5 py-3.5">
              <strong className="text-[14px]">{tx("آخرین پرونده‌ها")}</strong>
              <span className="rounded-(--pv-r-ctrl) bg-(--pv-primary) px-3 py-1.5 text-[12px] font-bold text-(--pv-on-primary)">{tx("+ پرونده جدید")}</span>
            </div>
            {[[tx("سفارش خرید تجهیزات"), tx("در انتظار"), tx("سارا محمدی")], [tx("قرارداد پشتیبانی"), tx("تأیید شد"), tx("علی رضایی")], [tx("درخواست مرخصی"), tx("در حال بررسی"), tx("نگار احمدی")]].map(([title, status, owner], index) => (
              <div key={title} className="flex items-center gap-4 border-b border-(--pv-border) px-5 py-3 text-[13px] last:border-0">
                <span className="font-mono text-[11px] text-(--pv-muted)">#{faNumber(1040 + index)}</span>
                <span className="flex-1 font-bold">{title}</span>
                {!compact && <span className="text-(--pv-muted)">{owner}</span>}
                <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: index === 1 ? "color-mix(in srgb, var(--pv-primary) 16%, transparent)" : "color-mix(in srgb, var(--pv-accent) 16%, transparent)", color: index === 1 ? "var(--pv-primary)" : "var(--pv-accent)" }}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div></ActionLayer>
  );
};
