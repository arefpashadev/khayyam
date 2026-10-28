import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Footer from "@/components/layouts/footer";
import { ServiceLanding } from "@/components/sections/home/service";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Service.site" });
  return { title: t("metaTitle"), description: t("sub") };
}

export default function Page() {
  return (
    <>
      <main className="bg-[#0c1222]">
        <ServiceLanding kind="site" />
      </main>
      <Footer />
    </>
  );
}
