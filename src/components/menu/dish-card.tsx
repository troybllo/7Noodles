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
  feature,
  className = "",
}: {
  item: MenuItem;
  categorySlug: string;
  /**
   * Leads its grid so no row is left with a lone card: `wide` spans both
   * columns below `lg`; `hero` also takes two columns and two rows at `lg`.
   */
  feature?: "wide" | "hero" | undefined;
  className?: string;
}) {
  const span =
    feature === "hero"
      ? "col-span-2 lg:row-span-2"
      : feature === "wide"
        ? "col-span-2 lg:col-span-1"
        : "";
  return (
    <article className={`relative ${span} ${className}`}>
      <Link
        href={`/menu/${categorySlug}/${item.slug}`}
        className="group focus-visible:outline-brand flex flex-col outline-offset-4"
      >
        {/* Shares its name with the dish page's hero, so the photograph flies
            into place when the card is opened. */}
        <ViewTransition name={`dish-${item.slug}`} share="morph" default="none">
          {/* A print with a paper border; it lifts and turns a little on hover. */}
          <div className="bg-paper shadow-lift relative p-[0.4rem] transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-hover:-translate-y-1 group-hover:-rotate-1 group-active:scale-[0.98]">
            {/* Only the photograph inks in; the paper and its shadow stay put. */}
            <div data-ink>
              <DishMedia
                media={DISH_MEDIA[item.slug]}
                label={item.nameEn}
                zh={item.nameZh}
                {...(feature
                  ? {
                      aspect: "aspect-[4/3] lg:aspect-[4/5]",
                      sizes:
                        feature === "hero"
                          ? "(min-width: 1024px) 46vw, 100vw"
                          : "(min-width: 1024px) 23vw, 100vw",
                    }
                  : {})}
              />
            </div>
            {item.signature ? (
              <span className="bg-brand-deep text-paper absolute bottom-3 left-3 rotate-[-3deg] px-2 py-1 text-[0.6rem] font-bold tracking-[0.14em] uppercase sm:bottom-4 sm:left-4 sm:px-3 sm:text-[0.65rem]">
                Signature
              </span>
            ) : null}
            {!item.available ? (
              <span className="bg-brand-deep text-paper absolute inset-x-4 bottom-4 py-2 text-center text-xs font-semibold tracking-[0.1em] uppercase">
                Coming soon
              </span>
            ) : null}
          </div>
        </ViewTransition>

        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3
            className={`font-display text-brand decoration-brand-deep min-w-0 leading-snug break-words hyphens-auto underline-offset-4 group-hover:underline ${feature === "hero" ? "text-lg sm:text-xl md:text-2xl lg:text-3xl" : "text-base sm:text-lg md:text-xl"}`}
          >
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
