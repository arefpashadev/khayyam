import type { Metadata } from "next";

import { AiWizard } from "@/components/sections/ai-wizard";

export const metadata: Metadata = { title: "استودیو هوش مصنوعی و اتوماسیون | خیام" };

export default function CreateAiPage() {
  return <AiWizard />;
}
