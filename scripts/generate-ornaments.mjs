/**
 * Generates the painted lantern used on the menu pages and in the footer.
 *
 * A lantern painted in loose dry brush, from the same stroke model as the
 * brush masks (scripts/lib/brush-stroke.mjs): bands of red laid across the
 * sphere, ink caps, and a pointed ink loop to hang it by.
 *
 * Run with `pnpm ornaments`. Output is committed; the seeds are fixed, so the
 * output is identical on every run.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { filters, outline } from "./lib/brush-stroke.mjs";

const OUT_DIR = join(import.meta.dirname, "..", "public", "ornaments");

/**
 * A lantern painted in loose dry brush: bands of red laid across the sphere,
 * ink caps, and a pointed ink loop to hang it by.
 *
 * A stand-in, in the manner of the owner-approved lantern painting by Troy
 * Bello, until that artwork arrives as a file without its poster lettering.
 * Replace this file with it then; nothing else changes.
 */
function paintedLantern() {
  const width = 1000;
  const height = 1250;
  const cx = 500;
  const cy = 740;
  const rx = 330;
  const ry = 285;
  const reds = ["#d6302a", "#e24a3c", "#c42a22", "#dd3b31", "#cf2f27"];
  const ink = "#171313";

  let seed = 100;
  const defs = [];
  const shapes = [];
  const stroke = (curve, size, color, opacity = 1) => {
    seed += 7;
    defs.push(filters(seed));
    shapes.push(
      `<path d="${outline(curve, size)}" fill="${color}" opacity="${opacity}" filter="url(#dry${seed})"/>`,
      `<path d="${outline(curve, size, { inset: 0.7 })}" fill="${color}" opacity="${opacity * 0.95}" filter="url(#core${seed})"/>`,
    );
  };

  // The body: ten passes of the brush, each following the sphere's curve at
  // its height and alternating direction, as a painter works down a shape.
  for (let i = 0; i < 10; i += 1) {
    const y = cy - ry + 40 + i * ((2 * ry - 80) / 9);
    const k = Math.max(0.18, Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)));
    const half = rx * k;
    const sag = 22 * k;
    const across = [
      [cx - half - 12, y - 6],
      [cx - half * 0.35, y + sag],
      [cx + half * 0.35, y + sag],
      [cx + half + 14, y - 10],
    ];
    stroke(
      i % 2 === 0 ? across : [...across].reverse(),
      84 + 10 * k,
      reds[i % reds.length],
      0.92,
    );
  }

  stroke(
    [
      [cx - 170, cy - ry - 18],
      [cx - 60, cy - ry - 40],
      [cx + 70, cy - ry - 42],
      [cx + 175, cy - ry - 20],
    ],
    74,
    ink,
  );
  stroke(
    [
      [cx - 150, cy + ry + 22],
      [cx - 50, cy + ry + 40],
      [cx + 60, cy + ry + 42],
      [cx + 150, cy + ry + 24],
    ],
    64,
    ink,
  );
  stroke(
    [
      [cx - 160, cy - ry - 34],
      [cx - 120, cy - 460],
      [cx - 50, cy - 560],
      [cx + 10, cy - 640],
    ],
    18,
    ink,
  );
  stroke(
    [
      [cx + 10, cy - 640],
      [cx + 70, cy - 560],
      [cx + 130, cy - 450],
      [cx + 165, cy - ry - 34],
    ],
    17,
    ink,
  );
  stroke(
    [
      [cx + 10, cy - 640],
      [cx + 6, cy - 690],
      [cx + 14, cy - 740],
      [cx + 4, cy - 800],
    ],
    12,
    ink,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${defs.join("")}</defs>
  <g transform="rotate(-14 ${cx} ${cy})">${shapes.join("")}</g>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

{
  const png = new Resvg(paintedLantern(), { fitTo: { mode: "width", value: 700 } })
    .render()
    .asPng();
  await writeFile(join(OUT_DIR, "lantern-painted.png"), png);
  console.log(`lantern-painted: 700x875, ${(png.length / 1024).toFixed(1)} KB`);
}
