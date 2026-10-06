"use client";

import { buildPreviewVars, type OrderKind, type WizardConfig } from "../config";
import { FitScene, Laptop, LAPTOP, Phone, PHONE } from "./devices";
import { PagePreview } from "./page-preview";
import { AppDevice, APP_PHONE } from "../app/device";
import { InteractiveApp } from "../app/interactive-app";

/** One device showing any config (not only the store's), scaled to fit its box. */
export const DevicePreview = ({ kind, config, device }: { kind: OrderKind; config: WizardConfig; device: "laptop" | "phone" }) => {
  const address = config.brandName.trim().replace(/\s+/g, "-") || "your-brand";
  const showLaptop = device === "laptop";

  if (kind === "app") {
    return (
      <div className="relative size-full" style={buildPreviewVars(config)}>
        <FitScene width={APP_PHONE.width} height={APP_PHONE.height}>
          <AppDevice kind={config.platform === "android" ? "android" : config.platform === "pwa" ? "pwa" : "ios"} address={`${address}.ir`}>
            <InteractiveApp config={config} />
          </AppDevice>
        </FitScene>
      </div>
    );
  }

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
            <PagePreview config={config} compact />
          </Phone>
        </FitScene>
      )}
    </div>
  );
};
