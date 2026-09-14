"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Smooth scrolling, driven from GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Two independent rAF loops is the usual cause of scroll-linked
 * animation drifting a frame behind the page.
 *
 * Mounts nothing when the reader has asked for reduced motion — native
 * scrolling is left completely alone.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      // In-page links (the menu's category tabs) glide rather than jump, and
      // stop clear of the fixed navigation bar.
      anchors: { offset: -112 },
      // Slightly overshoot-free exponential glide; matches --ease-out-expo.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
