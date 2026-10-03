"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/** Snap heights as a share of the screen: peek, half, almost full. */
const SNAPS = [0.32, 0.55, 0.88];

/**
 * A bottom sheet you can drag like a native one: grab the handle, pull up or down,
 * release and it springs to the nearest height (a quick flick carries further).
 * Tapping the handle toggles between half and full height.
 */
export const DraggableSheet = ({ children, className = "", ...rest }: { children: ReactNode; className?: string } & Record<`data-${string}`, string>) => {
  const height = useMotionValue(typeof window === "undefined" ? 0 : window.innerHeight * SNAPS[1]);
  const drag = useRef<{ startY: number; startHeight: number; lastY: number; lastTime: number; velocity: number; moved: boolean } | null>(null);
  const snapIndex = useRef(1);

  const settle = (target: number) => {
    const sizes = SNAPS.map((share) => share * window.innerHeight);
    const nearest = sizes.reduce((best, size, index) => (Math.abs(size - target) < Math.abs(sizes[best] - target) ? index : best), 0);
    snapIndex.current = nearest;
    animate(height, sizes[nearest], { type: "spring", bounce: 0.12, duration: 0.45 });
  };

  // Keep the same snap when the viewport changes (rotation, keyboard, browser bars).
  useEffect(() => {
    const onResize = () => height.set(window.innerHeight * SNAPS[snapIndex.current]);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [height]);

  return (
    <motion.aside {...rest} style={{ height }} className={`flex w-full shrink-0 flex-col ${className}`}>
      <button
        type="button"
        aria-label="تغییر اندازه پنل"
        className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { startY: event.clientY, startHeight: height.get(), lastY: event.clientY, lastTime: performance.now(), velocity: 0, moved: false };
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          if (!state) return;
          const now = performance.now();
          state.velocity = (event.clientY - state.lastY) / Math.max(1, now - state.lastTime);
          state.lastY = event.clientY;
          state.lastTime = now;
          if (Math.abs(event.clientY - state.startY) > 4) state.moved = true;
          const min = window.innerHeight * SNAPS[0] * 0.85;
          const max = window.innerHeight * SNAPS[SNAPS.length - 1];
          height.set(Math.min(max, Math.max(min, state.startHeight - (event.clientY - state.startY))));
        }}
        onPointerUp={() => {
          const state = drag.current;
          drag.current = null;
          if (!state) return;
          if (!state.moved) {
            settle(window.innerHeight * (snapIndex.current === 2 ? SNAPS[1] : SNAPS[2]));
            return;
          }
          // project the flick a little forward so a fast swipe jumps a snap
          settle(height.get() - state.velocity * 220);
        }}
        onPointerCancel={() => {
          drag.current = null;
          settle(height.get());
        }}
      >
        <span className="h-1 w-10 rounded-full bg-white/20" />
      </button>
      {children}
    </motion.aside>
  );
};
