import type { Metadata } from "next";

import { OrderWizard } from "@/components/sections/order-wizard";

export const metadata: Metadata = { title: "ثبت سفارش سایت | خیام" };

export default function CreateSitePage() {
  return <OrderWizard kind="site" />;
}
