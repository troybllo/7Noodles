"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { CATEGORY_MOTIF, MOTIFS, VIEW_H, VIEW_W, type MotifKey } from "./margin-motifs";

/** Wide enough that each margin holds a drawing (~120px) without touching the menu. */
const WIDE = "(min-width: 1640px)";

/** The loop each drawing keeps up while shown. Rests under reduced motion (globals.css). */
const IDLE: Record<(typeof MOTIFS)[MotifKey]["idle"], string> = {
  sway: "origin-top motion-safe:animate-margin-sway",
  drift: "motion-safe:animate-margin-drift",
  rise: "origin-bottom motion-safe:animate-margin-rise",
  none: "",
};

const KEYS = Object.keys(MOTIFS) as MotifKey[];

function Side({ initial, mirrored }: { initial: MotifKey; mirrored?: boolean }) {
  return (
    <div
      className={`absolute inset-y-0 w-[calc((100%-1400px)/2)] ${mirrored ? "right-0 -scale-x-100" : "left-0"}`}
    >
      {/* Held in view while the page scrolls, and carried off with it at the
          foot, so it never floats over the footer. */}
      <div className="sticky top-0 h-svh pt-24 pb-8">
        <div
          data-sway
          className="text-brand relative mx-auto h-full w-[min(8rem,70%)] origin-top"
        >
          {KEYS.map((key) => {
            const motif = MOTIFS[key];
            const shown = key === initial;
            return (
              <svg
                key={key}
                data-motif={key}
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`absolute inset-0 h-full w-full overflow-visible ${IDLE[motif.idle]}`}
                // Only the starting drawing is visible in the server HTML;
                // the rest wait, fully drawn, to be faded in.
                style={{
                  opacity: shown ? 1 : 0,
                  visibility: shown ? "visible" : "hidden",
                }}
              >
                {motif.paths.map((path, i) => (
                  <path
                    key={i}
                    d={path.d}
                    pathLength={1}
                    strokeWidth={path.width ?? 2}
                    strokeOpacity={path.opacity ?? 1}
                  />
                ))}
              </svg>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Life in the menu's empty side margins: a drawing for whichever category is
 * being read — noodles on chopsticks for the xiaomian, a wok over flame for
 * the chef's specials, steam off a bowl for the soups, dumplings, ribbons,
 * skewers, chilies, peas, jelly — that hands over to the next as the reader
 * scrolls into it. The outgoing drawing un-draws as the incoming one draws
 * itself on.
 *
 * `category` fixes the drawing (a single category's page). Without it, the
 * category is the last of the menu's `section[id]`s whose top has passed the
 * middle of the screen.
 *
 * Built not to stutter: the hand-over is one GSAP timeline, killed and
 * restarted from wherever the strokes are if the reader moves on mid-way, so
 * fast scrolling never leaves two drawings half drawn. Nothing re-renders
 * React — the active drawing is tracked in a ref.
 *
 * Decoration only — hidden from assistive technology and the pointer — and
 * only on screens where the margins can hold it. Mount it as the first child
 * of a `relative` main whose content sits above it (`relative z-10`).
 */
export function MenuMargins({ category }: { category?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const initial: MotifKey = (category && CATEGORY_MOTIF[category]) || "noodles";
  const active = useRef<MotifKey>(initial);
  const handover = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !window.matchMedia(WIDE).matches) return;

    const groups = (key: MotifKey) =>
      element.querySelectorAll<SVGSVGElement>(`[data-motif="${key}"]`);
    const strokes = (key: MotifKey) =>
      element.querySelectorAll<SVGPathElement>(`[data-motif="${key}"] path`);

    const show = (next: MotifKey) => {
      if (next === active.current) return;
      const previous = active.current;
      active.current = next;
      handover.current?.kill();

      if (reduced) {
        KEYS.forEach((key) => gsap.set(groups(key), { autoAlpha: key === next ? 1 : 0 }));
        return;
      }

      const timeline = gsap.timeline();
      // Every drawing but the incoming one leaves — not only the last one, so
      // a hand-over cut short mid-way never strands a half-drawn drawing.
      KEYS.filter((key) => key !== next).forEach((key) => {
        timeline.to(
          strokes(key),
          {
            strokeDashoffset: 1,
            duration: key === previous ? 0.5 : 0.25,
            ease: "power2.in",
            stagger: 0.02,
          },
          0,
        );
        timeline.to(
          groups(key),
          { autoAlpha: 0, duration: 0.35, ease: "power1.in" },
          0.15,
        );
      });
      timeline.set(strokes(next), { strokeDasharray: 1 }, 0);
      timeline.to(groups(next), { autoAlpha: 1, duration: 0.2 }, 0.3);
      timeline.fromTo(
        strokes(next),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.06 },
        0.3,
      );
      handover.current = timeline;
    };

    // A fixed category: nothing to watch.
    if (category) return;

    // The category being read: the last one whose top has passed the middle
    // of the screen. Measured on every scroll frame rather than waiting for
    // an edge to cross a line, so a fast fling past a short category still
    // lands on the right drawing.
    const sections = [...document.querySelectorAll<HTMLElement>("section[id]")].filter(
      (section) => section.id in CATEGORY_MOTIF,
    );
    let frame = 0;
    const pick = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let current: HTMLElement | undefined;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= middle) current = section;
      }
      const key = CATEGORY_MOTIF[(current ?? sections[0])?.id ?? ""];
      if (key) show(key);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      handover.current?.kill();
    };
  }, [category, reduced]);

  // Lean towards the cursor, as something held up would swing.
  useEffect(() => {
    const element = root.current;
    if (!element || reduced || !window.matchMedia(WIDE).matches) return;
    const turns = [...element.querySelectorAll<HTMLElement>("[data-sway]")].map((sway) =>
      gsap.quickTo(sway, "rotation", { duration: 1.2, ease: "elastic.out(1, 0.4)" }),
    );
    const onMove = (event: PointerEvent) => {
      const lean = (event.clientX / window.innerWidth - 0.5) * 4;
      // The right side is mirrored, so it leans the other way to match.
      turns.forEach((turn, i) => turn(i === 0 ? lean : -lean));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden min-[1640px]:block"
    >
      <Side initial={initial} />
      <Side initial={initial} mirrored />
    </div>
  );
}
