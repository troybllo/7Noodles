import { ShowcasePanels } from "./showcase-panels";

export function Showcase() {
  return (
    <section
      id="showcase"
      data-nav-theme="dark"
      className="bg-ink-deep text-rice py-20 md:py-28"
    >
      <div className="px-6 md:px-10 lg:pr-10 lg:pl-36 xl:pl-44">
        <p lang="zh" className="text-lantern text-sm tracking-[0.3em]">
          招牌
        </p>
        <h2 className="text-title mt-3 font-black">What to order first</h2>
      </div>

      <div className="mt-12 pl-0 lg:pl-36 xl:pl-44">
        <ShowcasePanels />
      </div>
    </section>
  );
}
