"use client";

import { useRef } from "react";
import { useGsap } from "@/components/motion/use-gsap";
import type { HomeSection } from "@/content/home-sections";

/**
 * Pillars: one mark on the strand for each section of the page, lighting up as
 * the reader reaches it.
 *
 * Positions are found on the strand itself rather than guessed. The path
 * descends monotonically, so a binary search over arc length finds the point
 * at any given height, and because the rail stretches linearly in y, that
 * viewBox point maps straight to a percentage offset in the rail.
 *
 * Positioning and active state are written directly to the elements instead of
 * through React state. This runs on every scroll frame, and re-rendering a
 * component tree at that rate to move two marks would be the wrong trade.
 */
export function SectionPillars({ sections }: { sections: HomeSection[] }) {
  const pillars = useRef<(HTMLDivElement | null)[]>([]);

  const scopeRef = useGsap<HTMLDivElement>(
    ({ gsap, scope }) => {
      const path = scope
        .closest("nav")
        ?.querySelector<SVGPathElement>("[data-spine-main]");
      if (!path) return;

      const totalLength = path.getTotalLength();
      const viewBoxHeight = 1000;
      const viewBoxWidth = 100;

      /** The point on the strand at a given fraction of its height. */
      const pointAtHeight = (fraction: number) => {
        const targetY = fraction * viewBoxHeight;
        let low = 0;
        let high = totalLength;
        for (let i = 0; i < 22; i += 1) {
          const mid = (low + high) / 2;
          if (path.getPointAtLength(mid).y < targetY) low = mid;
          else high = mid;
        }
        return path.getPointAtLength((low + high) / 2);
      };

      let fractions: number[] = [];

      const place = () => {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - innerHeight,
        );

        fractions = sections.map((section) => {
          const element = document.getElementById(section.id);
          if (!element) return 0;
          // Where the section's top sits in the page as a whole, which is what
          // the rail is a map of.
          return Math.min(1, Math.max(0, element.offsetTop / maxScroll));
        });

        fractions.forEach((fraction, index) => {
          const pillar = pillars.current[index];
          if (!pillar) return;
          const point = pointAtHeight(fraction);
          pillar.style.top = `${fraction * 100}%`;
          pillar.style.left = `${(point.x / viewBoxWidth) * 100}%`;
        });
      };

      place();

      const trigger = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onRefresh: place,
          onUpdate: ({ progress }) => {
            fractions.forEach((fraction, index) => {
              const pillar = pillars.current[index];
              if (!pillar) return;
              // A small lead-in so a pillar lights as the strand arrives at it
              // rather than a beat after.
              pillar.dataset.reached = String(progress >= fraction - 0.01);
            });
          },
        },
      });

      return () => {
        trigger.kill();
      };
    },
    [sections.length],
  );

  return (
    <div ref={scopeRef} className="pointer-events-none absolute inset-0">
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(node) => {
            pillars.current[index] = node;
          }}
          data-reached="false"
          className="group absolute -translate-x-1/2 -translate-y-1/2"
        >
          <span className="bg-agar group-data-[reached=true]:bg-lantern block size-1.5 rotate-45 transition-all duration-[--duration-base] ease-[--ease-out-expo] group-data-[reached=true]:scale-150" />
        </div>
      ))}
    </div>
  );
}
