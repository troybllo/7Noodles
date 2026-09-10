import { BLOSSOMS, BRANCH_VIEWBOX, LIMBS, PETALS } from "./branch-geometry";

type BranchProps = {
  className?: string;
  /** Colour of the woody limbs. Defaults to the ink token. */
  limbColor?: string;
  /** Colour of the blossom clusters. Defaults to peach. */
  blossomColor?: string;
};

/**
 * Renders the branch fully grown. Animation is applied by the parent, which
 * targets `[data-limb]` and `[data-blossom]`, so the static render stays the
 * finished state and the component works with no JavaScript at all.
 */
export function Branch({
  className,
  limbColor = "var(--color-ink)",
  blossomColor = "var(--color-peach)",
}: BranchProps) {
  return (
    <svg
      viewBox={`0 0 ${BRANCH_VIEWBOX.width} ${BRANCH_VIEWBOX.height}`}
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke={limbColor} strokeLinejoin="round">
        {LIMBS.map((limb, index) => (
          <path
            key={limb.d}
            d={limb.d}
            pathLength={1}
            strokeWidth={limb.width}
            strokeLinecap={limb.cap}
            data-limb={index}
          />
        ))}
      </g>

      <g fill={blossomColor}>
        {BLOSSOMS.map((blossom) => (
          <g
            key={`${blossom.x}-${blossom.y}`}
            data-blossom={blossom.limb}
            style={{ transformOrigin: `${blossom.x}px ${blossom.y}px` }}
          >
            {PETALS.map((petal) => (
              <circle
                key={`${petal.dx}-${petal.dy}`}
                cx={blossom.x + petal.dx * blossom.r * 0.52}
                cy={blossom.y + petal.dy * blossom.r * 0.52}
                r={blossom.r * 0.42}
              />
            ))}
            <circle
              cx={blossom.x}
              cy={blossom.y}
              r={blossom.r * 0.3}
              fill="var(--color-lantern)"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
