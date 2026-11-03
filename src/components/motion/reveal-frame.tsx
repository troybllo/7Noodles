"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

type RevealFrameProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the frame opens. */
  delay?: number;
};

/**
 * A rounded window onto a photograph that opens from the bottom as it scrolls
 * into view, while the picture inside settles from a slight zoom — the frame
 * and the image moving at different speeds is what gives it depth.
 *
 * The wipe is driven through a proxy object rather than tweened as a CSS
 * string, so the inset is recomputed rather than interpolated between two
 * shapes GSAP would have to parse. Without motion it is simply open.
 */
export function RevealFrame({ children, className, delay = 0 }: RevealFrameProps) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const wipe = element.querySelector<HTMLElement>("[data-reveal-wipe]");
    const inner = element.querySelector<HTMLElement>("[data-reveal-inner]");
    if (!wipe || !inner) return;

    const state = { p: 0 };
    const shape = (p: number) => `inset(${(1 - p) * 100}% 0 0 0 round 0)`;
    wipe.style.clipPath = shape(0);

    const trigger = { trigger: element, start: "top 85%", once: true };
    gsap.to(state, {
      p: 1,
      duration: 1.3,
      delay,
      ease: "expo.out",
      onUpdate: () => {
        wipe.style.clipPath = shape(state.p);
      },
      onComplete: () => {
        wipe.style.clipPath = "";
      },
      scrollTrigger: trigger,
    });
    gsap.fromTo(
      inner,
      { scale: 1.18 },
      { scale: 1, duration: 1.8, delay, ease: "expo.out", scrollTrigger: trigger },
    );
  });

  return (
    <div ref={scope} className={className}>
      <div data-reveal-wipe className="h-full w-full overflow-hidden">
        <div data-reveal-inner className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
