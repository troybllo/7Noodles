import type { OrderLine } from "./snapshot";

/**
 * Checkout Session line items for an order: one per dish, its choices in the
 * description, and HST as its own line so the receipt matches the site's
 * total to the cent (tax is computed once, on the subtotal, by `totals`).
 */
export function stripeLineItems(lines: OrderLine[], taxCents: number) {
  const dishes = lines.map((line) => ({
    quantity: line.quantity,
    price_data: {
      currency: "cad",
      unit_amount: line.unitPriceCents,
      product_data: {
        name: `${line.nameEn} ${line.nameZh}`,
        ...(line.choices.length > 0
          ? { description: line.choices.map((c) => c.choice).join(" · ") }
          : {}),
      },
    },
  }));
  return taxCents > 0
    ? [
        ...dishes,
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: taxCents,
            product_data: { name: "HST (13%)" },
          },
        },
      ]
    : dishes;
}
