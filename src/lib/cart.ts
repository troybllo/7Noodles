import {
  findDish,
  resolveSelection,
  type MenuCategory,
  type MenuChoice,
  type MenuItem,
  type MenuOption,
  type Selection,
} from "./menu";
import { applyRate, type Cents } from "./money";

/**
 * The order being built, as the browser keeps it.
 *
 * Only slugs, chosen options and quantities are stored. Names and prices are
 * always read back from the menu, so a cart saved last week can never carry
 * last week's price, and a dish removed from the menu simply drops out.
 *
 * Everything here is pure, so checkout prices the order again on the server
 * with these same functions and never trusts a total sent by the browser.
 */

export type CartLine = { slug: string; selection: Selection; quantity: number };

export type PricedLine = CartLine & {
  /** Identifies the line: the same dish with different choices is a different line. */
  key: string;
  item: MenuItem;
  category: MenuCategory;
  choices: { option: MenuOption; choice: MenuChoice }[];
  unitPriceCents: Cents;
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

/** The largest online order: anything bigger is a catering call, not a pickup. */
export const MAX_ITEMS = 50;

/** Stripe takes at most 100 line items; HST is one of them. */
export const MAX_LINES = 40;

const clamp = (quantity: number) =>
  Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));

/** A stable key for a dish with its choices, independent of the order they were made in. */
export function lineKey(slug: string, selection: Selection): string {
  const parts = Object.keys(selection)
    .sort()
    .map((option) => `${option}=${selection[option]}`);
  return parts.length > 0 ? `${slug}?${parts.join("&")}` : slug;
}

const keyOf = (line: CartLine) => lineKey(line.slug, line.selection);

/** Adds `quantity` of a dish with these choices, merging with an identical line. */
export function addItem(
  lines: CartLine[],
  slug: string,
  selection: Selection = {},
  quantity = 1,
): CartLine[] {
  const key = lineKey(slug, selection);
  const existing = lines.find((line) => keyOf(line) === key);
  if (!existing) {
    const next = clamp(quantity);
    return next > 0
      ? [...lines, { slug, selection: { ...selection }, quantity: next }]
      : lines;
  }
  return setQuantity(lines, key, existing.quantity + quantity);
}

/** Sets a line's quantity by its key; zero or less removes it. */
export function setQuantity(
  lines: CartLine[],
  key: string,
  quantity: number,
): CartLine[] {
  const next = clamp(quantity);
  if (next === 0) return removeItem(lines, key);
  return lines.map((line) => (keyOf(line) === key ? { ...line, quantity: next } : line));
}

export function removeItem(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((line) => keyOf(line) !== key);
}

/** How many of a dish the cart holds, across all its choices. */
export function quantityOf(lines: CartLine[], slug: string): number {
  return lines.reduce((sum, line) => (line.slug === slug ? sum + line.quantity : sum), 0);
}

/**
 * The cart's lines with their dishes, choices and prices. Drops any line whose
 * dish the menu no longer has, is not serving, or whose choices no longer fit.
 */
export function priceLines(lines: CartLine[]): PricedLine[] {
  return lines.flatMap((line) => {
    const found = findDish(line.slug);
    const quantity = clamp(line.quantity);
    if (!found || !found.item.available || quantity === 0) return [];
    const choices = resolveSelection(found.item, line.selection);
    if (!choices) return [];
    const unitPriceCents =
      found.item.priceCents +
      choices.reduce((sum, { choice }) => sum + choice.priceDeltaCents, 0);
    return [
      {
        slug: line.slug,
        selection: line.selection,
        quantity,
        key: keyOf(line),
        item: found.item,
        category: found.category,
        choices,
        unitPriceCents,
        lineTotalCents: unitPriceCents * quantity,
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

const isSelection = (value: unknown): value is Selection =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((choice) => typeof choice === "string");

/**
 * Parses whatever was stored or posted, keeping only well-formed lines and
 * merging repeats of the same dish and choices, so the per-dish cap holds
 * however the lines were sent.
 */
export function parseLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartLine[]>((lines, entry) => {
    if (typeof entry !== "object" || entry === null) return lines;
    const { slug, selection, quantity } = entry as Partial<CartLine>;
    if (typeof slug !== "string" || typeof quantity !== "number") return lines;
    return addItem(lines, slug, isSelection(selection) ? { ...selection } : {}, quantity);
  }, []);
}

/** Whether an order is small enough to take online. */
export function withinOrderLimits(lines: CartLine[]): boolean {
  const items = lines.reduce((sum, line) => sum + line.quantity, 0);
  return lines.length <= MAX_LINES && items <= MAX_ITEMS;
}
