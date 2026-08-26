"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

const showcaseItems = [
  {
    src: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?auto=format&fit=crop&w=900&q=85",
    alt: "نمایش صفحه‌های یک وب‌سایت روی مانیتور",
  },
  {
    src: "https://images.unsplash.com/photo-1770899621442-24237af4c8b4?auto=format&fit=crop&w=900&q=85",
    alt: "فضای کار مدرن با لپ‌تاپ و نمایشگر",
  },
  {
    src: "https://images.unsplash.com/photo-1781914476939-91a41b914899?auto=format&fit=crop&w=900&q=85",
    alt: "محیط برنامه‌نویسی و طراحی محصول دیجیتال",
  },
  {
    src: "https://images.unsplash.com/photo-1780253256175-ce82148d44b3?auto=format&fit=crop&w=900&q=85",
    alt: "برنامه‌نویسی یک رابط کاربری روی لپ‌تاپ",
  },
  {
    src: "https://images.unsplash.com/photo-1744555270794-6d378b9e7cd3?auto=format&fit=crop&w=900&q=85",
    alt: "طراحی رابط کاربری روی چند نمایشگر",
  },
  {
    src: "https://images.unsplash.com/photo-1778146476147-5f8d4bd03c79?auto=format&fit=crop&w=900&q=85",
    alt: "لپ‌تاپ و موبایل در فضای توسعه نرم‌افزار",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
    alt: "کدنویسی و توسعه وب روی لپ‌تاپ",
  },
];

export const AiHero = () => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const itemCount = showcaseItems.length;
    const startedAt = performance.now();
    let animationFrame = 0;

    const renderOrbit = (time: number) => {
      const phase = reducedMotion ? 0 : -(time - startedAt) / 8500;
      const spacing = Math.max(
        115,
        Math.min(window.innerWidth * 0.17, 245),
      );

      cardRefs.current.forEach((card, itemIndex) => {
        if (!card) return;

        const wrappedPosition =
          ((((itemIndex + phase + itemCount / 2) % itemCount) + itemCount) %
            itemCount) -
          itemCount / 2;
        const distance = Math.abs(wrappedPosition);
        const x = wrappedPosition * spacing;
        const y = Math.pow(distance, 2) * 24;
        const rotation = wrappedPosition * 11;
        const scale = Math.max(0.82, 1 - distance * 0.045);
        const edgeFade = Math.max(
          0,
          Math.min(1, (2.65 - distance) / 0.55),
        );
        const opacity = edgeFade * Math.max(0.82, 1 - distance * 0.08);

        card.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${Math.round(10 - distance * 2)}`;
      });

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(renderOrbit);
      }
    };

    renderOrbit(startedAt);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      aria-labelledby="ai-hero-title"
      className="relative isolate h-[calc(100svh-60px)] min-h-[660px] max-h-[760px] w-full overflow-hidden bg-[#05030d] text-white"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-[-210px] left-1/2 z-0 h-[520px] w-[min(1050px,95vw)] -translate-x-1/2 rounded-[50%] bg-[#008ef0]/45 blur-[86px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-290px] left-1/2 z-0 h-[500px] w-[min(900px,88vw)] -translate-x-1/2 rounded-[50%] bg-[#009cff]/55 blur-[55px]"
      />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-14 lg:pt-16">
        <p className="text-[34px] font-black leading-tight text-[#0799ef] sm:text-[44px] lg:text-[54px]">
          هوش مصنوعی
        </p>
        <h1
          id="ai-hero-title"
          className="mt-5 text-[34px] font-black leading-[1.35] tracking-[-0.02em] text-balance sm:mt-6 sm:text-[48px] lg:text-[58px]"
        >
          متناسب با نیاز کسب‌وکار شما
        </h1>
        <p className="mt-8 max-w-[610px] text-sm leading-7 text-white/75 sm:mt-10 sm:text-base sm:leading-8">
          از دستیارهای هوشمند و اتوماسیون تا تحلیل داده و راهکارهای
          <br className="hidden sm:block" /> اختصاصی؛ کمک می‌کنیم هوش مصنوعی را
          واقعاً وارد کسب‌وکارتان کنید.
        </p>
      </div>

      <div
        aria-label="نمونه راهکارهای هوش مصنوعی"
        className="absolute inset-x-0 bottom-[-26px] z-10 h-[330px] sm:bottom-[-30px] sm:h-[350px]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {showcaseItems.map((item, itemIndex) => (
          <div
            ref={(node) => {
              cardRefs.current[itemIndex] = node;
            }}
            key={item.src}
            className="absolute left-1/2 top-3 aspect-[1.58/1] w-[clamp(165px,16vw,230px)] origin-center overflow-hidden rounded-2xl bg-[#071626] opacity-0 shadow-[0_14px_32px_rgba(0,0,0,0.28)] ring-1 ring-white/10 will-change-[transform,opacity] sm:top-4"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={itemIndex === 0}
              sizes="(max-width: 639px) 165px, (max-width: 1424px) 16vw, 230px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <Button
        href="#contact"
        size="lg"
        className="absolute bottom-9 left-1/2 z-30 h-14 w-[min(350px,calc(100%-40px))] -translate-x-1/2 rounded-xl border-0 px-2 text-base font-bold shadow-[0_10px_35px_rgba(0,153,239,0.25)] hover:-translate-x-1/2 sm:bottom-11 sm:text-lg"
      >
        <span>شروع ساخت و طراحی</span>
        <span className="absolute left-1.5 flex size-11 items-center justify-center rounded-[10px] bg-[#05070b] text-white sm:size-12">
          <Image
            src="/icons/arrow-down-left.svg"
            alt=""
            width={24}
            height={24}
            className="size-5 sm:size-6"
          />
        </span>
      </Button>
    </section>
  );
};
