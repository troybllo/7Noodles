import Link from "next/link";
import { HandUnderline } from "@/components/hand/hand-underline";
import { ViewTransition } from "react";
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
        className="group focus-visible:outline-ink flex flex-col outline-offset-4"
      >
        {/* Shares its name with the dish page's hero, so the photograph flies
            into place when the card is opened. */}
        <ViewTransition name={`dish-${item.slug}`} share="morph" default="none">
          <div
            data-ink
            className="bg-cream p-[0.4rem] shadow-[0_0.3rem_0.8rem_rgb(40_20_10/0.18)] transition-transform duration-[--duration-slow] ease-[--ease-out-expo] group-hover:-translate-y-1 group-hover:-rotate-1"
          >
            <DishMedia media={DISH_MEDIA[item.slug]} label={item.nameEn} />
          </div>
        </ViewTransition>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-nav text-ink relative text-lg leading-snug font-bold">
            {item.nameEn}
            <HandUnderline
              seed={item.nameEn.length * 3}
              className="text-chili absolute inset-x-0 -bottom-1 h-2"
            />
          </h3>
          <p className="text-ink shrink-0 font-mono text-lg">
            {formatCad(item.priceCents)}
          </p>
        </div>
        <p lang="zh" className="text-ink mt-1 text-sm">
          {item.nameZh}
        </p>

        {/* The hairline and its height stay even when a dish has no tags, so every
            card in a row lines up. */}
        <div className="border-ink/20 mt-4 min-h-10 border-t border-dashed pt-3">
          <DishTags item={item} />
        </div>
      </Link>
    </article>
  );
}
