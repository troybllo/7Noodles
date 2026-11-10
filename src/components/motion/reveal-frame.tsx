"use client";

import type { ReactNode } from "react";
import { DURATION, EASE } from "@/components/motion/motion-tokens";
import { useGsap } from "@/components/motion/use-gsap";

type RevealFrameProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the frame opens, where frames sit side by side. */
  delay?: number;
};

/**
 * A window onto a photograph that opens from the bottom as it scrolls into
 * view, while the picture inside settles from a slight zoom — the frame and
 * the image moving at different speeds is what gives it depth.
 *
 * The wipe is a curtain of two transforms: the window rises into place while
 * its contents move the opposite way, so the photograph appears to hold still
 * as it is uncovered. Transforms only, so it stays on the compositor. On
 * phones, where frames stack, `delay` is dropped. Without motion it is open.
 */
export function RevealFrame({ children, className, delay = 0 }: RevealFrameProps) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const wipe = element.querySelector<HTMLElement>("[data-reveal-wipe]");
    const inner = element.querySelector<HTMLElement>("[data-reveal-inner]");
    if (!wipe || !inner) return;

    const wait = window.matchMedia("(min-width: 48rem)").matches ? delay : 0;
    const scrollTrigger = { trigger: element, start: "top 88%", once: true };
    const reveal = { duration: DURATION.reveal, delay: wait, ease: EASE.out, scrollTrigger };

    gsap.fromTo(wipe, { yPercent: 100 }, { yPercent: 0, ...reveal });
    gsap.fromTo(
      inner,
      { yPercent: -100, scale: 1.18 },
      { yPercent: 0, ...reveal },
    );
    gsap.to(inner, {
      scale: 1,
      duration: DURATION.zoom,
      delay: wait,
      ease: EASE.out,
      scrollTrigger,
    });
  });

  return (
    <div ref={scope} className={`overflow-hidden ${className ?? ""}`}>
      <div data-reveal-wipe className="h-full w-full overflow-hidden">
        <div data-reveal-inner className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
