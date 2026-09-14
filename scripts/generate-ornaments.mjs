/**
 * Generates the hanging lanterns used as ornaments on the menu.
 *
 * Drawn rather than sourced: the references are stock illustrations, and no
 * public-domain collection holds a clean standalone lantern. Generating them
 * also keeps them in the palette and lets each variant differ slightly, so two
 * lanterns hung side by side never read as the same image twice.
 *
 * A lantern is built from a few flat shapes, then made to read as watercolour
 * by the filters rather than by detail in the shapes:
 *
 *   The body wash is warped at the edge, darkened just inside its outline where
 *   pigment pools as it dries, blotched with low-frequency noise so the colour
 *   is uneven, and grained so a little paper shows through.
 *
 *   The caps, ribs, cord and tassel are drawn as dry strokes: slightly wavering
 *   lines with no wash behind them.
 *
 * The glow is not baked in. It is a CSS layer behind the image, so it can
 * breathe independently and be left off on light grounds.
 *
 * Run with `pnpm ornaments`. Output is committed; seeds are fixed, so the
 * output is identical on every run.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const OUT_DIR = join(import.meta.dirname, "..", "public", "ornaments");

const INK = "#1b1512";
const GOLD = "#c9953c";
const RIB = "#6e121b";
const TASSEL = "#b3262f";

/** Park–Miller, so every run draws the same tassel and the same drops. */
function random(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

function lantern({ seed, half, ribs, tasselLength }) {
  const rand = random(seed);
  const width = 420;
  const cx = width / 2;
  const capTop = { y: 176, h: 34, w: 118 };
  const capBottom = { y: 566, h: 30, w: 100 };
  const bodyTop = capTop.y + capTop.h - 6;
  const bodyBottom = capBottom.y + 6;
  const mid = (bodyTop + bodyBottom) / 2;
  const tasselTop = capBottom.y + capBottom.h + 72;
  const height = Math.ceil(tasselTop + tasselLength + 60);

  // Flat where the body meets each cap, full through the middle.
  const body = [
    `M ${cx - capTop.w / 2} ${bodyTop}`,
    `C ${cx - half * 0.78} ${bodyTop + 4}, ${cx - half} ${mid - 105}, ${cx - half} ${mid}`,
    `C ${cx - half} ${mid + 105}, ${cx - half * 0.74} ${bodyBottom - 4}, ${cx - capBottom.w / 2} ${bodyBottom}`,
    `L ${cx + capBottom.w / 2} ${bodyBottom}`,
    `C ${cx + half * 0.74} ${bodyBottom - 4}, ${cx + half} ${mid + 105}, ${cx + half} ${mid}`,
    `C ${cx + half} ${mid - 105}, ${cx + half * 0.78} ${bodyTop + 4}, ${cx + capTop.w / 2} ${bodyTop}`,
    "Z",
  ].join(" ");

  // Ribs run from points along the top cap to matching points on the bottom
  // cap, bowing out with the body.
  const ribPaths = Array.from({ length: ribs - 1 }, (_, index) => {
    const k = ((index + 1) / ribs) * 2 - 1;
    const top = cx + (k * capTop.w) / 2;
    const bottom = cx + (k * capBottom.w) / 2;
    const bow = cx + Math.sin((k * Math.PI) / 2) * half * 0.98;
    return `<path d="M ${top} ${bodyTop + 2} C ${bow} ${bodyTop + 40}, ${bow} ${bodyBottom - 40}, ${bottom} ${bodyBottom - 2}"/>`;
  }).join("");

  const tassel = Array.from({ length: 22 }, (_, index) => {
    const x = cx - 9 + (18 * index) / 21;
    const spread = (index / 21 - 0.5) * 34 + (rand() - 0.5) * 6;
    const length = tasselLength * (0.85 + rand() * 0.2);
    return `<path d="M ${x} ${tasselTop} C ${x} ${tasselTop + 52}, ${x + spread * 0.5} ${tasselTop + length * 0.7}, ${x + spread} ${tasselTop + length}" stroke-width="${(1.4 + rand() * 1.6).toFixed(2)}"/>`;
  }).join("");

  // A few drops thrown off the brush, as in a loose watercolour.
  const drops = Array.from({ length: 9 }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = 185 + rand() * 20;
    return `<circle cx="${(cx + Math.cos(angle) * radius * 0.9).toFixed(1)}" cy="${(mid + Math.sin(angle) * radius * 1.3 + 60).toFixed(1)}" r="${(1.2 + rand() * 3.2).toFixed(2)}"/>`;
  }).join("");

  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="body" cx="0.45" cy="0.46" r="0.6">
      <stop offset="0" stop-color="#ffe2a0"/>
      <stop offset="0.22" stop-color="#f7a458"/>
      <stop offset="0.55" stop-color="#d6473a"/>
      <stop offset="1" stop-color="#8a1a25"/>
    </radialGradient>
    <filter id="wash" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="${seed}" result="warp"/>
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="11" xChannelSelector="R" yChannelSelector="G" result="shape"/>
      <feMorphology in="shape" operator="erode" radius="5" result="inner"/>
      <feComposite in="shape" in2="inner" operator="out" result="rim"/>
      <feGaussianBlur in="rim" stdDeviation="3" result="rimSoft"/>
      <feColorMatrix in="rimSoft" type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.04  0 0 0 0 0.07  0 0 0 0.55 0" result="rimInk"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.014 0.028" numOctaves="3" seed="${seed + 12}" result="blot"/>
      <feColorMatrix in="blot" type="matrix" values="0.25 0.25 0 0 0.66  0.25 0.25 0 0 0.66  0.25 0.25 0 0 0.66  0 0 0 0 1" result="blotGrey"/>
      <feBlend in="shape" in2="blotGrey" mode="multiply" result="blotted"/>
      <feComposite in="blotted" in2="shape" operator="in" result="washed"/>
      <feComposite in="rimInk" in2="washed" operator="over" result="rimmed"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="${seed + 5}" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.45" result="grainAlpha"/>
      <feComposite in="rimmed" in2="grainAlpha" operator="in" result="grained"/>
      <feComposite in="grained" in2="shape" operator="in"/>
    </filter>
    <filter id="dry" x="-20%" y="-10%" width="140%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed + 4}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <g filter="url(#dry)" stroke="${INK}" stroke-linecap="round" fill="none">
    <path d="M ${cx} 0 C ${cx - 3} 60, ${cx + 3} 110, ${cx} ${capTop.y - 14}" stroke-width="3.2"/>
  </g>
  <g filter="url(#dry)" fill="${INK}"><rect x="${cx - 7}" y="${capTop.y - 22}" width="14" height="24" rx="4"/></g>
  <g filter="url(#wash)"><path d="${body}" fill="url(#body)"/></g>
  <g filter="url(#dry)" stroke="${RIB}" stroke-width="2.6" fill="none" opacity="0.45" stroke-linecap="round">${ribPaths}</g>
  <g filter="url(#dry)" fill="${INK}">
    <rect x="${cx - capTop.w / 2 - 6}" y="${capTop.y}" width="${capTop.w + 12}" height="${capTop.h}" rx="9"/>
    <rect x="${cx - capBottom.w / 2 - 6}" y="${capBottom.y}" width="${capBottom.w + 12}" height="${capBottom.h}" rx="9"/>
  </g>
  <g filter="url(#dry)" stroke="${GOLD}" stroke-width="2.2" fill="none" opacity="0.75">
    <path d="M ${cx - capTop.w / 2} ${capTop.y + 12} h ${capTop.w}"/>
    <path d="M ${cx - capBottom.w / 2} ${capBottom.y + capBottom.h - 11} h ${capBottom.w}"/>
  </g>
  <g filter="url(#dry)" stroke="${INK}" stroke-width="3" fill="none"><path d="M ${cx} ${capBottom.y + capBottom.h} v 30"/></g>
  <g filter="url(#dry)" fill="${INK}">
    <circle cx="${cx}" cy="${capBottom.y + capBottom.h + 36}" r="11"/>
    <rect x="${cx - 12}" y="${tasselTop - 18}" width="24" height="20" rx="5"/>
  </g>
  <g filter="url(#dry)" stroke="${TASSEL}" fill="none" stroke-linecap="round" opacity="0.92">${tassel}</g>
  <g filter="url(#dry)" fill="#c83a36" opacity="0.8">${drops}</g>
</svg>`,
  };
}

const VARIANTS = [
  { name: "lantern-a", seed: 7, half: 158, ribs: 8, tasselLength: 190 },
  { name: "lantern-b", seed: 23, half: 146, ribs: 7, tasselLength: 160 },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { name, ...shape } of VARIANTS) {
  const { svg, width, height } = lantern(shape);
  const png = new Resvg(svg).render().asPng();
  await writeFile(join(OUT_DIR, `${name}.png`), png);
  console.log(`${name}: ${width}x${height}, ${(png.length / 1024).toFixed(1)} KB`);
}
