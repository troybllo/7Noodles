"use client";

import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the OS reduced-motion setting, including changes made while the page
 * is open.
 *
 * `useSyncExternalStore` is the right shape for this: matchMedia is an
 * external store, and subscribing through it avoids the extra render that
 * reading the value into state inside an effect would cause.
 *
 * The server snapshot is `true`, so the first paint is always the still one. A
 * reader who has asked for less motion must never catch a frame of the full
 * animation; the reverse costs nothing.
 */
export function useReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia(QUERY);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
