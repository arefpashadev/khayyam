import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { isRTLLocale } from "@/i18n/routing";

const yekanBakh = localFont({
  src: [
    {
      path: "./fonts/YekanBakh-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/YekanBakh-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/YekanBakh-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/YekanBakh-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  preload: true,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("title"), description: t("description"), applicationName: t("app") };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={isRTLLocale(locale) ? "rtl" : "ltr"}
      className={`${yekanBakh.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
