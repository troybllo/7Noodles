"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { formatCad } from "@/lib/money";
import { PhotoSlot } from "@/components/media/photo-slot";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useGsap } from "@/components/motion/use-gsap";
import { SHOWCASE, type ShowcaseDish } from "@/content/showcase";

/** Six columns: the open panel takes four, the other two take one each. */
const OPEN_GROW = 4;
const CLOSED_GROW = 1;

/** The accordion only exists from this width up. Below it the panels stack. */
const ACCORDION = "(min-width: 48rem)";

const GROUND: Record<
  ShowcaseDish["ground"],
  { panel: string; text: string; sub: string }
> = {
  pine: { panel: "bg-pine", text: "text-rice", sub: "text-rice/75" },
  peach: { panel: "bg-peach-deep", text: "text-rice", sub: "text-rice/75" },
  rice: { panel: "bg-rice", text: "text-ink", sub: "text-agar-text" },
};

export function ShowcasePanels() {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  /**
   * Tweens flex-grow rather than a transform. scaleX would distort the
   * photography and the type, and counter-scaling the children back is
   * fragile. Three panels animating a bounded layout is the cheaper trade, and
   * `contain: layout paint` on each panel stops the recalculation escaping its
   * own subtree.
   */
  const setOpenPanel = (index: number) => {
    setOpen(index);
    if (reduced || !window.matchMedia(ACCORDION).matches) return;

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      gsap.to(panel, {
        flexGrow: i === index ? OPEN_GROW : CLOSED_GROW,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });
  };

  // Entrance: the panels start equal and settle into the default 4/1/1.
  const scope = useGsap<HTMLUListElement>(({ gsap: g, scope: element }) => {
    const media = g.matchMedia();

    media.add(ACCORDION, () => {
      g.fromTo(
        gsap.utils.toArray<HTMLElement>(element.children),
        { flexGrow: 2 },
        {
          flexGrow: (i: number) => (i === 0 ? OPEN_GROW : CLOSED_GROW),
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 78%", once: true },
        },
      );
    });

    return () => media.revert();
  });

  return (
    <ul
      ref={scope}
      className="@container flex flex-col md:h-[70svh] md:min-h-[26rem] md:flex-row"
    >
      {SHOWCASE.map((dish, index) => {
        const active = index === open;
        const tone = GROUND[dish.ground];

        return (
          <li
            key={dish.slug}
            ref={(node) => {
              panels.current[index] = node;
            }}
            className="relative h-[62svh] overflow-hidden md:h-auto"
            style={{
              flexGrow: active ? OPEN_GROW : CLOSED_GROW,
              flexBasis: 0,
              contain: "layout paint",
            }}
            onMouseEnter={() => setOpenPanel(index)}
          >
            <button
              type="button"
              aria-expanded={active}
              onFocus={() => setOpenPanel(index)}
              onClick={() => setOpenPanel(index)}
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
                  <PhotoSlot label={dish.shot} />
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
