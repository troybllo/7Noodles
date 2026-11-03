/**
 * Builds the self-hosted Chinese webfont.
 *
 * Noto Sans SC served by Google's CSS API costs a page ~300 `@font-face`
 * rules (one per unicode-range slice, per weight) — about 100 KB of render-
 * blocking CSS — plus a font file for every slice a page touches. The site
 * sets a few hundred distinct characters, so this cuts one variable woff2
 * holding exactly those, at every weight from 400 to 900.
 *
 * The characters are not listed by hand: every Chinese character in src/ and
 * in data/menu.json is collected, so a new dish or label is covered by
 * re-running `pnpm fonts`. A test (src/app/fonts.test.ts) fails if the site
 * sets a character the committed font lacks.
 *
 * The output is committed, so a clean checkout builds without the network.
 */

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import harfbuzz from "harfbuzzjs";
import subsetFont from "subset-font";
import { siteGlyphs } from "./site-glyphs.mjs";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "fonts", "noto-sans-sc-subset.woff2");

/** SIL OFL 1.1. Pinned by checksum so a font revision cannot change the site unnoticed. */
const SOURCE = {
  url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
  sha256: "a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da",
};

{
  const glyphs = await siteGlyphs();
  const response = await fetch(SOURCE.url);
  if (!response.ok) throw new Error(`${response.status} fetching ${SOURCE.url}`);
  const original = Buffer.from(await response.arrayBuffer());
  const sha = createHash("sha256").update(original).digest("hex");
  if (SOURCE.sha256 && sha !== SOURCE.sha256)
    throw new Error(`checksum mismatch: ${sha}`);

  // Fail rather than let a character fall back to a system face.
  const hb = await harfbuzz;
  const face = hb.createFace(hb.createBlob(original), 0);
  const covered = new Set(face.collectUnicodes());
  face.destroy();
  const missing = [...glyphs].filter((g) => !covered.has(g.codePointAt(0)));
  if (missing.length)
    throw new Error(`Noto Sans SC has no glyph for: ${missing.join(" ")}`);

  const subset = await subsetFont(original, glyphs, { targetFormat: "woff2" });
  await mkdir(join(ROOT, "public", "fonts"), { recursive: true });
  await writeFile(OUT, subset);
  await writeFile(OUT.replace(/\.woff2$/, ".glyphs.txt"), glyphs + "\n");
  console.log(
    `Noto Sans SC: ${(original.length / 1024).toFixed(0)} KB -> ${(subset.length / 1024).toFixed(1)} KB, ${[...glyphs].length} glyphs (source sha256 ${sha})`,
  );
}
