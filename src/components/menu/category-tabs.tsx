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
  tone: "light" | "dark";
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
  const base =
    tone === "dark"
      ? "border-rice/25 bg-ink-deep text-rice hover:border-rice/60"
      : "border-ink/20 bg-rice text-ink hover:border-ink/60";
  // On the light pages the current tab is a filled pill rather than peach text:
  // small peach text measured 3.76:1 over the dragon's darkest strokes.
  const current =
    tone === "dark"
      ? "border-lantern bg-ink-deep text-lantern"
      : "border-ink bg-ink text-rice";

  return (
    <nav
      aria-label="Menu categories"
      className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
    >
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center">
        {categories.map((category) => {
          const isActive = category.slug === active;
          const pill = `flex items-baseline gap-2 border px-4 py-2 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-[--duration-fast] ${
            isActive ? current : base
          }`;
          const label = (
            <>
              <span lang="zh" className="font-round-cjk tracking-normal">
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
