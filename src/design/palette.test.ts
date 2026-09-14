import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex } from "@/lib/contrast";
import { DRAGON_STRENGTH, PANEL_OPACITY } from "./backdrop";
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

  it("holds the showcase panels at body-text contrast", () => {
    // Black, white and red: each panel's name and its smaller lines, the
    // paper grounds taken at their worst case for the text they carry.
    const redPaper = GROUND_HEX["red-paper"];
    const creamPaper = GROUND_HEX["cream-paper"];
    const pairs: [string, string, string][] = [
      ["ink panel, rice", "#f2eee5", "#12100e"],
      ["ink panel, rice at 75%", blend("#f2eee5", 0.75, "#12100e"), "#12100e"],
      ["red panel, cream", "#f6f5e9", redPaper],
      ["red panel, cream at 80%", blend("#f6f5e9", 0.8, redPaper), redPaper],
      ["cream panel, ink", "#12100e", creamPaper],
      ["cream panel, ink at 70%", blend("#12100e", 0.7, creamPaper), creamPaper],
    ];

    for (const [name, text, ground] of pairs) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("carries bronze both ways without a derived variant", () => {
    // Bronze is used as text on rice and as a ground under rice, so both
    // directions have to clear on the one value.
    expect(contrastRatio("#72511e", GROUND_HEX.rice)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(GROUND_HEX.rice, "#72511e")).toBeGreaterThanOrEqual(4.5);
  });

  it("holds every mosaic block against the tone set on it", () => {
    // Large text, so 3:1 is the floor; every block clears body text anyway.
    const blocks: [string, string, string][] = [
      ["白 cream", "#f6f5e9", "#0a0908"],
      ["墨 ink", "#12100e", "#f2eee5"],
      ["纸 cream paper", "#e5ddcb", "#0a0908"],
      ["deep chilli", "#6b1814", "#f2eee5"],
      ["红 chilli", "#8b1f1b", "#f2eee5"],
    ];

    for (const [name, ground, text] of blocks) {
      const ratio = contrastRatio(text, ground);
      expect(ratio, `${name} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("holds the reviews and contact sections at body-text contrast", () => {
    const pairs: [string, string, string, number][] = [
      ["review text, ink on cream card", "#12100e", "#f6f5e9", 4.5],
      [
        "reviews eyebrow, chilli on cream paper",
        "#8b1f1b",
        GROUND_HEX["cream-paper"],
        4.5,
      ],
      // Stars are graphics, not text: WCAG 1.4.11 asks 3:1.
      ["review stars, chilli on cream card", "#8b1f1b", "#f6f5e9", 3],
      ["contact detail, rice on panel", "#f2eee5", "#12100e", 4.5],
      [
        "contact labels, rice at 70% on panel",
        blend("#f2eee5", 0.7, "#12100e"),
        "#12100e",
        4.5,
      ],
      ["story and showcase marks, peach-glow on ink", "#c6595e", "#0a0908", 4.5],
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

  it("keeps the show dishes panel readable over any photograph", () => {
    // Worst case: the ink panel over a pure white photograph.
    const panel = blend("#12100e", PANEL_OPACITY, "#ffffff");
    const ratio = contrastRatio("#f2eee5", panel);
    expect(ratio, `panel text is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
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
