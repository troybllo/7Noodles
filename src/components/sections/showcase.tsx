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
      className="bg-ink-deep text-rice relative z-0 w-full md:sticky md:top-0 md:h-svh"
    >
      <ShowcasePanels />

      <div className="pointer-events-none absolute top-24 left-6 z-10 md:left-10">
        <p lang="zh" className="text-peach-glow font-brush text-2xl">
          招牌
        </p>
        <h2 className="text-rice mt-1 text-sm font-semibold tracking-[0.2em] uppercase">
          What to order first
        </h2>
      </div>
    </section>
  );
}
