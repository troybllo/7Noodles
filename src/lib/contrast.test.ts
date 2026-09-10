import { describe, expect, it } from "vitest";
import { contrastLevel, contrastRatio, luminance, parseHex } from "./contrast";

describe("parseHex", () => {
  it("reads long and short form", () => {
    expect(parseHex("#12100E")).toEqual({ r: 18, g: 16, b: 14 });
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("rejects anything else", () => {
    expect(() => parseHex("rebeccapurple")).toThrow();
    expect(() => parseHex("#12345")).toThrow();
  });
});

describe("luminance", () => {
  it("anchors at the extremes", () => {
    expect(luminance("#000000")).toBeCloseTo(0, 5);
    expect(luminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("returns the 21:1 maximum for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#C14A50", "#F2EEE5")).toBeCloseTo(
      contrastRatio("#F2EEE5", "#C14A50"),
      10,
    );
  });

  it("holds the palette rules the design depends on", () => {
    // Rice on ink is the primary reversed pairing.
    expect(contrastRatio("#F2EEE5", "#12100E")).toBeGreaterThan(15);
    // The text variants were derived to clear 4.5 on their ground.
    expect(contrastRatio("#BD4147", "#F2EEE5")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#736E3E", "#F2EEE5")).toBeGreaterThanOrEqual(4.5);
    // Lantern is dark-ground only, and must stay that way.
    expect(contrastRatio("#D9A441", "#12100E")).toBeGreaterThan(7);
    expect(contrastRatio("#D9A441", "#F2EEE5")).toBeLessThan(3);
  });
});

describe("contrastLevel", () => {
  it("bands the thresholds", () => {
    expect(contrastLevel(21)).toBe("AAA");
    expect(contrastLevel(7)).toBe("AAA");
    expect(contrastLevel(4.5)).toBe("AA");
    expect(contrastLevel(3)).toBe("AA Large");
    expect(contrastLevel(2.99)).toBe("Fail");
  });
});
