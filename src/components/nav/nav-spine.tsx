import { buildLimb, buildSpine, SPINE_VIEWBOX } from "@/components/brand/spine-geometry";

type NavSpineProps = {
  nodes: number;
  /** Index of the node for the current page, or -1 when none matches. */
  activeIndex: number;
  className?: string;
};

/**
 * The strand itself.
 *
 * The viewBox is stretched vertically with `preserveAspectRatio="none"` so the
 * rail can be any height, and every stroke sets `vector-effect` so that
 * stretch never distorts its width. Because the stretch is linear, a node at
 * viewBox y maps to exactly that fraction of the rail, which is what lets the
 * HTML labels be positioned with plain percentages and still land on the
 * strand.
 *
 * The progress strand is a second copy of the same path, drawn over the first
 * and revealed by the scroll timeline in site-nav.
 */
export function NavSpine({ nodes, activeIndex, className }: NavSpineProps) {
  const main = buildSpine({ nodes });
  const siblingA = buildSpine({ nodes, amplitude: 13, phase: 1 });
  const siblingB = buildSpine({ nodes, amplitude: 25, phase: 3 });

  return (
    <svg
      viewBox={`0 0 ${SPINE_VIEWBOX.width} ${SPINE_VIEWBOX.height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g vectorEffect="non-scaling-stroke" stroke="var(--color-agar)" fill="none">
        <path
          d={siblingA.d}
          strokeWidth={1.8}
          opacity={0.5}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={siblingB.d}
          strokeWidth={1.4}
          opacity={0.32}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      <path
        d={main.d}
        stroke="var(--color-ink)"
        strokeWidth={3.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      <path
        data-spine-progress
        d={main.d}
        stroke="var(--color-peach)"
        strokeWidth={3.5}
        strokeLinecap="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />

      {main.nodes.map((node, index) => (
        <path
          key={node.y}
          data-spine-limb={index}
          d={buildLimb(node)}
          stroke={index === activeIndex ? "var(--color-peach)" : "var(--color-agar)"}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
