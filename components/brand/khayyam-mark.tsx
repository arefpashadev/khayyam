"use client";

import type { CSSProperties } from "react";

/**
 * The Khayyam mark: a cube.
 * Khayyam solved cubic equations with geometry; a cube is also "building" — what we do.
 * Two outlined sides and one gold face; nothing else, so it reads at favicon size.
 *
 * States
 * - idle: still, gold top face
 * - thinking: the gold face travels top -> right -> left, like a cube turning (loaders, assistant)
 * - intro: the sides draw themselves, then the gold face drops into place (splash, welcome)
 * - still: no motion at all
 */
const FACES = {
  top: "M32 9 L53 21 L32 33 L11 21 Z",
  right: "M53 21 V44 L32 56 V33 Z",
  left: "M11 21 V44 L32 56 V33 Z",
};

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
  /** "light" draws white lines for dark backgrounds; "dark" draws ink lines for light ones. */
  tone?: "light" | "dark";
}) => {
  const line = tone === "light" ? "#f4f6fa" : "#14202b";
  const gold = "#f0b44a";
  const stroke = { fill: "none", stroke: line, strokeWidth: 3.6, strokeLinejoin: "round" as const };
  const draw = (delay: number): CSSProperties | undefined =>
    state === "intro" ? { strokeDasharray: 90, strokeDashoffset: 90, animation: `khayyam-draw 0.7s ${delay}s cubic-bezier(0.65, 0, 0.35, 1) forwards` } : undefined;
  const travel = (delay: number): CSSProperties => ({ opacity: 0, animation: `khayyam-face 1.8s ${delay}s cubic-bezier(0.65, 0, 0.35, 1) infinite` });

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {state === "thinking" ? (
        <>
          <path d={FACES.top} fill={gold} style={travel(0)} />
          <path d={FACES.right} fill={gold} style={travel(0.6)} />
          <path d={FACES.left} fill={gold} style={travel(1.2)} />
        </>
      ) : (
        <path
          d={FACES.top}
          fill={gold}
          style={state === "intro" ? { transformBox: "fill-box", transformOrigin: "center", opacity: 0, animation: "khayyam-drop 0.55s 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" } : undefined}
        />
      )}
      <path d={FACES.left} {...stroke} style={draw(0)} />
      <path d={FACES.right} {...stroke} style={draw(0.15)} />
      {state === "thinking" && <path d={FACES.top} {...stroke} strokeOpacity={0.35} />}
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
