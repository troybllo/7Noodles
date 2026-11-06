import { ShowcasePanels } from "./showcase-panels";

/**
 * Signature dishes as expanding panels, one screen tall, with the heading laid
 * over them. Sticks on larger screens while the categories scroll up over it.
 */
export function Showcase() {
  return (
    <section
      id="showcase"
      data-nav-theme="dark"
      className="bg-brand text-paper relative z-0 w-full md:sticky md:top-0 md:h-svh"
    >
      <ShowcasePanels />

      <div className="pointer-events-none absolute top-24 left-6 z-10 md:left-10">
        <p className="eyebrow text-paper flex items-center gap-3 [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]">
          <span
            lang="zh"
            className="font-cjk text-paper text-sm font-bold tracking-[0.2em]"
          >
            招牌
          </span>
          What to order first
        </p>
      </div>
    </section>
  );
}
