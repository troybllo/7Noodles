/**
 * Generates the brush-stroke alpha masks.
 *
 * These are windows onto photography: the shape is the mask, the picture shows
 * through it. They are generated rather than licensed — the references the
 * design came from are stock (one still carries its watermark), and generating
 * them means the shape, direction and weight can be tuned per placement.
 *
 * Run with `pnpm brushes`. Output is committed, so a clean checkout and CI
 * never regenerate assets.
 *
 * Two things matter for these to read as brush rather than as blobs:
 *
 *   The outline is built from a centreline offset by a width profile, not by
 *   stroking a path. A stroked path carries one width for its whole length and
 *   always reads as a ribbon; a real stroke is fat through the middle and
 *   tapers away at the ends.
 *
 *   The texture is two layers. A dry layer whose bristle streaks run ALONG the
 *   stroke — turbulence at low X and high Y frequency — thresholded into gaps,
 *   with a denser inset core laid over it. With only the dry layer the whole
 *   stroke reads as scratchy; with only the core it reads as a solid shape.
 *
 * Seeds are fixed, so the output is identical on every run.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { filters, outline } from "./lib/brush-stroke.mjs";

const OUT_DIR = join(import.meta.dirname, "..", "public", "brushes");

/**
 * Each brush is a small cluster of strokes rather than one, which is what the
 * references are: a mass built from two or three passes of the same loaded
 * brush, not a single swipe.
 */
const BRUSHES = [
  {
    name: "story-right",
    width: 1280,
    height: 1600,
    // Roughly parallel diagonals at slightly different angles, overlapping into
    // a band. Strokes that cross near a right angle read as a cross-out mark
    // rather than as paint.
    strokes: [
      {
        curve: [
          [150, 1240],
          [480, 990],
          [770, 690],
          [1090, 420],
        ],
        w: 310,
        seed: 11,
      },
      {
        curve: [
          [110, 980],
          [460, 790],
          [800, 460],
          [1130, 250],
        ],
        w: 250,
        seed: 21,
      },
      {
        curve: [
          [210, 1430],
          [560, 1150],
          [840, 930],
          [1160, 640],
        ],
        w: 280,
        seed: 31,
      },
      {
        curve: [
          [390, 1330],
          [520, 1060],
          [640, 810],
          [780, 540],
        ],
        w: 110,
        seed: 43,
      },
    ],
  },
  {
    name: "story-left",
    width: 1200,
    height: 900,
    strokes: [
      {
        curve: [
          [90, 560],
          [400, 330],
          [760, 600],
          [1120, 360],
        ],
        w: 285,
        seed: 41,
      },
      {
        curve: [
          [140, 770],
          [470, 570],
          [820, 800],
          [1090, 590],
        ],
        w: 205,
        seed: 51,
      },
    ],
  },
  {
    name: "underline",
    width: 900,
    height: 190,
    strokes: [
      {
        curve: [
          [40, 108],
          [260, 74],
          [600, 128],
          [860, 86],
        ],
        w: 78,
        seed: 61,
      },
    ],
  },
];

async function build({ name, width, height, strokes }) {
  const defs = strokes.map((s) => filters(s.seed)).join("");
  const shapes = strokes
    .map(
      (s) => `
    <path d="${outline(s.curve, s.w)}" fill="#fff" filter="url(#dry${s.seed})"/>
    <path d="${outline(s.curve, s.w, { inset: 0.72 })}" fill="#fff" filter="url(#core${s.seed})" opacity="0.95"/>`,
    )
    .join("");

  // White on transparent: CSS masks read the alpha channel.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${defs}</defs>
  ${shapes}
</svg>`;

  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, `${name}.png`), png);
  console.log(
    `${name}: ${width}x${height}, ${strokes.length} strokes, ${(png.length / 1024).toFixed(1)} KB`,
  );
}

/**
 * The ink bloom that reveals each new page during navigation.
 *
 * A disc of ink with a torn, wet edge and a scatter of droplets thrown ahead
 * of it. The page transition grows it from the point that was clicked until
 * its solid centre covers the screen, so only the edge is ever seen moving:
 * the centre must be fully opaque, and wide — the disc reaches 36% of the
 * image from its centre, and the CSS sizes the mask so that radius clears the
 * viewport's diagonal from any corner.
 */
async function buildBloom() {
  const size = 1024;
  const centre = size / 2;
  let state = 97;
  const random = () => (state = (state * 16807) % 2147483647) / 2147483647;

  const droplets = Array.from({ length: 16 }, () => {
    const angle = random() * Math.PI * 2;
    const distance = 392 + random() * 86;
    const radius = 6 + random() * 30;
    return `<circle cx="${(centre + Math.cos(angle) * distance).toFixed(1)}" cy="${(centre + Math.sin(angle) * distance).toFixed(1)}" r="${radius.toFixed(1)}"/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="wet" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" result="warp"/>
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="70" xChannelSelector="R" yChannelSelector="G" result="torn"/>
      <feGaussianBlur in="torn" stdDeviation="1.6"/>
    </filter>
  </defs>
  <g fill="#fff" filter="url(#wet)">
    <circle cx="${centre}" cy="${centre}" r="368"/>
    ${droplets}
  </g>
</svg>`;

  const png = new Resvg(svg).render().asPng();
  await writeFile(join(OUT_DIR, "ink-bloom.png"), png);
  console.log(`ink-bloom: ${size}x${size}, ${(png.length / 1024).toFixed(1)} KB`);
}

for (const brush of BRUSHES) {
  await build(brush);
}
await buildBloom();
