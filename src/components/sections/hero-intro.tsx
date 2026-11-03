"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero's arrival, played once when the site first loads.
 *
 *   Each word of the name rises out of its own line.
 *   The photographs settle from a slight zoom, one after the other.
 *   恰小面 is stamped down a character at a time, then the panda seal lands
 *   with a turn, and the row of links fades up.
 *
 * The markup renders its finished state, which is what stays under reduced
 * motion, where this setup never runs. Each tween applies its starting state
 * immediately, so pieces waiting their turn are hidden rather than showing and
 * then jumping back.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const q = gsap.utils.selector(element);

    gsap
      .timeline({ defaults: { immediateRender: true } })
      .fromTo(
        q("[data-rise]"),
        { yPercent: 105 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 },
        0.1,
      )
      // The photographs are never hidden — they are the page's largest
      // paint, and hiding them until this runs would hold that paint back on
      // a slow phone by seconds. They only settle from a slight zoom.
      .fromTo(
        q("[data-photo] img"),
        { scale: 1.12 },
        { scale: 1, duration: 1.8, ease: "expo.out", stagger: 0.15 },
        0,
      )
      .fromTo(
        q("[data-stamp]"),
        { opacity: 0, scale: 1.4 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)", stagger: 0.12 },
        1.1,
      )
      .fromTo(
        q("[data-seal]"),
        { opacity: 0, scale: 1.6, rotate: -24 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.4)" },
        1.5,
      )
      .fromTo(
        q("[data-row]"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        1.4,
      );
  });

  return <div ref={scope}>{children}</div>;
}
