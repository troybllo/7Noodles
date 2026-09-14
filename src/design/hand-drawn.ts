/**
 * Geometry for lines that look drawn by hand.
 *
 * A vector curve through exact points reads as software. A pen wanders: each
 * point lands a little off where it was aimed, and the stroke between them
 * still flows. So the points are nudged by a seeded amount, and a smooth curve
 * is passed through where they landed.
 *
 * Seeded rather than random, so a drawing is identical on the server and in
 * the browser, and on every render.
 */

export type Point = readonly [number, number];

/** Park–Miller; small, deterministic and plenty for jitter. */
export function seeded(seed: number): () => number {
  let state = Math.max(1, Math.floor(seed)) % 2147483647;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * A smooth path through `points`, each moved by up to `wobble` in any
 * direction. Catmull–Rom through the moved points, written as cubic Béziers.
 */
export function roughPath(
  points: readonly Point[],
  { seed, wobble = 1.5 }: { seed: number; wobble?: number },
): string {
  const [first] = points;
  if (!first) return "";

  const rand = seeded(seed);
  const moved = points.map(([x, y]): Point => {
    const angle = rand() * Math.PI * 2;
    const distance = rand() * wobble;
    return [x + Math.cos(angle) * distance, y + Math.sin(angle) * distance];
  });

  const [start] = moved as [Point, ...Point[]];
  let d = `M ${round(start[0])} ${round(start[1])}`;

  for (let i = 0; i < moved.length - 1; i += 1) {
    const p0 = moved[i - 1] ?? moved[i]!;
    const p1 = moved[i]!;
    const p2 = moved[i + 1]!;
    const p3 = moved[i + 2] ?? p2;

    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${round(c1[0])} ${round(c1[1])}, ${round(c2[0])} ${round(c2[1])}, ${round(p2[0])} ${round(p2[1])}`;
  }

  return d;
}

/**
 * The two strokes of an arrowhead at the end of a line, pointing along the
 * direction from `before` to `tip`. Drawn as two separate flicks of the pen,
 * slightly unequal, as a hand would draw them.
 */
export function arrowHead(
  before: Point,
  tip: Point,
  { size = 10, seed }: { size?: number; seed: number },
): [string, string] {
  const rand = seeded(seed);
  const angle = Math.atan2(tip[1] - before[1], tip[0] - before[0]);
  const flick = (spread: number) => {
    const length = size * (0.85 + rand() * 0.3);
    const a = angle + Math.PI - spread;
    const end: Point = [tip[0] + Math.cos(a) * length, tip[1] + Math.sin(a) * length];
    return roughPath([tip, end], { seed: seed + Math.round(spread * 100), wobble: 0.6 });
  };
  return [flick(0.5 + rand() * 0.12), flick(-(0.5 + rand() * 0.12))];
}
