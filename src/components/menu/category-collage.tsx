import Image from "next/image";
import Link from "next/link";
import { PhotoSlot } from "@/components/media/photo-slot";
import type { MenuCategory } from "@/lib/menu";
import { CATEGORY_COVERS, DISH_MEDIA, type Media } from "@/content/menu-media";
import { PANEL_OPACITY } from "@/design/backdrop";

/** Two full rows of three when a category has the dishes for it, else one row. */
function tileCount(dishes: number): number {
  return dishes >= 6 ? 6 : 3;
}

/**
 * A collage of a category's dishes on the menu overview, and the way into that
 * category: the whole collage is a single link.
 *
 * Each tile is a dish's photograph. Until the shoot most dishes have none, so a
 * tile falls back to the category cover (first tile only, since the cover is
 * not tied to one dish) and then to a placeholder named for the dish, which
 * keeps the collage honest and doubles as the shot list.
 *
 * The photographs are decorative inside the link; the link's own label names
 * the category, so a screen reader hears one destination, not six images.
 * Hovering raises a panel inviting the click, and keyboard focus raises the
 * same panel, because a collage that only explains itself to a mouse says
 * nothing to someone tabbing through the page.
 */
export function CategoryCollage({ category }: { category: MenuCategory }) {
  const cover = CATEGORY_COVERS[category.slug];
  const dishes = category.items.slice(0, tileCount(category.items.length));

  return (
    <Link
      href={`/menu/${category.slug}`}
      aria-label={`Show all ${category.itemCount} ${category.nameEn} dishes`}
      className="group border-rice/15 bg-rice/15 focus-visible:outline-lantern relative grid grid-cols-3 gap-px border outline-offset-4"
    >
      {dishes.map((dish, index) => {
        const photo: Media | undefined =
          DISH_MEDIA[dish.slug]?.photo ?? (index === 0 ? cover : undefined);

        return (
          <div
            key={dish.slug}
            data-ink
            className="bg-ink-soft relative aspect-[4/3] overflow-hidden"
          >
            <div className="absolute inset-0 transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:scale-[1.04]">
              {photo ? (
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 340px, 33vw"
                  quality={75}
                  className="object-cover"
                />
              ) : (
                <PhotoSlot label={dish.nameEn} tone="bg-ink-soft" compact />
              )}
            </div>
          </div>
        );
      })}

      {/* The invitation to click. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className="text-rice border-rice/20 scale-90 border px-7 py-3.5 text-xs tracking-[0.24em] uppercase opacity-0 backdrop-blur-md transition-[opacity,transform] duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
          style={{ backgroundColor: `rgb(18 16 14 / ${PANEL_OPACITY})` }}
        >
          Show dishes →
        </span>
      </div>
    </Link>
  );
}
