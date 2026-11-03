import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { GROUND_HEX, PALETTE } from "./palette";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** Every `--color-x: #hex;` declaration in the theme block. */
function themeColors(): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    const [, token, hex] = match;
    if (token && hex) found.set(token, hex.toLowerCase());
  }
  return found;
}

const swatches = PALETTE.flatMap((group) => group.swatches);

describe("palette documentation", () => {
  it("documents every colour the theme defines", () => {
    const documented = new Set(swatches.map((s) => s.token));
    const undocumented = [...themeColors().keys()].filter((t) => !documented.has(t));
    expect(undocumented).toEqual([]);
  });

  it("matches the hex values the theme actually ships", () => {
    const theme = themeColors();
    for (const swatch of swatches) {
      expect(theme.get(swatch.token), `--color-${swatch.token} missing from theme`).toBe(
        swatch.hex.toLowerCase(),
      );
    }
  });

  it("uses each token name only once", () => {
    const tokens = swatches.map((s) => s.token);
    expect(tokens).toHaveLength(new Set(tokens).size);
  });
});

describe("palette accessibility claims", () => {
  it("clears 4.5:1 on every ground a swatch claims it can carry text on", () => {
    for (const swatch of swatches) {
      for (const ground of swatch.textOn) {
        const ratio = contrastRatio(swatch.hex, GROUND_HEX[ground]);
        expect(
          ratio,
          `${swatch.token} on ${ground} is ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("holds the pairings the pages actually set", () => {
    const ivory = "#f3eee5";
    const red = "#862218";
    const deep = "#641910";
    const pairs: [string, string, string, number][] = [
      ["type on ivory, red", red, ivory, 4.5],
      ["secondary type on ivory, deep red", deep, ivory, 4.5],
      ["type on the red band, ivory", ivory, red, 4.5],
      ["buttons, ivory on red", ivory, red, 4.5],
      ["pressed buttons, ivory on deep red", ivory, deep, 4.5],
      ["placeholder labels, red on soft ivory", red, "#e9e0d1", 4.5],
      ["accents on the red band, gold", "#f2d288", red, 4.5],
    ];

    for (const [name, text, ground, floor] of pairs) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(floor);
    }
  });
});
