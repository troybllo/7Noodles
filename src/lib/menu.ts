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
  /**
   * Written by the kitchen, never by us: ingredients matter to anyone with an
   * allergy. Absent for every dish today, and each page shows these sections
   * only once they exist.
   */
  description: z.string().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1).optional(),
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

/**
 * A dish, found through the category it belongs to. A dish addressed under the
 * wrong category is not found, so every dish has exactly one address.
 */
export function getDish(
  categorySlug: string,
  dishSlug: string,
): { category: MenuCategory; item: MenuItem } | undefined {
  const category = getCategory(categorySlug);
  const item = category?.items.find((candidate) => candidate.slug === dishSlug);
  return category && item ? { category, item } : undefined;
}

/**
 * The dishes after this one in its category, wrapping round to the start, and
 * never the dish itself.
 */
export function getMoreDishes(
  category: MenuCategory,
  item: MenuItem,
  count = 3,
): MenuItem[] {
  const index = category.items.findIndex((candidate) => candidate.slug === item.slug);
  const others = [...category.items.slice(index + 1), ...category.items.slice(0, index)];
  return others.slice(0, count);
}

/** Any dish on the menu by its slug, which is unique across the whole menu. */
export function findDish(
  dishSlug: string,
): { category: MenuCategory; item: MenuItem } | undefined {
  for (const category of categories) {
    const item = category.items.find((candidate) => candidate.slug === dishSlug);
    if (item) return { category, item };
  }
  return undefined;
}
