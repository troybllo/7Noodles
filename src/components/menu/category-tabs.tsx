import Link from "next/link";
import type { MenuCategory } from "@/lib/menu";

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
 * The rail of category pills along the top of the menu, held under the
 * navigation bar as the page scrolls.
 *
 * These are links, not client-side tab state: each category is its own page
 * with its own address, so it can be shared, bookmarked and indexed. The
 * current one carries aria-current rather than only a highlight. On the
 * overview they jump to that category's section instead.
 *
 * On narrow screens the rail scrolls sideways instead of wrapping into a block.
 */
export function CategoryTabs({
  categories,
  active,
  anchors = false,
  className,
}: CategoryTabsProps) {
  return (
    <nav
      aria-label="Menu categories"
      className={`bg-paper/95 sticky top-16 z-30 -mx-6 [scrollbar-width:none] overflow-x-auto px-6 py-3 backdrop-blur-md md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      <ul className="flex w-max gap-2">
        {categories.map((category) => {
          const isActive = category.slug === active;
          const pill = `flex items-baseline gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-[--duration-fast] ${
            isActive
              ? "border-brand bg-brand text-paper border"
              : "border-brand/30 text-brand hover:border-brand border"
          }`;
          const label = (
            <>
              {category.nameEn}
              <span
                lang="zh"
                className={`font-cjk text-xs ${isActive ? "text-paper" : "text-brand-deep"}`}
              >
                {category.nameZh}
              </span>
            </>
          );

          return (
            <li key={category.slug}>
              {anchors ? (
                // A plain anchor, not a router link: this stays on the page, and
                // smooth scrolling takes it from here.
                <a href={`#${category.slug}`} className={pill}>
                  {label}
                </a>
              ) : (
                <Link
                  href={`/menu/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={pill}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
