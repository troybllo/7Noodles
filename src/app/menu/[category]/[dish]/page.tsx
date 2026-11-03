import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, dishJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { DishCard } from "@/components/menu/dish-card";
import { AddToCart } from "@/components/order/add-to-cart";
import { DishMedia } from "@/components/menu/dish-media";
import { DishTags } from "@/components/menu/dish-tags";
import { AllergyNotice } from "@/components/menu/allergy-notice";
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

  return pageMetadata({
    title: `${item.nameEn} ${item.nameZh}`,
    description:
      item.description ??
      `${item.nameEn} (${item.nameZh}), ${formatCad(item.priceCents)}, from the ${category.nameEn.toLowerCase()} at 7 Noodles 恰小面 on Yonge Street, North York. Order online for pickup.`,
    path: `/menu/${category.slug}/${item.slug}`,
    image: DISH_MEDIA[item.slug]?.photo,
  });
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
        className="bg-paper text-brand relative min-h-svh px-6 pt-32 pb-28 md:px-10"
      >
        <JsonLd
          data={[
            dishJsonLd(item, category.slug),
            breadcrumbJsonLd([
              { name: "Menu", path: "/menu" },
              { name: category.nameEn, path: `/menu/${category.slug}` },
              { name: item.nameEn, path: `/menu/${category.slug}/${item.slug}` },
            ]),
          ]}
        />
        <div className="mx-auto max-w-[1400px]">
          <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Held to a width whose 4:5 height still fits a laptop screen with the
                details beside it. */}
            <div className="w-full lg:max-w-[36rem] lg:justify-self-end">
              {/* Shares its name with the dish's card, so opening a card flies
                  its photograph into this place. */}
              <ViewTransition name={`dish-${item.slug}`} share="morph" default="none">
                <DishMedia
                  media={DISH_MEDIA[item.slug]}
                  label={item.nameEn}
                  zh={item.nameZh}
                  sizes="(min-width: 1024px) 576px, 100vw"
                  preload
                />
              </ViewTransition>
            </div>

            <div className="flex flex-col items-start">
              <Link
                href={`/menu/${category.slug}`}
                className="eyebrow text-brand-deep hover:text-brand flex items-baseline gap-2 transition-colors"
              >
                <span aria-hidden="true">←</span>
                {category.nameEn}
                <span lang="zh" className="font-cjk text-brand-deep normal-case">
                  {category.nameZh}
                </span>
              </Link>

              <p
                lang="zh"
                className="font-cjk text-brand-deep mt-10 text-2xl leading-none font-bold tracking-[0.08em]"
              >
                {item.nameZh}
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.25rem,4.2vw,4rem)] leading-[1.02] tracking-[-0.03em] text-balance">
                {item.nameEn}
              </h1>
              <p className="mt-6 flex items-baseline gap-3 text-2xl font-semibold tabular-nums">
                {formatCad(item.priceCents)}
                {item.portion ? (
                  <span className="text-brand-deep text-base font-normal">
                    {item.portion}
                  </span>
                ) : null}
              </p>

              <DishTags item={item} className="mt-6" />

              {item.description ? (
                <p className="text-brand-deep mt-8 max-w-prose text-base leading-relaxed">
                  {item.description}
                </p>
              ) : null}

              {item.ingredients ? (
                <section aria-labelledby="ingredients" className="mt-10 w-full">
                  <h2 id="ingredients" className="eyebrow text-brand-deep">
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

              {item.options.length > 0 ? (
                <p className="text-brand-deep mt-8 text-sm">
                  Choose{" "}
                  {item.options
                    .map(
                      (option) =>
                        `${option.labelEn.toLowerCase()} (${option.choices.map((c) => c.labelEn.toLowerCase()).join(", ")})`,
                    )
                    .join("; ")}
                  .
                </p>
              ) : null}

              <div className="mt-8">
                <AddToCart item={item} />
              </div>
              <p className="text-brand-deep mt-4 text-sm">
                Pickup at {CONTACT.address.street}, {CONTACT.address.locality}.{" "}
                {CONTACT.hoursSummary}.
              </p>
              <AllergyNotice legend={false} className="mt-8 max-w-xl" />
            </div>
          </article>

          {more.length > 0 ? (
            <section aria-labelledby="more-dishes" className="mt-32">
              <h2
                id="more-dishes"
                className="font-display text-title border-brand/15 flex flex-wrap items-baseline gap-x-4 border-t pt-8"
              >
                <span>More {category.nameEn.toLowerCase()}</span>
                <span lang="zh" className="font-cjk text-brand-deep text-lg font-bold">
                  {category.nameZh}
                </span>
              </h2>

              <InkRevealGrid className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3">
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
