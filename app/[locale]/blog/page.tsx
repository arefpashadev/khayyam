import type { Metadata } from "next";

import Footer from "@/components/layouts/footer";
import { AiRelatedBlogs } from "@/components/sections/ai-related-blogs";
import { BlogExplorer } from "@/components/sections/blog-explorer";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogPostList } from "@/components/sections/blog-post-list";
import { BlogSuggestedPosts } from "@/components/sections/blog-suggested-posts";

export const metadata: Metadata = {
  title: "وبلاگ خیام",
  description:
    "مقالات کاربردی درباره طراحی سایت، هوش مصنوعی، اپلیکیشن، اتوماسیون و رشد دیجیتال.",
};

export default function BlogPage() {
  return (
    <>
      <main>
        <BlogHero />
        <BlogExplorer />
        <BlogPostList />
        <AiRelatedBlogs showHeader={false} showPagination />
        <BlogSuggestedPosts />
      </main>
      <Footer />
    </>
  );
}
