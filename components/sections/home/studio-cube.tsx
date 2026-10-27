"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";

export type Face = "site" | "app" | "ai";

export const faces: { key: Face; title: string; text: string; href: string; cta: string }[] = [
  { key: "site", title: "وب‌سایت", text: "سایت معرفی، فروشگاه، رزرو یا پلتفرم؛ با ظاهری که خودتان می‌چینید.", href: "/createsite", cta: "طراحی سایت" },
  { key: "app", title: "اپلیکیشن", text: "آیفون، اندروید یا وب‌اپ؛ روی گوشی می‌بینید و امتحانش می‌کنید.", href: "/createapp", cta: "طراحی اپلیکیشن" },
  { key: "ai", title: "هوش مصنوعی", text: "تیمی که شبانه‌روز جواب مشتری می‌دهد، سند می‌خواند و گزارش می‌سازد.", href: "/createai", cta: "ساختن تیم هوش مصنوعی" },
];

// Isometric cube on a 400×400 canvas.
const P = { top: "200,52", ur: "328,126", ul: "72,126", c: "200,200", lr: "328,274", ll: "72,274", b: "200,348" };
const shape: Record<Face, string> = {
  ai: `${P.top} ${P.ur} ${P.c} ${P.ul}`,
  site: `${P.ur} ${P.lr} ${P.b} ${P.c}`,
  app: `${P.ul} ${P.c} ${P.b} ${P.ll}`,
};
// Text laid flat on each face.
const label: Record<Face, string> = {
  ai: "matrix(0.866 -0.5 0.866 0.5 200 126)",
  site: "matrix(0.866 -0.5 0 1 264 250)",
  app: "matrix(0.866 0.5 0 1 136 250)",
};

const GOLD = "#d9a648";
const IVORY = "#f2ecdf";

/**
 * The home page's signature: Khayyam's cube, one face per studio.
 * Faces take turns lighting up on their own; hovering or focusing one holds it,
 * and choosing it opens that studio.
 */
export const StudioCube = ({ onChange }: { onChange?: (face: Face) => void }) => {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [auto, setAuto] = useState<Face>("ai");
  const [held, setHeld] = useState<Face | null>(null);
  const active = held ?? auto;

  useEffect(() => {
    if (held || reduce) return;
    const order: Face[] = ["ai", "site", "app"];
    const interval = window.setInterval(() => setAuto((face) => order[(order.indexOf(face) + 1) % order.length]), 2800);
    return () => window.clearInterval(interval);
  }, [held, reduce]);

  useEffect(() => onChange?.(active), [active, onChange]);

  const draw = (delay: number) => (reduce ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.2, delay, ease: [0.65, 0, 0.35, 1] as const } });

  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full overflow-visible" role="group" aria-label="سه استودیوی خیام">
      <defs>
        <radialGradient id="cube-glow">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="210" r="190" fill="url(#cube-glow)" />

      {faces.map((face, index) => {
        const on = active === face.key;
        const title = faces.find((item) => item.key === face.key)?.title ?? "";
        return (
          <g
            key={face.key}
            role="link"
            tabIndex={0}
            aria-label={`${title}، ${face.cta}`}
            className="cursor-pointer outline-none"
            onMouseEnter={() => setHeld(face.key)}
            onMouseLeave={() => setHeld(null)}
            onFocus={() => setHeld(face.key)}
            onBlur={() => setHeld(null)}
            onClick={() => router.push(face.href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(face.href);
              }
            }}
          >
            <motion.polygon
              points={shape[face.key]}
              initial={false}
              animate={{ fill: on ? GOLD : "rgba(242,236,223,0.02)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.polygon points={shape[face.key]} fill="none" stroke={IVORY} strokeOpacity={0.9} strokeWidth="2" strokeLinejoin="round" {...draw(index * 0.18)} />
            <motion.text
              transform={label[face.key]}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={face.key === "ai" ? 23 : 28}
              fontWeight="800"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1, fill: on ? "#1c1406" : IVORY }}
              transition={{ opacity: { delay: 1.1 + index * 0.1, duration: 0.6 }, fill: { duration: 0.4 } }}
              style={{ fontFamily: "inherit" }}
            >
              {title}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
};

/** The caption under the cube: what the lit face is, and the way in. */
export const FaceCaption = ({ face }: { face: Face }) => {
  const item = faces.find((entry) => entry.key === face) ?? faces[0];
  return (
    <motion.div key={face} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col items-center gap-2 text-center">
      <p className="max-w-[34ch] text-[14px] leading-7 text-[#b9bfcc]">{item.text}</p>
      <Link href={item.href} className="text-[14px] font-bold text-[#e9c27a] underline decoration-[#d9a648]/40 underline-offset-[6px] transition-colors hover:text-[#f5d79c]">
        {item.cta}
      </Link>
    </motion.div>
  );
};
