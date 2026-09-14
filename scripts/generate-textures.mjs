/**
 * Generates the paper textures and painted chilli slices.
 *
 * Nothing here is photographed or licensed: every file is drawn from seeded
 * noise, so the output is identical on every run and owned outright.
 *
 * Paper is built as a height field of facets rather than from an SVG lighting
 * filter. Filter noise lit from one side reads as a uniform stipple; crumpled
 * paper is a set of flat planes, each tilted a little, meeting at creases. So:
 *
 *   Two layers of Voronoi facets on a torus (the tile wraps, so it repeats with
 *   no seam), each facet given a random tilt and shaded by a single light.
 *
 *   Shading blurred with a wrapping box blur until the planes soften into
 *   folds, while the crease lines are taken from the unblurred distance field,
 *   so they stay crisp — lit on one side of the fold and shadowed on the other.
 *
 *   A fine tooth multiplied over the top.
 *
 * Run with `pnpm textures`. Output is committed; CI never regenerates it.
 */

import { statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const OUT_DIR = join(import.meta.dirname, "..", "public", "textures");
const TILE = 1200;

/** Park–Miller, so every run draws the same facets. */
function random(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

/**
 * One layer of facets. Returns each pixel's shading under a light from the
 * upper left, and its distance to the nearest facet edge.
 */
function facets(count, seed, tilt) {
  const rand = random(seed);
  const cells = Math.ceil(Math.sqrt(count));
  const cell = TILE / cells;
  const grid = Array.from({ length: cells * cells }, () => []);

  for (let i = 0; i < count; i += 1) {
    const x = rand() * TILE;
    const y = rand() * TILE;
    const angle = rand() * Math.PI * 2;
    const lean = tilt * (0.3 + rand() * 0.7);
    const nx = Math.cos(angle) * lean;
    const ny = Math.sin(angle) * lean;
    const length = Math.hypot(nx, ny, 1);
    grid[Math.floor(y / cell) * cells + Math.floor(x / cell)].push({
      x,
      y,
      nx: nx / length,
      ny: ny / length,
      nz: 1 / length,
    });
  }

  const light = [-0.55, -0.62, 0.56];
  const lightLength = Math.hypot(...light);
  const [lx, ly, lz] = light.map((v) => v / lightLength);

  const shade = new Float32Array(TILE * TILE);
  const edge = new Float32Array(TILE * TILE);
  const half = TILE / 2;

  for (let y = 0; y < TILE; y += 1) {
    const cy = Math.floor(y / cell);
    for (let x = 0; x < TILE; x += 1) {
      const cx = Math.floor(x / cell);
      let nearest = Infinity;
      let second = Infinity;
      let facet = null;

      for (let oy = -2; oy <= 2; oy += 1) {
        for (let ox = -2; ox <= 2; ox += 1) {
          const gx = (cx + ox + cells) % cells;
          const gy = (cy + oy + cells) % cells;
          for (const point of grid[gy * cells + gx]) {
            let dx = Math.abs(point.x - x);
            let dy = Math.abs(point.y - y);
            if (dx > half) dx = TILE - dx;
            if (dy > half) dy = TILE - dy;
            const distance = dx * dx + dy * dy;
            if (distance < nearest) {
              second = nearest;
              nearest = distance;
              facet = point;
            } else if (distance < second) {
              second = distance;
            }
          }
        }
      }

      const index = y * TILE + x;
      shade[index] = facet.nx * lx + facet.ny * ly + facet.nz * lz;
      edge[index] = Math.sqrt(second) - Math.sqrt(nearest);
    }
  }

  return { shade, edge };
}

/** Three passes of a wrapping box blur each way: close to Gaussian, and seamless. */
function soften(field, sigma) {
  const radius = Math.max(1, Math.round(Math.sqrt(4 * sigma * sigma + 1) / 2));
  const width = radius * 2 + 1;
  const a = Float32Array.from(field);
  const b = new Float32Array(TILE * TILE);

  for (let pass = 0; pass < 3; pass += 1) {
    for (let y = 0; y < TILE; y += 1) {
      let sum = 0;
      for (let k = -radius; k <= radius; k += 1) sum += a[y * TILE + ((k + TILE) % TILE)];
      for (let x = 0; x < TILE; x += 1) {
        b[y * TILE + x] = sum / width;
        sum +=
          a[y * TILE + ((x + radius + 1) % TILE)] -
          a[y * TILE + ((x - radius + TILE) % TILE)];
      }
    }
    for (let x = 0; x < TILE; x += 1) {
      let sum = 0;
      for (let k = -radius; k <= radius; k += 1) sum += b[((k + TILE) % TILE) * TILE + x];
      for (let y = 0; y < TILE; y += 1) {
        a[y * TILE + x] = sum / width;
        sum +=
          b[((y + radius + 1) % TILE) * TILE + x] -
          b[((y - radius + TILE) % TILE) * TILE + x];
      }
    }
  }

  return a;
}

/** Fine paper tooth, a multiply layer between `floor` and white. */
function tooth(floor, seed) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}">
  <filter id="tooth" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
    <feColorMatrix values="${1 - floor} 0 0 0 ${floor}  ${1 - floor} 0 0 0 ${floor}  ${1 - floor} 0 0 0 ${floor}  0 0 0 0 1"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#tooth)"/>
</svg>`;
  return new Resvg(svg).render().asPng();
}

async function paper({ name, base, relief, crease, seed, toothFloor }) {
  const big = facets(60, seed, 0.5);
  const small = facets(380, seed + 12, 0.35);
  const bigSoft = soften(big.shade, 16);
  const smallSoft = soften(small.shade, 6);

  const pixels = Buffer.alloc(TILE * TILE * 3);
  for (let i = 0; i < TILE * TILE; i += 1) {
    // A fold catches light on one side of its crease and falls into shadow on
    // the other; which side is decided by the facet's own shading.
    const bigLine = Math.max(0, 1 - big.edge[i] / 1.3);
    const smallLine = Math.max(0, 1 - small.edge[i] / 0.9);
    const light =
      (0.78 * bigSoft[i] + 0.22 * smallSoft[i] - 0.9) * relief +
      1.02 +
      (big.shade[i] > 0.93 ? 1 : -1) * bigLine * crease +
      (small.shade[i] > 0.95 ? 1 : -1) * smallLine * crease * 0.46;

    for (let c = 0; c < 3; c += 1) {
      pixels[i * 3 + c] = Math.max(0, Math.min(255, base[c] * light));
    }
  }

  const surface = await sharp(pixels, { raw: { width: TILE, height: TILE, channels: 3 } })
    .png()
    .toBuffer();
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp(surface)
    .composite([{ input: tooth(toothFloor, seed + 5), blend: "multiply" }])
    .webp({ quality: 80 })
    .toFile(file);

  console.log(`${name}: ${TILE}px tile, ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

/**
 * Worn-ink mask for display type: opaque, with scattered pinholes and thin
 * patches where the ink did not take. White on transparent; CSS masks read
 * the alpha.
 */
async function printSpeckle() {
  const size = 384;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <filter id="worn" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="19" stitchTiles="stitch" result="fine"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="23" stitchTiles="stitch" result="patch"/>
    <feComposite in="fine" in2="patch" operator="arithmetic" k2="0.7" k3="0.5" k4="0"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  9 0 0 0 -2.6"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#worn)"/>
</svg>`;
  const file = join(OUT_DIR, "print-speckle.webp");
  await sharp(new Resvg(svg).render().asPng())
    .webp({ quality: 70, alphaQuality: 60 })
    .toFile(file);
  console.log(`print-speckle: ${size}px, ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

/**
 * A slice of fresh chilli, painted: a glossy red ring of skin around paler
 * flesh, a scatter of seeds, all washed with noise so it reads as paint rather
 * than vector. Three variants so a scatter never repeats itself.
 */
async function chiliSlice({ name, seed, squash, seeds }) {
  const size = 320;
  const c = size / 2;
  const rand = random(seed);
  // Seeds cling to the pale core at the centre of the slice.
  const seedMarks = Array.from({ length: seeds }, () => {
    const angle = rand() * Math.PI * 2;
    const distance = 10 + rand() * 34;
    const x = c + Math.cos(angle) * distance;
    const y = c + Math.sin(angle) * distance * squash;
    const rotation = (angle * 180) / Math.PI + 90;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="5" transform="rotate(${rotation.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <filter id="paint" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="${seed}" result="warp"/>
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="14" xChannelSelector="R" yChannelSelector="G" result="shape"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="${seed + 4}" result="wash"/>
      <feColorMatrix in="wash" values="0.3 0 0 0 0.76  0.3 0 0 0 0.76  0.3 0 0 0 0.76  0 0 0 0 1" result="washGrey"/>
      <feBlend in="shape" in2="washGrey" mode="multiply" result="washed"/>
      <feComposite in="washed" in2="shape" operator="in"/>
    </filter>
    <mask id="hollow">
      <rect width="100%" height="100%" fill="#fff"/>
      <ellipse cx="${c}" cy="${c}" rx="96" ry="${96 * squash}" fill="#000"/>
    </mask>
  </defs>
  <g filter="url(#paint)">
    <!-- The skin: a glossy ring, hollow inside, as a sliced chilli is. -->
    <ellipse cx="${c}" cy="${c}" rx="122" ry="${122 * squash}" fill="#c8261f" mask="url(#hollow)"/>
    <ellipse cx="${c}" cy="${c}" rx="122" ry="${122 * squash}" fill="none" stroke="#7d0f13" stroke-width="5" opacity="0.7"/>
    <!-- Translucent flesh lining the ring, and the pale core. -->
    <ellipse cx="${c}" cy="${c}" rx="96" ry="${96 * squash}" fill="none" stroke="#f08a5d" stroke-width="10" opacity="0.75"/>
    <ellipse cx="${c}" cy="${c}" rx="30" ry="${30 * squash}" fill="#f7d6a2" opacity="0.9"/>
    <g fill="#f8e7b4" stroke="#d9b56e" stroke-width="1.2">${seedMarks}</g>
    <path d="M ${c - 84} ${c - 62 * squash} q 44 -38 104 -34" stroke="#ffd2c0" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.6"/>
  </g>
</svg>`;
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp(new Resvg(svg).render().asPng())
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(file);
  console.log(`${name}: ${size}px, ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

await mkdir(OUT_DIR, { recursive: true });

await paper({
  name: "paper-red",
  base: [172, 38, 33],
  relief: 0.42,
  crease: 0.13,
  seed: 17,
  toothFloor: 0.72,
});
await paper({
  name: "paper-cream",
  base: [243, 234, 216],
  relief: 0.12,
  crease: 0.05,
  seed: 41,
  toothFloor: 0.9,
});
await printSpeckle();
await chiliSlice({ name: "chili-slice-a", seed: 5, squash: 1, seeds: 7 });
await chiliSlice({ name: "chili-slice-b", seed: 13, squash: 0.82, seeds: 5 });
await chiliSlice({ name: "chili-slice-c", seed: 29, squash: 0.92, seeds: 9 });
