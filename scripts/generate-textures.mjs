/**
 * Generates the paper textures and painted chilli slices.
 *
 * The paper's surface comes from ambientCG's Paper003, a scanned sheet of
 * creased paper released under CC0 (public domain; see
 * public/textures/PROVENANCE.md). Only its normal map is used: the site's own
 * colour is lit through the scanned creases, so the folds are real but the
 * colour and grain are ours. Fine fibre grain and a few pale flecks are laid
 * over it from seeded noise.
 *
 * The chilli slices and the worn-print mask are drawn from seeded noise, so
 * every run produces identical files.
 *
 * Run with `pnpm textures`. Needs the network once, to fetch the pinned and
 * checksummed source, and bsdtar to unpack it. Output is committed; CI never
 * regenerates it.
 */

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const OUT_DIR = join(import.meta.dirname, "..", "public", "textures");
const TILE = 1200;

/** Park–Miller, so every run draws the same slices. */
function random(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

const PAPER_SOURCE = {
  url: "https://ambientcg.com/get?file=Paper003_2K-JPG.zip",
  sha256: "7939efd9c04e3da41341386730ad657034ed19dafc2211bad80e6f5182e89a2c",
  normalMap: "Paper003_2K-JPG_NormalGL.jpg",
};

/** The scanned paper's normal map, resized to the tile, as raw RGB. */
async function loadNormalMap() {
  const response = await fetch(PAPER_SOURCE.url);
  if (!response.ok) throw new Error(`${response.status} fetching ${PAPER_SOURCE.url}`);
  const body = Buffer.from(await response.arrayBuffer());
  const actual = createHash("sha256").update(body).digest("hex");
  if (actual !== PAPER_SOURCE.sha256) {
    throw new Error(`Paper source checksum mismatch (got ${actual})`);
  }

  const dir = await mkdtemp(join(tmpdir(), "textures-"));
  try {
    await writeFile(join(dir, "source.zip"), body);
    await promisify(execFile)("bsdtar", ["-xf", "source.zip", PAPER_SOURCE.normalMap], {
      cwd: dir,
    });
    return await sharp(await readFile(join(dir, PAPER_SOURCE.normalMap)))
      .resize(TILE, TILE)
      .raw()
      .toBuffer();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** A seamless noise layer, rendered through an SVG filter. */
function noise(filter) {
  return new Resvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}"><filter id="n" x="0" y="0" width="100%" height="100%">${filter}</filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  )
    .render()
    .asPng();
}

/**
 * One paper colour lit through the scanned creases from the upper left.
 * `relief` sets how deep the folds read; `grainFloor` how dark the fibre grain
 * can multiply; `flecks` the strength of the pale fibres.
 */
async function paper(normals, { name, base, relief, grainFloor, flecks }) {
  const light = [-0.45, 0.55, 0.7];
  const length = Math.hypot(...light);
  const [lx, ly, lz] = light.map((v) => v / length);

  const pixels = Buffer.alloc(TILE * TILE * 3);
  for (let i = 0; i < TILE * TILE; i += 1) {
    const nx = normals[i * 3] / 127.5 - 1;
    const ny = normals[i * 3 + 1] / 127.5 - 1;
    const nz = normals[i * 3 + 2] / 127.5 - 1;
    const shade = 1 + (nx * lx + ny * ly + nz * lz - 0.72) * relief;
    for (let c = 0; c < 3; c += 1) {
      pixels[i * 3 + c] = Math.max(0, Math.min(255, base[c] * shade));
    }
  }

  const grain = noise(
    `<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="9" stitchTiles="stitch"/><feColorMatrix values="${1 - grainFloor} 0 0 0 ${grainFloor}  ${1 - grainFloor} 0 0 0 ${grainFloor}  ${1 - grainFloor} 0 0 0 ${grainFloor}  0 0 0 0 1"/>`,
  );
  const pale = noise(
    `<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="21" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.84  ${3.2 * flecks} 0 0 0 ${-1.9 * flecks}"/>`,
  );

  const lit = await sharp(pixels, { raw: { width: TILE, height: TILE, channels: 3 } })
    .png()
    .toBuffer();
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp(lit)
    .composite([
      { input: grain, blend: "multiply" },
      { input: pale, blend: "screen" },
    ])
    // High quality: at lower settings WebP smooths the fibre grain away.
    .webp({ quality: 88 })
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
    <!-- The hollow inside, faintly tinted, and the pale core. -->
    <ellipse cx="${c}" cy="${c}" rx="96" ry="${96 * squash}" fill="#d2452f" opacity="0.35"/>
    <ellipse cx="${c}" cy="${c}" rx="30" ry="${30 * squash}" fill="#e98a62" opacity="0.4"/>
    <g fill="#f4d19a" opacity="0.8">${seedMarks}</g>
    <path d="M ${c - 84} ${c - 62 * squash} q 44 -38 104 -34" stroke="#ffc9b0" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.35"/>
  </g>
</svg>`;
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp(new Resvg(svg).render().asPng())
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(file);
  console.log(`${name}: ${size}px, ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

await mkdir(OUT_DIR, { recursive: true });

const normals = await loadNormalMap();
await paper(normals, {
  name: "paper-red",
  base: [158, 36, 31],
  relief: 2.2,
  grainFloor: 0.55,
  flecks: 0.42,
});
await paper(normals, {
  name: "paper-cream",
  base: [243, 234, 216],
  relief: 0.9,
  grainFloor: 0.88,
  flecks: 0,
});
await printSpeckle();
await chiliSlice({ name: "chili-slice-a", seed: 5, squash: 1, seeds: 7 });
await chiliSlice({ name: "chili-slice-b", seed: 13, squash: 0.82, seeds: 5 });
await chiliSlice({ name: "chili-slice-c", seed: 29, squash: 0.92, seeds: 9 });
