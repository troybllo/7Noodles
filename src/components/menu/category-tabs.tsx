import Link from "next/link";
import type { MenuCategory } from "@/lib/menu";

type CategoryTabsProps = {
  categories: MenuCategory[];
  /** Slug of the category being viewed, if any. */
  active?: string;
  /**
   * Link to sections on the current page (`#slug`) rather than to each
   * category's own page. Used on the overview, where every category is set out
   * in turn.
   */
  anchors?: boolean;
  tone: "red" | "cream";
};

/**
 * The row of category tabs across the top of the menu.
 *
 * These are links, not client-side tab state: each category is its own page
 * with its own address, so it can be shared, bookmarked and indexed. The
 * current one carries aria-current rather than only a highlight. On the
 * overview they jump to that category's section instead.
 *
 * On narrow screens the row scrolls sideways instead of wrapping into a block.
 */
export function CategoryTabs({
  categories,
  active,
  anchors = false,
  tone,
}: CategoryTabsProps) {
  // Every tab carries its own solid ground. The lanterns and the plum branch
  // can pass behind the row, and text on a pill never depends on what is behind.
  // Paper pills. Every tab carries its own solid ground, so the lanterns and
  // the plum branch can pass behind the row without touching its text.
  const base =
    tone === "red"
      ? "border-cream/45 bg-chili text-cream hover:border-cream"
      : "border-ink/25 bg-cream text-ink hover:border-ink";
  const current =
    tone === "red" ? "border-cream bg-cream text-ink" : "border-ink bg-ink text-cream";

  return (
    <nav
      aria-label="Menu categories"
      className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
    >
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center">
        {categories.map((category) => {
          const isActive = category.slug === active;
          const pill = `font-nav flex items-baseline gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold whitespace-nowrap uppercase transition-colors duration-[--duration-fast] ${
            isActive ? current : base
          }`;
          const label = (
            <>
              <span
                lang="zh"
                className="font-brush text-base tracking-normal normal-case"
              >
                {category.nameZh}
              </span>
              <span>{category.nameEn}</span>
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
