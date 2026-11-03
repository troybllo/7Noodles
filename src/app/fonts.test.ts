import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error -- a plain ESM build script, with no type declarations.
import { siteGlyphs } from "../../scripts/site-glyphs.mjs";

describe("Chinese webfont", () => {
  it("covers every Chinese character the site sets", async () => {
    const shipped = new Set(
      readFileSync(
        join(process.cwd(), "public/fonts/noto-sans-sc-subset.glyphs.txt"),
        "utf8",
      ),
    );
    const missing = [...(await siteGlyphs())].filter((glyph) => !shipped.has(glyph));
    expect(missing, "run `pnpm fonts` to add these to the font").toEqual([]);
  });
});
