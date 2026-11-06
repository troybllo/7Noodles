"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/**
 * The reader's reduced-motion setting. True before hydration, so a reader who
 * asked for less motion never catches a frame of the full animation.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
