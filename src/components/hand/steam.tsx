import { roughPath } from "@/design/hand-drawn";

const WISPS = [
  { seed: 3, x: 30, delay: 0, duration: 5.2 },
  { seed: 11, x: 55, delay: 1.7, duration: 6.1 },
  { seed: 19, x: 78, delay: 3.1, duration: 5.6 },
] as const;

/**
 * Steam rising off a hot bowl: soft, blurred wisps that curl upward and fade.
 *
 * Each wisp loops on its own timing (`animate-steam`, a transform and opacity
 * keyframe on the compositor). Under reduced motion each loop runs once, instantly,
 * and ends faded out, so the steam is simply not shown.
 */
export function Steam({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 120"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={`overflow-visible ${className ?? ""}`}
      style={style}
    >
      {WISPS.map((wisp) => (
        <path
          key={wisp.seed}
          d={roughPath(
            [
              [wisp.x, 118],
              [wisp.x - 9, 90],
              [wisp.x + 8, 62],
              [wisp.x - 7, 34],
              [wisp.x + 4, 6],
            ],
            { seed: wisp.seed, wobble: 3 },
          )}
          strokeWidth={7}
          className="animate-steam origin-bottom blur-[3px]"
          style={{
            animationDelay: `${wisp.delay}s`,
            animationDuration: `${wisp.duration}s`,
          }}
        />
      ))}
    </svg>
  );
}
