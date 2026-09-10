"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/components/motion/use-gsap";
import type { HomeSection } from "@/content/home-sections";

const VIEWBOX_HEIGHT = 1000;
const VIEWBOX_WIDTH = 100;

/**
 * Pillars: one mark on the strand for each section of the page, lighting up as
 * the reader reaches it.
 *
 * Positions are found on the strand itself rather than guessed. The path
 * descends monotonically, so a binary search over arc length finds the point at
 * any given height, and because the rail stretches linearly in y, that viewBox
 * point maps straight to a percentage offset in the rail.
 *
 * Positioning and lit state are written directly to the elements rather than
 * through React state. This runs on every scroll frame, and re-rendering a
 * component tree at that rate to move three marks would be the wrong trade.
 */
export function SectionPillars({ sections }: { sections: HomeSection[] }) {
  const pillars = useRef<(HTMLDivElement | null)[]>([]);

  const scopeRef = useGsap<HTMLDivElement>(
    ({ scope }) => {
      const path = scope
        .closest("nav")
        ?.querySelector<SVGPathElement>("[data-spine-main]");
      if (!path) return;

      const totalLength = path.getTotalLength();

      /** The point on the strand at a given fraction of its height. */
      const pointAtHeight = (fraction: number) => {
        const targetY = fraction * VIEWBOX_HEIGHT;
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
          document.documentElement.scrollHeight - window.innerHeight,
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
          pillar.style.left = `${(point.x / VIEWBOX_WIDTH) * 100}%`;
        });
      };

      const light = (progress: number) => {
        fractions.forEach((fraction, index) => {
          const pillar = pillars.current[index];
          if (!pillar) return;
          // A small lead-in so a pillar lights as the strand arrives at it
          // rather than a beat afterwards.
          pillar.dataset.reached = String(progress >= fraction - 0.01);
        });
      };

      /*
       * Progress is read straight from the document rather than from a
       * ScrollTrigger range. A trigger spanning documentElement from "top top"
       * to "bottom bottom" resolves to a degenerate range and never emits
       * onUpdate, which is why these silently never lit. Lenis scrolls the
       * window natively, so a passive scroll listener is both simpler and
       * exact here.
       */
      const onScroll = () => {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        light(window.scrollY / maxScroll);
      };

      const refresh = () => {
        place();
        onScroll();
      };

      refresh();

      window.addEventListener("scroll", onScroll, { passive: true });
      // Section offsets move whenever layout does, and ScrollTrigger already
      // broadcasts that for every other scroll-linked piece on the page.
      ScrollTrigger.addEventListener("refresh", refresh);

      return () => {
        window.removeEventListener("scroll", onScroll);
        ScrollTrigger.removeEventListener("refresh", refresh);
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
          {/*
            A tick crossing the strand, not a dot on it. Nav nodes also sit on
            the centre line, so a dot disappears underneath one whenever a
            section boundary lands near a nav item; a tick still reads.
          */}
          <span className="block h-[2px] w-4 bg-[var(--rail-muted)] transition-all duration-[--duration-slow] ease-[--ease-out-expo] group-data-[reached=true]:w-7 group-data-[reached=true]:bg-[var(--rail-accent)]" />
        </div>
      ))}
    </div>
  );
}
