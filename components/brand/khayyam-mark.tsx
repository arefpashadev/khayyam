"use client";

import { useId, type CSSProperties } from "react";

/**
 * The Khayyam mark: an astrolabe.
 * Omar Khayyam measured the solar year (365.2422 days) for the Jalali calendar and solved
 * cubic equations with geometry — so the mark is a working instrument: a degree scale that
 * turns like the sky, an ecliptic ring turning the other way, a planet on its orbit and an
 * eight-pointed Persian star (khatam) at the centre.
 *
 * `state="thinking"` speeds every part up; use it for loading and for the assistant typing.
 */
export const KhayyamMark = ({ size = 40, state = "idle", className = "", title }: { size?: number; state?: "idle" | "thinking" | "still"; className?: string; title?: string }) => {
  const id = useId().replace(/:/g, "");
  const speed = state === "thinking" ? 0.25 : 1;
  const spin = (seconds: number, reverse = false): CSSProperties =>
    state === "still"
      ? { transformBox: "view-box", transformOrigin: "50% 50%" }
      : { transformBox: "view-box", transformOrigin: "50% 50%", animation: `khayyam-spin ${seconds * speed}s linear infinite${reverse ? " reverse" : ""}` };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4da3ff" />
          <stop offset="0.55" stopColor="#7c6cff" />
          <stop offset="1" stopColor="#2fd0c0" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe3a3" />
          <stop offset="1" stopColor="#e0a43a" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#7c6cff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7c6cff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill={`url(#${id}-glow)`} />

      {/* mater: outer ring with a degree scale, turning slowly like the night sky */}
      <g style={spin(60)}>
        <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="2.6" />
        {Array.from({ length: 72 }, (_, index) => {
          const long = index % 6 === 0;
          const angle = (index * 5 * Math.PI) / 180;
          const inner = long ? 37.5 : 40;
          return (
            <line
              key={index}
              x1={50 + Math.cos(angle) * inner}
              y1={50 + Math.sin(angle) * inner}
              x2={50 + Math.cos(angle) * 42.5}
              y2={50 + Math.sin(angle) * 42.5}
              stroke={long ? "#e8edf5" : "#8c96b5"}
              strokeWidth={long ? 1.4 : 0.7}
              strokeLinecap="round"
              opacity={long ? 0.9 : 0.55}
            />
          );
        })}
      </g>

      {/* rete: an off-centre ecliptic ring turning the other way */}
      <g style={spin(24, true)}>
        <circle cx="50" cy="45" r="24" fill="none" stroke="#4da3ff" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 3" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#7c6cff" strokeOpacity="0.4" strokeWidth="0.8" />
      </g>

      {/* a planet on its orbit */}
      <g style={spin(8)}>
        <circle cx="50" cy="19" r="3.4" fill="#2fd0c0" />
        <circle cx="50" cy="19" r="6" fill="#2fd0c0" opacity="0.2" />
      </g>

      {/* khatam: the eight-pointed Persian star */}
      <g style={spin(30)}>
        <rect x="38" y="38" width="24" height="24" rx="1.5" fill={`url(#${id}-gold)`} />
        <rect x="38" y="38" width="24" height="24" rx="1.5" fill={`url(#${id}-gold)`} transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="5.2" fill="#0b0d12" />
        <circle cx="50" cy="50" r="2.2" fill="#ffe3a3" />
      </g>
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
    <KhayyamMark size={96} state="thinking" />
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
