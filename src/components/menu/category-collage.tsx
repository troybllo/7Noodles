import Image from "next/image";
import Link from "next/link";
import { TapedFrame } from "@/components/hand/taped-frame";
import { PhotoSlot } from "@/components/media/photo-slot";
import type { MenuCategory } from "@/lib/menu";
import { CATEGORY_COVERS, DISH_MEDIA, type Media } from "@/content/menu-media";

/** Two full rows of three when a category has the dishes for it, else one row. */
function tileCount(dishes: number): number {
  return dishes >= 6 ? 6 : 3;
}

/**
 * A collage of a category's dishes on the menu overview, and the way into that
 * category: the whole collage is a single link.
 *
 * The photographs sit on a sheet of cream paper taped to the red page, turned
 * slightly, as a spread cut from a menu and stuck up on the wall. Until the
 * shoot most dishes have no photograph, so a tile falls back to the category
 * cover (first tile only, since the cover is not tied to one dish) and then to
 * a placeholder named for the dish, which doubles as the shot list.
 *
 * The photographs are decorative inside the link; the link's own label names
 * the category, so a screen reader hears one destination, not six images.
 * Hovering straightens the sheet and raises a Show dishes button; keyboard
 * focus does the same, because a collage that only explains itself to a mouse
 * says nothing to someone tabbing through the page.
 */
export function CategoryCollage({
  category,
  tilt,
}: {
  category: MenuCategory;
  /** Degrees the sheet is turned at rest. */
  tilt: number;
}) {
  const cover = CATEGORY_COVERS[category.slug];
  const dishes = category.items.slice(0, tileCount(category.items.length));

  return (
    <Link
      href={`/menu/${category.slug}`}
      aria-label={`Show all ${category.itemCount} ${category.nameEn} dishes`}
      className="group focus-visible:outline-cream relative block outline-offset-8"
    >
      <TapedFrame
        tilt={tilt}
        className="text-base transition-[rotate] duration-[--duration-slow] ease-[--ease-out-expo] group-hover:!rotate-0 group-focus-visible:!rotate-0"
      >
        <div className="grid grid-cols-3 gap-[0.45em]">
          {dishes.map((dish, index) => {
            const photo: Media | undefined =
              DISH_MEDIA[dish.slug]?.photo ?? (index === 0 ? cover : undefined);

            return (
              <div
                key={dish.slug}
                data-ink
                className="bg-cream-paper relative aspect-[4/3] overflow-hidden"
              >
                <div className="absolute inset-0 transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:scale-[1.04]">
                  {photo ? (
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 330px, 33vw"
                      quality={75}
                      className="object-cover"
                    />
                  ) : (
                    <PhotoSlot
                      label={dish.nameEn}
                      tone="bg-cream-paper"
                      labelTone="text-ink/60"
                      compact
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TapedFrame>

      {/* The invitation to click. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="bg-ink text-cream scale-90 rounded-full px-8 py-3.5 font-mono text-base opacity-0 shadow-[0_0.4rem_1.2rem_rgb(20_8_6/0.35)] transition-[opacity,transform] duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          Show dishes →
        </span>
      </div>
    </Link>
  );
}
