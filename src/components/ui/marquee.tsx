"use client";

import { useState, type ReactNode } from "react";

/**
 * A row that scrolls on a loop: `children` is the row once, rendered twice so
 * the loop has no seam. Hover pauses it, and so does the Pause button, for
 * anyone not using a mouse. Under reduced motion it is a plain scroller.
 */
export function Marquee({ children, label }: { children: ReactNode; label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative">
      <div className="marquee-fade overflow-hidden motion-reduce:overflow-x-auto">
        <div
          className={`animate-marquee-left flex w-max gap-8 pr-8 hover:[animation-play-state:paused] motion-reduce:animate-none ${paused ? "[animation-play-state:paused]" : ""}`}
        >
          <ul aria-label={label} className="flex gap-8">
            {children}
          </ul>
          <ul aria-hidden="true" className="flex gap-8 motion-reduce:hidden">
            {children}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        className="eyebrow mt-6 ml-6 underline underline-offset-4 motion-reduce:hidden md:ml-10"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
