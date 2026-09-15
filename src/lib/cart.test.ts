import { describe, expect, it } from "vitest";
import source from "../../data/menu-source.json";
import {
  addItem,
  MAX_QUANTITY,
  parseLines,
  priceLines,
  removeItem,
  setQuantity,
  totals,
} from "./cart";

const [first, second] = source.categories[0]!.items as {
  slug: string;
  priceCents: number;
}[];
if (!first || !second) throw new Error("fixture dishes missing");

describe("cart", () => {
  it("adds, merges and removes dishes", () => {
    let lines = addItem([], first.slug);
    lines = addItem(lines, first.slug, 2);
    lines = addItem(lines, second.slug);
    expect(lines).toEqual([
      { slug: first.slug, quantity: 3 },
      { slug: second.slug, quantity: 1 },
    ]);
    expect(removeItem(lines, first.slug)).toEqual([{ slug: second.slug, quantity: 1 }]);
  });

  it("keeps quantities between one and the maximum, and removes at zero", () => {
    const lines = addItem([], first.slug);
    expect(setQuantity(lines, first.slug, 999)[0]?.quantity).toBe(MAX_QUANTITY);
    expect(setQuantity(lines, first.slug, 0)).toEqual([]);
    expect(setQuantity(lines, first.slug, -3)).toEqual([]);
    expect(addItem([], first.slug, 0)).toEqual([]);
  });

  it("prices from the menu and drops dishes it no longer has", () => {
    const lines = [
      { slug: first.slug, quantity: 2 },
      { slug: "a-dish-long-gone", quantity: 4 },
    ];
    const priced = priceLines(lines);
    expect(priced).toHaveLength(1);
    expect(priced[0]?.lineTotalCents).toBe(first.priceCents * 2);
  });

  it("adds HST at 13%, rounded once on the subtotal", () => {
    const lines = [
      { slug: first.slug, quantity: 1 },
      { slug: second.slug, quantity: 2 },
    ];
    const subtotal = first.priceCents + second.priceCents * 2;
    const result = totals(lines);
    expect(result.subtotalCents).toBe(subtotal);
    expect(result.taxCents).toBe(Math.round(subtotal * 0.13));
    expect(result.totalCents).toBe(subtotal + result.taxCents);
    expect(result.itemCount).toBe(3);
    expect(totals([])).toEqual({
      itemCount: 0,
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
    });
  });

  it("reads back only well-formed stored lines", () => {
    expect(
      parseLines([
        { slug: first.slug, quantity: 2 },
        { slug: 7, quantity: 1 },
        { slug: second.slug, quantity: 0 },
        "nonsense",
      ]),
    ).toEqual([{ slug: first.slug, quantity: 2 }]);
    expect(parseLines(null)).toEqual([]);
  });
});
