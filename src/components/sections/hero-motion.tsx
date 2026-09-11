"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero entrance.
 *
 * Two deliberate choices, both about not trusting the animation to run.
 *
 * `fromTo` with both ends stated: `from` alone takes its end value from
 * whatever the DOM holds when the tween is built, so an effect that runs twice
 * — as it does under StrictMode — reads back the start value the first run
 * applied and animates a value to itself.
 *
 * `immediateRender: false`: the hidden start state is applied when the tween
 * actually begins rather than the moment it is built. If the frame loop never
 * runs, the hero stays in its finished, readable state. Content should never
 * depend on an animation to appear.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap }) => {
    gsap
      .timeline({ defaults: { ease: "expo.out", immediateRender: false } })
      .fromTo("[data-hero-name]", { yPercent: 110 }, { yPercent: 0, duration: 1.1 }, 0)
      .fromTo(
        "[data-hero-letter]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.3, stagger: 0.05 },
        0.12,
      )
      .fromTo(
        "[data-hero-art]",
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 },
        0.5,
      )
      .fromTo(
        "[data-hero-line]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
        0.7,
      );
  });

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
