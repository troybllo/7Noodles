import Image from "next/image";
import Link from "next/link";
import { PhotoSlot } from "@/components/media/photo-slot";
import { formatCad } from "@/lib/money";
import type { MenuCategory } from "@/lib/menu";
import { CATEGORY_COVERS } from "@/content/menu-media";

/**
 * A category on the menu overview, linking through to its dishes.
 *
 * Hovering raises a blurred panel inviting the click, after the reference. The
 * same panel appears on keyboard focus: a card that only explains itself to a
 * mouse says nothing to someone tabbing through the page.
 */
export function CategoryCard({ category }: { category: MenuCategory }) {
  const cover = CATEGORY_COVERS[category.slug];
  const range =
    category.minPriceCents === category.maxPriceCents
      ? formatCad(category.minPriceCents)
      : `${formatCad(category.minPriceCents)} – ${formatCad(category.maxPriceCents)}`;

  return (
    <Link
      href={`/menu/${category.slug}`}
      className="group border-rice/12 bg-ink-deep focus-visible:outline-lantern relative flex flex-col border outline-offset-[-2px]"
    >
      <div data-ink className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:scale-[1.04]">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={75}
              className="object-cover"
            />
          ) : (
            <PhotoSlot label={`${category.nameEn} — category cover`} tone="bg-ink-soft" />
          )}
        </div>

        {/* The invitation to click. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="bg-ink/70 text-rice border-rice/20 scale-90 border px-6 py-3 text-xs tracking-[0.24em] uppercase opacity-0 backdrop-blur-md transition-[opacity,transform] duration-[--duration-base] ease-[--ease-out-expo] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
            View dishes →
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p lang="zh" className="font-round-cjk text-lantern text-2xl leading-none">
          {category.nameZh}
        </p>
        <h2 className="font-round text-rice text-xl leading-snug font-semibold">
          {category.nameEn}
        </h2>
        <p className="text-rice text-sm">
          {category.itemCount} {category.itemCount === 1 ? "dish" : "dishes"} · {range}
        </p>
      </div>
    </Link>
  );
}
