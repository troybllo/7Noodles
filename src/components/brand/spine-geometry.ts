/**
 * The spine.
 *
 * A single continuous noodle running the left edge of every page, branching
 * toward each destination. It is the site's connective tissue and the literal
 * "tree structure" the client asked for, built from the thing the restaurant
 * actually sells rather than from a dragon or a cherry branch.
 *
 * The path is generated rather than hand-authored so the node positions and
 * the curve are guaranteed to agree: anchors sit exactly on the rail centre
 * line at every node, and the strand bulges alternately either side between
 * them. Hand-written control points drift out of agreement the moment the
 * number of nav items changes.
 *
 * Coordinates are a fixed viewBox that the rail stretches vertically with
 * `preserveAspectRatio="none"`. Strokes use `vector-effect="non-scaling-stroke"`
 * so that stretch never distorts their width.
 */

export const SPINE_VIEWBOX = { width: 100, height: 1000 } as const;

const CENTER_X = SPINE_VIEWBOX.width / 2;

export type SpineOptions = {
  /** How many nodes hang off the strand. */
  nodes: number;
  /** Horizontal bulge either side of centre, in viewBox units. */
  amplitude?: number;
  /** Phase offset in half-periods, used to fan sibling strands apart. */
  phase?: number;
};

/**
 * Per-segment multipliers applied to the bulge, so the strand is not a perfect
 * sine wave. Pulled noodles are not uniform, and the slight irregularity is
 * most of what stops this reading as a graph.
 *
 * Fixed rather than random: the path is generated during server rendering and
 * again on the client, and any disagreement between the two is a hydration
 * mismatch.
 */
const VARIANCE = [1, 0.82, 1.14, 0.9, 1.06, 0.78, 1.18, 0.94];

export type Spine = {
  d: string;
  /** Node centres, in viewBox units, sitting exactly on the strand. */
  nodes: { x: number; y: number }[];
};

/**
 * Builds a serpentine through `nodes + 1` evenly spaced anchors, all on the
 * centre line, bulging alternately right and left between them. Nodes are
 * placed on the interior anchors so the strand runs past the top and bottom
 * of the rail rather than terminating at the first and last item.
 */
export function buildSpine({ nodes, amplitude = 17, phase = 0 }: SpineOptions): Spine {
  const segments = nodes + 1;
  const step = SPINE_VIEWBOX.height / segments;

  let d = `M ${CENTER_X} 0`;

  for (let i = 0; i < segments; i += 1) {
    const yStart = i * step;
    const yEnd = yStart + step;
    // Alternating sign is what makes it read as a strand rather than an arc.
    const direction = (i + phase) % 2 === 0 ? 1 : -1;
    const wobble = VARIANCE[(i + phase) % VARIANCE.length] ?? 1;
    const bulge = CENTER_X + direction * amplitude * wobble;

    d += ` C ${bulge} ${yStart + step * 0.32} ${bulge} ${yEnd - step * 0.32} ${CENTER_X} ${yEnd}`;
  }

  return {
    d,
    nodes: Array.from({ length: nodes }, (_, i) => ({
      x: CENTER_X,
      y: (i + 1) * step,
    })),
  };
}

/**
 * A limb reaching from a node out toward the right edge of the rail, where the
 * label sits. Drawn as its own path so it can extend on hover independently of
 * the strand.
 */
export function buildLimb(node: { x: number; y: number }, reach = 34): string {
  const endX = node.x + reach;
  return `M ${node.x} ${node.y} C ${node.x + reach * 0.45} ${node.y} ${endX - reach * 0.3} ${node.y} ${endX} ${node.y}`;
}
