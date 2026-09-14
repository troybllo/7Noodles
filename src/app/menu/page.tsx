import type { Metadata } from "next";
import { CategoryCollage } from "@/components/menu/category-collage";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DragonBackdrop } from "@/components/menu/dragon-backdrop";
import { InkRevealGrid } from "@/components/menu/ink-reveal-grid";
import { MenuOrnaments } from "@/components/menu/menu-ornaments";
import { getCategories } from "@/lib/menu";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Sichuan and Chongqing noodles, noodle soups, wontons, Leshan fried skewers, cold appetisers, desserts and drinks at Seven Noodles in North York.",
};

export default function MenuPage() {
  const categories = getCategories();

  return (
    <PageTransition id="menu">
      <main
        id="main"
        data-nav-theme="dark"
        className="bg-ink-deep text-rice relative isolate min-h-svh px-6 pt-32 pb-24 md:px-10"
      >
        <DragonBackdrop tone="dark" />
        <MenuOrnaments tone="dark" />

        <div className="relative mx-auto max-w-5xl">
          <CategoryTabs categories={categories} anchors tone="dark" />

          <header className="mt-14 text-center">
            <p lang="zh" className="font-round-cjk text-lantern text-3xl leading-none">
              菜单
            </p>
            <h1 className="font-round mt-3 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-[0.08em] uppercase">
              Menu
            </h1>
          </header>

          <InkRevealGrid className="mt-20 flex flex-col gap-28 md:gap-36">
            {categories.map((category) => (
              <section
                key={category.slug}
                id={category.slug}
                aria-labelledby={`${category.slug}-title`}
                className="scroll-mt-28"
              >
                <header className="mb-10 text-center">
                  <p
                    lang="zh"
                    className="font-round-cjk text-lantern text-2xl leading-none"
                  >
                    {category.nameZh}
                  </p>
                  <h2
                    id={`${category.slug}-title`}
                    className="font-round mt-3 text-[clamp(1.75rem,3.5vw,3rem)] leading-tight font-semibold tracking-[0.06em] uppercase"
                  >
                    {category.nameEn}
                  </h2>
                  <p className="text-rice mt-2 text-sm">
                    {category.itemCount} {category.itemCount === 1 ? "dish" : "dishes"}
                  </p>
                </header>

                <CategoryCollage category={category} />
              </section>
            ))}
          </InkRevealGrid>
        </div>
      </main>
    </PageTransition>
  );
}
