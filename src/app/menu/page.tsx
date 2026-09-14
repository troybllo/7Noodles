import type { Metadata } from "next";
import { CategoryCard } from "@/components/menu/category-card";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DragonBackdrop } from "@/components/menu/dragon-backdrop";
import { InkRevealGrid } from "@/components/menu/ink-reveal-grid";
import { getCategories } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Sichuan and Chongqing noodles, noodle soups, wontons, Leshan fried skewers, cold appetisers, desserts and drinks at Seven Noodles in North York.",
};

export default function MenuPage() {
  const categories = getCategories();

  return (
    <main
      id="main"
      data-nav-theme="dark"
      className="bg-ink-deep text-rice relative isolate min-h-svh px-6 pt-32 pb-24 md:px-10"
    >
      <DragonBackdrop tone="dark" />

      <div className="mx-auto max-w-[1400px]">
        <CategoryTabs categories={categories} tone="dark" />

        <header className="mt-14 text-center">
          <p lang="zh" className="font-round-cjk text-lantern text-3xl leading-none">
            菜单
          </p>
          <h1 className="font-round mt-3 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-[0.08em] uppercase">
            Menu
          </h1>
        </header>

        <InkRevealGrid className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </InkRevealGrid>
      </div>
    </main>
  );
}
