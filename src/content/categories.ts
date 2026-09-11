/**
 * The four categories previewed in the horizontal run.
 *
 * Four rather than all seven, deliberately: each panel is a full viewport of
 * horizontal travel, and seven would trap the reader in the section.
 *
 * Every name, Chinese name and price is taken from data/menu-source.json, the
 * capture of the restaurant's own menu. Nothing here is invented.
 */

export type CategoryDish = {
  nameEn: string;
  nameZh: string;
  /** What the photograph should be. Each one is a shot-list line. */
  shot: string;
};

export type Category = {
  slug: string;
  index: string;
  nameEn: string;
  nameZh: string;
  /** One line on what the category is. Needs the owner's sign-off. */
  note: string;
  /** Photographed dishes, in the order the collage places them. */
  dishes: CategoryDish[];
  /** Called out in the corner block. */
  signature: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "dry-and-fried-noodles",
    index: "01",
    nameEn: "Dry Noodles & Fried Noodles",
    nameZh: "干拌面&炒面",
    note: "Sauced rather than soupy. Tossed at the pass so nothing sits.",
    dishes: [
      {
        nameEn: "Signature Wanza Noodles",
        nameZh: "招牌干馏豌杂面",
        shot: "Wanza noodles, overhead, chopsticks lifting",
      },
      {
        nameEn: "Dandan Noodle",
        nameZh: "腊肉丁丁担担面",
        shot: "Dandan noodles, close, sesame and chilli",
      },
      {
        nameEn: "Double-Cooked Pork Belly",
        nameZh: "回锅肉面",
        shot: "Pork belly noodles, three-quarter",
      },
      {
        nameEn: "Aunt Zhao's Burning Noodles",
        nameZh: "赵大嬢燃面",
        shot: "Burning noodles, dry, red oil pooling",
      },
      {
        nameEn: "Beef Stir-Fried Noodles",
        nameZh: "哞哞炒面",
        shot: "Wok toss mid-air, flame behind",
      },
      {
        nameEn: "Vegetarian Cold Noodles",
        nameZh: "素凉面",
        shot: "Cold noodles, overhead, flat light",
      },
    ],
    signature: ["招牌干馏豌杂面 · Signature Wanza", "赵大嬢燃面 · Aunt Zhao's Burning"],
  },
  {
    slug: "crispy-fried-skewer",
    index: "02",
    nameEn: "Crispy Fried Skewer",
    nameZh: "乐山油炸",
    note: "Leshan street food. Fried to order, tossed in chilli, eaten standing up.",
    dishes: [
      {
        nameEn: "Beef Skewers",
        nameZh: "牛肉串",
        shot: "Beef skewers in hand, against dark",
      },
      {
        nameEn: "Pork Belly Skewers",
        nameZh: "猪五花",
        shot: "Pork belly skewers, close, glistening",
      },
      {
        nameEn: "Chicken Cartilage",
        nameZh: "鸡脆骨",
        shot: "Cartilage skewers, overhead on paper",
      },
      {
        nameEn: "Cauliflower Skewers",
        nameZh: "花菜",
        shot: "Cauliflower skewers, charred edges",
      },
      { nameEn: "Chicken Wings", nameZh: "鸡翅中", shot: "Wings on skewers, side light" },
      {
        nameEn: "Cuttlefish Ball",
        nameZh: "花枝丸",
        shot: "Cuttlefish balls, tight crop",
      },
    ],
    signature: ["牛肉串 · Beef Skewers", "猪五花 · Pork Belly"],
  },
  {
    slug: "traditional-noodle-soup",
    index: "03",
    nameEn: "Traditional Noodle Soup",
    nameZh: "传统汤面",
    note: "Broth first. Everything else is built on top of it.",
    dishes: [
      {
        nameEn: "Braised Beef Noodle Soup",
        nameZh: "川味红烧牛肉面",
        shot: "Beef noodle soup, steam, shot into the light",
      },
      {
        nameEn: "Beef & Tendon",
        nameZh: "富贵牛肉牛筋面",
        shot: "Tendon noodle soup, overhead",
      },
      {
        nameEn: "Hong Kong Brisket",
        nameZh: "港式清汤牛腩面",
        shot: "Clear brisket broth, side profile",
      },
      {
        nameEn: "Braised All-in-One",
        nameZh: "至尊三合面",
        shot: "All-in-one bowl, everything visible",
      },
      {
        nameEn: "Classic Plain Street Noodles",
        nameZh: "麻辣小面",
        shot: "Street noodles, enamel bowl, plain ground",
      },
      {
        nameEn: "Tomato & Egg",
        nameZh: "华新番茄鸡蛋面",
        shot: "Tomato and egg soup, warm light",
      },
    ],
    signature: ["川味红烧牛肉面 · Braised Beef", "至尊三合面 · All-in-One"],
  },
  {
    slug: "appetizers",
    index: "04",
    nameEn: "Appetizers",
    nameZh: "凉菜",
    note: "Cold dishes, dressed to order. What arrives while the noodles are pulled.",
    dishes: [
      {
        nameEn: "Smashed Cucumber",
        nameZh: "爽口拍黄瓜",
        shot: "Smashed cucumber, overhead, garlic visible",
      },
      {
        nameEn: "Roasted Pepper Chicken",
        nameZh: "红油烧椒口水鸡",
        shot: "Mouth-watering chicken in red oil",
      },
      {
        nameEn: "Spicy Beef Jerky",
        nameZh: "冷吃牛肉",
        shot: "Cold-eaten beef, dark bowl, tight crop",
      },
      {
        nameEn: "Century Egg",
        nameZh: "烧椒皮蛋",
        shot: "Century egg with roasted pepper, overhead",
      },
      {
        nameEn: "Bamboo Shoot Salad",
        nameZh: "啷个那么笋",
        shot: "Bamboo shoot salad, pale, high key",
      },
      {
        nameEn: "Popcorn Chicken",
        nameZh: "盐酥鸡",
        shot: "Popcorn chicken, basket, steam",
      },
    ],
    signature: ["红油烧椒口水鸡 · Roasted Pepper Chicken", "冷吃牛肉 · Spicy Beef Jerky"],
  },
];
