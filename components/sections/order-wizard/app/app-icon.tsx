import { industries, type WizardConfig } from "../config";

/** The app's launcher icon in the chosen style; the same squircle iOS and Android use. */
export const AppIcon = ({ config, size = 60 }: { config: WizardConfig; size?: number }) => {
  const Glyph = industries[config.industry].icon;
  const background = {
    gradient: `linear-gradient(140deg, ${config.color}, ${config.accent})`,
    solid: config.color,
    glyph: "#ffffff",
    duo: `linear-gradient(180deg, ${config.color} 0 55%, ${config.accent} 55% 100%)`,
  }[config.iconStyle];
  const ink = config.iconStyle === "glyph" ? config.color : "#ffffff";

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45)]"
      style={{ width: size, height: size, borderRadius: size * 0.23, background }}
      aria-hidden="true"
    >
      {config.iconStyle === "gradient" && <span className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full bg-white/20" />}
      <Glyph style={{ width: size * 0.5, height: size * 0.5, color: ink }} strokeWidth={2} />
    </span>
  );
};
