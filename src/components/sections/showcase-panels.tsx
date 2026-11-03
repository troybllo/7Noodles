"use client";

import Image from "next/image";
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
    shade: "bg-[#5e150c]",
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
        const photo =
          DISH_MEDIA[dish.slug]?.photo ??
          (category ? CATEGORY_COVERS[category] : undefined);

        return (
          <li
            key={dish.slug}
            {...panelProps(index)}
            className={`relative h-[46svh] overflow-hidden md:h-auto ${panelProps(index).className}`}
          >
            <button
              type="button"
              aria-expanded={active}
              onFocus={() => panelProps(index).onMouseEnter()}
              onClick={() => panelProps(index).onMouseEnter()}
              className="absolute inset-0 flex h-full w-full cursor-pointer flex-col text-left"
            >
              {/*
                Photo and colour block are both present at every width, because
                a collapsed panel is a narrow slice of the same composition
                rather than a different one.

                Both inner layers are fixed at the open width and clipped by the
                panel, so narrowing crops them. It never reflows the type or
                squashes the photograph, which is the thing that makes an
                accordion look cheap.

                Below the accordion breakpoint every layer is full width and the
                collapsed label is not rendered at all.
              */}
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
                  className={`absolute inset-y-0 left-0 flex w-full flex-col justify-end gap-3 p-7 transition-opacity duration-[--duration-base] md:w-[66.6cqw] ${
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
                  className={`absolute inset-y-0 left-0 hidden w-[16.6cqw] items-center justify-center transition-opacity duration-[--duration-base] md:flex ${
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
