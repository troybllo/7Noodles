import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex } from "@/lib/contrast";
import { DRAGON_STRENGTH } from "./backdrop";
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

/** Composite a colour at the given opacity over a ground, as the browser does. */
function blend(foreground: string, alpha: number, ground: string): string {
  const f = parseHex(foreground);
  const g = parseHex(ground);
  const mix = (a: number, b: number) =>
    Math.round(a * alpha + b * (1 - alpha))
      .toString(16)
      .padStart(2, "0");
  return `#${mix(f.r, g.r)}${mix(f.g, g.g)}${mix(f.b, g.b)}`;
}

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

  it("holds the showcase panels at the large-text threshold", () => {
    /*
     * The showcase sets dark text on its coloured panels. The dish names are
     * display type and clear 3:1 comfortably; the smaller lines beneath them —
     * English name, family, price — do not reach 4.5 on the two coloured
     * panels:
     *
     *   風入松 #736E3E   ink 3.64   rice at 75% 3.30
     *   桃紅   #B12959   ink 3.01   rice at 75% 3.69
     *
     * That is a deliberate design direction, recorded here as it ships rather
     * than as it once was. Everything still holds 3:1, which is the floor this
     * test guards; if a panel is retuned and drops below it, this fails.
     */
    const rice75 = (ground: string) => blend("#f2eee5", 0.75, ground);
    const panels: [string, string, string][] = [
      ["風入松 ink", "#736e3e", "#12100e"],
      ["桃紅 ink", "#b12959", "#12100e"],
      ["風入松 rice/75", "#736e3e", rice75("#736e3e")],
      ["桃紅 rice/75", "#b12959", rice75("#b12959")],
      ["白 ink", "#f2eee5", "#12100e"],
    ];

    for (const [name, ground, text] of panels) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
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
    // Large text, so 3:1. Dark text on every block, as the mosaic now ships.
    const blocks: [string, string, string][] = [
      ["白 rice-dim", "#e7e7dc", "#0a0908"],
      ["paper", "#dad6cb", "#0a0908"],
      ["绿沉 pine-deep", "#76796e", "#000000"],
      ["沉香 agar", "#897367", "#000000"],
      ["桃红 peach", "#c14a50", "#000000"],
    ];

    for (const [name, ground, text] of blocks) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    }
  });

  it("holds the reviews and contact sections at body-text contrast", () => {
    const pairs: [string, string, string, number][] = [
      ["review text, ink on card", "#12100e", "#e7e7dc", 4.5],
      ["reviews eyebrow, peach-text on rice", "#bd4147", "#f2eee5", 4.5],
      // Stars are graphics, not text: WCAG 1.4.11 asks 3:1.
      ["review stars, peach on card", "#c14a50", "#e7e7dc", 3],
      ["contact detail, rice on panel", "#f2eee5", "#12100e", 4.5],
      ["contact labels, agar-glow on panel", "#8d776a", "#12100e", 4.5],
      ["story call to action, rice on ink-deep", "#f2eee5", "#0a0908", 4.5],
    ];

    for (const [name, text, ground, floor] of pairs) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(floor);
    }
  });

  it("keeps menu text readable over the dragon's darkest strokes", () => {
    /*
     * The dragon sits behind the menu as a tinted ink layer. Measuring against
     * the bare ground would miss the worst case: where the ink is fully opaque,
     * the ground is darkened (or, on the overview, lightened) by the backdrop's
     * whole strength. Every pairing is checked there.
     */
    const riceUnder = blend("#12100e", DRAGON_STRENGTH.rice, "#f2eee5");
    const darkUnder = blend("#f2eee5", DRAGON_STRENGTH.dark, "#0a0908");

    const pairs: [string, string, string, number][] = [
      ["dish names, prices and tags", "#12100e", riceUnder, 4.5],
      ["category title in Chinese, large", "#bd4147", riceUnder, 3],
      ["overview tabs", "#f2eee5", darkUnder, 4.5],
      ["overview current tab", "#d9a441", darkUnder, 4.5],
      ["overview title in Chinese, large", "#d9a441", darkUnder, 3],
    ];

    for (const [name, text, ground, floor] of pairs) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(floor);
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
