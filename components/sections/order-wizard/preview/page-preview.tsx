import type { WizardConfig } from "../config";
import { AppPreview } from "./app-preview";
import { CommunityPreview } from "./community-preview";
import { DashboardPreview } from "./dashboard-preview";
import { SitePreview } from "./site-preview";

/** Picks the right page for what's being built: site-like pages, an internal panel, or a community. */
export const PagePreview = ({ config, compact, app = false }: { config: WizardConfig; compact: boolean; app?: boolean }) => {
  if (app) return <AppPreview config={config} />;
  if (config.projectType === "dashboard") return <DashboardPreview config={config} compact={compact} />;
  if (config.projectType === "community") return <CommunityPreview config={config} compact={compact} />;
  return <SitePreview config={config} compact={compact} />;
};
