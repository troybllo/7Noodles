/**
 * The restaurant's own menu photography — four photographs, until the shoot.
 * Provenance in public/photos/PROVENANCE.md.
 */
export const PHOTOS = {
  braisedBeef: "/photos/braised-beef-chilli-broth.jpg",
  noodleSoup: "/photos/beef-noodle-soup.jpg",
  chicken: "/photos/mouth-watering-chicken.jpg",
  tossed: "/photos/tossed-dry-dish.jpg",
} as const;

/**
 * Hero copy, after the approved mockup.
 *
 * The featured dish is 豌杂 (wanza noodles) and the callouts are the mockup's
 * own. Until the original wanza photograph arrives, the bowl shown is the
 * restaurant's tossed dish in the same branded bowl, so its alt text describes
 * what is actually pictured. The tagline was spelled "Chonquing" in the
 * mockup; corrected here.
 */

export type Callout = {
  zh: string;
  /** The English note, one entry per handwritten line. */
  en: readonly string[];
};

export const HERO = {
  title: "7 Noodles",
  /** Set on two handwritten lines, broken where the mockup breaks them. */
  tagline: ["Authentic Chongqing noodles,", "Bird\u2019s Eye Chili, Erjingtiao."],
  action: { label: "Order Now", href: "/order" },
  dish: {
    nameZh: "豌杂",
    photo: {
      src: PHOTOS.tossed,
      alt: "A tossed noodle dish with pork belly and scallion in the restaurant's red-rimmed bowl",
      /**
       * Where the bowl's red rim sits in the photograph, as fractions of its
       * width and height. The hero crops to this ellipse, so the bowl stands
       * on the paper as a cut-out. Measure again when the photograph changes.
       */
      rim: { top: 113 / 846, bottom: 809 / 846 },
    },
    callouts: {
      upper: { zh: "秘制肉沫", en: ["Signature", "pork sauce"] },
      lower: { zh: "糯糯豌豆", en: ["Slow-cooked", "yellow pea"] },
    } satisfies Record<string, Callout>,
  },
} as const;
