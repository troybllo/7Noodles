import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, menuJsonLd, pageMetadata } from "@/lib/seo";
import { CATEGORY_COVERS } from "@/content/menu-media";
import { notFound } from "next/navigation";
import { AllergyNotice } from "@/components/menu/allergy-notice";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { CategoryDishes } from "@/components/menu/category-dishes";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getCategory } from "@/lib/menu";
import { formatCad } from "@/lib/money";
import { MenuMargins } from "@/components/menu/menu-margins";
import { PageTransition } from "@/components/motion/page-transition";

/** Every category is prerendered; anything else is a 404, not an empty menu. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/menu/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return pageMetadata({
    title: `${category.nameEn} ${category.nameZh}`,
    description: `${category.itemCount} ${category.nameEn.toLowerCase()} dishes at 7 Noodles 恰小面 on Yonge Street, North York, from ${formatCad(category.minPriceCents)}. See photos and prices, and order online for pickup.`,
    path: `/menu/${category.slug}`,
    image: CATEGORY_COVERS[category.slug],
  });
}

export default async function CategoryPage({ params }: PageProps<"/menu/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <PageTransition id={`menu/${category.slug}`}>
      <main
        id="main"
        data-nav-theme="light"
        className="bg-paper text-brand relative min-h-svh px-6 pt-24 pb-28 md:px-10 md:pt-32"
      >
        <JsonLd
          data={[
            menuJsonLd(category.slug),
            breadcrumbJsonLd([
              { name: "Menu", path: "/menu" },
              { name: category.nameEn, path: `/menu/${category.slug}` },
            ]),
          ]}
        />
        <MenuMargins category={category.slug} />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="grid gap-6 md:gap-10 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end">
            <div>
              <SectionHeading
                as="h1"
                eyebrow={`Menu · ${category.itemCount} ${category.itemCount === 1 ? "dish" : "dishes"}`}
                zh={category.nameZh}
              >
                {category.nameEn}
              </SectionHeading>
              {category.note ? (
                <p className="text-brand-deep mt-6 max-w-[52ch] leading-relaxed">
                  {category.note}
                </p>
              ) : null}
            </div>
            <AllergyNotice legend={false} />
          </div>

          <CategoryTabs
            categories={getCategories()}
            active={category.slug}
            className="mt-8 md:mt-12"
          />

          <CategoryDishes category={category} className="mt-8 md:mt-12" />
        </div>
      </main>
    </PageTransition>
  );
}
