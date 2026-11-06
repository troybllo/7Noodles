/**
 * Generates /brushes/ink-bloom.png, the mask the page transition grows from
 * the point that was clicked (see globals.css). Seeded, so every run is
 * identical; the output is committed. Run with `pnpm brushes`.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const OUT_DIR = join(import.meta.dirname, "..", "public", "brushes");

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
  await mkdir(OUT_DIR, { recursive: true });
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

await buildBloom();
