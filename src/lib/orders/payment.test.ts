import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { parseLines, priceLines, totals } from "@/lib/cart";
import { defaultSelection, findDish } from "@/lib/menu";
import { snapshot } from "./snapshot";
import { verifyStripeEvent } from "./stripe-events";
import { stripeLineItems } from "./stripe-lines";

const wanza = findDish("wanza-noodles")!.item;
const spicy = findDish("super-spicy-beef-or-chicken-noodles")!.item;

describe("checkout pricing", () => {
  it("ignores prices sent by the browser and charges the menu's", () => {
    // A tampered cart: prices and totals the browser has no say in.
    const posted = [
      { slug: wanza.slug, selection: {}, quantity: 2, priceCents: 1, lineTotalCents: 2 },
      { slug: spicy.slug, selection: defaultSelection(spicy), quantity: 1, totalCents: 0 },
    ];
    const lines = parseLines(posted);
    const priced = priceLines(lines);
    expect(priced.map((l) => l.unitPriceCents)).toEqual([wanza.priceCents, spicy.priceCents]);
    expect(totals(lines).subtotalCents).toBe(wanza.priceCents * 2 + spicy.priceCents);
  });

  it("sends Stripe the same total the site shows, HST included", () => {
    const lines = parseLines([
      { slug: wanza.slug, selection: {}, quantity: 3 },
      { slug: spicy.slug, selection: defaultSelection(spicy), quantity: 1 },
    ]);
    const sum = totals(lines);
    const items = stripeLineItems(snapshot(priceLines(lines)), sum.taxCents);
    const charged = items.reduce((total, i) => total + i.price_data.unit_amount * i.quantity, 0);
    expect(charged).toBe(sum.totalCents);
    expect(items.at(-1)?.price_data.product_data.name).toBe("HST (13%)");
    expect(items.every((i) => i.price_data.currency === "cad")).toBe(true);
  });
});

describe("Stripe webhook verification", () => {
  const secret = "whsec_test_secret";
  const body = JSON.stringify({ id: "evt_1", object: "event", type: "checkout.session.completed", data: { object: {} } });

  it("accepts a delivery signed by Stripe", () => {
    const header = Stripe.webhooks.generateTestHeaderString({ payload: body, secret });
    expect(verifyStripeEvent(body, header, secret).id).toBe("evt_1");
  });

  it("rejects a forged, altered or unsigned delivery", () => {
    const header = Stripe.webhooks.generateTestHeaderString({ payload: body, secret });
    expect(() => verifyStripeEvent(body.replace("evt_1", "evt_2"), header, secret)).toThrow();
    expect(() => verifyStripeEvent(body, header, "whsec_other")).toThrow();
    expect(() => verifyStripeEvent(body, null, secret)).toThrow();
  });
});
