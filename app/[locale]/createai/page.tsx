import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StudioEntry } from "@/components/sections/studio-entry";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Studio" });
  return { title: t("ai") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <StudioEntry studio="ai" locale={locale} />;
}
