import type { Metadata } from "next";
import { CategoryCard } from "@/components/menu/category-card";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DragonBackdrop } from "@/components/menu/dragon-backdrop";
import { InkRevealGrid } from "@/components/menu/ink-reveal-grid";
import { MenuOrnaments } from "@/components/menu/menu-ornaments";
import { getCategories } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Sichuan and Chongqing noodles, noodle soups, wontons, Leshan fried skewers, cold appetisers, desserts and drinks at Seven Noodles in North York.",
};

/**
 * Classes for the last tile when it would sit alone on a short final row: it
 * spans the row instead, at the same height as the tiles above it. Written out
 * in full so Tailwind can see every class.
 */
function lastTileSpan(count: number): string {
  const twoColumns = count % 2 === 1 ? "sm:col-span-2 sm:aspect-[8/3]" : "";
  const threeColumns =
    count % 3 === 1 ? "lg:col-span-3 lg:aspect-[4/1]" : "lg:col-span-1 lg:aspect-[4/3]";
  return `${twoColumns} ${threeColumns}`;
}

export default function MenuPage() {
  const categories = getCategories();

  return (
    <main
      id="main"
      data-nav-theme="dark"
      className="bg-ink-deep text-rice relative isolate min-h-svh px-6 pt-32 pb-24 md:px-10"
    >
      <DragonBackdrop tone="dark" />
      <MenuOrnaments tone="dark" />

      <div className="relative mx-auto max-w-5xl">
        <CategoryTabs categories={categories} tone="dark" />

        <header className="mt-14 text-center">
          <p lang="zh" className="font-round-cjk text-lantern text-3xl leading-none">
            菜单
          </p>
          <h1 className="font-round mt-3 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-[0.08em] uppercase">
            Menu
          </h1>
        </header>

        <InkRevealGrid className="border-rice/15 bg-rice/15 mt-14 grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              category={category}
              {...(index === categories.length - 1 && {
                className: lastTileSpan(categories.length),
              })}
            />
          ))}
        </InkRevealGrid>
      </div>
    </main>
  );
}
