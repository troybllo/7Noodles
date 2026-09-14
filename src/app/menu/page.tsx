import type { Metadata } from "next";
import { StampedText } from "@/components/hand/stamped-text";
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
        data-nav-theme="red"
        className="paper-red text-cream relative isolate min-h-svh px-6 pt-32 pb-24 md:px-10"
      >
        <DragonBackdrop tone="red" />
        <MenuOrnaments />

        <div className="relative mx-auto max-w-5xl">
          <CategoryTabs categories={categories} anchors tone="red" />

          <header className="mt-14 text-center">
            <p lang="zh" className="font-brush text-parchment text-5xl leading-none">
              菜单
            </p>
            <h1 className="font-poster mt-3 text-[clamp(3rem,7vw,6rem)] leading-none uppercase">
              <StampedText>Menu</StampedText>
            </h1>
          </header>

          <InkRevealGrid className="mt-20 flex flex-col gap-28 md:gap-36">
            {categories.map((category, index) => (
              <section
                key={category.slug}
                id={category.slug}
                aria-labelledby={`${category.slug}-title`}
                className="scroll-mt-28"
              >
                <header className="mb-10 text-center">
                  <p
                    lang="zh"
                    className="font-brush text-parchment text-4xl leading-none"
                  >
                    {category.nameZh}
                  </p>
                  <h2
                    id={`${category.slug}-title`}
                    className="font-poster mt-3 text-[clamp(1.9rem,3.8vw,3.25rem)] leading-tight uppercase"
                  >
                    <StampedText>{category.nameEn}</StampedText>
                  </h2>
                  <p className="font-hand text-cream mt-2 text-xl">
                    {category.itemCount} {category.itemCount === 1 ? "dish" : "dishes"}
                  </p>
                </header>

                <CategoryCollage
                  category={category}
                  tilt={index % 2 === 0 ? -1.2 : 1.2}
                />
              </section>
            ))}
          </InkRevealGrid>
        </div>
      </main>
    </PageTransition>
  );
}
