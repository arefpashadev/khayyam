"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { buildPreviewVars, type OrderKind, type WizardConfig } from "../config";
import { AppPreview } from "./app-preview";
import { SiteTop } from "./site-preview";

const pages = { site: { width: 1280, height: 720 }, app: { width: 390, height: 760 } };

/**
 * A real page rendered at full size and scaled down to the thumbnail's width,
 * so galleries show exactly what the customer will get.
 */
export const DesignThumb = ({ kind, config }: { kind: OrderKind; config: WizardConfig }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const page = pages[kind];
  const still = { ...config, motion: "none" as const };

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative w-full overflow-hidden bg-(--pv-bg)"
      style={{ ...buildPreviewVars(config), aspectRatio: `${page.width} / ${page.height}` }}
    >
      {width > 0 && (
        <div
          dir="rtl"
          data-motion="none"
          className="pointer-events-none absolute left-0 top-0 origin-top-left overflow-hidden bg-(--pv-bg) font-sans text-(--pv-text)"
          style={{ width: page.width, height: page.height, transform: `scale(${width / page.width})` }}
        >
          {kind === "app" ? <AppPreview config={still} /> : <SiteTop config={still} compact={false} />}
        </div>
      )}
    </div>
  );
};
