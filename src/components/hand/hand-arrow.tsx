import { arrowHead, roughPath, type Point } from "@/design/hand-drawn";

type HandArrowProps = {
  /** The line, in viewBox units, from its tail to the point it aims at. */
  points: readonly Point[];
  /** The drawing's own coordinate space, as `[width, height]`. */
  size: readonly [number, number];
  seed: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * An arrow drawn in chalk, after the hero mockup: the line gone over twice with
 * a light hand, so it doubles and frays, ending in an open triangular head
 * lightly filled in.
 *
 * Strokes in `currentColor`. Every stroke carries `pathLength="1"` and
 * `data-draw`, so a parent's motion can draw it on by animating
 * `stroke-dashoffset` from 1 to 0; without motion it is simply drawn.
 */
export function HandArrow({ points, size, seed, className, style }: HandArrowProps) {
  const tip = points.at(-1);
  const before = points.at(-2);
  const [left, right] =
    tip && before ? arrowHead(before, tip, { seed, size: 12 }) : ["", ""];

  // The head as a closed, lightly filled triangle between the two flicks.
  const head =
    tip && before
      ? (() => {
          const angle = Math.atan2(tip[1] - before[1], tip[0] - before[0]);
          const corner = (spread: number): Point => [
            tip[0] + Math.cos(angle + Math.PI - spread) * 12,
            tip[1] + Math.sin(angle + Math.PI - spread) * 12,
          ];
          const [a, b] = [corner(0.52), corner(-0.52)];
          return `M ${tip[0]} ${tip[1]} L ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)} Z`;
        })()
      : "";

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className ?? ""}`}
      style={style}
    >
      <path
        data-draw
        d={head}
        fill="currentColor"
        fillOpacity={0.3}
        strokeWidth={1.1}
        pathLength={1}
      />
      <path
        data-draw
        pathLength={1}
        strokeWidth={1.5}
        d={roughPath(points, { seed, wobble: 1.4 })}
      />
      <path
        data-draw
        pathLength={1}
        strokeWidth={0.9}
        opacity={0.75}
        d={roughPath(
          points.map(([x, y]) => [x + 1.6, y - 1] as const),
          { seed: seed + 9, wobble: 1.6 },
        )}
      />
      <path data-draw pathLength={1} strokeWidth={1.5} d={left} />
      <path data-draw pathLength={1} strokeWidth={1.5} d={right} />
    </svg>
  );
}
