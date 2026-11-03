/**
 * The brand story, as the restaurant wrote it in its brand guide
 * (data/brand/7 Noodles Brand Guide Line .pdf, page 4). The English is theirs
 * word for word, split into chapters at their paragraph breaks; only a double
 * space was tidied. The Chinese is theirs too, and is not a translation of the
 * English — each stands on its own, so both are shown.
 */

export const ABOUT = {
  nameZh: "恰小面",
  nameEn: "7 Noodles",
  heading: "Our story",
  headingZh: "品牌故事",
  /** The brand's line, in both languages. */
  tagline: { en: "Come for a bowl. Stay for a little warmth.", zh: "一筷入魂，恰一碗川味人间" },
  lede: "In Sichuan and Chongqing, a bowl of noodles is part of everyday life.",
  story: {
    everyday: {
      title: "A bowl of everyday life",
      body: "In Sichuan and Chongqing, a bowl of noodles is part of everyday life. It might be a quick breakfast at a street-side shop or a familiar meal after a long day. The pleasure is simple: bold flavours, a satisfying bowl, and a moment to enjoy it.",
    },
    qia: {
      title: "恰 means to eat",
      body: "That is the spirit we bring to Toronto at 7 Noodles, known in Chinese as 恰小面. “Qia” means “to eat” which is a simple invitation to pull up a chair and share the food we love.",
    },
    wanza: {
      title: "Our signature Wanza",
      body: "At the heart of our menu is our signature Wanza Noodles: springy noodles topped with soft yellow peas and savoury minced pork sauce, brought together with fragrant chili oil and Sichuan seasonings. Give the bowl a good mix. The peas soften into the sauce, coating the noodles so every bite carries their comforting richness and a gentle, tingling heat.",
    },
    roots: {
      title: "Our roots",
      body: "Our inspiration comes from the everyday food culture of Sichuan and Chongqing, the care behind a familiar recipe, the bustle of a neighbourhood noodle shop, and the warmth of welcoming someone to the table. We honour those roots through the flavours we serve and the details we share.",
    },
    welcome: {
      title: "A place at our table",
      body: "Whether Wanza is a taste of home or your first introduction to Sichuan-style noodles, there is a place for you at our table.",
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
