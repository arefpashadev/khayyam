"use client";

import { AppWindow, ArrowRight, BrainCircuit, Smartphone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { posts, relatedPosts, type BlogKind, type BlogPost } from "@/lib/blog";
import { dirOf, formatNumber } from "@/lib/locale";

import { card, ease, Forward, primary, Reveal, SiteHeader } from "../home/shared";

const studio: Record<BlogKind, string> = { site: "/createsite", app: "/createapp", ai: "/createai" };

/* ------------------------------------------------------------------ */
/* Cover: drawn in the brand's colours, one motif per kind              */
/* ------------------------------------------------------------------ */

const glows = ["top-[-30%] start-[-10%]", "bottom-[-40%] end-[-10%]", "top-[-20%] end-[10%]"];

export const BlogCover = ({ post, large = false }: { post: BlogPost; large?: boolean }) => {
  const seed = posts.findIndex((item) => item.slug === post.slug);
  const ivory = "bg-[#f2ecdf]/80";
  const motif =
    post.kind === "site" ? (
      <div className={`overflow-hidden rounded-[14px] bg-[#0c1222] ring-1 ring-[#f2ecdf]/15 ${large ? "w-[62%]" : "w-[70%]"}`} dir="ltr">
        <div className="flex gap-1 border-b border-[#f2ecdf]/10 px-2.5 py-2">
          {[0, 1, 2].map((dot) => <span key={dot} className="size-1.5 rounded-full bg-[#f2ecdf]/25" />)}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className={`h-2.5 w-3/4 rounded-full ${ivory}`} />
          <span className="h-1.5 w-1/2 rounded-full bg-[#f2ecdf]/35" />
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((cell) => <span key={cell} className="aspect-[4/3] rounded-md bg-[#f2ecdf]/12" />)}
          </div>
          <span className="h-3 w-14 rounded-full bg-[#d9a648]" />
        </div>
      </div>
    ) : post.kind === "app" ? (
      <div className={`flex flex-col gap-1.5 rounded-[22px] bg-[#0c1222] p-2.5 ring-2 ring-[#f2ecdf]/20 ${large ? "w-[30%]" : "w-[34%]"}`}>
        <span className="mx-auto h-1 w-8 rounded-full bg-[#f2ecdf]/25" />
        <span className="h-10 rounded-xl bg-[linear-gradient(135deg,#f5d79c,#d9a648)]" />
        {[0, 1, 2].map((row) => (
          <span key={row} className="flex items-center gap-1.5 rounded-lg bg-[#f2ecdf]/[0.07] p-1.5">
            <span className="size-3 rounded-[5px] bg-[#d9a648]/70" />
            <span className="h-1 flex-1 rounded-full bg-[#f2ecdf]/30" />
          </span>
        ))}
      </div>
    ) : (
      <div className={`relative aspect-square ${large ? "w-[30%]" : "w-[38%]"}`}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(242,236,223,0.14)" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(217,166,72,0.35)" />
          {[0, 72, 144, 216, 288].map((angle) => {
            const r = ((angle + seed * 24) * Math.PI) / 180;
            const x = 50 + Math.cos(r) * 48;
            const y = 50 + Math.sin(r) * 48;
            return (
              <g key={angle}>
                <line x1="50" y1="50" x2={x} y2={y} stroke="rgba(242,236,223,0.12)" />
                <circle cx={x} cy={y} r="3.2" fill="#f2ecdf" fillOpacity="0.75" />
              </g>
            );
          })}
        </svg>
        <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d79c,#d9a648)] text-[#1c1406]">
          <BrainCircuit className="size-[58%]" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
    );

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#16203a] ${large ? "aspect-[16/10]" : "aspect-[16/10]"}`} aria-hidden="true">
      <span className="absolute inset-0 bg-[linear-gradient(rgba(242,236,223,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,236,223,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <span className={`absolute size-[70%] rounded-full bg-[#d9a648] opacity-25 blur-[70px] ${glows[seed % glows.length]}`} />
      <div className="relative flex w-full items-center justify-center">{motif}</div>
    </div>
  );
};

const KindLabel = ({ kind }: { kind: BlogKind }) => {
  const t = useTranslations("Blog");
  const Icon = kind === "site" ? AppWindow : kind === "app" ? Smartphone : BrainCircuit;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#e9c27a]">
      <Icon className="size-3.5" aria-hidden="true" /> {t(`kinds.${kind}`)}
    </span>
  );
};

const Minutes = ({ value }: { value: number }) => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  return <span className="text-[12.5px] text-[#7f889c]">{t("minutes", { n: formatNumber(locale, value) })}</span>;
};

export const PostCard = ({ post }: { post: BlogPost }) => (
  <Link href={`/blog/${post.slug}`} className={`${card} group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1`}>
    <div className="overflow-hidden">
      <div className="transition-transform duration-500 group-hover:scale-[1.04]">
        <BlogCover post={post} />
      </div>
    </div>
    <div className="flex flex-1 flex-col p-6" lang="fa" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <KindLabel kind={post.kind} />
        <Minutes value={post.minutes} />
      </div>
      <h3 className="mt-3 text-[18px] font-extrabold leading-8 text-[#f2ecdf]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-[13.5px] leading-7 text-[#9aa3b8]">{post.excerpt}</p>
    </div>
  </Link>
);

/* ------------------------------------------------------------------ */
/* A few posts on the home page and the service pages                   */
/* ------------------------------------------------------------------ */

export const BlogPicks = ({ kind }: { kind?: BlogKind }) => {
  const t = useTranslations("Blog");
  const list = kind ? relatedPosts(kind) : [posts[0], posts[2], posts[4]];
  return (
    <section aria-labelledby="blog-picks" className="border-t border-[#f2ecdf]/[0.07]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[13px] font-bold text-[#e9c27a]">{t("eyebrow")}</span>
            <h2 id="blog-picks" className="mt-2 text-[28px] font-extrabold leading-[1.4] lg:text-[40px]">{t(kind ? "pickTitle" : "homeTitle")}</h2>
          </div>
          <Link href="/blog" className="group flex items-center gap-1.5 text-[14px] font-bold text-[#e9c27a] transition-colors hover:text-[#f5d79c]">
            {t("all")} <Forward className="size-4 transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {list.map((post) => (
            <div key={post.slug} className="w-[82%] shrink-0 snap-center sm:w-[55%] md:w-auto">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* /blog                                                                */
/* ------------------------------------------------------------------ */

const filters = ["all", "site", "app", "ai"] as const;

export const BlogIndex = () => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const list = filter === "all" ? posts : posts.filter((post) => post.kind === filter);
  const [lead, ...rest] = list;

  return (
    <div dir={dirOf(locale)} className="relative min-h-dvh overflow-x-clip bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader />
      <span className="pointer-events-none absolute -top-32 start-1/4 size-[480px] rounded-full bg-[#d9a648] opacity-[0.07] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1240px] px-5 pb-24 pt-28 lg:px-10 lg:pt-36">
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <h1 className="text-[40px] font-extrabold leading-[1.25] lg:text-[64px]">{t("title")}</h1>
          <p className="mt-4 max-w-[52ch] text-[15.5px] leading-8 text-[#b9bfcc]">{t("sub")}</p>
          {locale !== "fa" && <p className="mt-2 text-[13px] text-[#7f889c]">{t("persianNote")}</p>}
        </motion.div>

        <div role="tablist" aria-label={t("filter")} className="mt-10 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`h-10 shrink-0 rounded-full px-5 text-[13.5px] font-bold transition-colors ${filter === key ? "bg-[#d9a648] text-[#1c1406]" : "text-[#dcd6c9] ring-1 ring-[#f2ecdf]/15 hover:bg-[#f2ecdf]/[0.06]"}`}
            >
              {key === "all" ? t("allShort") : t(`kinds.${key}`)}
            </button>
          ))}
        </div>

        {lead && (
          <motion.div key={`${filter}-lead`} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mt-8">
            <Link href={`/blog/${lead.slug}`} className={`${card} group grid lg:grid-cols-[1.15fr_1fr]`}>
              <div className="overflow-hidden">
                <div className="h-full transition-transform duration-500 group-hover:scale-[1.03] [&>div]:h-full">
                  <BlogCover post={lead} large />
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 lg:p-12" lang="fa" dir="rtl">
                <div className="flex items-center gap-4">
                  <KindLabel kind={lead.kind} />
                  <Minutes value={lead.minutes} />
                </div>
                <h2 className="mt-4 text-[24px] font-extrabold leading-[1.6] lg:text-[32px]">{lead.title}</h2>
                <p className="mt-3 text-[14.5px] leading-8 text-[#9aa3b8]">{lead.excerpt}</p>
                <span className="mt-6 flex w-fit items-center gap-1.5 text-[14px] font-bold text-[#e9c27a]">
                  {t("read")} <Forward className="size-4 transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, index) => (
            <motion.div key={`${filter}-${post.slug}`} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 * (index + 1), ease }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* /blog/[slug]                                                         */
/* ------------------------------------------------------------------ */

export const BlogArticle = ({ post }: { post: BlogPost }) => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const related = relatedPosts(post.kind, post.slug);
  const half = Math.ceil(post.sections.length / 2);

  const section = (item: BlogPost["sections"][number]) => (
    <section key={item.heading} className="mt-12 first:mt-0">
      <h2 className="text-[23px] font-extrabold leading-[1.6] text-[#f2ecdf] lg:text-[28px]">{item.heading}</h2>
      {item.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="mt-4 text-[16px] leading-[2.1] text-[#c4c9d4] lg:text-[17px]">
          {paragraph}
        </p>
      ))}
    </section>
  );

  return (
    <div dir={dirOf(locale)} className="relative overflow-x-clip bg-[#0c1222] text-[#f2ecdf]">
      <SiteHeader />
      <article className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-28 lg:px-10 lg:pt-36">
        <Link href="/blog" className="group inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#9aa3b8] transition-colors hover:text-[#f2ecdf]">
          <ArrowRight className="size-4 ltr:rotate-180" aria-hidden="true" /> {t("back")}
        </Link>
        <header className="mx-auto mt-8 max-w-[820px] text-center" lang="fa" dir="rtl">
          <div className="flex items-center justify-center gap-4">
            <KindLabel kind={post.kind} />
            <Minutes value={post.minutes} />
          </div>
          <h1 className="mt-5 text-[32px] font-extrabold leading-[1.5] lg:text-[48px]">{post.title}</h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-[16px] leading-8 text-[#9aa3b8]">{post.excerpt}</p>
        </header>

        <div className={`${card} mx-auto mt-10 max-w-[1040px]`}>
          <BlogCover post={post} large />
        </div>

        <div className="mx-auto mt-14 max-w-[720px] lg:mt-20" lang="fa" dir="rtl">
          {post.sections.slice(0, half).map(section)}
          {post.quote && (
            <blockquote className="my-14 border-s-4 border-[#d9a648] ps-6 text-[20px] font-extrabold leading-[1.9] text-[#e9c27a] lg:text-[23px]">{post.quote}</blockquote>
          )}
          <div className={post.quote ? "" : "mt-12"}>{post.sections.slice(half).map(section)}</div>
        </div>

        <aside className="relative mx-auto mt-20 max-w-[1040px] overflow-hidden rounded-[30px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(217,166,72,0.16),transparent_60%),#121a2e] px-6 py-14 text-center ring-1 ring-[#f2ecdf]/[0.07] lg:py-16">
          <h2 className="text-[26px] font-extrabold leading-[1.5] lg:text-[34px]">{t(`cta.${post.kind}`)}</h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[14.5px] leading-7 text-[#9aa3b8]">{t("ctaSub")}</p>
          <Link href={studio[post.kind]} className={`${primary} mt-8`}>
            {t(`start.${post.kind}`)} <Forward />
          </Link>
        </aside>
      </article>

      <section aria-labelledby="related" className="border-t border-[#f2ecdf]/[0.07]">
        <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-10">
          <h2 id="related" className="text-[26px] font-extrabold lg:text-[34px]">{t("related")}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => <PostCard key={item.slug} post={item} />)}
          </div>
        </div>
      </section>
    </div>
  );
};
