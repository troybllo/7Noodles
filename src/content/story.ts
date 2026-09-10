/**
 * Copy for the story section.
 *
 * PLACEHOLDER, PENDING THE OWNER INTERVIEW.
 *
 * Every line here is drawn only from what the restaurant's own menu and
 * listings state: that the cooking is Sichuan and Chongqing, that the skewers
 * are Leshan style, that the wontons are hand folded, and that two dishes are
 * named for 蒋三娘 and 赵大嬢. Nothing about family history, how long the
 * kitchen has run, or who taught whom has been invented, because none of it is
 * verifiable yet and a restaurant's own story is not ours to make up.
 *
 * Replace with the real account once the owner has been interviewed. The
 * Chinese lines need a native review at the same time — they are written to
 * pair with the English, not to be a literal translation of it.
 */

export const STORY = {
  /** Runs vertically down the gutter, as a printed Sichuan menu would set it. */
  vertical: "麻辣鲜香",
  sealCharacter: "恰",
  quote:
    "Sichuan peppercorn before chilli, in that order, on purpose. That is the whole argument of this kitchen.",
  supporting: [
    "The numbing arrives first — 麻 — and the heat follows it. Get the order the wrong way round and it is just spicy food.",
    "Skewers fried the way Leshan fries them. Wontons pleated one at a time. Dishes that still carry the names of the people they came from.",
  ],
  cta: { label: "See the menu", href: "/menu" },
  photos: {
    primary: "Hero bowl, overhead, steam",
    secondary: "Hands pleating a wonton",
  },
} as const;
