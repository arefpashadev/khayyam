import { useSyncExternalStore } from "react";

const query = "(max-width: 1023px)";

const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

/** True below the `lg` breakpoint (phones and small tablets). */
export const useIsSmallScreen = () => useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);

export const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia(query).matches;
