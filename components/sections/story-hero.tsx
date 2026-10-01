"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { flushSync } from "react-dom";

import { Link } from "@/i18n/navigation";

type Story = {
  accent: string;
  cta: string;
  description: string;
  effect: "cloud" | "petal" | "soft" | "wave";
  href: "#project-estimator" | "#services" | "/ai";
  poster: string;
  title: string;
  video: string;
};

const stories: Story[] = [
  {
    title: "زیرساخت دیجیتال برای رشد کسب‌وکارها",
    description:
      "ما وب‌سایت، اپلیکیشن، سیستم‌های اتوماسیون و راهکارهای هوش مصنوعی طراحی می‌کنیم تا فروش، مدیریت و ارتباط با مشتریان شما ساده‌تر و حرفه‌ای‌تر شود.",
    cta: "شروع ساخت و طراحی",
    href: "#services",
    video: "/videos/hero-growth.mp4",
    poster: "/videos/hero-growth.jpg",
    accent: "#00d4ff",
    effect: "soft",
  },
  {
    title: "پیچیدگی فنی، تجربه‌ای ساده",
    description:
      "محصولات دیجیتال مقیاس‌پذیر را با تمرکز بر تجربه کاربری، کارایی و جزئیاتی طراحی می‌کنیم که در ذهن می‌مانند.",
    cta: "مشاهده خدمات",
    href: "#services",
    video: "/videos/hero-experience.mp4",
    poster: "/videos/hero-experience.jpg",
    accent: "#7c5cff",
    effect: "petal",
  },
  {
    title: "هوشمندتر کار کنید، سریع‌تر رشد کنید",
    description:
      "هوش مصنوعی و اتوماسیون را به راهکارهای واقعی تبدیل می‌کنیم؛ برای کاهش کارهای تکراری و تصمیم‌های دقیق‌تر.",
    cta: "کشف راهکارهای هوشمند",
    href: "/ai",
    video: "/videos/hero-ai.mp4",
    poster: "/videos/hero-ai.jpg",
    accent: "#ff5ebc",
    effect: "cloud",
  },
  {
    title: "از یک ایده تا یک محصول ماندگار",
    description:
      "از تحلیل و طراحی تا توسعه، انتشار و پشتیبانی کنار شما هستیم تا ایده‌تان به محصولی قابل رشد تبدیل شود.",
    cta: "شروع همکاری با خیام",
    href: "#project-estimator",
    video: "/videos/hero-product.mp4",
    poster: "/videos/hero-product.jpg",
    accent: "#7bf29a",
    effect: "wave",
  },
];

const nextIndex = (index: number) => (index + 1) % stories.length;

export const StoryHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const activeIndexRef = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const activeSlideRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressFrameRef = useRef<number | null>(null);
  const revealAnimationRef = useRef<Animation | null>(null);
  const transitionRef = useRef(false);
  const activeStory = stories[activeIndex];

  const stopProgress = useCallback(() => {
    if (progressFrameRef.current !== null) {
      window.cancelAnimationFrame(progressFrameRef.current);
      progressFrameRef.current = null;
    }
  }, []);

  const updateProgress = useCallback(
    (video: HTMLVideoElement) => {
      stopProgress();

      const draw = () => {
        const progress = video.duration
          ? Math.min(video.currentTime / video.duration, 1)
          : 0;
        progressRef.current?.style.setProperty(
          "--hero-story-progress",
          `${progress}`,
        );

        if (!video.paused && !video.ended) {
          progressFrameRef.current = window.requestAnimationFrame(draw);
        }
      };

      progressFrameRef.current = window.requestAnimationFrame(draw);
    },
    [stopProgress],
  );

  const showStory = useCallback(
    (index: number, completedIndex?: number) => {
      const currentIndex = activeIndexRef.current;
      if (index === currentIndex || transitionRef.current) return;

      const applyStory = () => {
        setOutgoingIndex(currentIndex);
        setCompletedIndexes((current) => {
          const next = new Set(current);
          if (completedIndex !== undefined) next.add(completedIndex);
          next.delete(index);
          return next;
        });
        activeIndexRef.current = index;
        setActiveIndex(index);
      };

      if (reduceMotion) {
        applyStory();
        return;
      }

      transitionRef.current = true;
      flushSync(applyStory);

      const slide = activeSlideRef.current;
      if (!slide) {
        transitionRef.current = false;
        return;
      }

      revealAnimationRef.current?.cancel();
      const revealAnimation = slide.animate(
        [
          {
            maskSize: "0% 0%",
            WebkitMaskSize: "0% 0%",
            offset: 0,
            easing: "cubic-bezier(0.2, 0.72, 0.25, 1)",
          },
          {
            maskSize: "24% 43%",
            WebkitMaskSize: "24% 43%",
            offset: 0.34,
            easing: "cubic-bezier(0.55, 0.08, 0.88, 0.62)",
          },
          {
            maskSize: "92% 164%",
            WebkitMaskSize: "92% 164%",
            offset: 0.68,
            easing: "cubic-bezier(0.18, 0.78, 0.18, 1)",
          },
          {
            maskSize: "340% 605%",
            WebkitMaskSize: "340% 605%",
            offset: 1,
          },
        ],
        {
          duration: 1050,
          easing: "linear",
          fill: "both",
        },
      );
      revealAnimationRef.current = revealAnimation;

      revealAnimation.finished
        .catch(() => undefined)
        .finally(() => {
          transitionRef.current = false;
          if (revealAnimationRef.current === revealAnimation) {
            revealAnimationRef.current = null;
          }
        });
    },
    [reduceMotion],
  );

  const handleVideoEnded = useCallback(() => {
    const currentIndex = activeIndexRef.current;
    stopProgress();
    progressRef.current?.style.setProperty("--hero-story-progress", "1");
    showStory(nextIndex(currentIndex), currentIndex);
  }, [showStory, stopProgress]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (outgoingIndex === null) return;

    const transitionTimer = window.setTimeout(
      () => setOutgoingIndex(null),
      reduceMotion ? 0 : 1150,
    );

    return () => window.clearTimeout(transitionTimer);
  }, [activeIndex, outgoingIndex, reduceMotion]);

  useEffect(() => {
    progressRef.current?.style.setProperty("--hero-story-progress", "0");
    return stopProgress;
  }, [activeIndex, stopProgress]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex && !reduceMotion) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, reduceMotion]);

  useEffect(
    () => () => {
      stopProgress();
      revealAnimationRef.current?.cancel();
      revealAnimationRef.current = null;
    },
    [stopProgress],
  );

  const ambientStyle = {
    "--hero-accent": activeStory.accent,
  } as CSSProperties;

  return (
    <section
      ref={heroRef}
      aria-roledescription="carousel"
      aria-label="معرفی خدمات خیام"
      className="relative isolate h-[calc(100svh-64px)] min-h-[610px] max-h-[840px] w-full overflow-hidden bg-[#05080e] text-white md:h-[calc(100svh-76px)]"
      style={ambientStyle}
    >
      {stories.map((story, index) => {
        const isActive = index === activeIndex;
        const isOutgoing = index === outgoingIndex;
        const slideStyle = {
          "--hero-accent": story.accent,
        } as CSSProperties;

        return (
          <div
            key={story.title}
            ref={isActive ? activeSlideRef : undefined}
            aria-hidden={!isActive}
            className={`absolute inset-0 ${
              isActive
                ? outgoingIndex !== null
                  ? `hero-slide-reveal hero-slide-reveal-${story.effect} z-10`
                  : "z-10"
                : isOutgoing
                  ? "z-0"
                  : "invisible -z-10"
            }`}
            style={slideStyle}
          >
            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              aria-hidden="true"
              autoPlay={isActive && !reduceMotion}
              muted
              playsInline
              preload={isActive ? "metadata" : "none"}
              poster={story.poster}
              disablePictureInPicture
              tabIndex={-1}
              className="absolute inset-0 size-full object-cover"
              onEnded={isActive ? handleVideoEnded : undefined}
              onPause={isActive ? stopProgress : undefined}
              onPlay={
                isActive
                  ? (event) => updateProgress(event.currentTarget)
                  : undefined
              }
            >
              <source src={story.video} type="video/mp4" />
              مرورگر شما امکان پخش ویدیو را ندارد.
            </video>

            <div
            
              aria-live={isActive ? "polite" : undefined}
              className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8 sm:pb-28 lg:px-12"
            >
              <h1 className="max-w-[980px] text-[38px] font-extrabold leading-[1.3] tracking-[-0.035em] text-balance sm:text-[52px] lg:text-[66px]">
                {story.title}
              </h1>
              <p className="mt-7 max-w-[710px] text-sm leading-8 text-white/78 sm:text-base sm:leading-9 lg:text-lg">
                {story.description}
              </p>

              <div className="mt-9">
                <Link
                  href={story.href}
                  tabIndex={isActive ? undefined : -1}
                  className="inline-flex min-h-12 min-w-[210px] items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-[#0a1119] shadow-[0_12px_34px_rgba(0,0,0,0.2)] outline-none transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:ring-4 focus-visible:ring-white/30 sm:text-base"
                >
                  {story.cta}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center sm:bottom-7">
        <div  className="flex items-center justify-center gap-0.5">
          {stories.map((story, index) => {
            const isActive = index === activeIndex;
            const isCompleted = completedIndexes.has(index);

            return (
              <button
                key={story.title}
                type="button"
                aria-label={`نمایش اسلاید ${index + 1}: ${story.title}`}
                aria-current={isActive ? "true" : undefined}
                data-state={
                  isActive ? "active" : isCompleted ? "complete" : "queued"
                }
                onClick={() => showStory(index)}
                className="hero-story-control flex h-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span aria-hidden="true" className="hero-story-mark">
                  <span
                    ref={isActive ? progressRef : undefined}
                    className="hero-story-progress absolute inset-0 rounded-full bg-white"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
