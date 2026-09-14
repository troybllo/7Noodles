"use client";

import { useGsap } from "@/components/motion/use-gsap";
import { DRAGON_STRENGTH } from "@/design/backdrop";

/**
 * Soga Nichokuan's Dragon, as a layer of ink behind the menu.
 *
 * The file is a transparent ink extraction of the painting, used as a mask and
 * filled with ink, so it reads as a faint wash of ink on the red or cream
 * paper beneath. Provenance in public/artwork/PROVENANCE.md.
 *
 * Sits at -z-10, so its page must establish a stacking context (`isolate`);
 * without one the layer drops behind the page background entirely.
 *
 * It drifts a little against the scroll so it reads as a layer behind the page
 * rather than a pattern printed on it. Under reduced motion it simply stays put.
 */
export function DragonBackdrop({ tone }: { tone: "cream" | "red" }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    gsap.fromTo(
      element.firstElementChild,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: "none",
        // Absolute scroll positions, not a trigger element: a documentElement
        // trigger from "top top" to "bottom bottom" resolves to a degenerate
        // range and never updates.
        scrollTrigger: { start: 0, end: "max", scrub: 0.5 },
      },
    );
  });

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-[6%] mx-auto aspect-[2000/833] w-[min(140%,110rem)] max-w-none"
        style={{
          backgroundColor: "var(--color-ink)",
          opacity: DRAGON_STRENGTH[tone],
          maskImage: "url(/artwork/soga-nichokuan-dragon-ink.webp)",
          WebkitMaskImage: "url(/artwork/soga-nichokuan-dragon-ink.webp)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
}
