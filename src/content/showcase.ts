/**
 * The three dishes in the showcase.
 *
 * Names, families and prices are taken verbatim from data/menu-source.json,
 * captured from the restaurant's own menu. One dish per family — a bowl, a
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
  ground: "ink" | "chili" | "cream";
  /** What the photograph in this panel should be. */
  shot: string;
};

export const SHOWCASE: ShowcaseDish[] = [
  {
    slug: "signature-wanza-noodles-with-minced-pork-yellow-peas",
    nameZh: "招牌干馏豌杂面",
    nameEn: "Signature Wanza Noodles",
    family: "Dry Noodles",
    priceCents: 1600,
    ground: "ink",
    shot: "Wanza noodles, overhead, chopsticks lifting",
  },
  {
    slug: "wonton-in-red-chili-oil",
    nameZh: "红油抄手",
    nameEn: "Wonton in Red Chili Oil",
    family: "Wonton",
    priceCents: 1400,
    ground: "chili",
    shot: "Wontons in red oil, close, three-quarter",
  },
  {
    slug: "beef-skewers-6-pcs",
    nameZh: "牛肉串",
    nameEn: "Beef Skewers",
    family: "Crispy Fried Skewer",
    priceCents: 650,
    ground: "cream",
    shot: "Beef skewers in hand, against dark",
  },
];
