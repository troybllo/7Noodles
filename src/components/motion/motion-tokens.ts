/**
 * GSAP's side of the motion tokens in globals.css, so scripted and CSS motion
 * share one set of curves and timings.
 */

export const EASE = {
  /** --ease-out-expo: arrivals, reveals. */
  out: "expo.out",
  /** --ease-out-soft: fills and fades that settle. */
  soft: "power2.out",
  /** --ease-in-out-quart: things that move across and stop. */
  inOut: "power3.inOut",
  /** Departures. */
  in: "power2.in",
  /** A stamp landing. */
  pop: "back.out(2.2)",
  /** A print pressed onto the page: a softer overshoot. */
  land: "back.out(1.4)",
  /** Lenis takes a function: the same expo curve. */
  lenis: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;

/** Seconds. */
export const DURATION = {
  /** --duration-fast */
  fast: 0.16,
  /** --duration-base */
  base: 0.32,
  /** --duration-slow */
  slow: 0.64,
  /** A stamp landing. */
  stamp: 0.45,
  /** --duration-settle: something coming to rest. */
  settle: 0.7,
  /** --duration-reveal: a photo opening, a heading rising. */
  reveal: 1.1,
  /** A photograph settling from a slight zoom. */
  zoom: 1.8,
  /** A line drawing itself on. */
  draw: 1.6,
} as const;
