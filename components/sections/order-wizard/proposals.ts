import { defaultScreens, defaultSections, suggestAccents, type OrderKind, type WizardConfig } from "./config";
import { siteLayouts } from "./designs";
import { recommended } from "./assistant/brain";

/**
 * Quick path: from three answers (what, which business, one colour) build three complete,
 * clearly different proposals. Each is a full WizardConfig, so it can be ordered as is
 * or opened in the studio for fine-tuning.
 */

export type Proposal = { key: string; title: string; traits: string[]; config: WizardConfig };

const layoutIndex = (value: string) => Math.max(0, siteLayouts.findIndex((layout) => layout.value === value));

export const buildProposals = (kind: OrderKind, base: WizardConfig): Proposal[] => {
  const tips = recommended[base.industry];
  const [analogous, triadic, complementary] = suggestAccents(base.color);
  const sections = defaultSections(kind, base.projectType);
  const screens = defaultScreens(base.projectType);
  const common = { ...base, sections, screens, extras: kind === "app" ? ["otp", "push", "payment"] : tips.extras, tagline: base.tagline };

  return [
    {
      key: "calm",
      title: "آرام و حرفه‌ای",
      traits: ["روشن", "گوشه نرم", "حرکت نرم"],
      config: { ...common, accent: analogous.value, theme: "light", radius: "soft", type: "balanced", backdrop: "grid", motion: "subtle", variant: layoutIndex(tips.layouts[0]), art: 0, appNav: "tabs", iconStyle: "solid" },
    },
    {
      key: "bold",
      title: "مدرن و جسور",
      traits: ["رنگی", "گوشه گرد", "تیتر درشت", "حرکت سریع"],
      config: { ...common, accent: triadic.value, theme: "tinted", radius: "round", type: "heavy", backdrop: "aurora", motion: "snappy", variant: layoutIndex(tips.layouts[1] ?? "bento"), art: 1, appNav: "floating", iconStyle: "gradient" },
    },
    {
      key: "luxe",
      title: "لوکس و شبانه",
      traits: ["نیمه‌شب", "گوشه تیز", "نوشته ظریف", "درخشش"],
      config: { ...common, accent: complementary.value, theme: "midnight", radius: "sharp", type: "light", backdrop: "glow", motion: "lively", variant: layoutIndex(tips.layouts[2] ?? "editorial"), art: 2, appNav: "drawer", iconStyle: "duo" },
    },
  ];
};
