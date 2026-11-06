import Link from "next/link";
import { ViewTransition } from "react";
import { formatCad } from "@/lib/money";
import type { MenuItem } from "@/lib/menu";
import { DISH_MEDIA } from "@/content/menu-media";
import { AddToCart } from "@/components/order/add-to-cart";
import { DishMedia } from "./dish-media";
import { DishTags } from "./dish-tags";

/**
 * One dish: a tall photograph, the name and price on one line, the Chinese
 * name and portion beneath, then the spice, diet and allergen marks. The whole
 * card links to the dish's own page.
 */
export function DishCard({
  item,
  categorySlug,
}: {
  item: MenuItem;
  categorySlug: string;
}) {
  return (
    <article className="relative">
      <Link
        href={`/menu/${categorySlug}/${item.slug}`}
        className="group focus-visible:outline-brand flex flex-col rounded-2xl outline-offset-4"
      >
        {/* Shares its name with the dish page's hero, so the photograph flies
            into place when the card is opened. */}
        <ViewTransition name={`dish-${item.slug}`} share="morph" default="none">
          {/* A print with a paper border; it lifts and turns a little on hover. */}
          <div
            data-ink
            className="bg-paper shadow-lift relative p-[0.4rem] transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-hover:-translate-y-1 group-hover:-rotate-1"
          >
            <DishMedia
              media={DISH_MEDIA[item.slug]}
              label={item.nameEn}
              zh={item.nameZh}
            />
            {item.signature ? (
              <span className="bg-brand-deep text-paper absolute top-4 left-4 rotate-[-3deg] rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] uppercase backdrop-blur">
                Signature
              </span>
            ) : null}
            {!item.available ? (
              <span className="bg-brand-deep text-paper absolute inset-x-4 bottom-4 rounded-full py-2 text-center text-xs font-semibold tracking-[0.1em] uppercase">
                Coming soon
              </span>
            ) : null}
          </div>
        </ViewTransition>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-brand decoration-brand-deep min-w-0 text-base leading-snug [overflow-wrap:anywhere] underline-offset-4 group-hover:underline sm:text-lg md:text-xl">
            {item.nameEn}
          </h3>
          <p className="text-brand shrink-0 text-base font-semibold tabular-nums">
            {formatCad(item.priceCents)}
          </p>
        </div>
        <p className="text-brand-deep mt-1 text-sm">
          <span lang="zh" className="font-cjk">
            {item.nameZh}
          </span>
          {item.portion ? <span> · {item.portion}</span> : null}
        </p>

        {/* Holds its height even when a dish has no marks, so a row lines up. */}
        <div className="mt-3 min-h-7">
          <DishTags item={item} compact />
        </div>
      </Link>
      {/* Outside the link, so adding a dish never also opens its page. */}
      <div className="absolute top-3 right-3 z-10">
        <AddToCart item={item} variant="plus" />
      </div>
    </article>
  );
}
