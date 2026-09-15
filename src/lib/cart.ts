import { findDish, type MenuCategory, type MenuItem } from "./menu";
import { applyRate, type Cents } from "./money";

/**
 * The order being built, as the browser keeps it.
 *
 * Only slugs and quantities are stored. Names and prices are always read back
 * from the menu, so a cart saved last week can never carry last week's price,
 * and a dish removed from the menu simply drops out.
 *
 * Everything here is pure, so the same functions can price an order on the
 * server when checkout is connected.
 */

export type CartLine = { slug: string; quantity: number };

export type PricedLine = CartLine & {
  item: MenuItem;
  category: MenuCategory;
  lineTotalCents: Cents;
};

export type CartTotals = {
  itemCount: number;
  subtotalCents: Cents;
  taxCents: Cents;
  totalCents: Cents;
};

/** Ontario HST on prepared food. */
export const HST_RATE = 0.13;

/** The most of any one dish a single online order can hold. */
export const MAX_QUANTITY = 20;

const clamp = (quantity: number) =>
  Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));

/** Adds `quantity` of a dish, merging with any already in the cart. */
export function addItem(lines: CartLine[], slug: string, quantity = 1): CartLine[] {
  const existing = lines.find((line) => line.slug === slug);
  if (!existing) {
    const next = clamp(quantity);
    return next > 0 ? [...lines, { slug, quantity: next }] : lines;
  }
  return setQuantity(lines, slug, existing.quantity + quantity);
}

/** Sets a dish's quantity; zero or less removes it. */
export function setQuantity(
  lines: CartLine[],
  slug: string,
  quantity: number,
): CartLine[] {
  const next = clamp(quantity);
  if (next === 0) return removeItem(lines, slug);
  return lines.map((line) => (line.slug === slug ? { ...line, quantity: next } : line));
}

export function removeItem(lines: CartLine[], slug: string): CartLine[] {
  return lines.filter((line) => line.slug !== slug);
}

/** The cart's lines with their dishes and prices, dropping any the menu no longer has. */
export function priceLines(lines: CartLine[]): PricedLine[] {
  return lines.flatMap((line) => {
    const found = findDish(line.slug);
    const quantity = clamp(line.quantity);
    if (!found || quantity === 0) return [];
    return [
      {
        slug: line.slug,
        quantity,
        item: found.item,
        category: found.category,
        lineTotalCents: found.item.priceCents * quantity,
      },
    ];
  });
}

/** Subtotal, HST and total. Tax is rounded once, on the subtotal. */
export function totals(lines: CartLine[]): CartTotals {
  const priced = priceLines(lines);
  const subtotalCents = priced.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const taxCents = applyRate(subtotalCents, HST_RATE);
  return {
    itemCount: priced.reduce((sum, line) => sum + line.quantity, 0),
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
  };
}

/** Parses whatever was stored, keeping only well-formed lines. */
export function parseLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as CartLine).slug === "string" &&
      typeof (entry as CartLine).quantity === "number"
    ) {
      const quantity = clamp((entry as CartLine).quantity);
      return quantity > 0 ? [{ slug: (entry as CartLine).slug, quantity }] : [];
    }
    return [];
  });
}
