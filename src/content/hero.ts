/**
 * Hero copy and the photographs that fill its moving rows.
 *
 * The wordmark reads SEVEN NOODLES to match the client's logo. The English
 * lines need the owner's sign-off; the Chinese needs a native review.
 */

export const HERO = {
  nameZh: "恰小面",
  wordmark: "SEVEN NOODLES",
  lede: "Sichuan and Chongqing noodles, hand-folded wontons and Leshan fried skewers.",
  actions: [
    { label: "Order for pickup", href: "/order", primary: true },
    { label: "View menu", href: "/menu", primary: false },
  ],
} as const;

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

export type Tile = { src: string; position: string };

/**
 * Four photographs across three rows will repeat. Each is used at more than
 * one framing — the tiles are portrait, so shifting `object-position` across a
 * square original shows a genuinely different part of the dish — and each row
 * orders them differently so no two rows line up the same way.
 *
 * It still reads as repetitive on close inspection. That goes away with real
 * photography, not with more cropping.
 */
export const HERO_ROWS: Tile[][] = [
  [
    { src: PHOTOS.braisedBeef, position: "20% 50%" },
    { src: PHOTOS.noodleSoup, position: "55% 45%" },
    { src: PHOTOS.tossed, position: "70% 50%" },
    { src: PHOTOS.chicken, position: "35% 50%" },
    { src: PHOTOS.noodleSoup, position: "15% 60%" },
    { src: PHOTOS.braisedBeef, position: "80% 45%" },
    { src: PHOTOS.tossed, position: "25% 55%" },
    { src: PHOTOS.chicken, position: "75% 45%" },
  ],
  [
    { src: PHOTOS.tossed, position: "50% 50%" },
    { src: PHOTOS.chicken, position: "55% 55%" },
    { src: PHOTOS.braisedBeef, position: "45% 55%" },
    { src: PHOTOS.noodleSoup, position: "85% 50%" },
    { src: PHOTOS.tossed, position: "10% 45%" },
    { src: PHOTOS.chicken, position: "20% 45%" },
    { src: PHOTOS.noodleSoup, position: "40% 40%" },
    { src: PHOTOS.braisedBeef, position: "60% 40%" },
  ],
  [
    { src: PHOTOS.noodleSoup, position: "65% 55%" },
    { src: PHOTOS.braisedBeef, position: "30% 60%" },
    { src: PHOTOS.chicken, position: "90% 55%" },
    { src: PHOTOS.tossed, position: "40% 60%" },
    { src: PHOTOS.braisedBeef, position: "65% 55%" },
    { src: PHOTOS.noodleSoup, position: "25% 50%" },
    { src: PHOTOS.tossed, position: "85% 45%" },
    { src: PHOTOS.chicken, position: "50% 40%" },
  ],
];
