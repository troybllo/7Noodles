import Image from "next/image";
import Link from "next/link";
import { PhotoSlot } from "@/components/media/photo-slot";
import type { MenuCategory } from "@/lib/menu";
import { CATEGORY_COVERS } from "@/content/menu-media";
import { TILE_SCRIM } from "@/design/backdrop";

type CategoryCardProps = {
  category: MenuCategory;
  /** Extra grid classes, for a tile that spans a short last row. */
  className?: string;
};

/**
 * A category on the menu overview: one photograph, and the whole of it is the
 * link through to that category's dishes.
 *
 * The name sits on the picture over a scrim rather than in a caption beneath,
 * so the grid reads as images. Hovering raises a blurred panel inviting the
 * click; the same panel appears on keyboard focus, because a tile that only
 * explains itself to a mouse says nothing to someone tabbing through the page.
 */
export function CategoryCard({ category, className }: CategoryCardProps) {
  const cover = CATEGORY_COVERS[category.slug];
  const dishes = `${category.itemCount} ${category.itemCount === 1 ? "dish" : "dishes"}`;

  return (
    <Link
      href={`/menu/${category.slug}`}
      className={`group bg-ink-soft focus-visible:outline-lantern relative block aspect-[4/3] overflow-hidden outline-offset-[-3px] ${className ?? ""}`}
    >
      <div data-ink className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:scale-[1.05]">
          {cover ? (
            <Image
              src={cover.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
              quality={75}
              className="object-cover"
            />
          ) : (
            <PhotoSlot
              label={`${category.nameEn} — category cover`}
              labelPosition="top"
              tone="bg-ink-soft"
            />
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgb(10 9 8 / ${TILE_SCRIM.base}) 0%, rgb(10 9 8 / ${TILE_SCRIM.underText}) 42%, transparent 78%)`,
        }}
      />

      {/* The invitation to click. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="bg-ink/70 text-rice border-rice/20 scale-90 border px-6 py-3 text-xs tracking-[0.24em] uppercase opacity-0 backdrop-blur-md transition-[opacity,transform] duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          View dishes →
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
        <div className="flex flex-col gap-2">
          <p lang="zh" className="font-round-cjk text-lantern text-2xl leading-none">
            {category.nameZh}
          </p>
          <h2 className="font-round text-rice text-xl leading-snug font-semibold">
            {category.nameEn}
          </h2>
        </div>
        <p className="text-rice shrink-0 text-sm">{dishes}</p>
      </div>
    </Link>
  );
}
