"use client";

import { PhotoSlot } from "@/components/media/photo-slot";
import { useExpandingPanels } from "@/components/motion/use-expanding-panels";
import { ABOUT } from "@/content/about";

const GROUND: Record<string, { panel: string; text: string; sub: string }> = {
  pine: { panel: "bg-pine", text: "text-rice", sub: "text-rice/75" },
  peach: { panel: "bg-peach-deep", text: "text-rice", sub: "text-rice/75" },
  bronze: { panel: "bg-bronze", text: "text-rice", sub: "text-rice/75" },
  rice: { panel: "bg-rice", text: "text-ink", sub: "text-agar-text" },
};

/**
 * The practical details, on the showcase's expanding-panel mechanic.
 *
 * Four panels rather than three, so the open one takes three columns of six
 * and the rest take one each. Both sections share the behaviour through
 * `useExpandingPanels`; only the presentation is local, because a dish panel
 * and an address panel have nothing in common to abstract.
 *
 * No entrance here — this sits at the foot of the page, where an equal-width
 * hold would read as something failing to load rather than as a reveal.
 */
export function ContactPanels() {
  const { open, trackRef, panelProps } = useExpandingPanels<HTMLLIElement>(
    ABOUT.panels.length,
    { openGrow: 3, closedGrow: 1 },
  );

  return (
    <ul
      ref={trackRef}
      className="@container flex h-[70svh] min-h-[22rem] w-full flex-col md:flex-row"
    >
      {ABOUT.panels.map((panel, index) => {
        const active = index === open;
        const tone = GROUND[panel.ground] ?? GROUND.rice!;

        return (
          <li
            key={panel.key}
            {...panelProps(index)}
            className="relative h-[26svh] overflow-hidden md:h-auto"
          >
            <button
              type="button"
              aria-expanded={active}
              onFocus={() => panelProps(index).onMouseEnter()}
              onClick={() => panelProps(index).onMouseEnter()}
              className="absolute inset-0 flex h-full w-full cursor-pointer flex-col text-left"
            >
              <span className="block h-[55%] w-full overflow-hidden">
                <span className="block h-full w-full md:w-[50cqw]">
                  <PhotoSlot label={panel.shot} tone="bg-ink-soft" />
                </span>
              </span>

              <span
                className={`relative block flex-1 overflow-hidden ${tone.panel} ${tone.text}`}
              >
                {/* Fixed at the open width and clipped, so narrowing crops the
                    block instead of re-wrapping an address mid-transition. */}
                <span
                  className={`absolute inset-y-0 left-0 flex w-full flex-col justify-center gap-2 p-6 transition-opacity duration-[--duration-base] md:w-[50cqw] ${
                    active ? "md:opacity-100 md:delay-150" : "md:opacity-0"
                  }`}
                >
                  <span lang="zh" className="font-brush text-2xl leading-none">
                    {panel.zh}
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                    {panel.label}
                  </span>
                  <span className={`${tone.sub} text-sm`}>{panel.detail}</span>
                </span>

                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 hidden w-[16.6cqw] items-center justify-center transition-opacity duration-[--duration-base] md:flex ${
                    active ? "opacity-0" : "opacity-100 delay-150"
                  }`}
                >
                  <span
                    lang="zh"
                    className="text-base font-medium tracking-[0.22em] whitespace-nowrap"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {panel.zh}
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
