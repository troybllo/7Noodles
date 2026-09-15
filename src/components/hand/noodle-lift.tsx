import { roughPath, seeded, type Point } from "@/design/hand-drawn";

const WIDTH = 400;
const HEIGHT = 600;

/** A chopstick entering from the right, tapering to a rounded tip at x = 96. */
function chopstick(tipY: number, endY: number, seed: number): string {
  const middle = (tipY + endY) / 2;
  const outline: Point[] = [
    [400, endY - 7],
    [260, middle - 5],
    [96, tipY - 4],
    [96, tipY + 4],
    [260, middle + 6],
    [400, endY + 8],
  ];
  const tip = `M 96 ${tipY - 4} C 88 ${tipY - 4}, 88 ${tipY + 4}, 96 ${tipY + 4}`;
  return `${roughPath(outline, { seed, wobble: 0.6 })} ${tip}`;
}

type Strand = { key: string; d: string; width: number };

/**
 * The noodles: each strand hangs over the sticks, arcs across them and falls in
 * a long uneven sway, a few swinging out into a loop on the way down. Thicker
 * strands are drawn as a tube, the same line again a few pixels over.
 */
function strands(): Strand[] {
  const rand = seeded(88);
  const out: Strand[] = [];

  for (let i = 0; i < 13; i += 1) {
    const x = 110 + i * 14 + (rand() - 0.5) * 12;
    const y = 118 + (x - 96) * 0.06;
    const length = 300 + rand() * 230;
    const drift = (rand() - 0.5) * 60;

    const points: Point[] = [
      [x - 14 + rand() * 6, y + 34 + rand() * 30],
      [x - 8, y - 2],
      [x + 2, y - 18 - rand() * 8],
      [x + 12, y + 4],
    ];
    for (let step = 1; step <= 5; step += 1) {
      const t = step / 5;
      points.push([
        x + 12 + drift * t + Math.sin(t * 3 + i) * (10 + rand() * 12),
        y + 20 + length * t,
      ]);
    }
    if (rand() > 0.7) {
      const at = 2 + Math.floor(rand() * 2);
      const [lx, ly] = points[at + 3] ?? [x, y];
      points.splice(
        at + 4,
        0,
        [lx + 46, ly + 46],
        [lx + 40, ly + 112],
        [lx - 6, ly + 104],
        [lx - 14, ly + 60],
        [lx + 8, ly + 40],
      );
    }

    const width = 1.8 + rand() * 0.8;
    const tube = rand() > 0.45;
    const seed = 400 + i;
    out.push({ key: `${i}`, d: roughPath(points, { seed, wobble: 2 }), width });
    if (tube) {
      out.push({
        key: `${i}-tube`,
        d: roughPath(
          points.map(([px, py]) => [px + 6, py] as const),
          { seed, wobble: 2 },
        ),
        width,
      });
    }
  }

  return out;
}

const STRANDS = strands();

/**
 * Noodles lifted on chopsticks, drawn in a single colour of line — an original
 * drawing in the manner of a line-art food poster.
 *
 * Every stroke is seeded, so the drawing is identical on the server and in the
 * browser, and every stroke carries `data-draw` and `pathLength="1"`, so a
 * `DrawOn` parent can draw it on. Lines are `currentColor`; the sticks are
 * filled with `--noodle-ground` so they sit in front of the strands.
 */
export function NoodleLift({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className ?? ""}`}
    >
      {STRANDS.map((strand) => (
        <path
          key={strand.key}
          data-draw
          pathLength={1}
          d={strand.d}
          strokeWidth={strand.width}
        />
      ))}
      <path
        data-draw
        pathLength={1}
        d={chopstick(112, 60, 7)}
        strokeWidth={2.4}
        style={{ fill: "var(--noodle-ground, transparent)" }}
      />
      <path
        data-draw
        pathLength={1}
        d={chopstick(128, 84, 9)}
        strokeWidth={2.4}
        style={{ fill: "var(--noodle-ground, transparent)" }}
      />
    </svg>
  );
}
