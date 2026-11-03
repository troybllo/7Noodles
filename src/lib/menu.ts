import source from "../../data/menu.json";
import type { MenuCategoryData, MenuData, MenuItem } from "./menu-schema";
import type { Cents } from "./money";

export type { MenuChoice, MenuItem, MenuOption, MenuTag } from "./menu-schema";
import type { MenuChoice, MenuOption } from "./menu-schema";

/**
 * The menu, as the site reads it.
 *
 * Today this is the owner's own menu, transcribed into data/menu.json. When
 * the database goes in, the bodies of these functions change and nothing that
 * calls them does — which is why pages never import the JSON directly.
 *
 * The JSON is validated at build time against src/lib/menu-schema.ts (see
 * next.config.ts), not here: this module reaches the browser through the cart.
 */

export type MenuCategory = MenuCategoryData & {
  itemCount: number;
  minPriceCents: Cents;
  maxPriceCents: Cents;
};

const menu = source as unknown as MenuData;

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

/** A dish's choices as option id → choice id. */
export type Selection = Record<string, string>;

/** The first choice of every option, which is what the kitchen makes unasked. */
export function defaultSelection(item: MenuItem): Selection {
  return Object.fromEntries(
    item.options.map((option) => [option.id, option.choices[0]!.id]),
  );
}

/**
 * The chosen choice for each of a dish's options, in the dish's option order,
 * or undefined if the selection names an option or choice the dish does not
 * have or leaves one out. A cart saved before the menu changed fails here and
 * is dropped rather than sent to the kitchen half-understood.
 */
export function resolveSelection(
  item: MenuItem,
  selection: Selection,
): { option: MenuOption; choice: MenuChoice }[] | undefined {
  if (Object.keys(selection).length !== item.options.length) return undefined;
  const resolved: { option: MenuOption; choice: MenuChoice }[] = [];
  for (const option of item.options) {
    const choice = option.choices.find(
      (candidate) => candidate.id === selection[option.id],
    );
    if (!choice) return undefined;
    resolved.push({ option, choice });
  }
  return resolved;
}
