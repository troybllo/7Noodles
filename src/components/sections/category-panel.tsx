import { HandUnderline } from "@/components/hand/hand-underline";
import { TapedFrame } from "@/components/hand/taped-frame";
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

/** A slight, uneven turn for each photograph, so the collage looks pressed on by hand. */
const TILTS = [-2, 1.5, -1, 2, -1.5, 1] as const;

/** A photograph taped to the page with its dish name written beneath. */
function Plate({
  dish,
  index,
  className,
}: {
  dish: Category["dishes"][number];
  index: number;
  className?: string;
}) {
  return (
    <figure className={`flex flex-col gap-2 ${className ?? ""}`}>
      <TapedFrame
        tape="top"
        tilt={TILTS[index % TILTS.length] ?? 0}
        className="min-h-0 flex-1 text-[0.7rem]"
      >
        <div className="h-full">
          <PhotoSlot
            label={dish.shot}
            tone="bg-ink/[0.07]"
            labelTone="text-ink/60"
            compact
          />
        </div>
      </TapedFrame>
      <figcaption className="flex flex-col leading-tight">
        <span className="font-hand text-ink text-sm">{dish.nameEn}</span>
        <span lang="zh" className="text-ink/70 text-[0.7rem]">
          {dish.nameZh}
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
      className="paper-cream relative flex w-[86%] shrink-0 snap-start flex-col px-6 pt-20 pb-12 first:ml-0 md:h-svh md:w-full md:px-10 md:pt-28 md:pb-8"
    >
      <div
        data-panel-dim
        aria-hidden="true"
        className="bg-ink pointer-events-none absolute inset-0 z-20 opacity-0"
      />

      <div className="text-ink relative flex items-center justify-between pb-3">
        <span className="font-hand-caps flex items-baseline gap-2 text-sm tracking-[0.06em] uppercase">
          <span lang="zh" className="font-brush text-chili text-lg">
            菜单
          </span>
          Menu
        </span>
        <span className="font-hand-caps hidden text-sm tracking-[0.06em] uppercase md:inline">
          {category.nameEn}
        </span>
        <span className="font-mono text-xs">
          {category.index} <span className="text-ink/50">/ 04</span>
        </span>
        <HandUnderline
          seed={Number(category.index) * 11}
          drawn
          className="text-ink/30 absolute inset-x-0 bottom-0 h-2"
        />
      </div>

      <div className="relative mt-5 md:min-h-0 md:flex-1">
        <header className="relative z-10 max-w-sm md:absolute md:top-0 md:left-0">
          <h3
            id={`category-${category.slug}`}
            lang="zh"
            className="font-brush text-chili text-[clamp(2rem,4vw,3.75rem)] leading-none"
          >
            {category.nameZh}
          </h3>
          <p className="font-poster text-ink mt-3 text-[clamp(1.1rem,1.7vw,1.75rem)] leading-tight">
            {category.nameEn}
          </p>
          <p className="font-hand text-ink/80 mt-3 max-w-[24ch] text-base leading-snug">
            {category.note}
          </p>
        </header>

        <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-3 md:mt-0 md:h-full md:grid-rows-10">
          {category.dishes.map((dish, index) => (
            <Plate
              key={dish.nameZh}
              dish={dish}
              index={index}
              className={`hidden md:flex ${layout[index] ?? ""}`}
            />
          ))}

          {/* Below the accordion breakpoint the collage becomes a plain grid;
              absolute placement at phone width is unreadable. */}
          <div className="col-span-12 grid grid-cols-2 gap-3 md:hidden">
            {category.dishes.slice(0, 4).map((dish, index) => (
              <Plate
                key={dish.nameZh}
                dish={dish}
                index={index}
                className="aspect-[4/3]"
              />
            ))}
          </div>
        </div>

        <footer className="mt-6 flex max-w-xs flex-col gap-1 md:absolute md:right-0 md:bottom-0 md:mt-0 md:text-right">
          <span className="font-hand-caps text-chili text-sm tracking-[0.06em] uppercase">
            Signature
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
