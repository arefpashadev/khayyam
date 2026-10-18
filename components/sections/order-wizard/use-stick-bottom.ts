"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps a chat scrolled to the newest message: whenever its content grows (a new bubble,
 * the typing indicator, an answer card) the scroller glides to the bottom on its own.
 * The scroller's first child must wrap all messages.
 */
export const useStickToBottom = (ref: RefObject<HTMLElement | null>, active = true) => {
  useEffect(() => {
    const scroller = ref.current;
    const content = scroller?.firstElementChild;
    if (!scroller || !content || !active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = 0;
    const observer = new ResizeObserver(() => {
      const height = content.getBoundingClientRect().height;
      if (height > last + 1) {
        // Go to the bottom — unless the newest message (marked data-chat-anchor) is taller than
        // the view, then stop at its top so its beginning is what the customer reads first.
        const anchors = content.querySelectorAll<HTMLElement>("[data-chat-anchor]");
        const anchor = anchors[anchors.length - 1];
        const bottom = scroller.scrollHeight - scroller.clientHeight;
        const anchorTop = anchor ? anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16 : bottom;
        scroller.scrollTo({ top: Math.min(bottom, anchorTop), behavior: reduce ? "auto" : "smooth" });
      }
      last = height;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [ref, active]);
};
