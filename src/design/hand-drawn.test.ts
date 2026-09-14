import { describe, expect, it } from "vitest";
import { arrowHead, roughPath, seeded, type Point } from "./hand-drawn";

/** Every coordinate pair in a path string, in order. */
function coordinates(d: string): Point[] {
  const numbers = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const pairs: Point[] = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    pairs.push([numbers[i]!, numbers[i + 1]!]);
  }
  return pairs;
}

describe("hand-drawn geometry", () => {
  const points: Point[] = [
    [0, 0],
    [40, 20],
    [90, 10],
    [120, 60],
  ];

  it("draws the same line for the same seed, so server and browser agree", () => {
    expect(roughPath(points, { seed: 7 })).toBe(roughPath(points, { seed: 7 }));
    expect(arrowHead([0, 0], [10, 10], { seed: 3 })).toEqual(
      arrowHead([0, 0], [10, 10], { seed: 3 }),
    );
  });

  it("draws a different line for a different seed", () => {
    expect(roughPath(points, { seed: 7 })).not.toBe(roughPath(points, { seed: 8 }));
  });

  it("keeps every point it passes through within the wobble of where it was aimed", () => {
    const wobble = 2;
    const d = roughPath(points, { seed: 11, wobble });
    const all = coordinates(d);
    // The moveto, then the end point of each curve segment (every third pair).
    const anchors = [all[0]!, ...all.slice(1).filter((_, i) => i % 3 === 2)];

    expect(anchors).toHaveLength(points.length);
    anchors.forEach(([x, y], i) => {
      const [ax, ay] = points[i]!;
      expect(Math.hypot(x - ax, y - ay)).toBeLessThanOrEqual(wobble + 0.1);
    });
  });

  it("returns nothing for no points", () => {
    expect(roughPath([], { seed: 1 })).toBe("");
  });

  it("produces values between 0 and 1", () => {
    const rand = seeded(42);
    for (let i = 0; i < 1000; i += 1) {
      const value = rand();
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    }
  });
});
