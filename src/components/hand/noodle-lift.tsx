import { roughPath, seeded, type Point } from "@/design/hand-drawn";

const WIDTH = 400;
const HEIGHT = 600;

/** The fork's tines: four, pointing left, their tips at x = 100. */
const TINES = [0, 1, 2, 3].map((i) => ({ top: 102 + i * 10, bottom: 108 + i * 10 }));

/**
 * A fork entering from the right, rising gently to its handle end: one closed
 * outline, from the top of the handle round each tine and back.
 */
function fork(): string {
  let d = "M 400 64 L 222 110 C 208 113, 198 103, 184 102";
  for (const { top, bottom } of TINES) {
    d += ` L 106 ${top} Q 98 ${top + 3}, 106 ${bottom} L 178 ${bottom}`;
  }
  return `${d} L 184 138 C 198 137, 208 127, 222 124 L 400 84 Z`;
}

type Strand = { key: string; d: string; width: number };

/**
 * The noodles: each strand hangs over the tines, arcs across them and falls in
 * a long uneven sway, a few swinging out into a loop on the way down. Thicker
 * strands are drawn as a tube, the same line again a few pixels over.
 */
function strands(): Strand[] {
  const rand = seeded(88);
  const out: Strand[] = [];

  for (let i = 0; i < 13; i += 1) {
    const x = 104 + i * 6 + (rand() - 0.5) * 6;
    const y = 120;
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
 * Noodles lifted on a fork, in a single colour of line. Seeded, so the server
 * and browser draw the same thing; every stroke carries `data-draw` for a
 * `DrawOn` parent. The fork is filled with `--noodle-ground` so it sits in
 * front of the strands.
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
        d={fork()}
        strokeWidth={2.4}
        style={{ fill: "var(--noodle-ground, transparent)" }}
      />
    </svg>
  );
}
