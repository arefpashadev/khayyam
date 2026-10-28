import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/layouts/footer";
import { BlogArticle } from "@/components/sections/blog";
import { postBySlug } from "@/lib/blog";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <main className="bg-[#0c1222]">
        <BlogArticle post={post} />
      </main>
      <Footer />
    </>
  );
}
