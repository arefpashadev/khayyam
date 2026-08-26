import type { Metadata } from "next";

import { OrderWizard } from "@/components/sections/order-wizard";

export const metadata: Metadata = { title: "ثبت سفارش اپلیکیشن | خیام" };

export default function CreateAppPage() {
  return <OrderWizard kind="app" />;
}
