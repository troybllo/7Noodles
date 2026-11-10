"use client";

import { useEffect, type ReactNode } from "react";
import { DURATION, EASE } from "@/components/motion/motion-tokens";

const SEEN = "hero-intro-seen";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero's arrival: played in full on the first visit of a session, and
 * quickly on coming back to the home page, so a return trip never waits.
 *
 *   Each word of the name rises out of its own line.
 *   The photographs settle from a slight zoom, one after the other.
 *   The logo is stamped down, Panda 7 lands with a turn, and the row of
 *   links fades up.
 *
 * Under reduced motion none of this runs and the markup's finished state
 * stays. Otherwise the pieces start hidden from the first paint (`html.js`
 * rules in globals.css), so nothing shows and then jumps back.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const q = gsap.utils.selector(element);

    const timeline = gsap
      .timeline({ defaults: { immediateRender: true } })
      .fromTo(
        q("[data-rise]"),
        { yPercent: 105, opacity: 1 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DURATION.reveal,
          ease: EASE.out,
          stagger: 0.1,
        },
        0.1,
      )
      // The photographs are never hidden — they are the page's largest
      // paint, and hiding them until this runs would hold that paint back on
      // a slow phone by seconds. They only settle from a slight zoom.
      .fromTo(
        q("[data-photo] img"),
        { scale: 1.12 },
        { scale: 1, duration: DURATION.zoom, ease: EASE.out, stagger: 0.15 },
        0,
      )
      .fromTo(
        q("[data-stamp]"),
        { opacity: 0, scale: 1.4 },
        { opacity: 1, scale: 1, duration: DURATION.stamp, ease: EASE.pop, stagger: 0.12 },
        1.1,
      )
      .fromTo(
        q("[data-seal]"),
        { opacity: 0, scale: 1.6, rotate: -24 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: EASE.pop },
        1.5,
      )
      .fromTo(
        q("[data-row]"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DURATION.settle, ease: EASE.out },
        1.4,
      );

    // The timeline now holds every piece; the CSS fallback can stand down.
    document.documentElement.classList.add("hero-ready");
    try {
      if (sessionStorage.getItem(SEEN)) timeline.timeScale(2.5);
      sessionStorage.setItem(SEEN, "1");
    } catch {
      // Storage blocked: always play in full.
    }
  });

  // Leaving the home page hands the pieces back to the CSS, so they start
  // hidden again on the way back.
  useEffect(() => () => document.documentElement.classList.remove("hero-ready"), []);

  return <div ref={scope}>{children}</div>;
}
