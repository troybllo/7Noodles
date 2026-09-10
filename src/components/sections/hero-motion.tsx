"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero entrance.
 *
 * Wraps server-rendered markup and animates it, so the content itself never
 * becomes part of the client bundle. Everything it touches is already in its
 * finished state in the HTML — this only plays it in, and does nothing at all
 * under reduced motion.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap }) => {
    const timeline = gsap.timeline({
      defaults: { ease: "expo.out", duration: 1.1 },
    });

    timeline
      .from("[data-hero-eyebrow]", { yPercent: 120, opacity: 0, duration: 0.8 }, 0)
      .from("[data-hero-letter]", { yPercent: 115, duration: 1.2, stagger: 0.045 }, 0.1)
      .fromTo(
        "[data-limb]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.5, stagger: 0.16, ease: "power2.inOut" },
        0.35,
      )
      .from(
        "[data-blossom]",
        {
          scale: 0,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: { each: 0.09, from: "start" },
        },
        1.15,
      )
      .from(
        "[data-hero-foot] > *",
        { y: 26, opacity: 0, duration: 0.9, stagger: 0.12 },
        1.05,
      );
  });

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
