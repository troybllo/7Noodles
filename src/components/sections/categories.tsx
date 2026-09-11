import { CATEGORIES } from "@/content/categories";
import { CategoryPanel } from "./category-panel";
import { CategoriesTrack } from "./categories-track";

/**
 * The category run.
 *
 * Sits above the showcase in the stacking order so that, with the showcase
 * stuck to the top of the viewport, this section scrolls up over it and covers
 * it. That overlap is pure CSS — no scroll handler, nothing to jank, and it
 * degrades to ordinary stacking wherever sticky is unavailable.
 */
export function Categories() {
  return (
    <section
      id="categories"
      data-nav-theme="light"
      className="bg-rice relative z-10 w-full"
    >
      <h2 className="sr-only">What we cook</h2>
      <CategoriesTrack>
        {CATEGORIES.map((category) => (
          <CategoryPanel key={category.slug} category={category} />
        ))}
      </CategoriesTrack>
    </section>
  );
}
