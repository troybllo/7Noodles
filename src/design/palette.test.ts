import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { GROUND_HEX, PALETTE, type Ground } from "./palette";

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

  it("keeps lantern off light grounds", () => {
    const lantern = swatches.find((s) => s.token === "lantern");
    expect(lantern?.textOn).toEqual(["ink"]);
  });

  it("holds every showcase panel ground against its text colour", () => {
    // The showcase reads as three colour panels carrying dish names and prices.
    // If any of these slips, the section stops being legible, so it is guarded
    // here rather than left to a manual check.
    const panels: [string, string, string][] = [
      ["pine", "#736e3e", "#f2eee5"],
      ["peach-deep", "#b12959", "#f2eee5"],
      ["rice", "#f2eee5", "#12100e"],
    ];

    for (const [name, ground, text] of panels) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} panel is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("carries bronze both ways without a derived variant", () => {
    // Bronze is used as text on rice and as a ground under rice, so both
    // directions have to clear on the one value.
    expect(contrastRatio("#72511e", GROUND_HEX.rice)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(GROUND_HEX.rice, "#72511e")).toBeGreaterThanOrEqual(4.5);
  });

  it("documents why the mosaic code lines are set large", () => {
    /*
     * The mosaic sets each block's colour values on the block itself. Two of
     * those grounds are mid-luminance, and our warm near-black falls just
     * short of small-text contrast on both:
     *
     *   绿沉 #76796E  ink-deep 4.48   pure black 4.73
     *   沉香 #897367  ink-deep 4.46   pure black 4.71
     *
     * Pure black would clear 4.5, but only by a hair, and it means an
     * off-palette neutral on a deliberately warm system for a margin of about
     * 0.2. The lines are set at the large-text threshold instead, where
     * ink-deep clears 3:1 comfortably and the type is more legible than the
     * reference's fine print would have been.
     *
     * If a block is ever retuned, this is where the trade-off resurfaces.
     */
    const midTone = [
      ["绿沉", "#76796e"],
      ["沉香", "#897367"],
    ] as const;

    for (const [name, ground] of midTone) {
      const warm = contrastRatio("#0a0908", ground);
      expect(warm, `${name} with ink-deep`).toBeLessThan(4.5);
      expect(warm, `${name} must still clear large text`).toBeGreaterThanOrEqual(3);
    }
  });

  it("holds every mosaic block against the tone set on it", () => {
    // Large text, so 3:1. ink-deep on the light grounds, rice on the deep ones.
    const blocks: [string, string, string][] = [
      ["白 rice-dim", "#e7e7dc", "#0a0908"],
      ["paper", "#dad6cb", "#0a0908"],
      ["绿沉 pine-deep", "#76796e", "#f2eee5"],
      ["沉香 agar", "#897367", "#f2eee5"],
      ["桃红 peach", "#c14a50", "#f2eee5"],
    ];

    for (const [name, ground, text] of blocks) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the reference olive out of the palette", () => {
    // #787240 is the colour from the client's reference. It reads 4.24:1 on
    // rice and 3.87:1 on ink, so it cannot carry small text either way.
    // Guarded so nobody restores it from the reference image later.
    expect(contrastRatio("#787240", GROUND_HEX.rice)).toBeLessThan(4.5);
    expect(swatches.some((s) => s.hex.toLowerCase() === "#787240")).toBe(false);
  });

  it("still clears 3:1 for large display type in the accent families", () => {
    const grounds: Ground[] = ["rice", "ink"];
    for (const token of ["peach", "pine"]) {
      const swatch = swatches.find((s) => s.token === token);
      const best = Math.max(
        ...grounds.map((g) => contrastRatio(swatch!.hex, GROUND_HEX[g])),
      );
      expect(
        best,
        `${token} cannot carry display type on either ground`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
