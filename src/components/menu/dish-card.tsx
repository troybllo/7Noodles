import Link from "next/link";
import { formatCad } from "@/lib/money";
import type { MenuItem } from "@/lib/menu";
import { DISH_MEDIA } from "@/content/menu-media";
import { DishMedia } from "./dish-media";
import { DishTags } from "./dish-tags";

/**
 * One dish, Aritzia-style: a tall photograph, the name and price on one line,
 * the Chinese name beneath, then a row of tags. The whole card links to the
 * dish's own page.
 *
 * The reference puts a star rating where the tags sit. There are no per-dish
 * ratings, so the row carries what is actually known — spice level and
 * dietary tags.
 */
export function DishCard({
  item,
  categorySlug,
}: {
  item: MenuItem;
  categorySlug: string;
}) {
  return (
    <article>
      <Link
        href={`/menu/${categorySlug}/${item.slug}`}
        className="group focus-visible:outline-peach-text flex flex-col outline-offset-4"
      >
        <div data-ink>
          <DishMedia media={DISH_MEDIA[item.slug]} label={item.nameEn} />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-round text-ink text-lg leading-snug font-semibold decoration-1 underline-offset-4 group-hover:underline">
            {item.nameEn}
          </h3>
          <p className="font-round text-ink shrink-0 text-lg font-semibold tabular-nums">
            {formatCad(item.priceCents)}
          </p>
        </div>
        <p lang="zh" className="text-ink mt-1 text-sm">
          {item.nameZh}
        </p>

        {/* The hairline and its height stay even when a dish has no tags, so every
            card in a row lines up. */}
        <div className="border-ink/15 mt-4 min-h-10 border-t pt-3">
          <DishTags item={item} />
        </div>
      </Link>
    </article>
  );
}
