/**
 * The three dishes in the showcase.
 *
 * Names, families and prices are taken verbatim from data/menu.json, the
 * owner's own menu. One dish per family — a bowl, a
 * wonton and a skewer — so the section shows the kitchen's range rather than
 * three bowls of noodles.
 *
 * Swap freely once the owner says what actually sells; nothing but this file
 * needs to change.
 */

export type ShowcaseDish = {
  slug: string;
  nameZh: string;
  nameEn: string;
  family: string;
  priceCents: number;
  /** Which panel ground this dish sits on. */
  ground: "ink" | "chili" | "bone";
  /** What the photograph in this panel should be. */
  shot: string;
};

export const SHOWCASE: ShowcaseDish[] = [
  {
    slug: "wanza-noodles",
    nameZh: "招牌豌杂面",
    nameEn: "Wanza Noodles",
    family: "Traditional Xiaomian",
    priceCents: 1500,
    ground: "ink",
    shot: "Wanza noodles, overhead, a fork lifting",
  },
  {
    slug: "wontons-in-red-chili-oil",
    nameZh: "红油抄手",
    nameEn: "Sichuan Dumplings with Red Chili Oil",
    family: "House-Made Sichuan Dumplings",
    priceCents: 1300,
    ground: "chili",
    shot: "Wontons in red oil, close, three-quarter",
  },
  {
    slug: "beef-skewers",
    nameZh: "牛肉",
    nameEn: "Beef Skewers",
    family: "Leshan Fried Skewers",
    priceCents: 600,
    ground: "bone",
    shot: "Beef skewers in hand, against dark",
  },
];
