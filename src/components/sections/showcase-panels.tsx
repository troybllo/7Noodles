"use client";

import { formatCad } from "@/lib/money";
import { PhotoSlot } from "@/components/media/photo-slot";
import { useExpandingPanels } from "@/components/motion/use-expanding-panels";
import { SHOWCASE, type ShowcaseDish } from "@/content/showcase";

/** Six columns: the open panel takes four, the other two take one each. */
const OPEN_GROW = 4;
const CLOSED_GROW = 1;

/** How long the equal 2/2/2 opening holds before one panel takes over. */
const HOLD = 1.1;
/** How long that hand-over takes. */
const SETTLE = 1.3;

const GROUND: Record<
  ShowcaseDish["ground"],
  { panel: string; text: string; sub: string; shade: string }
> = {
  pine: {
    panel: "bg-pine",
    text: "text-ink",
    sub: "text-rice/75",
    shade: "bg-pine-shade",
  },
  peach: {
    panel: "bg-peach-deep",
    text: "text-ink",
    sub: "text-rice/75",
    shade: "bg-peach-shade",
  },
  rice: {
    panel: "bg-rice",
    text: "text-ink",
    sub: "text-agar-text",
    shade: "bg-rice-shade",
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

        return (
          <li
            key={dish.slug}
            {...panelProps(index)}
            className="relative h-[62svh] overflow-hidden md:h-auto"
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
                <span className="block h-full w-full md:w-[66.6cqw]">
                  <PhotoSlot label={dish.shot} tone={tone.shade} />
                </span>
              </span>

              <span
                className={`relative block flex-1 overflow-hidden text-black ${tone.panel} ${tone.text}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 flex w-full flex-col justify-end gap-3 p-7 transition-opacity duration-[--duration-base] md:w-[66.6cqw] ${
                    active ? "md:opacity-100 md:delay-150" : "md:opacity-0"
                  }`}
                >
                  <span lang="zh" className="text-title leading-none font-medium">
                    {dish.nameZh}
                  </span>
                  <span className="flex flex-col gap-0.5 text-sm">
                    <span className="font-semibold">{dish.nameEn}</span>
                    <span className={tone.sub}>{dish.family}</span>
                    <span className={`${tone.sub} tabular-nums`}>
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
                    className="text-lg font-medium tracking-[0.22em] whitespace-nowrap"
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
