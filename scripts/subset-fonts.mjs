/**
 * Builds the self-hosted Chinese webfonts.
 *
 * Ma Shan Zheng is 5.6 MB unsubset. Google serves it as 92 unicode-range
 * slices so a browser only fetches what it renders, but shipping the whole
 * family through next/font to set three characters is not a trade worth
 * making. This cuts a woff2 containing only the glyphs the site actually sets.
 *
 * Run with `pnpm fonts`. The output is committed, so a clean checkout builds
 * without reaching the network — CI never depends on a font host being up.
 * Faces shipped in an archive are unpacked with bsdtar (libarchive), which
 * macOS includes; on Linux install libarchive-tools.
 *
 * When Chinese copy is added, add its characters to the face's glyphs and
 * re-run. The same pipeline covers the full translation pass.
 */

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import harfbuzz from "harfbuzzjs";
import subsetFont from "subset-font";

const ROOT = join(import.meta.dirname, "..");
const OUT_DIR = join(ROOT, "public", "fonts");

/**
 * Every character in the menu's category names, read from the menu itself.
 * Written out by hand, a new or renamed category would be easy to miss; derived
 * here, re-running this script is the whole fix.
 */
const menu = JSON.parse(await readFile(join(ROOT, "data", "menu-source.json"), "utf8"));
const CATEGORY_GLYPHS = menu.categories.map((category) => category.nameZh).join("");

/** Each character once, in first-seen order. */
const unique = (text) => [...new Set([...text])].join("");

const FACES = [
  {
    family: "Ma Shan Zheng",
    // Pinned so a font revision cannot silently change the brand mark.
    source: {
      url: "https://fonts.gstatic.com/s/mashanzheng/v18/NaPecZTRCLxvwo41b4gvzkXaRMQ.ttf",
    },
    file: "ma-shan-zheng-subset.woff2",
    /**
     * Every character set in this face, anywhere on the site.
     *   恰小面 豌杂        the restaurant's name, and the dish over the hero's bowl
     *   招牌 麻辣鲜香      the showcase and story marks
     *   菜单 川味 品牌故事 食客  menu, about and reviews headings
     *   白墨纸红          the colour mosaic's swatch names
     *   花椒 辣椒          the about page's 麻辣 diagram
     *   and every category name on the menu, derived above. Dish names stay
     *   in the reader's system face: they are small, and one of them (嬢) is
     *   a character this face does not have.
     */
    glyphs: unique(
      `恰小面招牌麻辣鲜香豌杂菜单川味品牌故事食客白墨纸红花椒辣${CATEGORY_GLYPHS}`,
    ),
  },
  {
    family: "Zhi Mang Xing",
    /**
     * Brush handwriting for notes and callouts drawn over photographs, matched
     * against the approved hero mockup. SIL OFL 1.1.
     *
     * Taken from the google/fonts repository at a pinned commit and
     * checksummed: the files Google's CSS API serves for Chinese faces are
     * partial subsets.
     */
    source: {
      url: "https://raw.githubusercontent.com/google/fonts/b12c22f97f4769802373d8de6a0f4115eabb9a24/ofl/zhimangxing/ZhiMangXing-Regular.ttf",
      sha256: "644e0cae9b40f0b10ab729a01bd32032e3973bac22be3dccae01bf6ae7fde969",
    },
    file: "zhi-mang-xing-subset.woff2",
    /**
     *   秘制肉沫 糯糯豌豆  the hero's callouts (src/content/hero.ts)
     */
    glyphs: unique("秘制肉沫糯糯豌豆"),
  },
];

const run = promisify(execFile);
const hb = await harfbuzz;

async function download(family, url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${family}: ${response.status} fetching ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function load({ family, source }) {
  const body = await download(family, source.url);

  if (source.sha256) {
    const actual = createHash("sha256").update(body).digest("hex");
    if (actual !== source.sha256) {
      throw new Error(`${family}: checksum mismatch for ${source.url} (got ${actual})`);
    }
  }
  if (!source.entry) return body;

  const dir = await mkdtemp(join(tmpdir(), "subset-fonts-"));
  try {
    const archive = join(dir, "source");
    await writeFile(archive, body);
    await run("bsdtar", ["-xf", archive, "-C", dir, source.entry]);
    return await readFile(join(dir, source.entry));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * The subsetter drops characters a face does not contain without complaint,
 * and the browser then sets them in a fallback face. Fail here instead.
 */
function assertCoverage(family, font, glyphs) {
  const face = hb.createFace(hb.createBlob(font), 0);
  const covered = new Set(face.collectUnicodes());
  face.destroy();

  const missing = [...glyphs].filter((glyph) => !covered.has(glyph.codePointAt(0)));
  if (missing.length > 0) {
    throw new Error(`${family} has no glyph for: ${missing.join(" ")}`);
  }
}

async function build(face) {
  const { family, file, glyphs } = face;
  const original = await load(face);
  assertCoverage(family, original, glyphs);

  const subset = await subsetFont(original, glyphs, { targetFormat: "woff2" });

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, file), subset);

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  const saved = (1 - subset.length / original.length) * 100;
  console.log(
    `${family}: ${kb(original.length)} -> ${kb(subset.length)} ` +
      `(${saved.toFixed(2)}% smaller, ${[...glyphs].length} glyphs: ${glyphs})`,
  );
}

for (const face of FACES) {
  await build(face);
}
