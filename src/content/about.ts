/**
 * The brand story, in the restaurant's own words (revised November 2026).
 * The English is theirs, with two typos fixed; the Chinese is theirs too and
 * is not a translation of the English, so both are shown.
 */

export const ABOUT = {
  nameZh: "恰小面",
  nameEn: "7 Noodles",
  heading: "Our story",
  headingZh: "品牌故事",
  /** The brand's line, in both languages. */
  tagline: {
    en: "A taste of Sichuan. A little everyday comfort. A bowl to come back for.",
    zh: "一筷入魂，恰一碗川味人间",
  },
  lede: "Our name begins with 恰, a regional expression meaning “to eat.”",
  story: {
    name: {
      title: "恰 means to eat",
      body: "Our name, 恰小面 (Qia Xiaomian - 7 Noodles), begins with “恰,” a regional expression meaning “to eat,” which has the same pronunciation as 7 in Mandarin. To us, eating noodles is not only about the bold flavours and fragrant chili oil. It is also about slowing down, finding comfort in a familiar bowl, and enjoying life’s simple pleasures.",
    },
    roots: {
      title: "Rooted in Sichuan and Chongqing",
      body: "Inspired by the food traditions of Sichuan and Chongqing, we keep learning, refining our craft, and staying true to the flavours that brought us here. In Toronto, we look forward to welcoming you to our table.",
    },
  },
  /** The Chinese story, line by line as set in the guide. */
  storyZh: [
    "一碗豌杂，是巴蜀街头最动人的人间烟火。",
    "我们取名「恰小面」，“恰”即是吃。恰面，吃面不仅是在一碗麻辣鲜香，更是对于生活的态度。寻味川渝，学习沉淀，我们愿以温柔坚定之心，守本求真之意，延续川味的传统。在多伦多，我们永远期待和您的见面，也期待您来恰·面。",
    "一筷入魂，恰一碗川味人间",
  ],
  /**
   * The room, as published, and an excerpt from a real review, attributed as
   * it was posted. The excerpt removes one stray space from the original
   * ("well -balanced"); the full text is in content/reviews.ts.
   */
  aside: {
    room: {
      title: "The room",
      body: "Below street level at Yonge and Florence, open every day from eleven until ten.",
    },
    quote: {
      text: "The Braised Beef Noodle Soup and Wonton in Chicken Soup were both delectable, with the combination of the ingredients well-balanced with the herbs and spices and the broth.",
      author: "Fulbert",
      date: "April 2026",
    },
  },
} as const;
