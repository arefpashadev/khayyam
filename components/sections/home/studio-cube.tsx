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
 * At rest it is the logo itself — bold lines and a gold top, like a closed book.
 * Pointing at it opens it up: the faces name the studios, the one under the pointer
 * lights up, and choosing it opens that studio. Touch screens show the names right away.
 */
export const StudioCube = ({ onChange }: { onChange?: (face: Face | null) => void }) => {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [inside, setInside] = useState(false);
  const [held, setHeld] = useState<Face | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTouch(!window.matchMedia("(hover: hover)").matches), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const open = inside || touch;
  // At rest the top face is gold, exactly like the logo.
  const lit: Face = held ?? "ai";

  useEffect(() => onChange?.(open ? lit : null), [open, lit, onChange]);

  const draw = (delay: number) => (reduce ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.2, delay, ease: [0.65, 0, 0.35, 1] as const } });

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="h-auto w-full overflow-visible"
      role="group"
      aria-label="سه استودیوی خیام"
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => {
        setInside(false);
        setHeld(null);
      }}
      animate={reduce || open ? { y: 0 } : { y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="cube-glow">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.24" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="210" r="190" fill="url(#cube-glow)" />

      {faces.map((face, index) => {
        const on = lit === face.key;
        return (
          <g
            key={face.key}
            role="link"
            tabIndex={0}
            aria-label={`${face.title}، ${face.cta}`}
            className="cursor-pointer outline-none"
            onMouseEnter={() => setHeld(face.key)}
            onFocus={() => {
              setInside(true);
              setHeld(face.key);
            }}
            onBlur={() => {
              setInside(false);
              setHeld(null);
            }}
            onClick={() => router.push(face.href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(face.href);
              }
            }}
          >
            <motion.polygon points={shape[face.key]} initial={false} animate={{ fill: on ? GOLD : "rgba(242,236,223,0.025)" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
            <motion.polygon points={shape[face.key]} fill="none" stroke={IVORY} strokeWidth="7" strokeLinejoin="round" {...draw(index * 0.18)} />
            <motion.text
              transform={label[face.key]}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={face.key === "ai" ? 23 : 28}
              fontWeight="800"
              initial={false}
              animate={{ opacity: open ? 1 : 0, fill: on ? "#1c1406" : IVORY }}
              transition={{ duration: 0.35 }}
              style={{ fontFamily: "inherit", pointerEvents: "none" }}
            >
              {face.title}
            </motion.text>
          </g>
        );
      })}
    </motion.svg>
  );
};

/** The caption under the cube: an invitation at rest, then what the lit face is. */
export const FaceCaption = ({ face }: { face: Face | null }) => {
  const item = faces.find((entry) => entry.key === face);
  if (!item) {
    return (
      <motion.p key="rest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[14px] leading-7 text-[#8790a6]">
        نشانگر را روی مکعب ببرید؛ هر وجهش یک استودیو است.
      </motion.p>
    );
  }
  return (
    <motion.div key={item.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-2 text-center">
      <p className="max-w-[34ch] text-[14px] leading-7 text-[#b9bfcc]">{item.text}</p>
      <Link href={item.href} className="text-[14px] font-bold text-[#e9c27a] underline decoration-[#d9a648]/40 underline-offset-[6px] transition-colors hover:text-[#f5d79c]">
        {item.cta}
      </Link>
    </motion.div>
  );
};
