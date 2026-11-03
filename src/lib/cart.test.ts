import { describe, expect, it } from "vitest";
import {
  addItem,
  lineKey,
  MAX_QUANTITY,
  parseLines,
  priceLines,
  quantityOf,
  removeItem,
  setQuantity,
  totals,
} from "./cart";
import { defaultSelection, findDish, getCategories } from "./menu";

const plain = getCategories()
  .flatMap((c) => c.items)
  .filter((item) => item.available && item.options.length === 0);
const [first, second] = plain;
if (!first || !second) throw new Error("fixture dishes missing");

const withOptions = findDish("super-spicy-beef-or-chicken-noodles")?.item;
const pending = findDish("spicy-beef-tripe-noodles")?.item;
if (!withOptions || !pending) throw new Error("fixture dishes missing");

describe("cart", () => {
  it("adds, merges and removes dishes", () => {
    let lines = addItem([], first.slug);
    lines = addItem(lines, first.slug, {}, 2);
    lines = addItem(lines, second.slug);
    expect(lines).toEqual([
      { slug: first.slug, selection: {}, quantity: 3 },
      { slug: second.slug, selection: {}, quantity: 1 },
    ]);
    expect(removeItem(lines, first.slug)).toEqual([
      { slug: second.slug, selection: {}, quantity: 1 },
    ]);
  });

  it("keeps the same dish with different choices on separate lines", () => {
    const beef = { protein: "beef", spice: "regular" };
    const chicken = { spice: "regular", protein: "chicken" };
    let lines = addItem([], withOptions.slug, beef);
    lines = addItem(lines, withOptions.slug, chicken);
    lines = addItem(lines, withOptions.slug, { spice: "regular", protein: "beef" });
    expect(lines).toHaveLength(2);
    expect(lines[0]?.quantity).toBe(2);
    expect(quantityOf(lines, withOptions.slug)).toBe(3);
    expect(lineKey(withOptions.slug, beef)).toBe(
      lineKey(withOptions.slug, { spice: "regular", protein: "beef" }),
    );
  });

  it("keeps quantities between one and the maximum, and removes at zero", () => {
    const lines = addItem([], first.slug);
    expect(setQuantity(lines, first.slug, 999)[0]?.quantity).toBe(MAX_QUANTITY);
    expect(setQuantity(lines, first.slug, 0)).toEqual([]);
    expect(setQuantity(lines, first.slug, -3)).toEqual([]);
    expect(addItem([], first.slug, {}, 0)).toEqual([]);
  });

  it("prices from the menu and drops dishes it no longer has", () => {
    const lines = [
      { slug: first.slug, selection: {}, quantity: 2 },
      { slug: "a-dish-long-gone", selection: {}, quantity: 4 },
    ];
    const priced = priceLines(lines);
    expect(priced).toHaveLength(1);
    expect(priced[0]?.lineTotalCents).toBe(first.priceCents * 2);
  });

  it("drops dishes not yet served and choices the dish does not offer", () => {
    expect(priceLines([{ slug: pending.slug, selection: {}, quantity: 1 }])).toEqual([]);
    expect(
      priceLines([
        {
          slug: withOptions.slug,
          selection: { protein: "tofu", spice: "regular" },
          quantity: 1,
        },
      ]),
    ).toEqual([]);
    expect(priceLines([{ slug: withOptions.slug, selection: {}, quantity: 1 }])).toEqual(
      [],
    );
    expect(
      priceLines([{ slug: first.slug, selection: { protein: "beef" }, quantity: 1 }]),
    ).toEqual([]);
  });

  it("prices a dish with its choices", () => {
    const [line] = priceLines([
      { slug: withOptions.slug, selection: defaultSelection(withOptions), quantity: 2 },
    ]);
    expect(line?.choices.map((c) => c.choice.id)).toEqual(["beef", "regular"]);
    expect(line?.lineTotalCents).toBe(withOptions.priceCents * 2);
  });

  it("adds HST at 13%, rounded once on the subtotal", () => {
    const lines = [
      { slug: first.slug, selection: {}, quantity: 1 },
      { slug: second.slug, selection: {}, quantity: 2 },
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
        { slug: withOptions.slug, selection: { protein: "beef" }, quantity: 1 },
        { slug: second.slug, selection: { protein: 3 }, quantity: 1 },
        { slug: 7, quantity: 1 },
        { slug: second.slug, quantity: 0 },
        "nonsense",
      ]),
    ).toEqual([
      { slug: first.slug, selection: {}, quantity: 2 },
      { slug: withOptions.slug, selection: { protein: "beef" }, quantity: 1 },
      { slug: second.slug, selection: {}, quantity: 1 },
    ]);
    expect(parseLines(null)).toEqual([]);
  });
});
