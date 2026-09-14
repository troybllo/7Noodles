"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGsap } from "./use-gsap";
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
 * The expanding-panel mechanic behind the showcase.
 *
 * Tweens `flex-grow` rather than a transform. `scaleX` would distort the
 * photography and the type, and counter-scaling the children back is fragile.
 * A handful of panels animating a bounded layout is the cheaper trade, and
 * `contain: layout paint` on each panel — applied by the caller — stops the
 * recalculation escaping its own subtree.
 *
 * Only the behaviour lives here. The two sections that use it look nothing
 * alike, so their markup stays their own.
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
        duration: 0.7,
        ease: "power3.inOut",
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
            ease: "power3.inOut",
          });
      });

      return () => media.revert();
    },
    [count],
  );

  /**
   * Props every panel needs, so a caller cannot forget the containment.
   *
   * The zero flex-basis that makes the grow values divide the row is a class
   * scoped to the accordion's breakpoint, not an inline style. Below it the
   * panels stack in a column whose height comes from its content, and a zero
   * basis there collapses every panel to nothing — which is how the showcase
   * once vanished on phones.
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
