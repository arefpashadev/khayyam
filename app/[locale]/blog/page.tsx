import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Footer from "@/components/layouts/footer";
import { BlogIndex } from "@/components/sections/blog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return { title: t("metaTitle"), description: t("sub") };
}

export default function BlogPage() {
  return (
    <>
      <main className="bg-[#0c1222]">
        <BlogIndex />
      </main>
      <Footer />
    </>
  );
}
