/**
 * The four chapters in the home page's slide-over run: who we are and how we
 * cook, rather than what is on the menu (the menu page has that).
 *
 * FOR THE OWNER'S REVIEW. Every claim about the kitchen is taken from the
 * owner's own menu descriptions (data/menu-items.md): house-made noodles, a
 * braising broth of nearly fifteen spices, house-made chili paste and roasted
 * pepper sauce, chef's specials wok-fried to order, pork belly "翻锅50次".
 * Nothing about the restaurant's history is invented. The Chinese needs a
 * native review.
 */

export type Step = {
  title: string;
  body: string;
  /** A dish slug whose photograph illustrates the step (see DISH_MEDIA). */
  photo: string;
};

export const HOW_TO_EAT = {
  index: "01",
  label: "How to eat",
  title: "How to eat dry noodles",
  titleZh: "干拌面怎么吃",
  intro:
    "Our dry noodles — 干拌面 — arrive with the sauce waiting at the bottom of the bowl. A few seconds with your fork is what turns a bowl of noodles into the dish.",
  steps: [
    {
      title: "Find the sauce",
      body: "Chili oil and our secret sauce sit at the bottom, under the noodles and toppings.",
      photo: "wanza-noodles",
    },
    {
      title: "Toss from the bottom",
      body: "Lift the noodles from underneath and fold them over until every strand is red.",
      photo: "dandan-noodles",
    },
    {
      title: "Eat it while it's hot",
      body: "Dry noodles don't wait. Eat them while the oil is warm and the noodles still have their bite.",
      photo: "double-cooked-pork-belly-noodles",
    },
  ] satisfies Step[],
} as const;

export const SIGNATURES = {
  index: "02",
  label: "Signature",
  title: "Signature dishes",
  titleZh: "招牌",
  intro: "The bowls the kitchen is proudest of. Start here.",
  /** One line each, written from the owner's descriptions. Order is the owner's. */
  dishes: [
    {
      slug: "wanza-noodles",
      line: "Slow-cooked yellow peas and Sichuan pork sauce over our own noodles.",
    },
    {
      slug: "dandan-noodles",
      line: "House-smoked diced pork, preserved greens and crushed peanuts.",
    },
    {
      slug: "double-cooked-pork-belly-noodles",
      line: "Twice-cooked pork belly, tossed in the wok fifty times.",
    },
    {
      slug: "super-spicy-beef-or-chicken-noodles",
      line: "Six chilies, fresh from the wok. For serious spice lovers.",
    },
    {
      slug: "signature-braised-beef-noodle-soup",
      line: "Beef braised in a broth of nearly fifteen spices.",
    },
    {
      slug: "wontons-in-red-chili-oil",
      line: "Our dumplings, folded in house, in red chili oil.",
    },
  ],
} as const;

export const NUMBING = {
  index: "03",
  label: "Má",
  title: "The numbing",
  titleZh: "麻",
  intro:
    "Chongqing xiaomian is 麻辣 — má là. Là is the heat of chili. Má is the tingle of Sichuan peppercorn: a buzzing on the lips and tongue that arrives before the burn.",
  order:
    "Numbing first, heat second, on purpose. Get it the wrong way round and it is just spicy food.",
  adjust:
    "Want less tingle or less heat? Ask — the chef's specials can be made milder, hotter, or not spicy at all.",
  photo: "mala-noodle-soup",
} as const;

export const KITCHEN = {
  index: "04",
  label: "The kitchen",
  title: "What goes on in the kitchen",
  titleZh: "后厨",
  intro:
    "Nothing on the table is bought in a jar. This is what happens before a bowl reaches you.",
  steps: [
    {
      title: "Noodles, made here",
      body: "Our noodles are made in house, for bite and spring.",
      photo: "extra-noodles",
    },
    {
      title: "A broth of fifteen spices",
      body: "Nearly fifteen spices and our own Sichuan chili paste, with beef, tendon or intestine braised in it until tender.",
      photo: "extra-braised-beef",
    },
    {
      title: "Sauces from scratch",
      body: "Our roasted pepper sauce and chili paste are made in our kitchen.",
      photo: "extra-roasted-pepper-sauce",
    },
    {
      title: "Wok-fried to order",
      body: "Chef's specials hit a hot wok the moment you order — the pork belly is tossed fifty times.",
      photo: "double-cooked-pork-belly-noodles",
    },
  ] satisfies Step[],
} as const;
