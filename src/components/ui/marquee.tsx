"use client";

import { useState, type ReactNode } from "react";

/**
 * A row that scrolls on a loop: `children` is the row once, rendered twice so
 * the loop has no seam. Hover or a press pauses it, and so does the Pause
 * button, for anyone not using a mouse. On phones, and under reduced motion,
 * it is a plain row to swipe, so a card can be read without chasing it.
 */
export function Marquee({ children, label }: { children: ReactNode; label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative">
      <div className="md:marquee-fade overflow-hidden motion-reduce:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:scroll-px-5 max-md:[scrollbar-width:none] max-md:overflow-x-auto max-md:[&::-webkit-scrollbar]:hidden">
        <div
          className={`animate-marquee-left flex w-max gap-8 pr-8 hover:[animation-play-state:paused] active:[animation-play-state:paused] motion-reduce:animate-none max-md:animate-none max-md:gap-4 max-md:px-5 ${paused ? "[animation-play-state:paused]" : ""}`}
        >
          <ul aria-label={label} className="flex gap-8 max-md:gap-4 max-md:*:snap-start">
            {children}
          </ul>
          <ul
            aria-hidden="true"
            className="flex gap-8 motion-reduce:hidden max-md:hidden"
          >
            {children}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        className="eyebrow mt-4 ml-4 inline-flex min-h-11 items-center px-2 underline underline-offset-4 motion-reduce:hidden max-md:hidden md:ml-8"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
