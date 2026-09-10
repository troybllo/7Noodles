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

export type StoryFact = {
  zh: string;
  title: string;
  body: string;
};

export const STORY = {
  eyebrow: "麻辣",
  /**
   * Authored as separate lines so each can be masked and revealed on scroll.
   * They re-wrap freely at narrow widths; the reveal animates the block, so a
   * wrapped line still reads correctly.
   */
  statement: ["Numbing first.", "Then the heat arrives."],
  lede: "Sichuan peppercorn before chilli, in that order, on purpose. It is the whole argument of this kitchen, and it is why a bowl here does not taste like a bowl anywhere else on Yonge Street.",
  facts: [
    {
      zh: "乐山",
      title: "Leshan skewers",
      body: "Fried to order and tossed in chilli. Street food from a city that takes it seriously.",
    },
    {
      zh: "抄手",
      title: "Folded by hand",
      body: "Wontons pleated one at a time, then dressed in red oil, sesame and garlic, or dropped into chicken soup.",
    },
    {
      zh: "蒋三娘",
      title: "Named for someone",
      body: "Grandma Jiang's osmanthus jelly. Aunt Zhao's burning noodles. Dishes here carry the names of the people they came from.",
    },
  ] satisfies StoryFact[],
} as const;
