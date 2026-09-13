/**
 * The homepage sections, in scroll order.
 *
 * Shared between the page, which renders each section with the matching id,
 * and the rail, which marks each one as a pillar on the strand. Keeping one
 * list means a section cannot exist without a pillar, or the reverse.
 */
export type HomeSection = {
  id: string;
  /** Shown beside the pillar when the reader reaches that section. */
  label: string;
};

export const HOME_SECTIONS: HomeSection[] = [
  { id: "hero", label: "7 Noodles" },
  { id: "story", label: "麻辣" },
  { id: "showcase", label: "招牌" },
  { id: "categories", label: "菜单" },
  { id: "about", label: "恰" },
  { id: "reviews", label: "食客" },
  { id: "contact", label: "联系" },
];
