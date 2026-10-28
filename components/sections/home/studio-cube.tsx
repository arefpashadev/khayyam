"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";

export type Face = "site" | "app" | "ai";

export const faces: { key: Face; href: string }[] = [
  { key: "site", href: "/website" },
  { key: "app", href: "/apps" },
  { key: "ai", href: "/ai" },
];

// Isometric cube on a 400×400 canvas.
const P = {
  top: "200,52",
  ur: "328,126",
  ul: "72,126",
  c: "200,200",
  lr: "328,274",
  ll: "72,274",
  b: "200,348",
};
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
 * Its faces always carry the studio names; the one under the pointer lights up.
 * Pointing at it opens it up: the faces name the studios, the one under the pointer
 * lights up, and choosing it opens that studio. Touch screens show the names right away.
 */
export const StudioCube = ({
  onChange,
}: {
  onChange?: (face: Face | null) => void;
}) => {
  const reduce = useReducedMotion();
  const router = useRouter();
  const t = useTranslations("Cube");
  const [inside, setInside] = useState(false);
  const [held, setHeld] = useState<Face | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setTouch(!window.matchMedia("(hover: hover)").matches),
      0,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  const open = inside || touch;
  // At rest the top face is gold, exactly like the logo.
  const lit: Face = held ?? "ai";

  useEffect(() => onChange?.(open ? lit : null), [open, lit, onChange]);

  // Same look as the loading cube: ivory edges and a gold top, all there from the start.
  const enter = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="h-auto w-full overflow-visible"
      role="group"
      aria-label={t("group")}
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

      <motion.g {...enter} style={{ transformOrigin: "200px 200px" }}>
        {faces.map((face) => {
          const on = lit === face.key;
          return (
            <g
              key={face.key}
              role="link"
              tabIndex={0}
              aria-label={`${t(`${face.key}.title`)}: ${t(`${face.key}.cta`)}`}
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
              <motion.polygon
                points={shape[face.key]}
                initial={false}
                animate={{ fill: on ? GOLD : "rgba(242,236,223,0.025)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.text
                transform={label[face.key]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={
                  face.key === "ai" && t("ai.label").length > 3 ? 23 : 28
                }
                fontWeight="800"
                initial={false}
                animate={{ opacity: 1, fill: on ? "#1c1406" : IVORY }}
                transition={{ duration: 0.35 }}
                style={{ fontFamily: "inherit", pointerEvents: "none" }}
              >
                {t(`${face.key}.label`)}
              </motion.text>
            </g>
          );
        })}
        {/* edges on top, like the logo and the loading cube */}
        <g
          fill="none"
          stroke={IVORY}
          strokeWidth="7"
          strokeLinejoin="round"
          pointerEvents="none"
        >
          {faces.map((face) => (
            <polygon key={face.key} points={shape[face.key]} />
          ))}
        </g>
      </motion.g>
    </motion.svg>
  );
};

/** One line under the cube: an invitation at rest, then what the lit face is. */
export const FaceCaption = ({ face }: { face: Face | null }) => {
  const t = useTranslations("Cube");
  const line = face ? t(`${face}.hint`) : t("rest");
  return (
    <div
      className="relative h-7 w-full overflow-hidden text-center"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={`truncate text-[14px] leading-7 ${face ? "font-bold text-[#e9c27a]" : "text-[#8790a6]"}`}
        >
          {line}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
