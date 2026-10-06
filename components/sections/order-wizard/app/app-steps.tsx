"use client";

import { Check, Eye, Globe, Smartphone } from "lucide-react";

import { appNavs, appScreens, iconStyles, platforms, type AppNav, type Platform } from "../config";
import { Label, ring, Tile, active, idle } from "../steps";
import { useWizard } from "../store";
import { AppIcon } from "./app-icon";
import { useAppPreview } from "./state";

const PlatformGlyph = ({ platform }: { platform: Platform }) => {
  if (platform === "pwa") return <Globe className="size-6" aria-hidden="true" />;
  if (platform === "both")
    return (
      <span className="flex -space-x-1.5 space-x-reverse">
        <span className="h-7 w-4 rounded-[5px] border-2 border-current" />
        <span className="h-7 w-4 rounded-[3px] border-2 border-current opacity-70" />
      </span>
    );
  return (
    <span className={`relative h-8 w-[18px] border-2 border-current ${platform === "ios" ? "rounded-[6px]" : "rounded-[3px]"}`}>
      {platform === "ios" ? <span className="absolute left-1/2 top-0.5 h-1 w-2 -translate-x-1/2 rounded-full bg-current" /> : <span className="absolute left-1/2 top-0.5 size-1 -translate-x-1/2 rounded-full bg-current" />}
    </span>
  );
};

export const PlatformStep = () => {
  const platform = useWizard((state) => state.config.platform);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        {platforms.map((option) => {
          const selected = platform === option.value;
          return (
            <Tile key={option.value} selected={selected} onClick={() => update({ platform: option.value })} className="flex flex-col gap-3 p-4">
              <span className="flex h-9 items-center"><PlatformGlyph platform={option.value} /></span>
              <span>
                <strong className="block text-[13.5px] text-white">{option.label}</strong>
                <span className="mt-0.5 block text-[11px] leading-5 opacity-60">{option.description}</span>
              </span>
              {selected && <span className="absolute left-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#4da3ff] text-white"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>}
            </Tile>
          );
        })}
      </div>
      <p className="rounded-2xl bg-[#171b22] px-3.5 py-3 text-[11.5px] leading-6 text-[#8a93a0]">
        «هر دو» یعنی یک کد مشترک برای آیفون و اندروید؛ هزینه کمتر از ساخت دو اپ جدا. وب‌اپ بدون نصب از مرورگر باز می‌شود و روی صفحه گوشی هم می‌نشیند.
      </p>
    </div>
  );
};

const NavGlyph = ({ nav }: { nav: AppNav }) => (
  <div className="relative mx-auto h-24 w-14 overflow-hidden rounded-[12px] bg-white/90">
    {nav === "top" && <span className="absolute inset-x-1.5 top-2 flex gap-1">{[0, 1, 2].map((tab) => <span key={tab} className={`h-1.5 flex-1 rounded-full ${tab === 0 ? "bg-[#4da3ff]" : "bg-black/15"}`} />)}</span>}
    {nav === "drawer" && (
      <>
        <span className="absolute inset-y-0 right-0 w-9 bg-[#4da3ff]/25" />
        <span className="absolute right-1.5 top-2 flex flex-col gap-1">{[0, 1, 2, 3].map((row) => <span key={row} className="h-1 w-5 rounded-full bg-[#4da3ff]" />)}</span>
      </>
    )}
    <span className="absolute inset-x-2 top-6 flex flex-col gap-1.5">{[0, 1].map((row) => <span key={row} className="h-3 rounded-[3px] bg-black/10" />)}</span>
    {nav === "tabs" && <span className="absolute inset-x-0 bottom-0 flex h-4 items-center justify-around border-t border-black/10 bg-white">{[0, 1, 2, 3].map((tab) => <span key={tab} className={`size-1.5 rounded-full ${tab === 0 ? "bg-[#4da3ff]" : "bg-black/25"}`} />)}</span>}
    {nav === "floating" && <span className="absolute inset-x-1.5 bottom-1.5 flex h-3.5 items-center justify-around rounded-full bg-[#14202b]">{[0, 1, 2].map((tab) => <span key={tab} className={`size-1.5 rounded-full ${tab === 0 ? "bg-[#4da3ff]" : "bg-white/40"}`} />)}</span>}
  </div>
);

export const NavigationStep = () => {
  const appNav = useWizard((state) => state.config.appNav);
  const update = useWizard((state) => state.update);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {appNavs.map((option) => (
        <Tile key={option.value} selected={appNav === option.value} onClick={() => update({ appNav: option.value })} className="p-3">
          <NavGlyph nav={option.value} />
          <strong className="mt-2.5 block text-center text-[12.5px]">{option.label}</strong>
          <span className="block text-center text-[10.5px] opacity-60">{option.description}</span>
        </Tile>
      ))}
    </div>
  );
};

export const ScreensStep = () => {
  const screens = useWizard((state) => state.config.screens);
  const update = useWizard((state) => state.update);
  const open = useAppPreview((state) => state.open);

  return (
    <div className="flex flex-col gap-2">
      {appScreens.map((screen) => {
        const on = screens.includes(screen.value);
        const locked = screen.value === "home";
        return (
          <div key={screen.value} className={`flex items-center gap-3 rounded-2xl p-2.5 pe-3 transition-colors ${on ? active : idle}`}>
            <button
              type="button"
              disabled={locked}
              aria-pressed={on}
              onClick={() => {
                update({ screens: on ? screens.filter((value) => value !== screen.value) : [...screens, screen.value] });
                if (!on) open(screen.value);
              }}
              className={`flex flex-1 items-center gap-3 text-right ${ring} rounded-xl`}
            >
              <span className={`flex size-9 items-center justify-center rounded-xl ${on ? "bg-[#4da3ff] text-white" : "bg-white/6"}`}>
                <screen.icon className="size-4" aria-hidden="true" />
              </span>
              <strong className="flex-1 text-[13px]">{screen.label}</strong>
              {locked ? <span className="text-[10.5px] opacity-60">همیشه</span> : <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-[#4da3ff]" : "bg-[#2a303b]"}`}><span className="absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]" style={{ left: on ? 2 : 18 }} /></span>}
            </button>
            {on && (
              <button type="button" onClick={() => open(screen.value)} aria-label={`نمایش ${screen.label}`} className={`flex size-9 items-center justify-center rounded-xl bg-white/6 text-white transition-colors hover:bg-white/12 ${ring}`}>
                <Eye className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const IconStep = () => {
  const config = useWizard((state) => state.config);
  const update = useWizard((state) => state.update);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>سبک آیکون</Label>
        <div className="grid grid-cols-4 gap-2">
          {iconStyles.map((style) => (
            <Tile key={style.value} selected={config.iconStyle === style.value} onClick={() => update({ iconStyle: style.value })} className="flex flex-col items-center gap-2 py-3">
              <AppIcon config={{ ...config, iconStyle: style.value }} size={48} />
              <span className="text-[11px] font-bold">{style.label}</span>
            </Tile>
          ))}
        </div>
      </div>
      <div>
        <Label>روی صفحه گوشی</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "پس‌زمینه روشن", bg: "linear-gradient(160deg,#e9eef5,#cfd8e6)", ink: "#14202b" },
            { label: "پس‌زمینه تیره", bg: "linear-gradient(160deg,#1d2433,#06070d)", ink: "#ffffff" },
          ].map((wall) => (
            <div key={wall.label} className="flex flex-col items-center gap-2 rounded-2xl py-5" style={{ background: wall.bg }}>
              <AppIcon config={config} size={58} />
              <span className="max-w-[80%] truncate text-[11px] font-bold" style={{ color: wall.ink }}>{config.brandName.trim() || "اپ شما"}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="flex items-center gap-2 rounded-2xl bg-[#171b22] px-3.5 py-3 text-[11.5px] leading-6 text-[#8a93a0]">
        <Smartphone className="size-4 shrink-0 text-[#4da3ff]" aria-hidden="true" />
        در پیش‌نمایش، روی آیکون اپ بزنید تا صفحه آغاز و ورود به اپ را ببینید.
      </p>
    </div>
  );
};
