"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero entrance, measured from the prototype: the photo grid starts scaled
 * about 1.37 and turned about 7.4 degrees, then settles flat as the headline
 * rises in.
 *
 * `fromTo` with both ends stated, and `immediateRender: false`, so the start
 * state is applied only when the tween actually begins. If the frame loop never
 * runs, the hero is simply flat and readable rather than stuck tilted or with
 * its headline hidden.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap }) => {
    gsap
      .timeline({ defaults: { ease: "expo.out", immediateRender: false } })
      .fromTo(
        "[data-hero-grid]",
        { scale: 1.37, rotate: -7.4 },
        { scale: 1, rotate: 0, duration: 2.1 },
        0,
      )
      .fromTo(
        "[data-hero-rise]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.09 },
        0.55,
      );
  });

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
