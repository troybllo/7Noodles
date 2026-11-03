import { describe, expect, it } from "vitest";
import source from "../../data/menu.json";
import {
  defaultSelection,
  getCategories,
  getCategory,
  getDish,
  getMoreDishes,
  resolveSelection,
} from "./menu";
import { menuSchema } from "./menu-schema";

describe("menu data file", () => {
  it("is valid and already carries every default, so the site can read it unparsed", () => {
    const parsed = menuSchema.parse(source);
    expect(source.categories).toEqual(parsed.categories);
  });
});

describe("menu data layer", () => {
  const categories = getCategories();

  it("exposes every category and item in the owner's menu", () => {
    expect(categories).toHaveLength(source.categories.length);
    const total = categories.reduce((sum, c) => sum + c.itemCount, 0);
    expect(total).toBe(source.categories.reduce((sum, c) => sum + c.items.length, 0));
  });

  it("leaves drinks off the website", () => {
    expect(categories.map((c) => c.slug)).not.toContain("drinks");
    const names = categories.flatMap((c) => c.items.map((i) => i.nameEn.toLowerCase()));
    for (const drink of ["coke", "sprite", "iced tea", "heineken"]) {
      expect(
        names.some((name) => name.includes(drink)),
        drink,
      ).toBe(false);
    }
  });

  it("marks every skewer as containing nuts, which cannot be left off", () => {
    for (const item of getCategory("leshan-fried-skewers")?.items ?? []) {
      expect(item.allergens.nuts, item.slug).toBe("contains");
    }
  });

  it("gives every dish's default choices a valid selection", () => {
    for (const item of categories.flatMap((c) => c.items)) {
      expect(resolveSelection(item, defaultSelection(item)), item.slug).toBeDefined();
    }
  });

  it("uses unique category slugs", () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("stores every price as a whole number of cents", () => {
    for (const item of categories.flatMap((c) => c.items)) {
      expect(Number.isInteger(item.priceCents), item.slug).toBe(true);
    }
  });

  it("keeps spice levels within 0 to 3", () => {
    for (const item of categories.flatMap((c) => c.items)) {
      expect(item.spiceLevel, item.slug).toBeGreaterThanOrEqual(0);
      expect(item.spiceLevel, item.slug).toBeLessThanOrEqual(3);
    }
  });

  it("derives price ranges from the items themselves", () => {
    for (const category of categories) {
      const prices = category.items.map((i) => i.priceCents);
      expect(category.minPriceCents).toBe(Math.min(...prices));
      expect(category.maxPriceCents).toBe(Math.max(...prices));
    }
  });

  it("finds a category by slug and nothing for an unknown one", () => {
    expect(getCategory("sichuan-wontons")?.nameZh).toBe("川味抄手");
    expect(getCategory("not-a-category")).toBeUndefined();
  });

  it("finds a dish only under its own category", () => {
    const wonton = getCategory("sichuan-wontons");
    const dessert = getCategory("desserts");
    const dish = wonton?.items[0];
    if (!wonton || !dessert || !dish) throw new Error("fixture categories missing");

    expect(getDish("sichuan-wontons", dish.slug)?.item.slug).toBe(dish.slug);
    expect(getDish("desserts", dish.slug)).toBeUndefined();
    expect(getDish("sichuan-wontons", "not-a-dish")).toBeUndefined();
  });

  it("suggests other dishes from the same category, never the dish itself", () => {
    for (const category of categories) {
      for (const item of category.items) {
        const more = getMoreDishes(category, item);
        expect(more.map((m) => m.slug)).not.toContain(item.slug);
        expect(more).toHaveLength(Math.min(3, category.items.length - 1));
        expect(new Set(more.map((m) => m.slug)).size).toBe(more.length);
      }
    }
  });
});
