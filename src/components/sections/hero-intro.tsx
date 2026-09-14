"use client";

import type { ReactNode } from "react";
import { useGsap } from "@/components/motion/use-gsap";

/**
 * The hero's arrival, played once when the site first loads.
 *
 *   The 7 slides in from the left and NOODLES from the right, meeting where
 *   the mockup sets them, and land with a small stamp.
 *   The bowl drops onto the paper with a turn, and the chilli slices scatter
 *   out from under it to their places.
 *   The tagline is written on line by line, the brush characters are laid
 *   down, the button pops up, and the chalk arrows draw into the bowl.
 *
 * The markup renders its finished state, which is what stays under reduced
 * motion, where this setup never runs. Each tween applies its starting state
 * immediately, so pieces waiting their turn are hidden rather than showing and
 * then jumping back.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope: element }) => {
    const q = gsap.utils.selector(element);
    const travel = window.innerWidth * 0.75;
    const bowlBox = q("[data-bowl]")[0]?.getBoundingClientRect();

    /** How far a slice must move to sit at the middle of the bowl. */
    const toBowl = (axis: "x" | "y") => (_: number, target: Element) => {
      if (!bowlBox) return 0;
      const box = target.getBoundingClientRect();
      return axis === "x"
        ? bowlBox.left + bowlBox.width / 2 - (box.left + box.width / 2)
        : bowlBox.top + bowlBox.height / 2 - (box.top + box.height / 2);
    };

    gsap
      .timeline({ defaults: { immediateRender: true } })
      .fromTo(
        document.querySelector("[data-nav-bar]"),
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0,
      )
      .fromTo(
        q('[data-slide="left"]'),
        { x: -travel, rotate: -12, opacity: 0 },
        { x: 0, rotate: 0, opacity: 1, duration: 1.15, ease: "expo.out" },
        0.1,
      )
      .fromTo(
        q('[data-slide="right"]'),
        { x: travel, rotate: 8, opacity: 0 },
        { x: 0, rotate: 0, opacity: 1, duration: 1.15, ease: "expo.out" },
        0.18,
      )
      // The landing: a quick press of the stamp as the two halves meet.
      .fromTo(
        q("h1"),
        { scale: 1 },
        { scale: 1.035, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 },
        0.82,
      )
      .fromTo(
        q("[data-bowl]"),
        { opacity: 0, y: -40, rotate: -28, scale: 0.82 },
        { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 1.3, ease: "expo.out" },
        0.35,
      )
      .fromTo(
        q("[data-brush]"),
        { opacity: 0, y: -14, scale: 1.25 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.16 },
        0.85,
      )
      .fromTo(
        q("[data-write]"),
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.85,
          ease: "power2.inOut",
          stagger: 0.32,
        },
        1.0,
      )
      .fromTo(
        q("[data-pop]"),
        { opacity: 0, scale: 0.85, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2.2)" },
        1.55,
      )
      .fromTo(
        q("[data-chili]"),
        { scale: 0.2, x: toBowl("x"), y: toBowl("y"), autoAlpha: 0 },
        {
          scale: 1,
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "back.out(1.4)",
          stagger: 0.035,
        },
        1.1,
      )
      .fromTo(
        q("[data-draw]"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut", stagger: 0.06 },
        1.7,
      )
      .fromTo(
        q("[data-note]"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.2 },
        1.8,
      );
  });

  return <div ref={scope}>{children}</div>;
}
