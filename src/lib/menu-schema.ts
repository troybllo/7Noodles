import { z } from "zod";

/**
 * The shape of data/menu.json.
 *
 * Checked at build time — next.config.ts parses the menu with this, so a
 * malformed price or a duplicated slug fails `next build` — and in
 * menu.test.ts. Never imported by code that reaches the browser: the menu is
 * read on every page (the cart prices from it), and shipping the validator
 * with it would add ~86 KB of JavaScript to every page to re-check data that
 * was already checked.
 *
 * Defaults are written into the JSON itself (menu.test.ts fails if not), so
 * the site can read it without parsing.
 */

const tagSchema = z.enum(["vegetarian", "vegan", "seafood"]);

/**
 * "removable" means the kitchen can leave it off when asked; "contains" means
 * it is in the dish and cannot be.
 */
const allergenPresence = z.enum(["removable", "contains"]);

const allergensSchema = z.object({
  /** The owner's NUTS mark: always peanut or sesame, in any form. */
  nuts: allergenPresence.optional(),
  mustard: allergenPresence.optional(),
});

const choiceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  labelEn: z.string().min(1),
  labelZh: z.string().min(1),
  priceDeltaCents: z.number().int().default(0),
  /** The heat of the dish with this choice, when it differs from the dish's own. */
  spiceLevel: z.number().int().min(0).max(3).optional(),
});

const optionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    labelEn: z.string().min(1),
    labelZh: z.string().min(1),
    /** The first choice is the default. */
    choices: z.array(choiceSchema).min(2),
  })
  .refine(
    (option) => new Set(option.choices.map((c) => c.id)).size === option.choices.length,
    {
      message: "Choice ids must be unique within an option",
    },
  );

const itemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  spiceLevel: z.number().int().min(0).max(3),
  tags: z.array(tagSchema),
  allergens: allergensSchema.default({}),
  /** The kitchen will make it hotter, milder or not spicy at all. */
  spiceAdjustable: z.boolean().default(false),
  /** False while a dish is listed but not yet served: shown, never orderable. */
  available: z.boolean().default(true),
  /** One of the dishes the owner wants to lead with. */
  signature: z.boolean().default(false),
  /** How much comes, or what comes with it: "6 skewers", "with a fried egg". */
  portion: z.string().min(1).optional(),
  options: z.array(optionSchema).default([]),
  /**
   * Written by the kitchen, never by us: ingredients matter to anyone with an
   * allergy. Each page shows these sections only for dishes that have them.
   */
  description: z.string().min(1).optional(),
  ingredients: z.array(z.string().min(1)).min(1).optional(),
});

const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  /** A line from the owner shown under the heading, often about allergens. */
  note: z.string().min(1).optional(),
  items: z.array(itemSchema).min(1),
});

export const menuSchema = z
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

export type MenuData = z.infer<typeof menuSchema>;
export type MenuTag = z.infer<typeof tagSchema>;
export type MenuItem = z.infer<typeof itemSchema>;
export type MenuOption = z.infer<typeof optionSchema>;
export type MenuChoice = z.infer<typeof choiceSchema>;
export type MenuCategoryData = z.infer<typeof categorySchema>;
