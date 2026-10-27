"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { KhayyamLoader } from "@/components/brand/khayyam-mark";
import { loadStudioLocale } from "@/lib/tx";

export const StudioLoader = () => {
  const t = useTranslations("Loader");
  return (
    <div className="fixed inset-0 z-[100]">
      <KhayyamLoader tone="dark" label={t("studio")} facts={[t("f1"), t("f2"), t("f3")]} />
    </div>
  );
};

// The studios load only in the browser, after their language is set (see lib/tx.ts).
const OrderWizard = dynamic(() => import("./order-wizard").then((module) => module.OrderWizard), { ssr: false, loading: () => <StudioLoader /> });
const AiWizard = dynamic(() => import("./ai-wizard").then((module) => module.AiWizard), { ssr: false, loading: () => <StudioLoader /> });

export const StudioEntry = ({ studio, locale }: { studio: "site" | "app" | "ai"; locale: string }) => {
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void loadStudioLocale(locale).then(() => alive && setReady(locale));
    return () => {
      alive = false;
    };
  }, [locale]);

  if (ready !== locale) return <StudioLoader />;
  return studio === "ai" ? <AiWizard /> : <OrderWizard kind={studio} />;
};
