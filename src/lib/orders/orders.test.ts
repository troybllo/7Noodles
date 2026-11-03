import { describe, expect, it } from "vitest";
import { priceLines } from "@/lib/cart";
import { defaultSelection, findDish } from "@/lib/menu";
import { slotInstant } from "@/lib/pickup";
import { describeLine, orderCode, snapshot } from "./snapshot";
import { canMove, kitchenCanMove } from "./status";

describe("order status rules", () => {
  it("lets a paid order move forward through the kitchen", () => {
    expect(canMove("pending_payment", "new")).toBe(true);
    expect(canMove("new", "preparing")).toBe(true);
    expect(canMove("preparing", "ready")).toBe(true);
    expect(canMove("ready", "picked_up")).toBe(true);
  });

  it("allows one step back for a mistaken tap, but nothing after pickup", () => {
    expect(canMove("ready", "preparing")).toBe(true);
    expect(canMove("preparing", "new")).toBe(true);
    expect(canMove("picked_up", "ready")).toBe(false);
    expect(canMove("cancelled", "new")).toBe(false);
  });

  it("never lets the kitchen mark an order paid", () => {
    expect(kitchenCanMove("pending_payment", "new")).toBe(false);
    expect(kitchenCanMove("new", "preparing")).toBe(true);
  });
});

describe("order snapshot", () => {
  const item = findDish("super-spicy-beef-or-chicken-noodles")!.item;
  const lines = priceLines([
    {
      slug: item.slug,
      selection: { ...defaultSelection(item), protein: "chicken" },
      quantity: 2,
    },
  ]);

  it("freezes names, choices and amounts from the menu, not the browser", () => {
    const [line] = snapshot(lines);
    expect(line).toMatchObject({
      slug: item.slug,
      nameEn: item.nameEn,
      nameZh: item.nameZh,
      quantity: 2,
      unitPriceCents: item.priceCents,
      lineTotalCents: item.priceCents * 2,
    });
    expect(line!.choices.map((c) => c.choice)).toContain("Chicken");
    expect(describeLine(line!)).toMatch(/^2× Dry Noodles .*\(Chicken/);
  });

  it("makes short readable codes", () => {
    expect(orderCode(() => 0.0423)).toBe("7N-0423");
    expect(orderCode(() => 0)).toBe("7N-0000");
  });
});

describe("pickup slot instants", () => {
  it("reads Toronto wall time, in winter and in summer", () => {
    expect(slotInstant("2026-12-14T18:30").toISOString()).toBe(
      "2026-12-14T23:30:00.000Z",
    );
    expect(slotInstant("2026-07-14T18:30").toISOString()).toBe(
      "2026-07-14T22:30:00.000Z",
    );
  });

  it("refuses anything that is not a slot", () => {
    expect(() => slotInstant("tomorrow")).toThrow();
  });
});
