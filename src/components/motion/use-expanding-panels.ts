"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGsap } from "./use-gsap";
import { DURATION, EASE } from "@/components/motion/motion-tokens";
import { useReducedMotion } from "./use-reduced-motion";

/** The accordion only exists from this width up. Below it panels stack. */
export const ACCORDION_QUERY = "(min-width: 48rem)";

type Options = {
  /** Columns the open panel takes. */
  openGrow?: number;
  /** Columns each closed panel takes. */
  closedGrow?: number;
  /** Panel index open before anything is hovered. */
  initial?: number;
  /**
   * When set, the panels enter equal at this grow value, hold, then settle
   * into the open/closed split. Omit for panels that simply start settled.
   */
  entrance?: { from: number; hold: number; settle: number };
};

/**
 * Expanding panels: hovering or focusing one widens it. Tweens `flex-grow`
 * rather than scaling, which would distort the photographs; each panel's
 * `contain: layout paint` keeps the relayout local.
 */
export function useExpandingPanels<T extends HTMLElement = HTMLLIElement>(
  count: number,
  { openGrow = 4, closedGrow = 1, initial = 0, entrance }: Options = {},
) {
  const [open, setOpen] = useState(initial);
  const reduced = useReducedMotion();
  const panels = useRef<(T | null)[]>([]);

  const setOpenPanel = (index: number) => {
    setOpen(index);
    if (reduced || !window.matchMedia(ACCORDION_QUERY).matches) return;

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      gsap.to(panel, {
        flexGrow: i === index ? openGrow : closedGrow,
        duration: DURATION.settle,
        ease: EASE.inOut,
        overwrite: "auto",
      });
    });
  };

  const trackRef = useGsap<HTMLUListElement>(
    ({ gsap: g, scope: element }) => {
      if (!entrance) return;

      const media = g.matchMedia();

      media.add(ACCORDION_QUERY, () => {
        /*
         * The opening state is the point of the shot: equal panels, held long
         * enough to register as a set, before one wins. Settling straight out
         * of it reads as a glitch rather than a decision.
         */
        const items = gsap.utils.toArray<HTMLElement>(element.children);

        g.timeline({
          scrollTrigger: { trigger: element, start: "top 78%", once: true },
        })
          .fromTo(
            items,
            { flexGrow: entrance.from },
            { flexGrow: entrance.from, duration: entrance.hold },
          )
          .to(items, {
            flexGrow: (i: number) => (i === initial ? openGrow : closedGrow),
            duration: entrance.settle,
            ease: EASE.inOut,
          });
      });

      return () => media.revert();
    },
    [count],
  );

  /**
   * Props every panel needs. The zero flex-basis is scoped to the accordion's
   * breakpoint: below it, panels stack and a zero basis would collapse them.
   */
  const panelProps = (index: number) => ({
    ref: (node: T | null) => {
      panels.current[index] = node;
    },
    className: "md:basis-0",
    style: {
      flexGrow: index === open ? openGrow : closedGrow,
      contain: "layout paint" as const,
    },
    onMouseEnter: () => setOpenPanel(index),
  });

  return { open, setOpenPanel, trackRef, panelProps };
}
