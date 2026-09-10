"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

type Build = (context: { gsap: typeof gsap; scope: HTMLElement }) => void;

/**
 * Runs a GSAP setup function scoped to an element, and reverts everything it
 * created on unmount.
 *
 * `gsap.context` is what makes the cleanup complete: every tween, timeline and
 * ScrollTrigger created inside `build` is tracked and killed together, which
 * matters under the App Router where a route can mount and unmount repeatedly
 * without a full page load.
 *
 * The setup is skipped entirely when the reader has asked for reduced motion,
 * so components must render their finished, readable state by default and
 * treat animation as an enhancement on top of it.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  build: Build,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);
  const reduced = useReducedMotion();

  // Held in a ref so an inline `build` does not retrigger setup every render.
  // Written in an effect rather than during render, and declared before the
  // effect that reads it so it is always current by the time that one runs.
  const latest = useRef(build);
  useEffect(() => {
    latest.current = build;
  });

  useEffect(() => {
    const element = scope.current;
    if (reduced || !element) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      latest.current({ gsap, scope: element });
    }, element);

    return () => context.revert();
    // Re-runs are controlled by the caller through `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scope;
}
