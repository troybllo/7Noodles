import Link from "next/link";
import { formatCad } from "@/lib/money";
import type { MenuItem } from "@/lib/menu";
import { AddToCart } from "@/components/order/add-to-cart";
import { DishTags } from "./dish-tags";

/**
 * A dish set as a line on a printed menu: name, a dotted leader, the price,
 * then its Chinese name, portion and marks. Used for dishes that have not been
 * photographed yet, so the menu reads as a menu instead of a wall of empty
 * frames. The name links to the dish's page; the "+" sits outside the link.
 */
export function DishRow({
  item,
  categorySlug,
}: {
  item: MenuItem;
  categorySlug: string;
}) {
  return (
    <li className="border-brand/15 flex items-start gap-4 border-b py-5 md:gap-6">
      <Link
        href={`/menu/${categorySlug}/${item.slug}`}
        className="group focus-visible:outline-brand min-w-0 flex-1 outline-offset-4"
      >
        {item.signature ? (
          <p className="text-brand-deep mb-1 text-[0.65rem] font-bold tracking-[0.16em] uppercase">
            Signature
          </p>
        ) : null}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display decoration-brand-deep min-w-0 text-lg leading-snug break-words hyphens-auto underline-offset-4 group-hover:underline md:text-xl">
            {item.nameEn}
          </h3>
          <span
            aria-hidden="true"
            className="border-brand/30 hidden min-w-6 flex-1 -translate-y-[0.3em] border-b border-dotted sm:block"
          />
          <p className="shrink-0 text-base font-semibold tabular-nums">
            {formatCad(item.priceCents)}
          </p>
        </div>
        <p className="text-brand-deep mt-1 text-sm">
          <span lang="zh" className="font-cjk">
            {item.nameZh}
          </span>
          {item.portion ? <span> · {item.portion}</span> : null}
          {!item.available ? (
            <span className="ml-2 text-xs font-semibold tracking-[0.12em] uppercase">
              · Coming soon
            </span>
          ) : null}
        </p>
        <DishTags item={item} compact className="mt-3" />
      </Link>
      {item.available ? (
        <div className="shrink-0 pt-1">
          <AddToCart item={item} variant="plus" />
        </div>
      ) : (
        <div aria-hidden="true" className="w-11 shrink-0" />
      )}
    </li>
  );
}
