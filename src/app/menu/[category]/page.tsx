import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DishCard } from "@/components/menu/dish-card";
import { DragonBackdrop } from "@/components/menu/dragon-backdrop";
import { InkRevealGrid } from "@/components/menu/ink-reveal-grid";
import { getCategories, getCategory } from "@/lib/menu";

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

  return {
    title: `${category.nameEn} ${category.nameZh}`,
    description: `${category.itemCount} ${category.nameEn.toLowerCase()} dishes at Seven Noodles, Yonge Street, North York.`,
  };
}

export default async function CategoryPage({ params }: PageProps<"/menu/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <main
      id="main"
      data-nav-theme="light"
      className="bg-rice text-ink relative isolate min-h-svh px-6 pt-32 pb-28 md:px-10"
    >
      <DragonBackdrop tone="rice" />

      <div className="mx-auto max-w-[1400px]">
        <CategoryTabs categories={getCategories()} active={category.slug} tone="light" />

        <header className="mt-14 text-center">
          <p lang="zh" className="font-round-cjk text-peach-text text-3xl leading-none">
            {category.nameZh}
          </p>
          <h1 className="font-round mt-3 text-[clamp(2.25rem,4.5vw,4rem)] leading-tight font-semibold">
            {category.nameEn}
          </h1>
          <p className="text-ink mt-3 text-sm">
            {category.itemCount} {category.itemCount === 1 ? "dish" : "dishes"}
          </p>
        </header>

        <InkRevealGrid className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
          {category.items.map((item) => (
            <DishCard key={item.slug} item={item} />
          ))}
        </InkRevealGrid>
      </div>
    </main>
  );
}
