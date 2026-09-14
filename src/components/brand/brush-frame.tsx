"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

type BrushFrameProps = {
  /** Name of a mask in public/brushes, without the extension. */
  brush: "story-right" | "story-left";
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the stroke is painted on. */
  delay?: number;
};

/**
 * A brush-shaped window onto whatever it wraps.
 *
 * The shape is a generated alpha mask (scripts/generate-brushes.mjs), so the
 * picture shows through the stroke. The paint-on is a clip-path wipe over that
 * mask, with a slanted leading edge that follows the direction the strokes
 * were drawn in — a straight vertical edge reads as a shutter rather than as a
 * brush moving.
 *
 * The wipe is driven through a proxy object rather than tweened as a CSS
 * string, so the polygon is recomputed rather than interpolated between two
 * shapes GSAP would have to parse.
 */
export function BrushFrame({ brush, children, className, delay = 0 }: BrushFrameProps) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const wipe = element.querySelector<HTMLElement>("[data-brush-wipe]");
    if (!wipe) return;

    // Leading edge leans, so the stroke arrives corner-first.
    const shape = (p: number) => {
      const lead = p * 128 - 14;
      return `polygon(-2% -2%, ${lead + 14}% -2%, ${lead - 14}% 102%, -2% 102%)`;
    };

    const state = { p: 0 };
    wipe.style.clipPath = shape(0);

    gsap.to(state, {
      p: 1,
      duration: 1.5,
      delay,
      ease: "power2.inOut",
      onUpdate: () => {
        wipe.style.clipPath = shape(state.p);
      },
      onComplete: () => {
        // Nothing should stay clipped once the stroke has landed.
        wipe.style.clipPath = "none";
      },
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
    });
  });

  const mask = {
    maskImage: `url(/brushes/${brush}.png)`,
    WebkitMaskImage: `url(/brushes/${brush}.png)`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  } as const;

  return (
    <div ref={scope} className={className}>
      <div data-brush-wipe className="h-full w-full">
        <div className="h-full w-full" style={mask}>
          {children}
        </div>
      </div>
    </div>
  );
}
