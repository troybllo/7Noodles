import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { menuJsonLd, pageMetadata } from "@/lib/seo";
import { AllergyNotice } from "@/components/menu/allergy-notice";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { CategoryDishes } from "@/components/menu/category-dishes";
import { MenuMargins } from "@/components/menu/menu-margins";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories } from "@/lib/menu";

export const metadata: Metadata = pageMetadata({
  title: "Menu: Sichuan Noodles, Wontons & Skewers",
  description:
    "The full menu at 7 Noodles 恰小面 in North York: Chongqing xiaomian, wok-fried chef's specials, noodle soups, Sichuan wontons, Leshan fried skewers, appetizers and desserts, with prices.",
  path: "/menu",
});

export default function MenuPage() {
  const categories = getCategories();

  return (
    <PageTransition id="menu">
      <main
        id="main"
        data-nav-theme="light"
        className="bg-paper text-brand relative min-h-svh px-6 pt-24 pb-28 md:px-10 md:pt-32"
      >
        <JsonLd data={menuJsonLd()} />
        <MenuMargins />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="grid gap-6 md:gap-10 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
            <SectionHeading as="h1" eyebrow="Our menu" zh="菜单">
              Noodles, wontons &amp; skewers
            </SectionHeading>
            <div className="flex flex-col gap-5">
              <AllergyNotice />
              <Button href="/order" tone="solid" className="self-start">
                Order for pickup
              </Button>
            </div>
          </div>

          <CategoryTabs categories={categories} anchors className="mt-8 md:mt-14" />

          <div className="mt-10 flex flex-col gap-28 md:gap-36">
            {categories.map((category) => (
              <section
                key={category.slug}
                id={category.slug}
                aria-labelledby={`${category.slug}-title`}
                className="scroll-mt-rail"
              >
                <header className="border-brand/15 mb-10 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p
                      lang="zh"
                      className="font-cjk text-brand-deep text-base font-bold tracking-[0.15em]"
                    >
                      {category.nameZh}
                    </p>
                    <h2
                      id={`${category.slug}-title`}
                      className="font-display text-title mt-2"
                    >
                      {category.nameEn}
                    </h2>
                  </div>
                  {category.note ? (
                    <p className="text-brand-deep max-w-[46ch] text-sm leading-relaxed md:text-right">
                      {category.note}
                    </p>
                  ) : null}
                </header>

                <CategoryDishes category={category} />
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
