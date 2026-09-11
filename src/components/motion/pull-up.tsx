"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * Reveals its contents by pulling them up into a fixed frame.
 *
 * The frame clips and the contents translate, so nothing about the element's
 * size changes during the animation — no layout is read or written per frame,
 * which is what keeps a scroll-triggered reveal off the main thread.
 *
 * The inner element is scaled slightly at the start and settles to rest, so
 * the image drifts as it arrives rather than sliding as a flat card.
 */
export function PullUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    // Both ends stated: `from` alone would take its end value from the DOM at
    // build time, which is wrong as soon as the effect runs twice.
    gsap.fromTo(
      element.querySelector("[data-pull-up-inner]"),
      { yPercent: 100, scale: 1.12 },
      {
        yPercent: 0,
        scale: 1,
        duration: 1.4,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      },
    );
  });

  return (
    <div ref={scope} className={`overflow-hidden ${className ?? ""}`}>
      <div data-pull-up-inner className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
