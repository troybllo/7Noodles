import { z } from "zod";
import source from "../../data/menu-source.json";
import type { Cents } from "./money";

/**
 * The menu, as the site reads it.
 *
 * Today this is the capture of the restaurant's own published menu in
 * data/menu-source.json. When the database goes in, the bodies of these
 * functions change and nothing that calls them does — which is why pages never
 * import the JSON directly.
 *
 * The data is validated when this module loads. A malformed price or a
 * duplicated slug fails the build, not a customer's page load.
 */

const tagSchema = z.enum(["vegetarian", "vegan"]);

const itemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  spiceLevel: z.number().int().min(0).max(3),
  tags: z.array(tagSchema),
});

const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  items: z.array(itemSchema).min(1),
});

const menuSchema = z
  .object({ categories: z.array(categorySchema).min(1) })
  .refine(
    (menu) => new Set(menu.categories.map((c) => c.slug)).size === menu.categories.length,
    { message: "Category slugs must be unique" },
  )
  .refine(
    (menu) => {
      const slugs = menu.categories.flatMap((c) => c.items.map((i) => i.slug));
      return new Set(slugs).size === slugs.length;
    },
    { message: "Item slugs must be unique across the menu" },
  );

export type MenuTag = z.infer<typeof tagSchema>;
export type MenuItem = z.infer<typeof itemSchema>;

export type MenuCategory = z.infer<typeof categorySchema> & {
  itemCount: number;
  minPriceCents: Cents;
  maxPriceCents: Cents;
};

const menu = menuSchema.parse(source);

const categories: MenuCategory[] = menu.categories.map((category) => {
  const prices = category.items.map((item) => item.priceCents);
  return {
    ...category,
    itemCount: category.items.length,
    minPriceCents: Math.min(...prices),
    maxPriceCents: Math.max(...prices),
  };
});

export function getCategories(): MenuCategory[] {
  return categories;
}

export function getCategory(slug: string): MenuCategory | undefined {
  return categories.find((category) => category.slug === slug);
}
