"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * Scroll-driven reveal for the story section.
 *
 * Each statement line sits inside its own clipping wrapper and rises into it,
 * which is wrap-safe: if a line breaks at a narrow width the whole block still
 * rises behind the same mask rather than tearing.
 *
 * `once: true` — a section that re-animates every time it scrolls back into
 * view reads as a glitch rather than as craft.
 *
 * Both ends of every tween are stated. See hero-motion for why `from` alone is
 * unsafe when an effect can run twice.
 */
export function StoryMotion({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    gsap
      .timeline({
        scrollTrigger: { trigger: element, start: "top 72%", once: true },
        defaults: { ease: "expo.out" },
      })
      .fromTo("[data-story-eyebrow]", { yPercent: 110 }, { yPercent: 0, duration: 0.9 })
      .fromTo(
        "[data-story-line]",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.11 },
        0.12,
      )
      .fromTo(
        "[data-story-lede]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.5,
      )
      .fromTo(
        "[data-story-fact]",
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        0.68,
      );
  });

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
