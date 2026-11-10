import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { AllergyNotice } from "@/components/menu/allergy-notice";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { DishTags } from "@/components/menu/dish-tags";
import { MenuMargins } from "@/components/menu/menu-margins";
import { PageTransition } from "@/components/motion/page-transition";
import { AddToCart } from "@/components/order/add-to-cart";
import { OrderSummary } from "@/components/order/order-summary";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT } from "@/content/contact";
import { getCategories } from "@/lib/menu";
import { formatCad } from "@/lib/money";

export const metadata: Metadata = pageMetadata({
  title: "Order Online for Pickup",
  description:
    "Order 7 Noodles 恰小面 online for pickup on Yonge Street in North York: Chongqing noodles, Sichuan wontons and Leshan fried skewers, paid securely online.",
  path: "/order",
});

/**
 * The ordering menu: every dish in a compact row with its price, marks and an
 * Add control, grouped by category, beside the running order.
 */
export default function OrderPage() {
  const categories = getCategories();

  return (
    <PageTransition id="order">
      <main
        id="main"
        data-nav-theme="light"
        className="bg-paper text-brand relative px-6 pt-24 pb-28 md:px-10 md:pt-32"
      >
        <MenuMargins />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="grid gap-6 md:gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
            <div>
              <SectionHeading as="h1" eyebrow="Order online" zh="到店自取">
                Order for pickup
              </SectionHeading>
              <p className="text-brand-deep text-lede mt-6 max-w-[40ch] leading-relaxed">
                Pick your dishes, choose a time, and collect at {CONTACT.address.street}.{" "}
                {CONTACT.hoursSummary}.
              </p>
            </div>
            <AllergyNotice />
          </div>

          <CategoryTabs categories={categories} anchors className="mt-8 md:mt-12" />

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
            <div className="flex flex-col gap-16">
              {categories.map((category) => (
                <section
                  key={category.slug}
                  id={category.slug}
                  aria-labelledby={`order-${category.slug}`}
                  className="scroll-mt-rail"
                >
                  <h2
                    id={`order-${category.slug}`}
                    className="flex flex-wrap items-baseline gap-x-3"
                  >
                    <span className="font-display text-3xl tracking-[-0.02em]">
                      {category.nameEn}
                    </span>
                    <span
                      lang="zh"
                      className="font-cjk text-brand-deep text-base font-bold"
                    >
                      {category.nameZh}
                    </span>
                  </h2>
                  {category.note ? (
                    <p className="text-brand-deep mt-2 max-w-[60ch] text-sm">
                      {category.note}
                    </p>
                  ) : null}

                  <ul className="mt-4">
                    {category.items.map((item) => (
                      <li
                        key={item.slug}
                        className={`border-brand/10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b py-5 ${item.available ? "" : "opacity-60"}`}
                      >
                        <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                          <Link
                            href={`/menu/${category.slug}/${item.slug}`}
                            className="font-display decoration-brand-deep -my-2.5 inline-block py-2.5 text-lg leading-snug underline-offset-4 hover:underline"
                          >
                            {item.nameEn}
                          </Link>
                          <span className="text-brand-deep block text-sm">
                            <span lang="zh" className="font-cjk">
                              {item.nameZh}
                            </span>
                            {item.portion ? ` · ${item.portion}` : ""}
                          </span>
                          <DishTags item={item} compact className="mt-2" />
                        </div>
                        <span className="mr-auto font-semibold tabular-nums sm:mr-0">
                          {formatCad(item.priceCents)}
                        </span>
                        <AddToCart item={item} />
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
      </main>
    </PageTransition>
  );
}
