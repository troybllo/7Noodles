"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";
import { ACCORDION_QUERY } from "@/components/motion/use-expanding-panels";

/**
 * Pins the section and drives the track sideways with vertical scroll.
 *
 * Travel is measured rather than assumed from the panel count — deriving it
 * from `panels * 100vw` is the usual way this effect leaves the final panel
 * half off-screen.
 *
 * It is the track's width minus the *wrapper's*, not minus the track's own.
 * The track is `w-max`, so it sizes to its content and its scrollWidth and
 * clientWidth are identical; the overflow lives on the wrapper. Measuring the
 * track against itself yields a travel of zero and a rail that never moves.
 *
 * The scroll distance equals the travel, so a pixel of page scroll is a pixel
 * of sideways movement and the rail never feels geared wrong.
 *
 * Pinned only from the accordion breakpoint up. On a phone the panels stack
 * and scroll normally — a pinned horizontal rail fights the reader's own
 * gesture on a touch device.
 */
export function CategoriesTrack({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const track = element.querySelector<HTMLElement>("[data-track]");
    if (!track) return;

    const media = gsap.matchMedia();

    media.add(ACCORDION_QUERY, () => {
      const travel = () => Math.max(0, track.scrollWidth - element.clientWidth);

      gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: () => `+=${travel()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => media.revert();
  });

  return (
    <div ref={scope} className="relative h-svh w-full overflow-hidden">
      <div data-track className="flex h-full w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
