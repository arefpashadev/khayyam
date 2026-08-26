import type { Metadata } from "next";

import Footer from "@/components/layouts/footer";
import { AiRelatedBlogs } from "@/components/sections/ai-related-blogs";
import { BlogArticleDetail } from "@/components/sections/blog-article-detail";

export const metadata: Metadata = {
  title: "خیام چه مشکلاتی را با هوش مصنوعی حل می‌کند؟",
  description:
    "بررسی کاربردهای واقعی هوش مصنوعی برای ساده‌تر و سریع‌تر کردن فرایندهای کسب‌وکار.",
};

export default function BlogDetailPage() {
  return (
    <>
      <main>
        <BlogArticleDetail />
        <AiRelatedBlogs
          limit={3}
          title="مقالات مرتبط"
          description="سه مطلب پیشنهادی برای ادامه مطالعه و آشنایی بیشتر با راهکارهای دیجیتال خیام."
        />
      </main>
      <Footer />
    </>
  );
}
