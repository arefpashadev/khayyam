import { KhayyamLoader } from "@/components/brand/khayyam-mark";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100]">
      <KhayyamLoader tone="dark" label="در حال آماده‌سازی استودیو هوش مصنوعی" />
    </div>
  );
}
