"use client";

import type { ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/components/motion/motion-tokens";
import { useGsap } from "@/components/motion/use-gsap";

/** Three drops of ink growing from different points. Ellipses, as radial-gradient takes percentage radii only for those. */
const MASK = [
  "radial-gradient(ellipse calc(var(--ink-a) * 1%) calc(var(--ink-a) * 1%) at 24% 30%, #000 60%, transparent 100%)",
  "radial-gradient(ellipse calc(var(--ink-b) * 1%) calc(var(--ink-b) * 1%) at 74% 48%, #000 60%, transparent 100%)",
  "radial-gradient(ellipse calc(var(--ink-c) * 1%) calc(var(--ink-c) * 1%) at 38% 80%, #000 60%, transparent 100%)",
].join(", ");

/** Large enough that three drops fully cover a 4:5 frame. */
const FULL = 190;

/**
 * Reveals every `[data-ink]` photograph inside it as ink blooming in, a row at
 * a time as rows scroll in: a CSS mask of three growing gradients, removed
 * when each row finishes. Only photographs are masked, never names or prices.
 */
export function InkRevealGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    // Photographs already on screen were shown by the page transition (or
    // flew in from a dish page); inking them again would make them blink.
    const photos = gsap.utils
      .toArray<HTMLElement>(element.querySelectorAll("[data-ink]"))
      .filter((photo) => photo.getBoundingClientRect().top > window.innerHeight);
    if (photos.length === 0) return;

    // gsap.set rather than writing style directly, so the context reverts it.
    gsap.set(photos, {
      "--ink-a": 0,
      "--ink-b": 0,
      "--ink-c": 0,
      maskImage: MASK,
      WebkitMaskImage: MASK,
    });

    ScrollTrigger.batch(photos, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(batch, { maskImage: "none", WebkitMaskImage: "none" });
            },
          })
          .to(
            batch,
            { "--ink-a": FULL, duration: 1.1, ease: EASE.soft, stagger: 0.07 },
            0,
          )
          .to(
            batch,
            { "--ink-b": FULL, duration: 1.3, ease: EASE.soft, stagger: 0.07 },
            0.12,
          )
          .to(
            batch,
            { "--ink-c": FULL, duration: 1.5, ease: EASE.soft, stagger: 0.07 },
            0.24,
          );
      },
    });
  });

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
