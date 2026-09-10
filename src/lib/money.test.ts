import { describe, expect, it } from "vitest";
import { applyRate, formatCad } from "./money";

describe("formatCad", () => {
  it("formats whole and fractional dollars", () => {
    expect(formatCad(1600)).toBe("$16.00");
    expect(formatCad(650)).toBe("$6.50");
    expect(formatCad(0)).toBe("$0.00");
  });

  it("groups thousands", () => {
    expect(formatCad(123456)).toBe("$1,234.56");
  });
});

describe("applyRate", () => {
  it("computes HST on a typical order", () => {
    expect(applyRate(1600, 0.13)).toBe(208);
    expect(applyRate(4550, 0.13)).toBe(592);
  });

  it("rounds half away from zero in both directions", () => {
    expect(applyRate(50, 0.13)).toBe(7); // 6.5 -> 7
    expect(applyRate(-50, 0.13)).toBe(-7); // -6.5 -> -7
  });

  it("never returns a fractional cent", () => {
    for (const subtotal of [1, 999, 1234, 87654]) {
      expect(Number.isInteger(applyRate(subtotal, 0.13))).toBe(true);
    }
  });
});
