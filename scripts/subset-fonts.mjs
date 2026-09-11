/**
 * Builds the self-hosted Chinese webfonts.
 *
 * Ma Shan Zheng is 5.6 MB unsubset. Google serves it as 92 unicode-range
 * slices so a browser only fetches what it renders, but shipping the whole
 * family through next/font to set three characters is not a trade worth
 * making. This cuts a woff2 containing only the glyphs the site actually sets.
 *
 * Run with `pnpm fonts`. The output is committed, so a clean checkout builds
 * without reaching the network — CI never depends on Google being up.
 *
 * When Chinese copy is added, add its characters to GLYPHS and re-run. The
 * same pipeline covers the full translation pass.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import subsetFont from "subset-font";

const OUT_DIR = join(import.meta.dirname, "..", "public", "fonts");

const FACES = [
  {
    family: "Ma Shan Zheng",
    // Pinned so a font revision cannot silently change the brand mark.
    url: "https://fonts.gstatic.com/s/mashanzheng/v18/NaPecZTRCLxvwo41b4gvzkXaRMQ.ttf",
    file: "ma-shan-zheng-subset.woff2",
    /**
     * Every character set in this face, anywhere on the site.
     *   恰小面  the restaurant's name, the hero mark
     *   招牌    the showcase eyebrow
     *   麻辣    the story section
     */
    glyphs: "恰小面招牌麻辣",
  },
];

async function build({ family, url, file, glyphs }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${family}: ${response.status} fetching ${url}`);
  }

  const original = Buffer.from(await response.arrayBuffer());
  const subset = await subsetFont(original, glyphs, { targetFormat: "woff2" });

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, file), subset);

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  const saved = (1 - subset.length / original.length) * 100;
  console.log(
    `${family}: ${kb(original.length)} -> ${kb(subset.length)} ` +
      `(${saved.toFixed(2)}% smaller, ${[...glyphs].length} glyphs)`,
  );
}

for (const face of FACES) {
  await build(face);
}
