import { roughPath } from "@/design/hand-drawn";

/**
 * A quick pen stroke under a word, slightly uneven and trailing upward, as a
 * hand underlines.
 *
 * Stretches to its container's width. `drawn` shows it; otherwise it stays
 * hidden until an ancestor with the `group` class is hovered or focused, when
 * it draws itself on from left to right.
 */
export function HandUnderline({
  seed,
  drawn = false,
  className,
}: {
  seed: number;
  drawn?: boolean;
  className?: string;
}) {
  const d = roughPath(
    [
      [2, 7],
      [30, 5.5],
      [62, 6.5],
      [98, 3.5],
    ],
    { seed, wobble: 1.2 },
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={`overflow-visible ${className ?? ""}`}
    >
      <path
        d={d}
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        className={`transition-[stroke-dashoffset] duration-[--duration-slow] ease-[--ease-out-expo] [stroke-dasharray:1] ${
          drawn
            ? "[stroke-dashoffset:0]"
            : "[stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
        }`}
      />
    </svg>
  );
}
