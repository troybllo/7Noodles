"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { DURATION, EASE } from "./motion-tokens";
import { useReducedMotion } from "./use-reduced-motion";

/** Working pages (ordering, the kitchen) scroll natively: a form or a ticket list should not glide. */
const NATIVE_SCROLL = /^\/(kitchen|checkout|order|account)(\/|$)/;

/**
 * Smooth scrolling, driven from GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Off under reduced motion, on working pages, and on touch screens,
 * where the phone's own scrolling already has momentum and Lenis would only
 * add a frame loop. Anything inside an
 * open dialog (the cart, the menu, a dish's options) scrolls natively, and the
 * page behind it stays put (see `html:has(dialog[open])` in globals.css).
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const native = NATIVE_SCROLL.test(usePathname());
  const touch = useMediaQuery("(hover: none), (pointer: coarse)", true);

  // Once, for every page: keep triggers steady while a phone's address bar
  // shows and hides, and re-measure when the web fonts have changed the layout.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (reduced || native || touch) return;
    let cleanup = () => {};
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        duration: DURATION.reveal,
        easing: EASE.lenis,
        // In-page links glide, and stop at each target's scroll-margin-top.
        anchors: true,
        allowNestedScroll: true,
        prevent: (node) => node.closest("dialog") !== null,
      });
      lenis.on("scroll", ScrollTrigger.update);
      // An open dialog holds the page still; Lenis would otherwise keep
      // scrolling it under the wheel.
      const hold = new MutationObserver(() => {
        if (document.querySelector("dialog[open]")) lenis.stop();
        else lenis.start();
      });
      hold.observe(document.body, { subtree: true, attributeFilter: ["open"] });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        hold.disconnect();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, native, touch]);

  return null;
}
