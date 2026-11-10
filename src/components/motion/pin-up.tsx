"use client";

import type { ReactNode } from "react";
import { DURATION, EASE } from "./motion-tokens";
import { useGsap } from "./use-gsap";

/**
 * Something taped to the page lands as it scrolls into view: it drops a
 * little, turns into place and settles with a small overshoot, as a print
 * pressed down by hand. Wrap a TapedFrame; its own tilt is kept, since this
 * turns the wrapper, not the frame.
 *
 * `fade` is off for anything that is the page's largest paint, which must
 * never be held back at opacity 0.
 */
export function PinUp({
  children,
  className,
  turn = 4,
  fade = true,
}: {
  children: ReactNode;
  className?: string | undefined;
  /** Degrees it turns through on landing; negative turns the other way. */
  turn?: number;
  fade?: boolean;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    gsap.fromTo(
      element,
      { y: 28, rotation: turn, scale: 1.04, ...(fade ? { opacity: 0 } : {}) },
      {
        y: 0,
        rotation: 0,
        scale: 1,
        ...(fade ? { opacity: 1 } : {}),
        duration: DURATION.settle,
        ease: EASE.land,
        scrollTrigger: { trigger: element, start: "top 90%", once: true },
      },
    );
  });

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
