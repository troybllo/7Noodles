/**
 * The branch.
 *
 * One piece of geometry serves two jobs: the asset behind the hero wordmark,
 * and the spine of the tree navigation. Keeping it as path data rather than an
 * image file means it can be drawn on, recoloured per section and re-cut for
 * the navigation without shipping a second asset.
 *
 * Limbs are ordered trunk-first. Drawing them in array order reads as growth,
 * because every limb starts from a point the previous one has already reached.
 *
 * Every path carries `pathLength={1}` when rendered, so a draw-on is
 * `strokeDashoffset: 1 -> 0` with no measuring in JavaScript.
 */

export const BRANCH_VIEWBOX = { width: 600, height: 700 } as const;

export type Limb = {
  d: string;
  /** Stroke width in viewBox units. Thinner limbs read as younger growth. */
  width: number;
  /**
   * Round caps bulge past the endpoint by half the stroke width, which shows
   * as a notch wherever a thick trunk segment meets a thinner one. Internal
   * trunk joins use butt caps, which sit flush because the segments are
   * tangent-continuous. Free ends stay round.
   */
  cap: "round" | "butt";
};

export const LIMBS: Limb[] = [
  // Trunk. Split into four segments so it can taper from base to crown — a
  // single stroked path can only hold one width, and an untapered trunk reads
  // as a marker line rather than wood.
  //
  // The split points come from exact de Casteljau subdivision of the original
  // two curves, so the segments stay tangent-continuous and the joins are
  // invisible. Drawing them in order also reads as growth.
  { d: "M 566 700 C 526 653 495 599.5 467.75 546", width: 15, cap: "butt" },
  { d: "M 467.75 546 C 440.5 492.5 417 439 392 392", width: 12.5, cap: "butt" },
  { d: "M 392 392 C 366 344 334 296 297.75 249.5", width: 10, cap: "butt" },
  { d: "M 297.75 249.5 C 261.5 203 221 158 178 116", width: 7.5, cap: "butt" },

  // Major forks.
  { d: "M 424 456 C 362 466 302 498 252 558", width: 8, cap: "round" },
  { d: "M 386 378 C 446 338 504 320 572 302", width: 7, cap: "round" },
  { d: "M 312 262 C 256 246 204 258 146 288", width: 6, cap: "round" },

  // Twigs.
  { d: "M 252 558 C 224 586 204 620 194 662", width: 4, cap: "round" },
  { d: "M 232 176 C 206 152 172 140 132 138", width: 4, cap: "round" },
  { d: "M 178 116 C 168 86 172 56 190 28", width: 3, cap: "round" },
  { d: "M 504 320 C 522 288 518 256 500 230", width: 3, cap: "round" },
  { d: "M 204 258 C 190 226 192 198 206 174", width: 3, cap: "round" },
];

export type Blossom = {
  x: number;
  y: number;
  /** Radius of the cluster in viewBox units. */
  r: number;
  /** Index of the limb this cluster sits on, so it opens after that limb draws. */
  limb: number;
};

export const BLOSSOMS: Blossom[] = [
  // Clusters sit only at true limb tips. A blossom part-buried in a thicker
  // limb reads as a rendering fault rather than a flower.
  { x: 190, y: 28, r: 24, limb: 9 },
  { x: 132, y: 138, r: 17, limb: 8 },
  { x: 146, y: 288, r: 21, limb: 6 },
  { x: 572, y: 302, r: 22, limb: 5 },
  { x: 194, y: 662, r: 19, limb: 7 },
  { x: 500, y: 230, r: 14, limb: 10 },
  { x: 206, y: 174, r: 13, limb: 11 },
];

/** Five petals around a centre, as offsets scaled by the cluster radius. */
export const PETALS = Array.from({ length: 5 }, (_, i) => {
  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return { dx: Math.cos(angle), dy: Math.sin(angle) };
});
