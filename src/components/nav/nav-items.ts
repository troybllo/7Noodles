export type NavItem = {
  href: string;
  label: string;
  /** Chinese label, shown alongside the English as the house typographic device. */
  zh: string;
};

/**
 * The four destinations the client asked for. The spine geometry is generated
 * from this list's length, so adding an item re-flows the strand rather than
 * needing new path data.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", zh: "首页" },
  { href: "/menu", label: "Menu", zh: "菜单" },
  { href: "/order", label: "Order", zh: "点餐" },
  { href: "/contact", label: "Contact", zh: "联系" },
];
