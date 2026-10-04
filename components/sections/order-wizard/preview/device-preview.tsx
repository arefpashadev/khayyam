"use client";

import { buildPreviewVars, type OrderKind, type WizardConfig } from "../config";
import { FitScene, Laptop, LAPTOP, Phone, PHONE } from "./devices";
import { PagePreview } from "./page-preview";

/** One device showing any config (not only the store's), scaled to fit its box. */
export const DevicePreview = ({ kind, config, device }: { kind: OrderKind; config: WizardConfig; device: "laptop" | "phone" }) => {
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";
  const showLaptop = device === "laptop" && kind === "site";

  return (
    <div className="relative size-full" style={buildPreviewVars(config)}>
      {showLaptop ? (
        <FitScene width={LAPTOP.width} height={LAPTOP.height}>
          <Laptop address={address}>
            <PagePreview config={config} compact={false} />
          </Laptop>
        </FitScene>
      ) : (
        <FitScene width={PHONE.width} height={PHONE.height}>
          <Phone>
            <PagePreview config={config} compact app={kind === "app"} />
          </Phone>
        </FitScene>
      )}
    </div>
  );
};
