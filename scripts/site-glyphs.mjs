/**
 * Every Chinese character the site sets: collected from src/ and
 * data/menu.json, so nothing is listed by hand. Shared by the font build
 * (scripts/subset-fonts.mjs) and its coverage test (src/app/fonts.test.ts).
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

/** Han characters and the CJK punctuation set beside them. */
const CJK = /[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/gu;

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(tsx?|json)$/.test(entry.name)) yield path;
  }
}

export async function siteGlyphs() {
  const found = new Set();
  const sources = [join(ROOT, "data", "menu.json")];
  for await (const path of files(join(ROOT, "src"))) sources.push(path);
  for (const path of sources) {
    for (const glyph of (await readFile(path, "utf8")).match(CJK) ?? []) found.add(glyph);
  }
  return [...found].sort().join("");
}
