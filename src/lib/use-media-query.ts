"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a media query matches, following changes while the page is open.
 * `onServer` is the answer before hydration: choose the one that is safe to
 * show first.
 */
export function useMediaQuery(query: string, onServer: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => onServer,
  );
}
