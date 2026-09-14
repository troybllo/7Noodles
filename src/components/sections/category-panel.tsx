import { PhotoSlot } from "@/components/media/photo-slot";
import type { Category } from "@/content/categories";

/**
 * One category panel in the horizontal run.
 *
 * Chrome is shared so the four read as one system: a thin top rule, the
 * category title where the reference puts its numeral, and a corner block
 * calling out the signatures.
 *
 * The collage is not shared. Each panel places its photographs differently,
 * because the whole point of the reference is that no two slides repeat — a
 * single grid reused four times would read as a carousel.
 */

type PanelProps = { category: Category };

/** A photograph with its dish name set beneath, as the reference captions them. */
function Plate({
  dish,
  className,
}: {
  dish: Category["dishes"][number];
  className?: string;
}) {
  return (
    <figure className={`flex flex-col gap-2 ${className ?? ""}`}>
      <div className="min-h-0 flex-1">
        <PhotoSlot label={dish.shot} tone="bg-paper" labelTone="text-agar-text" compact />
      </div>
      <figcaption className="flex flex-col leading-tight">
        <span lang="zh" className="text-ink text-[0.7rem]">
          {dish.nameZh}
        </span>
        <span className="text-agar-text text-[0.62rem] tracking-[0.1em] uppercase">
          {dish.nameEn}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Four arrangements over a twelve-column, ten-row grid. Sizes and positions
 * are deliberately uneven — a collage that lines up is a table.
 */
const LAYOUTS: string[][] = [
  [
    "col-start-1 col-end-4 row-start-5 row-end-9",
    "col-start-4 col-end-7 row-start-2 row-end-5",
    "col-start-5 col-end-9 row-start-6 row-end-11",
    "col-start-7 col-end-10 row-start-1 row-end-4",
    "col-start-10 col-end-13 row-start-3 row-end-7",
    "col-start-9 col-end-12 row-start-8 row-end-11",
  ],
  [
    "col-start-1 col-end-3 row-start-6 row-end-9",
    "col-start-3 col-end-6 row-start-3 row-end-7",
    "col-start-6 col-end-9 row-start-1 row-end-8",
    "col-start-9 col-end-11 row-start-2 row-end-5",
    "col-start-11 col-end-13 row-start-5 row-end-8",
    "col-start-4 col-end-7 row-start-8 row-end-11",
  ],
  [
    "col-start-1 col-end-5 row-start-2 row-end-6",
    "col-start-5 col-end-7 row-start-4 row-end-7",
    "col-start-7 col-end-11 row-start-1 row-end-5",
    "col-start-2 col-end-5 row-start-7 row-end-11",
    "col-start-5 col-end-9 row-start-7 row-end-10",
    "col-start-11 col-end-13 row-start-6 row-end-10",
  ],
  [
    "col-start-1 col-end-4 row-start-3 row-end-6",
    "col-start-4 col-end-6 row-start-6 row-end-9",
    "col-start-6 col-end-10 row-start-2 row-end-7",
    "col-start-10 col-end-13 row-start-1 row-end-5",
    "col-start-8 col-end-11 row-start-7 row-end-11",
    "col-start-2 col-end-4 row-start-7 row-end-10",
  ],
];

export function CategoryPanel({ category }: PanelProps) {
  const layout = LAYOUTS[(Number(category.index) - 1) % LAYOUTS.length] ?? LAYOUTS[0]!;

  return (
    <section
      aria-labelledby={`category-${category.slug}`}
      className="bg-rice relative flex w-[86%] shrink-0 snap-start flex-col px-6 pt-20 pb-12 first:ml-0 md:h-svh md:w-full md:px-10 md:pt-28 md:pb-8"
    >
      <div
        data-panel-dim
        aria-hidden="true"
        className="bg-ink pointer-events-none absolute inset-0 z-20 opacity-0"
      />

      <div className="border-paper text-agar-text flex items-center justify-between border-b pb-3 text-[0.6rem] tracking-[0.22em] uppercase">
        <span lang="zh">菜单 · Menu</span>
        <span className="hidden md:inline">{category.nameEn}</span>
        <span>
          {category.index} <span className="text-paper">— 04</span>
        </span>
      </div>

      <div className="relative mt-5 md:min-h-0 md:flex-1">
        <header className="relative z-10 max-w-sm md:absolute md:top-0 md:left-0">
          <h3
            id={`category-${category.slug}`}
            lang="zh"
            className="font-brush text-ink text-[clamp(2rem,4vw,3.75rem)] leading-none"
          >
            {category.nameZh}
          </h3>
          <p className="text-ink mt-3 text-[clamp(1rem,1.5vw,1.5rem)] leading-tight font-black">
            {category.nameEn}
          </p>
          <p className="text-agar-text mt-3 max-w-[22ch] text-xs leading-relaxed">
            {category.note}
          </p>
        </header>

        <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-3 md:mt-0 md:h-full md:grid-rows-10">
          {category.dishes.map((dish, index) => (
            <Plate
              key={dish.nameZh}
              dish={dish}
              className={`hidden md:flex ${layout[index] ?? ""}`}
            />
          ))}

          {/* Below the accordion breakpoint the collage becomes a plain grid;
              absolute placement at phone width is unreadable. */}
          <div className="col-span-12 grid grid-cols-2 gap-3 md:hidden">
            {category.dishes.slice(0, 4).map((dish) => (
              <Plate key={dish.nameZh} dish={dish} className="aspect-[4/3]" />
            ))}
          </div>
        </div>

        <footer className="mt-6 flex max-w-xs flex-col gap-1 md:absolute md:right-0 md:bottom-0 md:mt-0 md:text-right">
          <span className="text-agar-text text-[0.6rem] tracking-[0.22em] uppercase">
            招牌 · Signature
          </span>
          {category.signature.map((line) => (
            <span key={line} lang="zh" className="text-ink text-xs">
              {line}
            </span>
          ))}
        </footer>
      </div>
    </section>
  );
}
