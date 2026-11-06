/** Hero copy: the name, its two photographs (the signature wanza and braised beef), and the call to action. */
export const HERO = {
  title: "Seven Noodles",
  nameZh: "恰小面",
  action: { label: "Order now", href: "/order" },
  photos: {
    primary: {
      src: "/photos/dishes/wanza-noodles.webp",
      alt: "Wanza noodles: slow-cooked yellow peas and pork sauce over noodles, with preserved greens, peanuts and scallion",
    },
    secondary: {
      src: "/photos/dishes/signature-braised-beef-noodle-soup.webp",
      alt: "Braised beef noodle soup with tender beef chunks, greens and cilantro",
    },
  },
} as const;
