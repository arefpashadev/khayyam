import { useTranslations } from "next-intl";

import { KhayyamLoader } from "@/components/brand/khayyam-mark";

export default function Loading() {
  const t = useTranslations("Loader");
  return <KhayyamLoader label={t("label")} facts={[t("f1"), t("f2"), t("f3")]} />;
}
