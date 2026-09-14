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

/**
 * The primary navigation, labelled as in the approved hero mockup.
 *
 * Every link goes somewhere real. Sustainability has no content yet, so its page
 * says so plainly until the owner supplies it. The Chinese labels need a native
 * review.
 */
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
    href: "/sustainability",
    label: "Sustainability",
    zh: "可持续",
    children: [{ href: "/sustainability", label: "Our approach", zh: "我们的做法" }],
  },
  { href: "/locations", label: "Locations", zh: "门店" },
  {
    href: "/#story",
    label: "Explore",
    zh: "探索",
    children: [
      { href: "/#story", label: "Our story", zh: "品牌故事" },
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
