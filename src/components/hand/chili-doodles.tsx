import { useId } from "react";
import { roughPath, seeded, type Point } from "@/design/hand-drawn";

const TILE = 420;

/** One chilli pod in outline: a curved, tapering body and a crooked stem. */
function pod(seed: number): string {
  const body: Point[] = [
    [0, 0],
    [14, 6],
    [30, 22],
    [40, 44],
    [42, 64],
    [36, 58],
    [26, 38],
    [12, 20],
    [-2, 9],
  ];
  const stem: Point[] = [
    [4, 2],
    [0, -8],
    [-8, -12],
  ];
  return `${roughPath(body, { seed, wobble: 1.4 })} ${roughPath(stem, { seed: seed + 1, wobble: 1 })}`;
}

/**
 * A faint all-over pattern of chillies drawn in outline, as in the hero
 * mockup's paper. Drawn once as an SVG pattern tile and repeated; the paths are
 * seeded, so the pattern is the same on the server and in the browser.
 *
 * Fills its positioned parent. Colour comes from `currentColor`, set low so it
 * reads as a printed texture rather than as content.
 */
export function ChiliDoodles({ className }: { className?: string }) {
  // useId output can contain characters that are not valid in a url() fragment.
  const id = `chili-doodles-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rand = seeded(73);
  const pods = Array.from({ length: 7 }, (_, index) => ({
    seed: 100 + index * 7,
    x: rand() * TILE,
    y: rand() * TILE,
    rotate: rand() * 360,
    scale: 0.8 + rand() * 0.5,
  }));

  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    >
      <defs>
        <pattern id={id} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
          {pods.map((p) =>
            // Each pod is drawn again one tile over wherever it would cross the
            // edge, so the pattern has no seams.
            [-TILE, 0, TILE].flatMap((ox) =>
              [-TILE, 0, TILE].map((oy) => (
                <path
                  key={`${p.seed}-${ox}-${oy}`}
                  d={pod(p.seed)}
                  transform={`translate(${p.x + ox} ${p.y + oy}) rotate(${p.rotate}) scale(${p.scale})`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )),
            ),
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
