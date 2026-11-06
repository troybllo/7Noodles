"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { EASE } from "./motion-tokens";
import { useReducedMotion } from "./use-reduced-motion";

/** Working pages (ordering, the kitchen) scroll natively: a form or a ticket list should not glide. */
const NATIVE_SCROLL = /^\/(kitchen|checkout|order\/|account)/;

/**
 * Smooth scrolling, driven from GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Off under reduced motion and on working pages. Anything inside an
 * open dialog (the cart, the menu, a dish's options) scrolls natively, and the
 * page behind it stays put (see `html:has(dialog[open])` in globals.css).
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const native = NATIVE_SCROLL.test(usePathname());

  useEffect(() => {
    if (reduced || native) return;
    let cleanup = () => {};
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        duration: 1.05,
        easing: EASE.lenis,
        // In-page links glide, and stop clear of the fixed navigation bar.
        anchors: { offset: -112 },
        allowNestedScroll: true,
        prevent: (node) => node.closest("dialog") !== null,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, native]);

  return null;
}
