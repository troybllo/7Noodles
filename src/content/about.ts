/**
 * Brand history.
 *
 * The prose is PLACEHOLDER and needs replacing after the owner interview — it
 * draws only on what the menu and public listings state, and invents no family
 * history. Putting a brand-history heading on the page makes that gap more
 * visible, not less. The Chinese needs a native review.
 */

export const ABOUT = {
  nameZh: "恰小面",
  nameEn: "7 Noodles",
  vertical: "川味小面",
  heading: "Brand history",
  headingZh: "品牌故事",
  lede: "A Sichuan kitchen on Yonge Street, cooking the food of Chongqing and Leshan the way it is cooked there.",
  /** Scrolls past the sticky column. */
  story: [
    {
      title: "The cooking",
      body: "Sichuan and Chongqing, from a room below street level at Yonge and Florence. Noodles tossed at the pass so nothing sits. Wontons pleated one at a time. Skewers fried the way Leshan fries them, then tossed in chilli.",
    },
    {
      title: "麻辣",
      body: "Sichuan peppercorn before chilli, in that order, on purpose. The numbing arrives first and the heat follows it. Get the order the wrong way round and it is just spicy food.",
    },
    {
      title: "Named for someone",
      body: "Grandma Jiang's osmanthus jelly. Aunt Zhao's burning noodles. Dishes here carry the names of the people they came from, which is not a marketing decision — it is how the recipes arrived.",
    },
  ],
  /**
   * The second scrolling column. Contact detail lives in the contact section
   * now, so this is more of the story — limited to what can be verified: the
   * room's location and hours as published, and an excerpt from a real review,
   * attributed as it was posted. The excerpt removes one stray space from the
   * original ("well -balanced"); the full text is in content/reviews.ts.
   */
  aside: {
    room: {
      title: "The room",
      body: "Below street level at Yonge and Florence, open every day from eleven until ten. Easy to walk past, which is part of the point.",
    },
    quote: {
      text: "The Braised Beef Noodle Soup and Wonton in Chicken Soup were both delectable, with the combination of the ingredients well-balanced with the herbs and spices and the broth.",
      author: "Fulbert",
      date: "April 2026",
    },
  },
} as const;
