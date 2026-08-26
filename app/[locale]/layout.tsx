import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Header from "@/components/layouts/header";
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

export const metadata: Metadata = {
  title: "خیام | طراحی و توسعه محصولات دیجیتال",
  description:
    "طراحی و توسعه وب‌سایت، اپلیکیشن، اتوماسیون و راهکارهای هوش مصنوعی برای رشد کسب‌وکارها.",
  applicationName: "خیام",
};

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
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
