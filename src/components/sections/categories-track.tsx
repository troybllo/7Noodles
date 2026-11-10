"use client";

import type { ReactNode } from "react";
import { DURATION } from "@/components/motion/motion-tokens";
import { useGsap } from "@/components/motion/use-gsap";
import { ACCORDION_QUERY } from "@/components/motion/use-expanding-panels";

/** Scroll distance for each hand-over, as a fraction of the viewport height. */
const HANDOVER_SCROLL = 0.6;

/**
 * The categories, pinned: each slides in from the right and covers the one
 * before, which drifts left and dims, so only one is ever fully in view. The
 * timeline is scrubbed, so scrolling back reverses it.
 *
 * The markup is normal flow (stacked one after another on phones); GSAP adds the stacking
 * only when it runs, so reduced motion still shows every panel.
 */
export function CategoriesTrack({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const media = gsap.matchMedia();

    media.add(ACCORDION_QUERY, () => {
      const panels = gsap.utils.toArray<HTMLElement>(element.children);
      if (panels.length < 2) return;

      // Take the panels out of flow and stack them, later over earlier.
      gsap.set(element, { height: "100svh", overflow: "hidden" });
      gsap.set(panels, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      });
      panels.forEach((panel, i) => gsap.set(panel, { zIndex: i + 1 }));

      const handovers = panels.length - 1;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: () => `+=${handovers * window.innerHeight * HANDOVER_SCROLL}`,
          pin: true,
          scrub: DURATION.settle,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const outgoing = panels[i - 1]!;
        const at = i - 1;

        timeline
          .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 1 }, at)
          // `to`, not `fromTo`: a middle panel is also the next one's incoming
          // target, and fromTo would reset its offscreen start. The dim is an
          // overlay, not a filter, so it stays on the compositor.
          .to(outgoing, { xPercent: -12, duration: 1 }, at)
          .to(
            outgoing.querySelector("[data-panel-dim]"),
            { opacity: 0.5, duration: 1 },
            at,
          );
      });
    });

    return () => media.revert();
  });

  return (
    <div
      ref={scope}
      // On phones the chapters simply follow one another, each as tall as its
      // own content. From the accordion breakpoint up, the pinned overlap
      // above takes over.
      className="relative flex w-full flex-col md:block"
    >
      {children}
    </div>
  );
}
