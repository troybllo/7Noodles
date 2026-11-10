import type { MenuCategory } from "@/lib/menu";
import { CategoryRail } from "./category-rail";

type CategoryTabsProps = {
  categories: MenuCategory[];
  /** Slug of the category being viewed, if any. */
  active?: string;
  /**
   * Link to sections on the current page (`#slug`) rather than to each
   * category's own page. Used on the overview and the order page, where every
   * category is set out in turn.
   */
  anchors?: boolean;
  className?: string;
};

/**
 * The rail of category tabs along the top of the menu, held under the
 * navigation bar as the page scrolls. Only names and slugs reach the client.
 */
export function CategoryTabs({ categories, ...rest }: CategoryTabsProps) {
  return (
    <CategoryRail
      categories={categories.map(({ slug, nameEn, nameZh }) => ({
        slug,
        nameEn,
        nameZh,
      }))}
      {...rest}
    />
  );
}
