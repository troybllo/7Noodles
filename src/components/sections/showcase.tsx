import { HandUnderline } from "@/components/hand/hand-underline";
import { ShowcasePanels } from "./showcase-panels";

/**
 * Fills exactly one screen, and sticks there on larger screens while the
 * categories scroll up over it. On phones the panels stack taller than the
 * screen, so it scrolls normally; stuck, its lower panels would never be seen.
 *
 * The panels are the section — the heading overlays
 * them rather than sitting in a band above, which is what previously left the
 * panels as a strip inside a field of black.
 */
export function Showcase() {
  return (
    <section
      id="showcase"
      data-nav-theme="dark"
      className="paper-ink text-cream relative z-0 w-full md:sticky md:top-0 md:h-svh"
    >
      <ShowcasePanels />

      <div className="pointer-events-none absolute top-24 left-6 z-10 md:left-10">
        <p lang="zh" className="text-parchment font-brush text-4xl leading-none">
          招牌
        </p>
        <h2 className="font-hand-caps text-cream relative mt-2 inline-block text-lg tracking-[0.06em] uppercase">
          What to order first
          <HandUnderline
            seed={17}
            drawn
            className="text-peach-glow absolute inset-x-0 -bottom-1 h-2"
          />
        </h2>
      </div>
    </section>
  );
}
