import { AppPreview } from "./app-preview";
import { SitePreview } from "./site-preview";
import { complexityOptions, getPalette, getPresets, type ComplexityKey, type OrderKind, type PaletteKey } from "./tokens";

type LivePreviewProps = {
  kind: OrderKind;
  visualIndex: number;
  paletteKey: PaletteKey;
  complexity: ComplexityKey;
  brandName: string;
  className?: string;
};

export const LivePreview = ({ kind, visualIndex, paletteKey, complexity, brandName, className = "" }: LivePreviewProps) => {
  const preset = getPresets(kind)[visualIndex] ?? getPresets(kind)[0];
  const palette = getPalette(paletteKey);
  const itemCount = complexityOptions.find((item) => item.value === complexity)?.itemCount ?? 3;
  const name = brandName.trim() || "برند شما";

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2bd47d] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#2bd47d]" />
          </span>
          <strong className="text-xs font-extrabold text-[#536169]">پیش‌نمایش زنده</strong>
        </div>
        <span className="text-[11px] text-[#9aa5aa]">{kind === "app" ? "اپلیکیشن" : "سایت"} شما</span>
      </div>

      <div className="rounded-2xl bg-[#f6f8f9] p-4 sm:p-6">
        {kind === "app" ? (
          <AppPreview palette={palette} preset={preset} itemCount={itemCount} brandName={name} />
        ) : (
          <SitePreview palette={palette} preset={preset} itemCount={itemCount} brandName={name} />
        )}
      </div>

      <p className="text-center text-[11px] leading-6 text-[#9aa5aa]">
        با تغییر هر انتخاب، این پیش‌نمایش بلافاصله به‌روزرسانی می‌شود. طرح نهایی توسط تیم ما شخصی‌سازی خواهد شد.
      </p>
    </div>
  );
};
