import { describe, expect, it } from "vitest";
import source from "../../data/menu-source.json";
import { getCategories, getCategory, getDish, getMoreDishes } from "./menu";

describe("menu data layer", () => {
  const categories = getCategories();

  it("exposes every captured category and item", () => {
    expect(categories).toHaveLength(source.categories.length);
    const total = categories.reduce((sum, c) => sum + c.itemCount, 0);
    expect(total).toBe(source.itemCount);
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
    expect(getCategory("wonton")?.nameZh).toBe("抄手");
    expect(getCategory("not-a-category")).toBeUndefined();
  });

  it("finds a dish only under its own category", () => {
    const wonton = getCategory("wonton");
    const dessert = getCategory("dessert");
    const dish = wonton?.items[0];
    if (!wonton || !dessert || !dish) throw new Error("fixture categories missing");

    expect(getDish("wonton", dish.slug)?.item.slug).toBe(dish.slug);
    expect(getDish("dessert", dish.slug)).toBeUndefined();
    expect(getDish("wonton", "not-a-dish")).toBeUndefined();
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
