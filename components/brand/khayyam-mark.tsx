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
  const stroke = { fill: "none", stroke: line, strokeWidth: 4.4, strokeLinejoin: "round" as const };
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

const defaultFacts = [
  "خیام طول سال را ۳۶۵٫۲۴۲۱۹ روز حساب کرد؛ دقیق‌تر از تقویم میلادی.",
  "خیام معادله‌های درجه سوم را با هندسه حل کرد.",
  "دقت، از خیام به ما رسیده؛ در حال آماده‌سازی…",
]

// One build step on a cube face: grows in, holds, fades, on a shared 3.6s loop.
const piece = (delay: number): CSSProperties => ({ transformBox: "fill-box", transformOrigin: "0% 50%", animation: "khayyam-build 3.6s cubic-bezier(0.22,1,0.36,1) infinite", animationDelay: `${delay}s`, opacity: 0 });

/**
 * The cube at work: a website being laid out on its right face, an app screen on its
 * left face, and the AI "thinking" on the gold top, piece by piece, while a Khayyam fact
 * rotates underneath. Drawn in the cube's own isometric planes.
 */
export const BuildingCube = ({ size = 210 }: { size?: number }) => {
  const ivory = "#f2ecdf";
  const line = { fill: ivory, fillOpacity: 0.85 } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" className="overflow-visible">
      <defs>
        <radialGradient id="build-glow">
          <stop offset="0" stopColor="#d9a648" stopOpacity="0.28" />
          <stop offset="1" stopColor="#d9a648" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="104" r="96" fill="url(#build-glow)" />
      {/* faces */}
      <polygon points="100,26 164,63 100,100 36,63" fill="#d9a648" />
      <polygon points="164,63 164,137 100,174 100,100" fill="rgba(242,236,223,0.07)" />
      <polygon points="36,63 100,100 100,174 36,137" fill="rgba(242,236,223,0.05)" />

      {/* right face: a website, laid out top to bottom */}
      <g transform="matrix(0.64 -0.37 0 0.74 100 100)">
        <rect x="8" y="8" width="84" height="9" rx="2" {...line} style={piece(0)} />
        <rect x="8" y="24" width="56" height="7" rx="2" {...line} style={piece(0.25)} />
        <rect x="8" y="36" width="40" height="5" rx="2" {...line} fillOpacity={0.6} style={piece(0.4)} />
        <rect x="8" y="48" width="26" height="22" rx="3" {...line} fillOpacity={0.5} style={piece(0.6)} />
        <rect x="37" y="48" width="26" height="22" rx="3" {...line} fillOpacity={0.5} style={piece(0.7)} />
        <rect x="66" y="48" width="26" height="22" rx="3" {...line} fillOpacity={0.5} style={piece(0.8)} />
        <rect x="8" y="78" width="30" height="8" rx="4" fill="#d9a648" style={piece(1)} />
      </g>

      {/* left face: an app screen, stacking up */}
      <g transform="matrix(0.64 0.37 0 0.74 36 63)">
        <rect x="30" y="6" width="40" height="88" rx="7" fill="none" stroke={ivory} strokeOpacity="0.85" strokeWidth="3" style={piece(0.2)} />
        <rect x="36" y="16" width="28" height="14" rx="3" fill="#d9a648" fillOpacity={0.85} style={piece(0.5)} />
        <rect x="36" y="35" width="28" height="7" rx="2" {...line} style={piece(0.7)} />
        <rect x="36" y="46" width="28" height="7" rx="2" {...line} fillOpacity={0.6} style={piece(0.85)} />
        <rect x="36" y="57" width="28" height="7" rx="2" {...line} fillOpacity={0.6} style={piece(1)} />
        <rect x="36" y="80" width="28" height="6" rx="3" {...line} style={piece(1.15)} />
      </g>

      {/* top face: the AI thinking */}
      <g transform="matrix(0.64 -0.37 0.64 0.37 36 63)">
        {[0, 1, 2].map((dot) => (
          <circle key={dot} cx={34 + dot * 16} cy={50} r="6" fill="#1c1406" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "khayyam-breathe 1.2s ease-in-out infinite", animationDelay: `${dot * 0.18}s` }} />
        ))}
      </g>

      {/* edges, drawn last so they sit on top */}
      <g fill="none" stroke={ivory} strokeWidth="5" strokeLinejoin="round">
        <polygon points="100,26 164,63 100,100 36,63" />
        <polygon points="164,63 164,137 100,174 100,100" />
        <polygon points="36,63 100,100 100,174 36,137" />
      </g>
    </svg>
  );
};

/** Full-screen loading state: the building cube and a rotating Khayyam fact. Always dark. */
export const KhayyamLoader = ({ label = "در حال بارگذاری", facts = defaultFacts }: { tone?: "light" | "dark"; label?: string; facts?: string[] }) => (
  <div role="status" aria-live="polite" className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-[#0c1222] px-6 text-center text-[#f2ecdf]">
    <BuildingCube />
    <span className="sr-only">{label}</span>
    <div className="relative h-14 w-full max-w-[360px]" aria-hidden="true">
      {facts.map((fact, index) => (
        <p
          key={fact}
          className="absolute inset-x-0 top-0 text-[13.5px] leading-7 text-[#9aa3b8] opacity-0"
          style={{ animation: `khayyam-fact ${facts.length * 3}s ease-in-out infinite`, animationDelay: `${index * 3}s` }}
        >
          {fact}
        </p>
      ))}
    </div>
  </div>
);
