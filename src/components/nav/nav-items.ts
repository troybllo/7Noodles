import { CONTACT } from "@/content/contact";

export type NavLink = {
  href: string;
  label: string;
  /** Chinese label, shown in the mobile menu beside the English. */
  zh: string;
};

export type NavItem = NavLink & {
  /** When present, the item opens a small menu of these links instead of navigating. */
  children?: NavLink[];
};

/** The primary navigation. */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/order",
    label: "Order online",
    zh: "在线点餐",
    children: [
      { href: "/order", label: "Order for pickup", zh: "到店自取" },
      {
        href: CONTACT.phone.href,
        label: `Call ${CONTACT.phone.display}`,
        zh: "电话点餐",
      },
    ],
  },
  { href: "/menu", label: "Menus", zh: "菜单" },
  {
    href: "/events",
    label: "Events",
    zh: "活动",
    children: [
      { href: "/events#upcoming", label: "What's on", zh: "近期活动" },
      { href: "/events#past", label: "Past events", zh: "往期回顾" },
    ],
  },
  { href: "/locations", label: "Locations", zh: "门店" },
  {
    href: "/#story",
    label: "Explore",
    zh: "探索",
    children: [
      { href: "/about", label: "Our story", zh: "品牌故事" },
      { href: "/#chapters", label: "How to eat dry noodles", zh: "干拌面怎么吃" },
      { href: "/#showcase", label: "What to order", zh: "招牌推荐" },
      { href: "/#reviews", label: "Reviews", zh: "食客评价" },
    ],
  },
];

/** Whether a nav item, or any of its links, is the page being viewed. */
export function isCurrent(item: NavItem, pathname: string): boolean {
  const hrefs = [item.href, ...(item.children ?? []).map((child) => child.href)].filter(
    (href) => href.startsWith("/") && !href.includes("#"),
  );
  return hrefs.some((href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href),
  );
}
