"use client";

import { useId, type CSSProperties } from "react";

/**
 * The Khayyam mark — deliberately minimal.
 * An open orbit (one year around the sun, which Khayyam measured to 365.2422 days)
 * whose gap holds a single star; the star is also the dot above «خ».
 * One stroke, one dot: it reads at 16px and animates simply where it matters:
 * - "thinking": the orbit turns and the star breathes (loading, assistant typing)
 * - "intro": the orbit draws itself, then the star lands (splash, welcome)
 */
export const KhayyamMark = ({
  size = 40,
  state = "idle",
  className = "",
  title,
  tone = "light",
}: {
  size?: number;
  state?: "idle" | "thinking" | "intro" | "still";
  className?: string;
  title?: string;
  /** "light" draws a white orbit for dark backgrounds; "dark" draws an ink orbit. */
  tone?: "light" | "dark";
}) => {
  const id = useId().replace(/:/g, "");
  const ring = tone === "light" ? "#f4f6fa" : "#14202b";
  const circumference = 2 * Math.PI * 15;
  const gap = circumference * 0.2;
  const orbitStyle: CSSProperties =
    state === "thinking"
      ? { transformBox: "view-box", transformOrigin: "24px 27px", animation: "khayyam-spin 1.4s cubic-bezier(0.6, 0.1, 0.4, 0.9) infinite" }
      : {};
  const starStyle: CSSProperties =
    state === "thinking"
      ? { transformBox: "fill-box", transformOrigin: "center", animation: "khayyam-breathe 1.4s ease-in-out infinite" }
      : state === "intro"
        ? { transformBox: "fill-box", transformOrigin: "center", opacity: 0, animation: "khayyam-land 0.5s 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
        : {};

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`${id}-star`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd88a" />
          <stop offset="1" stopColor="#f0a23a" />
        </linearGradient>
      </defs>
      <g style={orbitStyle}>
        {/* the orbit: a circle with a gap at the top, where the star sits */}
        <circle
          cx="24"
          cy="27"
          r="15"
          fill="none"
          stroke={ring}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeDasharray={`${circumference - gap} ${gap}`}
          transform={`rotate(${-90 + (gap / circumference) * 180} 24 27)`}
          style={state === "intro" ? { strokeDashoffset: circumference, animation: "khayyam-draw 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards" } : undefined}
        />
      </g>
      {/* the star: four-pointed, like a glint in the night sky */}
      <path d="M24 3.5 L26.2 9.8 L32.5 12 L26.2 14.2 L24 20.5 L21.8 14.2 L15.5 12 L21.8 9.8 Z" fill={`url(#${id}-star)`} style={starStyle} />
    </svg>
  );
};

const facts = [
  "خیام طول سال را ۳۶۵٫۲۴۲۱۹ روز حساب کرد؛ دقیق‌تر از تقویم میلادی.",
  "تقویم جلالی، حاصل محاسبات خیام و همکارانش در رصدخانه اصفهان است.",
  "خیام معادله‌های درجه سوم را با هندسه حل کرد.",
  "دقت، از خیام به ما رسیده؛ در حال آماده‌سازی…",
];

/** Full-area loading state with the mark and a rotating Khayyam fact. */
export const KhayyamLoader = ({ tone = "light", label = "در حال بارگذاری" }: { tone?: "light" | "dark"; label?: string }) => (
  <div role="status" aria-live="polite" className={`flex size-full min-h-[50vh] flex-col items-center justify-center gap-6 px-6 text-center ${tone === "dark" ? "bg-[#0b0d12] text-[#eef1f5]" : "bg-white text-[#14202b]"}`}>
    <KhayyamMark size={88} state="thinking" tone={tone === "dark" ? "light" : "dark"} />
    <span className="sr-only">{label}</span>
    <div className="relative h-14 w-full max-w-[340px]" aria-hidden="true">
      {facts.map((fact, index) => (
        <p
          key={fact}
          className={`absolute inset-x-0 top-0 text-[13px] leading-7 opacity-0 ${tone === "dark" ? "text-[#8a93a0]" : "text-[#5b6872]"}`}
          style={{ animation: `khayyam-fact ${facts.length * 3}s ease-in-out infinite`, animationDelay: `${index * 3}s` }}
        >
          {fact}
        </p>
      ))}
    </div>
  </div>
);
