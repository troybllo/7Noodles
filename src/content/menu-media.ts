/**
 * Dish photography, keyed by slug: the restaurant's shoot, one shot per dish,
 * 2400px WebP in public/photos/dishes. A dish without an entry is listed
 * as a line under the photographs (see category-dishes.tsx).
 */

export type Media = { src: string; alt: string };

export type DishMedia = { photo?: Media };

/** The photograph that leads each category on the menu and the home page. */
export const CATEGORY_COVERS: Partial<Record<string, Media>> = {
  "traditional-xiaomian": {
    src: "/photos/dishes/wanza-noodles.webp",
    alt: "Wanza noodles: slow-cooked yellow peas and pork sauce over noodles, with preserved greens, peanuts and scallion",
  },
  "chefs-special-noodles": {
    src: "/photos/dishes/double-cooked-pork-belly-noodles.webp",
    alt: "Dry noodles topped with wok-fried twice-cooked pork belly, leeks and green chilies",
  },
  "noodles-in-soup": {
    src: "/photos/dishes/signature-braised-beef-noodle-soup.webp",
    alt: "Braised beef noodle soup with tender beef chunks, greens and cilantro",
  },
  "sichuan-wontons": {
    src: "/photos/dishes/wontons-in-red-chili-oil.webp",
    alt: "Sichuan wontons in red chili oil with scallion",
  },
  "something-special": {
    src: "/photos/dishes/seafood-noodles-in-satay-broth.webp",
    alt: "Seafood noodles in satay broth with mussels, shrimp, squid and tofu puffs",
  },
  "leshan-fried-skewers": {
    src: "/photos/dishes/leshan-skewers-platter.webp",
    alt: "A platter of Leshan fried skewers: beef, chicken wings, sausages, corn, cauliflower and squid balls",
  },
  appetizers: {
    src: "/photos/dishes/chicken-in-chili-oil.webp",
    alt: "Sliced chicken in chili oil and roasted pepper sauce with scallion",
  },
  "extra-toppings": {
    src: "/photos/dishes/extra-braised-beef.webp",
    alt: "A side of braised beef in its sauce",
  },
};

export const DISH_MEDIA: Partial<Record<string, DishMedia>> = {
  "wanza-noodles": {
    photo: {
      src: "/photos/dishes/wanza-noodles.webp",
      alt: "Wanza noodles: slow-cooked yellow peas and pork sauce over noodles, with preserved greens, peanuts and scallion",
    },
  },
  "zajiang-noodles": {
    photo: {
      src: "/photos/dishes/zajiang-noodles.webp",
      alt: "Zajiang noodles topped with minced pork sauce, peanuts and scallion",
    },
  },
  "yellow-pea-noodles": {
    photo: {
      src: "/photos/dishes/yellow-pea-noodles.webp",
      alt: "Yellow pea noodles: a mound of soft stewed peas over noodles with scallion and sesame",
    },
  },
  "dandan-noodles": {
    photo: {
      src: "/photos/dishes/dandan-noodles.webp",
      alt: "Dandan noodles with a fried egg, diced smoked pork, preserved greens and crushed peanuts",
    },
  },
  "egg-and-tomato-noodles": {
    photo: {
      src: "/photos/dishes/egg-and-tomato-noodles.webp",
      alt: "Noodles under a glossy sauce of scrambled egg and tomato with scallion",
    },
  },
  "mala-noodle-soup": {
    photo: {
      src: "/photos/dishes/mala-noodle-soup.webp",
      alt: "Mala noodles in red chili broth with crushed peanuts and scallion",
    },
  },
  "wanzhou-cold-noodles": {
    photo: {
      src: "/photos/dishes/wanzhou-cold-noodles.webp",
      alt: "Wanzhou cold noodles with carrot, bean sprouts, cilantro and crushed peanuts",
    },
  },
  "double-cooked-pork-belly-noodles": {
    photo: {
      src: "/photos/dishes/double-cooked-pork-belly-noodles.webp",
      alt: "Dry noodles topped with wok-fried twice-cooked pork belly, leeks and green chilies",
    },
  },
  "pickled-pepper-chicken-gizzard-noodles": {
    photo: {
      src: "/photos/dishes/pickled-pepper-chicken-gizzard-noodles.webp",
      alt: "Dry noodles with chicken gizzard stir-fried with pickled peppers and chilies",
    },
  },
  "super-spicy-beef-or-chicken-noodles": {
    photo: {
      src: "/photos/dishes/super-spicy-beef-or-chicken-noodles.webp",
      alt: "Dry noodles with beef wok-fried with green and red chilies",
    },
  },
  "cumin-beef-noodles": {
    photo: {
      src: "/photos/dishes/cumin-beef-noodles.webp",
      alt: "Dry noodles with cumin beef, onions, green chilies and cilantro",
    },
  },
  "stir-fried-noodles": {
    photo: {
      src: "/photos/dishes/stir-fried-noodles.webp",
      alt: "Wok-fried noodles with beef, cabbage, carrot and bean sprouts",
    },
  },
  "signature-braised-beef-noodle-soup": {
    photo: {
      src: "/photos/dishes/signature-braised-beef-noodle-soup.webp",
      alt: "Braised beef noodle soup with tender beef chunks, greens and cilantro",
    },
  },
  "braised-beef-tendon-noodle-soup": {
    photo: {
      src: "/photos/dishes/braised-beef-tendon-noodle-soup.webp",
      alt: "Braised beef tendon noodle soup with cilantro and greens",
    },
  },
  "braised-pork-intestine-noodle-soup": {
    photo: {
      src: "/photos/dishes/braised-pork-intestine-noodle-soup.webp",
      alt: "Braised pork intestine noodle soup with cilantro",
    },
  },
  "clear-broth-beef-noodle-soup": {
    photo: {
      src: "/photos/dishes/clear-broth-beef-noodle-soup.webp",
      alt: "Beef brisket in clear broth over noodles, topped with crispy garlic and celery",
    },
  },
  "chicken-mushroom-noodle-soup": {
    photo: {
      src: "/photos/dishes/chicken-mushroom-noodle-soup.webp",
      alt: "Chicken noodle soup with mushrooms and cilantro",
    },
  },
  "wontons-in-red-chili-oil": {
    photo: {
      src: "/photos/dishes/wontons-in-red-chili-oil.webp",
      alt: "Sichuan wontons in red chili oil with scallion",
    },
  },
  "wontons-in-sesame-sauce": {
    photo: {
      src: "/photos/dishes/wontons-in-sesame-sauce.webp",
      alt: "Sichuan wontons in garlic sesame sauce with scallion and sesame seeds",
    },
  },
  "seafood-noodles-in-satay-broth": {
    photo: {
      src: "/photos/dishes/seafood-noodles-in-satay-broth.webp",
      alt: "Seafood noodles in satay broth with mussels, shrimp, squid and tofu puffs",
    },
  },
  "biangbiang-noodles": {
    photo: {
      src: "/photos/dishes/biangbiang-noodles.webp",
      alt: "BiangBiang noodles with tomato and egg, minced pork, greens and hot chili oil",
    },
  },
  "creamy-mushroom-chicken-noodles": {
    photo: {
      src: "/photos/dishes/creamy-mushroom-chicken-noodles.webp",
      alt: "Wide noodles in a creamy mushroom sauce with chicken and parsley",
    },
  },
  "spicy-beef-jerky": {
    photo: {
      src: "/photos/dishes/spicy-beef-jerky.webp",
      alt: "Spicy beef jerky in chili oil with sesame and scallion",
    },
  },
  "popcorn-chicken": {
    photo: {
      src: "/photos/dishes/popcorn-chicken.webp",
      alt: "A bowl of crisp popcorn chicken",
    },
  },
  "crispy-pork-strips": {
    photo: {
      src: "/photos/dishes/crispy-pork-strips.webp",
      alt: "Crispy fried pork strips with Sichuan peppercorn",
    },
  },
  "chicken-in-chili-oil": {
    photo: {
      src: "/photos/dishes/chicken-in-chili-oil.webp",
      alt: "Sliced chicken in chili oil and roasted pepper sauce with scallion",
    },
  },
  "preserved-eggs-roasted-pepper": {
    photo: {
      src: "/photos/dishes/preserved-eggs-roasted-pepper.webp",
      alt: "Preserved egg wedges around roasted pepper sauce with cilantro",
    },
  },
  "happy-cucumber-and-peanuts": {
    photo: {
      src: "/photos/dishes/happy-cucumber-and-peanuts.webp",
      alt: "Diced cucumber tossed with peanuts and chili",
    },
  },
  "extra-braised-beef": {
    photo: {
      src: "/photos/dishes/extra-braised-beef.webp",
      alt: "A side of braised beef in its sauce",
    },
  },
  "extra-braised-beef-tendon": {
    photo: {
      src: "/photos/dishes/extra-braised-beef-tendon.webp",
      alt: "A side of braised beef tendon",
    },
  },
  "extra-braised-pork-intestine": {
    photo: {
      src: "/photos/dishes/extra-braised-pork-intestine.webp",
      alt: "A side of braised pork intestines",
    },
  },
  "extra-meat-sauce": {
    photo: {
      src: "/photos/dishes/extra-meat-sauce.webp",
      alt: "A side of Sichuan pork meat sauce",
    },
  },
  "extra-yellow-peas": {
    photo: {
      src: "/photos/dishes/extra-yellow-peas.webp",
      alt: "A side of slow-stewed yellow peas",
    },
  },
  "extra-roasted-pepper-sauce": {
    photo: {
      src: "/photos/dishes/extra-roasted-pepper-sauce.webp",
      alt: "A side of house-made roasted pepper sauce",
    },
  },
  "extra-fried-egg": {
    photo: { src: "/photos/dishes/extra-fried-egg.webp", alt: "A pan-fried egg" },
  },
  "extra-vegetables": {
    photo: {
      src: "/photos/dishes/extra-vegetables.webp",
      alt: "A side of blanched greens",
    },
  },
  "extra-noodles": {
    photo: {
      src: "/photos/dishes/extra-noodles.webp",
      alt: "A bowl of house-made noodles",
    },
  },
};
