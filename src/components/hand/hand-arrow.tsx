import { arrowHead, roughPath, type Point } from "@/design/hand-drawn";

type HandArrowProps = {
  /** The line, in viewBox units, from its tail to the point it aims at. */
  points: readonly Point[];
  /** The drawing's own coordinate space, as `[width, height]`. */
  size: readonly [number, number];
  seed: number;
  className?: string;
};

/**
 * An arrow drawn by hand: a wandering line and two flicks for the head.
 *
 * Strokes in `currentColor`. Every stroke carries `pathLength="1"` and
 * `data-draw`, so a parent's motion can draw it on by animating
 * `stroke-dashoffset` from 1 to 0; without motion it is simply drawn.
 */
export function HandArrow({ points, size, seed, className }: HandArrowProps) {
  const tip = points.at(-1);
  const before = points.at(-2);
  const [left, right] =
    tip && before ? arrowHead(before, tip, { seed, size: 11 }) : ["", ""];

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className ?? ""}`}
    >
      <path data-draw pathLength={1} d={roughPath(points, { seed, wobble: 1.8 })} />
      <path data-draw pathLength={1} d={left} />
      <path data-draw pathLength={1} d={right} />
    </svg>
  );
}
