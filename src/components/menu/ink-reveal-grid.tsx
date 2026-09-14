"use client";

import type { ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * Three soft drops of ink, each growing from a different point, merged by the
 * mask's own union. Ellipses rather than circles because radial-gradient only
 * accepts percentage radii for ellipses — and a slightly uneven drop reads more
 * like ink than a perfect circle would.
 */
const MASK = [
  "radial-gradient(ellipse calc(var(--ink-a) * 1%) calc(var(--ink-a) * 1%) at 24% 30%, #000 60%, transparent 100%)",
  "radial-gradient(ellipse calc(var(--ink-b) * 1%) calc(var(--ink-b) * 1%) at 74% 48%, #000 60%, transparent 100%)",
  "radial-gradient(ellipse calc(var(--ink-c) * 1%) calc(var(--ink-c) * 1%) at 38% 80%, #000 60%, transparent 100%)",
].join(", ");

/** Large enough that three drops fully cover a 4:5 frame. */
const FULL = 190;

/**
 * Reveals every `[data-ink]` photograph inside it as ink blooming into the
 * picture, a row at a time as rows scroll in.
 *
 * The inspiration draws this with a canvas shader per card; a CSS mask of three
 * growing gradients gets the same look with nothing to compile and nothing
 * left running.
 *
 * The mask exists only while a reveal plays. It is applied when motion runs and
 * cleared when each batch finishes, so a settled page carries no mask at all —
 * and under reduced motion none is ever applied. Only photographs are masked;
 * names and prices are never hidden behind an animation.
 */
export function InkRevealGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const photos = gsap.utils.toArray<HTMLElement>(
      element.querySelectorAll("[data-ink]"),
    );
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
            { "--ink-a": FULL, duration: 1.1, ease: "power2.out", stagger: 0.07 },
            0,
          )
          .to(
            batch,
            { "--ink-b": FULL, duration: 1.3, ease: "power2.out", stagger: 0.07 },
            0.12,
          )
          .to(
            batch,
            { "--ink-c": FULL, duration: 1.5, ease: "power2.out", stagger: 0.07 },
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
