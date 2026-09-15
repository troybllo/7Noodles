import type { Metadata } from "next";
import Link from "next/link";
import { NoodleLift } from "@/components/hand/noodle-lift";
import { StampedText } from "@/components/hand/stamped-text";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DishTags } from "@/components/menu/dish-tags";
import { DrawOn } from "@/components/motion/draw-on";
import { PageTransition } from "@/components/motion/page-transition";
import { AddToCart } from "@/components/order/add-to-cart";
import { OrderSummary } from "@/components/order/order-summary";
import { CONTACT } from "@/content/contact";
import { getCategories } from "@/lib/menu";
import { formatCad } from "@/lib/money";

export const metadata: Metadata = {
  title: "Order for pickup",
  description:
    "Order Seven Noodles for pickup on Yonge Street in North York: Sichuan and Chongqing noodles, wontons and Leshan fried skewers.",
};

/**
 * The ordering menu: every dish in a compact row with its price and an Add
 * control, grouped by category, beside the running order.
 */
export default function OrderPage() {
  const categories = getCategories();

  return (
    <PageTransition id="order">
      <main id="main">
        <section
          data-nav-theme="red"
          className="paper-red text-cream relative overflow-hidden px-6 pt-32 pb-16 md:px-10"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <h1 className="font-poster text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] uppercase">
                <StampedText>Order for pickup</StampedText>
              </h1>
              <p className="font-hand mt-5 max-w-[34ch] text-[clamp(1.2rem,2vw,1.6rem)] leading-snug">
                Pick your dishes, choose a time, and collect at {CONTACT.address.street}.{" "}
                {CONTACT.hoursSummary}.
              </p>
            </div>
            <DrawOn className="hidden w-48 md:block lg:w-60">
              <NoodleLift className="text-cream w-full [--noodle-ground:var(--color-chili)]" />
            </DrawOn>
          </div>
        </section>

        <div
          data-nav-theme="light"
          className="paper-cream text-ink px-6 pt-10 pb-28 md:px-10"
        >
          <div className="mx-auto max-w-[1200px]">
            <CategoryTabs categories={categories} anchors tone="cream" />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
              <div className="flex flex-col gap-16">
                {categories.map((category) => (
                  <section
                    key={category.slug}
                    id={category.slug}
                    aria-labelledby={`order-${category.slug}`}
                    className="scroll-mt-28"
                  >
                    <h2
                      id={`order-${category.slug}`}
                      className="flex flex-wrap items-baseline gap-x-4"
                    >
                      <span lang="zh" className="font-brush text-chili text-3xl">
                        {category.nameZh}
                      </span>
                      <span className="font-poster text-2xl uppercase">
                        {category.nameEn}
                      </span>
                    </h2>

                    <ul className="mt-4">
                      {category.items.map((item) => (
                        <li
                          key={item.slug}
                          className="border-ink/20 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-dashed py-4"
                        >
                          <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                            <Link
                              href={`/menu/${category.slug}/${item.slug}`}
                              className="font-nav text-lg leading-snug font-bold hover:underline"
                            >
                              {item.nameEn}
                            </Link>
                            <span lang="zh" className="text-ink/70 block text-sm">
                              {item.nameZh}
                            </span>
                            <DishTags item={item} className="mt-1" />
                          </div>
                          <span className="mr-auto font-mono text-lg sm:mr-0">
                            {formatCad(item.priceCents)}
                          </span>
                          <AddToCart slug={item.slug} name={item.nameEn} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div>
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
