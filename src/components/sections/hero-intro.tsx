"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero's arrival, played once on load.
 *
 * The letters of the name are stamped onto the paper one after another, the
 * bowl is set down with a small turn, the notes are drawn on and the rest
 * rises into place. As the page scrolls the chilli slices drift at their own
 * depths.
 *
 * The markup renders its finished state, which is what stays under reduced
 * motion, where this setup never runs. Each tween is a `fromTo` that applies
 * its starting state immediately, so pieces waiting their turn in the timeline
 * are hidden rather than showing and then jumping back.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const q = gsap.utils.selector(element);
    const intro = gsap.timeline({ defaults: { immediateRender: true } });

    intro
      .fromTo(
        q("[data-stamp]"),
        { opacity: 0, scale: 1.35, rotate: -6 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: "power4.out",
          stagger: 0.07,
        },
      )
      .fromTo(
        q("[data-bowl]"),
        { opacity: 0, scale: 0.9, rotate: -14 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: "expo.out" },
        0.2,
      )
      .fromTo(
        q("[data-rise]"),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
        0.45,
      )
      .fromTo(
        q("[data-draw]"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: "power2.inOut",
          stagger: 0.12,
        },
        0.9,
      );

    for (const slice of q("[data-parallax]")) {
      const depth = Number(slice.getAttribute("data-parallax") ?? 1);
      gsap.to(slice, {
        yPercent: -60 * depth,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }
  });

  return <div ref={scope}>{children}</div>;
}
