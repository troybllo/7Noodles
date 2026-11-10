import Image from "next/image";
import type { MenuCategory } from "@/lib/menu";
import { CATEGORY_COVERS, DISH_MEDIA } from "@/content/menu-media";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { DishCard } from "./dish-card";
import { DishRow } from "./dish-row";
import { InkRevealGrid } from "./ink-reveal-grid";

/**
 * A category's dishes. Photographed dishes are cards in a grid; the rest are
 * set as lines of a printed menu beneath them, so nothing on the menu is an
 * empty frame. A category with no dish photographs but a cover photograph
 * (the skewers, shot as platters) sets its list beside that photograph.
 */
export function CategoryDishes({
  category,
  className = "",
}: {
  category: MenuCategory;
  className?: string;
}) {
  const pictured = category.items.filter((item) => DISH_MEDIA[item.slug]?.photo);
  const listed = category.items.filter((item) => !DISH_MEDIA[item.slug]?.photo);
  const cover = pictured.length === 0 ? CATEGORY_COVERS[category.slug] : undefined;

  const n = pictured.length;
  // One or two photographs sit beside the list, so it keeps to one column.
  const beside = n > 0 && n <= 2;
  const list =
    listed.length > 0 ? (
      <ul
        className={`grid gap-x-12 ${cover ? "border-brand/15 border-t" : beside ? "" : "lg:grid-cols-2"}`}
      >
        {listed.map((item) => (
          <DishRow key={item.slug} item={item} categorySlug={category.slug} />
        ))}
      </ul>
    ) : null;

  // Odd counts lead with a featured card so the two-column rows fill; at
  // `lg`, five or nine cards fill four columns when the first takes a 2×2.
  const feature = n % 2 === 1 && n > 1 ? (n % 4 === 1 ? "hero" : "wide") : undefined;
  const columns = n === 3 || n === 6 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  const grid = (cols: string) => (
    <InkRevealGrid
      className={`grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 ${cols}`}
    >
      {pictured.map((item, index) => (
        <DishCard
          key={item.slug}
          item={item}
          categorySlug={category.slug}
          feature={index === 0 ? feature : undefined}
        />
      ))}
    </InkRevealGrid>
  );
  const also = (
    <p className="eyebrow text-brand-deep border-brand/15 border-b pb-3">
      Also in {category.nameEn.toLowerCase()}
    </p>
  );

  if (beside && list) {
    return (
      <div className={`grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16 ${className}`}>
        {grid("")}
        <div>
          {also}
          {list}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {n > 0 ? grid(columns) : null}

      {list && n > 0 ? (
        <div className="mt-14 md:mt-20">
          {also}
          {list}
        </div>
      ) : null}

      {list && n === 0 ? (
        cover ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="lg:sticky lg:top-[calc(var(--rail-h,4.25rem)+5.5rem)] lg:self-start">
              <RevealFrame className="bg-paper shadow-lift p-[0.4rem]">
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </RevealFrame>
            </div>
            {list}
          </div>
        ) : (
          list
        )
      ) : null}
    </div>
  );
}
