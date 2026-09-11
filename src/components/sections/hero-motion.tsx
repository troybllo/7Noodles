"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero entrance.
 *
 * The artwork settles from a slow push-in while the card rises into place, so
 * the two planes arrive at different rates and the card reads as sitting above
 * the painting rather than printed onto it.
 *
 * Two deliberate choices here, both about not trusting the animation to run.
 *
 * `fromTo` with both ends stated: `from` alone takes its end value from
 * whatever the DOM holds when the tween is built, so an effect that runs twice
 * — as it does under StrictMode — reads back the start value the first run
 * applied and animates a value to itself.
 *
 * `immediateRender: false`: the hidden start state is applied when the tween
 * actually begins rather than the moment it is built. If the ticker never runs
 * — a background tab, a stalled frame loop, a script error earlier in the page
 * — the hero stays in its finished, readable state instead of being an empty
 * card over a painting. Content should never depend on an animation to appear.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap }) => {
    gsap
      .timeline({ defaults: { ease: "expo.out", immediateRender: false } })
      .fromTo("[data-hero-art]", { scale: 1.12 }, { scale: 1, duration: 2.2 }, 0)
      .fromTo(
        "[data-hero-card]",
        { yPercent: 8, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.4 },
        0.15,
      )
      .fromTo(
        "[data-hero-name] > *",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.08 },
        0.45,
      )
      .fromTo(
        "[data-hero-line]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
        0.7,
      )
      .fromTo("[data-hero-vertical]", { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0.9);
  });

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
