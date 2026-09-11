"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";
import { ACCORDION_QUERY } from "@/components/motion/use-expanding-panels";

/**
 * Each category slides in from the right and covers the one before it, rather
 * than the whole set travelling sideways as one rail.
 *
 * A continuous rail leaves two categories part-visible at once, so dishes
 * blur between them and the reader cannot tell which belongs to which. With
 * an overlap only one panel is ever fully in view.
 *
 * The timeline is scrubbed, so scrolling back reverses the hand-over exactly
 * — no separate "leave" animation to keep in sync.
 *
 * The outgoing panel drifts left and dims as it is covered. Without that
 * counter-move the incoming panel reads as replacing it rather than passing
 * over it, which is the difference between a slide and a stack.
 *
 * **The default layout is normal flow** — panels are block-level and stack
 * vertically. The absolute stacking is applied here, by GSAP, and only when
 * GSAP actually runs. Making it the default would hide three of the four
 * panels from anyone with reduced motion, since `useGsap` skips entirely.
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
          end: () => `+=${handovers * window.innerHeight}`,
          pin: true,
          scrub: 0.7,
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
          /*
           * The outgoing moves with `to`, not `fromTo`. Every panel except the
           * first and last is both an incoming and an outgoing target, and a
           * `fromTo` applies its start value the moment it is built — so the
           * outgoing tween would reset the panel to x:0 and undo the offscreen
           * start its own incoming tween had just set. `to` takes its start
           * from wherever the timeline has the panel when it gets there.
           *
           * Dimming an overlay rather than filtering the panel keeps this on
           * the compositor; a brightness filter over a full viewport repaints
           * it every frame.
           */
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
    <div ref={scope} className="relative w-full">
      {children}
    </div>
  );
}
