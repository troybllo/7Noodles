/**
 * Hero copy.
 *
 * The Chinese name is the restaurant's own, as it appears on their menu and
 * listings. The English lines need the owner's sign-off; the Chinese needs a
 * native review before launch.
 *
 * Anything set in the brush face must also be added to the glyph list in
 * scripts/subset-fonts.mjs, or it will fall back to a system font.
 */

export const HERO = {
  /** Set in brush calligraphy. Glyphs are subset for exactly this string. */
  name: "恰小面",
  latin: "7 Noodles",
  tagline: "Sichuan noodle house",
  /** The vertical column down the right edge of the card. */
  vertical: "麻辣鲜香",
  lede: "Chongqing noodles, hand-folded wontons and Leshan fried skewers. Yonge Street, North York.",
  actions: [
    { label: "Order for pickup", href: "/order", primary: true },
    { label: "View menu", href: "/menu", primary: false },
  ],
} as const;

/**
 * Guo Xi, Old Trees, Level Distance, ca. 1080, Northern Song. The Met, CC0.
 * Full provenance in public/artwork/PROVENANCE.md.
 */
export const HERO_ARTWORK = {
  src: "/artwork/guo-xi-old-trees-level-distance.jpg",
  alt: "Old Trees, Level Distance, a Northern Song landscape handscroll by Guo Xi",
  credit: "Guo Xi · ca. 1080 · The Met",
} as const;
