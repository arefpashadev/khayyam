"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/effect-fade";

type Story = {
  cta: string;
  description: string;
  duration: number;
  poster?: string;
  src: string;
  title: string;
  type: "image" | "video";
};

const stories: Story[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=2000&q=85",
    title: "زیرساخت دیجیتال برای رشد کسب‌وکارها",
    description:
      "ما وب‌سایت، اپلیکیشن، سیستم‌های اتوماسیون و راهکارهای هوش مصنوعی طراحی می‌کنیم تا فروش، مدیریت و ارتباط با مشتریان شما ساده‌تر و حرفه‌ای‌تر شود.",
    cta: "شروع ساخت و طراحی",
    duration: 6500,
  },
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/5639702/5639702-uhd_4096_2160_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=2000&q=85",
    title: "تجربه‌ای زنده، روان و ماندگار",
    description:
      "ترکیب تصویر، حرکت و روایت به برند شما کمک می‌کند تا ارتباطی عمیق‌تر و ماندگارتر با مخاطبان خود بسازد.",
    cta: "مشاهده نمونه‌کارها",
    duration: 9000,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=85",
    title: "فناوری پیچیده با تجربه‌ای ساده",
    description:
      "محصولات دیجیتال مقیاس‌پذیر را با تمرکز بر کارایی، امنیت و تجربه کاربری ساده و حرفه‌ای طراحی می‌کنیم.",
    cta: "مشاهده خدمات",
    duration: 6000,
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2000&q=85",
    title: "ایده‌ها را به محصول تبدیل می‌کنیم",
    description:
      "از اولین طرح تا انتشار نهایی، در تمام مسیر ساخت یک محصول سریع، زیبا و قابل توسعه کنار شما هستیم.",
    cta: "شروع همکاری",
    duration: 7000,
  },
];

const StoryVideo = ({ active, story }: { active: boolean; story: Story }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 size-full object-cover"
      muted
      playsInline
      poster={story.poster}
      preload="metadata"
    >
      <source src={story.src} type="video/mp4" />
    </video>
  );
};

export const StoryHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const activeStory = stories[activeIndex];

  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section
      aria-label="داستان خدمات ما"
      className="relative h-[calc(100svh-64px)] min-h-[520px] max-h-[820px] w-full overflow-hidden bg-slate-950 md:h-[calc(100svh-100px)]"
    >
      <Swiper
        dir="rtl"
        modules={[A11y, Autoplay, EffectFade]}
        a11y={{ enabled: true }}
        autoplay={{
          delay: stories[0].duration,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={750}
        className="size-full"
        onAutoplayTimeLeft={(_, __, progress) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${1 - progress})`;
          }
        }}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {stories.map((story, index) => (
          <SwiperSlide
            key={`${story.type}-${story.src}`}
            data-swiper-autoplay={story.duration}
            className="relative overflow-hidden"
          >
            {story.type === "image" ? (
              <Image
                src={story.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <StoryVideo active={activeIndex === index} story={story} />
            )}

            <div className=" inset-0" />

          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex flex-col items-center justify-end px-5 pb-12 text-center text-white sm:px-8 sm:pb-14 md:pb-12">
        <h1 className="max-w-4xl text-[30px] font-black leading-[1.4] text-balance sm:text-[38px] md:text-[46px] lg:text-[48px]">
          {activeStory.title}
        </h1>
        <p className="mt-10 max-w-[650px] text-sm leading-7 text-white/90 sm:text-base md:mt-12 md:leading-8">
          {activeStory.description}
        </p>
        <Button
          href="#contact"
          className="pointer-events-auto mt-10 h-14 w-full max-w-[490px] border-0 text-lg sm:mt-12"
        >
          {activeStory.cta}
        </Button>

        <div className="pointer-events-auto mt-8 flex w-[min(78%,490px)] gap-2">
          {stories.map((story, index) => (
            <button
              key={story.src}
              type="button"
              aria-label={`نمایش داستان ${index + 1}`}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/35"
            >
              <span
                ref={index === activeIndex ? progressRef : undefined}
                className="block h-full origin-right rounded-full bg-white will-change-transform"
                style={{
                  transform: `scaleX(${index < activeIndex ? 1 : 0})`,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <Button
        aria-label="داستان بعدی"
        className="absolute bottom-20 left-0 top-0 z-20 h-auto w-[18%] rounded-none border-0 bg-transparent opacity-0 hover:bg-transparent"
        onClick={() => swiperRef.current?.slideNext()}
        size="icon"
        variant="ghost"
      >
        <span className="sr-only">بعدی</span>
      </Button>
      <Button
        aria-label="داستان قبلی"
        className="absolute bottom-20 right-0 top-0 z-20 h-auto w-[18%] rounded-none border-0 bg-transparent opacity-0 hover:bg-transparent"
        onClick={() => swiperRef.current?.slidePrev()}
        size="icon"
        variant="ghost"
      >
        <span className="sr-only">قبلی</span>
      </Button>

    </section>
  );
};
