"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCad } from "@/lib/money";
import { PhotoSlot } from "@/components/media/photo-slot";
import { CATEGORY_COVERS, DISH_MEDIA } from "@/content/menu-media";
import { findDish } from "@/lib/menu";
import { useExpandingPanels } from "@/components/motion/use-expanding-panels";
import { SHOWCASE, type ShowcaseDish } from "@/content/showcase";

/** Six columns: the open panel takes four, the other two take one each. */
const OPEN_GROW = 4;
const CLOSED_GROW = 1;

/** How long the equal 2/2/2 opening holds before one panel takes over. */
const HOLD = 1.1;
/** How long that hand-over takes. */
const SETTLE = 1.3;

/** Each panel's ground, the text set on it and the tone of its placeholder. */
const GROUND: Record<
  ShowcaseDish["ground"],
  { panel: string; text: string; sub: string; shade: string }
> = {
  ink: {
    panel: "bg-brand",
    text: "text-paper",
    sub: "text-paper",
    shade: "bg-brand-deep",
  },
  chili: {
    panel: "bg-brand-deep",
    text: "text-paper",
    sub: "text-paper",
    shade: "bg-brand-deep",
  },
  bone: {
    panel: "bg-paper",
    text: "text-brand",
    sub: "text-brand-deep",
    shade: "bg-brand-soft",
  },
};

export function ShowcasePanels() {
  const { open, trackRef, panelProps } = useExpandingPanels<HTMLLIElement>(
    SHOWCASE.length,
    {
      openGrow: OPEN_GROW,
      closedGrow: CLOSED_GROW,
      entrance: { from: 2, hold: HOLD, settle: SETTLE },
    },
  );

  return (
    <ul ref={trackRef} className="@container flex h-full w-full flex-col md:flex-row">
      {SHOWCASE.map((dish, index) => {
        const active = index === open;
        const tone = GROUND[dish.ground];
        // The dish's own photograph, or its category's where it has none (the
        // skewers are photographed only as a platter).
        const category = findDish(dish.slug)?.category.slug;
        const href = category ? `/menu/${category}/${dish.slug}` : "/menu";
        const photo =
          DISH_MEDIA[dish.slug]?.photo ??
          (category ? CATEGORY_COVERS[category] : undefined);

        return (
          <li
            key={dish.slug}
            {...panelProps(index)}
            className={`relative overflow-hidden ${panelProps(index).className}`}
          >
            {/* Phones: a plain card that opens the dish, text never clipped. */}
            <Link
              href={href}
              className={`group flex flex-col md:hidden ${tone.panel} ${tone.text}`}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden">
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-expo) group-active:scale-[1.03]"
                  />
                ) : (
                  <PhotoSlot label={dish.shot} tone={tone.shade} />
                )}
              </span>
              <span className="flex items-end justify-between gap-4 px-5 pt-5 pb-7">
                <span className="flex flex-col gap-1.5">
                  <span lang="zh" className="font-cjk text-xl leading-none font-bold">
                    {dish.nameZh}
                  </span>
                  <span className="font-display text-2xl leading-tight">
                    {dish.nameEn}
                  </span>
                  <span className={`eyebrow ${tone.sub}`}>
                    {dish.family} · {formatCad(dish.priceCents)}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="border-current/40 flex size-11 shrink-0 items-center justify-center border transition-transform duration-(--duration-fast) group-active:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>

            <button
              type="button"
              aria-expanded={active}
              aria-label={`${dish.nameEn} ${dish.nameZh}, ${formatCad(dish.priceCents)}`}
              onFocus={() => panelProps(index).onMouseEnter()}
              onClick={() => panelProps(index).onMouseEnter()}
              className="absolute inset-0 hidden h-full w-full cursor-pointer flex-col text-left md:flex"
            >
              {/* Both layers are fixed at the open width and clipped by the panel,
                  so a collapsed panel crops rather than squashes. */}
              <span className="block h-[58%] w-full overflow-hidden">
                <span className="relative block h-full w-full md:w-[66.6cqw]">
                  {photo ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 66vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <PhotoSlot label={dish.shot} tone={tone.shade} />
                  )}
                </span>
              </span>

              <span
                className={`relative block flex-1 overflow-hidden ${tone.panel} ${tone.text}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 flex w-full flex-col justify-end gap-3 p-7 transition-opacity duration-(--duration-base) md:w-[66.6cqw] ${
                    active ? "md:opacity-100 md:delay-150" : "md:opacity-0"
                  }`}
                >
                  <span lang="zh" className="font-cjk text-2xl leading-none font-bold">
                    {dish.nameZh}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-2xl leading-tight md:text-3xl">
                      {dish.nameEn}
                    </span>
                    <span className={`eyebrow ${tone.sub}`}>{dish.family}</span>
                    <span className="text-base tabular-nums">
                      {formatCad(dish.priceCents)}
                    </span>
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 hidden w-[16.6cqw] items-center justify-center transition-opacity duration-(--duration-base) md:flex ${
                    active ? "opacity-0" : "opacity-100 delay-150"
                  }`}
                >
                  <span
                    lang="zh"
                    className="font-cjk text-lg font-bold tracking-[0.22em] whitespace-nowrap"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {dish.nameZh}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
