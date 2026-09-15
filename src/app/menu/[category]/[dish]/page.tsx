import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { HandUnderline } from "@/components/hand/hand-underline";
import { StampedText } from "@/components/hand/stamped-text";
import { TapedFrame } from "@/components/hand/taped-frame";
import { DishCard } from "@/components/menu/dish-card";
import { AddToCart } from "@/components/order/add-to-cart";
import { DishMedia } from "@/components/menu/dish-media";
import { DishTags } from "@/components/menu/dish-tags";
import { DragonBackdrop } from "@/components/menu/dragon-backdrop";
import { InkRevealGrid } from "@/components/menu/ink-reveal-grid";
import { CONTACT } from "@/content/contact";
import { DISH_MEDIA } from "@/content/menu-media";
import { getCategories, getDish, getMoreDishes } from "@/lib/menu";
import { formatCad } from "@/lib/money";
import { PageTransition } from "@/components/motion/page-transition";

/** Every dish is prerendered under its own category; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().flatMap((category) =>
    category.items.map((item) => ({ category: category.slug, dish: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/menu/[category]/[dish]">): Promise<Metadata> {
  const { category: categorySlug, dish: dishSlug } = await params;
  const found = getDish(categorySlug, dishSlug);
  if (!found) return {};
  const { category, item } = found;

  return {
    title: `${item.nameEn} ${item.nameZh}`,
    description:
      item.description ??
      `${item.nameEn} (${item.nameZh}), ${formatCad(item.priceCents)}, from the ${category.nameEn.toLowerCase()} at Seven Noodles, Yonge Street, North York.`,
  };
}

export default async function DishPage({ params }: PageProps<"/menu/[category]/[dish]">) {
  const { category: categorySlug, dish: dishSlug } = await params;
  const found = getDish(categorySlug, dishSlug);
  if (!found) notFound();
  const { category, item } = found;
  const more = getMoreDishes(category, item);

  return (
    <PageTransition id={`menu/${category.slug}/${item.slug}`}>
      <main
        id="main"
        data-nav-theme="light"
        className="paper-cream text-ink relative isolate min-h-svh px-6 pt-32 pb-28 md:px-10"
      >
        <DragonBackdrop tone="cream" />

        <div className="mx-auto max-w-[1400px]">
          <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Held to a width whose 4:5 height still fits a laptop screen with the
                details beside it. */}
            <div className="w-full lg:max-w-[36rem] lg:justify-self-end">
              {/* Shares its name with the dish's card, so opening a card flies
                  its photograph into this place. */}
              <TapedFrame tilt={-1.5} className="text-lg">
                <ViewTransition name={`dish-${item.slug}`} share="morph" default="none">
                  <DishMedia
                    media={DISH_MEDIA[item.slug]}
                    label={item.nameEn}
                    sizes="(min-width: 1024px) 576px, 100vw"
                    preload
                  />
                </ViewTransition>
              </TapedFrame>
            </div>

            <div className="flex flex-col items-start">
              <Link
                href={`/menu/${category.slug}`}
                className="group font-hand-caps text-ink relative flex items-baseline gap-2 text-base tracking-[0.06em] uppercase"
              >
                <span aria-hidden="true">←</span>
                <span lang="zh" className="font-brush text-chili text-xl normal-case">
                  {category.nameZh}
                </span>
                <span className="relative">
                  {category.nameEn}
                  <HandUnderline
                    seed={31}
                    className="text-chili absolute inset-x-0 -bottom-1 h-2"
                  />
                </span>
              </Link>

              <p lang="zh" className="text-chili mt-10 text-3xl leading-none font-bold">
                {item.nameZh}
              </p>
              <h1 className="font-poster mt-3 text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05]">
                <StampedText tone="text-ink" shadow="text-chili">
                  {item.nameEn}
                </StampedText>
              </h1>
              <p className="mt-6 font-mono text-3xl">{formatCad(item.priceCents)}</p>

              <DishTags item={item} className="mt-6 text-base" />

              {item.description ? (
                <p className="text-ink mt-8 max-w-prose text-base leading-relaxed">
                  {item.description}
                </p>
              ) : null}

              {item.ingredients ? (
                <section aria-labelledby="ingredients" className="mt-10 w-full">
                  <h2
                    id="ingredients"
                    className="font-hand-caps text-xl tracking-[0.06em] uppercase"
                  >
                    Ingredients
                  </h2>
                  <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="mt-10">
                <AddToCart slug={item.slug} name={item.nameEn} />
              </div>
              <p className="font-hand text-ink/85 mt-4 text-lg">
                Pickup at {CONTACT.address.street}, {CONTACT.address.locality}.{" "}
                {CONTACT.hoursSummary}.
              </p>
            </div>
          </article>

          {more.length > 0 ? (
            <section aria-labelledby="more-dishes" className="mt-32">
              <h2
                id="more-dishes"
                className="font-poster flex flex-wrap items-baseline gap-x-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight"
              >
                <span>More from</span>
                <span lang="zh" className="font-brush text-chili">
                  {category.nameZh}
                </span>
              </h2>

              <InkRevealGrid className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-10">
                {more.map((dish) => (
                  <DishCard key={dish.slug} item={dish} categorySlug={category.slug} />
                ))}
              </InkRevealGrid>
            </section>
          ) : null}
        </div>
      </main>
    </PageTransition>
  );
}
