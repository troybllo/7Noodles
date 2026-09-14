import { formatCad } from "@/lib/money";
import type { MenuItem } from "@/lib/menu";
import { DISH_MEDIA } from "@/content/menu-media";
import { DishMedia } from "./dish-media";

function Chilli() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="fill-peach-text size-3.5">
      <path d="M11.6 1.2c-.5-.3-1.1-.1-1.4.4-.2.4-.1.9.2 1.2-2.6.3-4.4 2.6-5.3 5.3C4.3 10.6 2.8 12.3.9 13.2c-.4.2-.4.8 0 1 3.9 1.9 9.4.2 11.4-4.6.9-2.1.8-4.2-.2-5.8.6-.3.9-1 .6-1.6-.2-.4-.6-.7-1.1-1z" />
    </svg>
  );
}

const TAG_LABEL: Record<MenuItem["tags"][number], string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
};

/**
 * One dish, Aritzia-style: a tall photograph, the name and price on one line,
 * the Chinese name beneath, then a row of tags.
 *
 * The reference puts a star rating where the tags sit. There are no per-dish
 * ratings, so the row carries what is actually known — spice level and
 * dietary tags. There is no description either: none exists yet, and a
 * dish's ingredients are not ours to guess when someone may be allergic.
 *
 * Vegan implies vegetarian in the data, so only the stronger tag is shown.
 */
export function DishCard({ item }: { item: MenuItem }) {
  const tags = item.tags.includes("vegan")
    ? (["vegan"] as const)
    : item.tags.filter((tag) => tag === "vegetarian");

  return (
    <article className="group flex flex-col">
      <div data-ink>
        <DishMedia media={DISH_MEDIA[item.slug]} label={item.nameEn} />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-round text-ink text-lg leading-snug font-semibold">
          {item.nameEn}
        </h3>
        <p className="font-round text-ink shrink-0 text-lg font-semibold tabular-nums">
          {formatCad(item.priceCents)}
        </p>
      </div>
      <p lang="zh" className="text-ink mt-1 text-sm">
        {item.nameZh}
      </p>

      <div className="border-ink/15 mt-4 flex min-h-6 flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs">
        {item.spiceLevel > 0 ? (
          <span className="flex items-center gap-1.5">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: item.spiceLevel }, (_, i) => (
                <Chilli key={i} />
              ))}
            </span>
            <span className="text-ink">
              {item.spiceLevel >= 3 ? "Very spicy" : "Spicy"}
            </span>
          </span>
        ) : null}
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-ink border-ink/25 border px-2 py-0.5 tracking-[0.08em] uppercase"
          >
            {TAG_LABEL[tag]}
          </span>
        ))}
      </div>
    </article>
  );
}
