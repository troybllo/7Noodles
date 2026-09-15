"use client";

import type { ReactNode } from "react";
import { useGsap } from "./use-gsap";

/**
 * Draws every `[data-draw]` stroke inside it on, stroke by stroke, the first
 * time it scrolls into view.
 *
 * The strokes render fully drawn, which is what stays under reduced motion,
 * where this never runs. The starting state is applied only when the trigger
 * is built.
 */
export function DrawOn({
  children,
  className,
  duration = 1.6,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds for the whole drawing. */
  duration?: number;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const strokes = element.querySelectorAll("[data-draw]");
    if (strokes.length === 0) return;

    gsap.fromTo(
      strokes,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: duration / 2,
        ease: "power2.inOut",
        stagger: { amount: duration / 2 },
        scrollTrigger: { trigger: element, start: "top 80%", once: true },
      },
    );
  });

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
