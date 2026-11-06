import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as NextServer from "next/server";

const repo = vi.hoisted(() => ({ markPaid: vi.fn(), markUnpaid: vi.fn() }));
const notify = vi.hoisted(() => ({ notifyKitchen: vi.fn() }));
const after = vi.hoisted(() => vi.fn((task: () => unknown) => task()));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/orders/repo", () => repo);
vi.mock("@/lib/orders/notify", () => notify);
vi.mock("@/lib/orders/env", () => ({
  stripeEnv: () => ({ secretKey: "sk_test_x", webhookSecret: SECRET }),
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof NextServer>()),
  after,
}));

const SECRET = "whsec_test_secret";
const { POST } = await import("./route");

function delivery(type: string, session: Partial<Stripe.Checkout.Session>) {
  const payload = JSON.stringify({
    id: "evt_1",
    object: "event",
    type,
    data: { object: session },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload,
  }) as unknown as Parameters<typeof POST>[0];
}

const session = { id: "cs_1", metadata: { orderId: "order-1" } };

describe("Stripe webhook", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends a paid order to the kitchen", async () => {
    repo.markPaid.mockResolvedValue({ id: "order-1" });
    const response = await POST(
      delivery("checkout.session.completed", { ...session, payment_status: "paid" }),
    );
    expect(response.status).toBe(200);
    expect(repo.markPaid).toHaveBeenCalledWith({ sessionId: "cs_1", orderId: "order-1" });
    expect(notify.notifyKitchen).toHaveBeenCalledOnce();
  });

  it("alerts nobody when Stripe repeats a delivery already handled", async () => {
    repo.markPaid.mockResolvedValue(null);
    await POST(
      delivery("checkout.session.completed", { ...session, payment_status: "paid" }),
    );
    expect(notify.notifyKitchen).not.toHaveBeenCalled();
  });

  it("waits for a delayed payment to clear, then accepts it", async () => {
    await POST(
      delivery("checkout.session.completed", { ...session, payment_status: "unpaid" }),
    );
    expect(repo.markPaid).not.toHaveBeenCalled();
    repo.markPaid.mockResolvedValue({ id: "order-1" });
    await POST(
      delivery("checkout.session.async_payment_succeeded", {
        ...session,
        payment_status: "paid",
      }),
    );
    expect(repo.markPaid).toHaveBeenCalledOnce();
  });

  it("drops orders whose payment expired or failed", async () => {
    await POST(delivery("checkout.session.expired", session));
    await POST(delivery("checkout.session.async_payment_failed", session));
    expect(repo.markUnpaid).toHaveBeenCalledTimes(2);
    expect(repo.markPaid).not.toHaveBeenCalled();
  });

  it("rejects a forged delivery", async () => {
    const forged = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=forged" },
      body: "{}",
    }) as unknown as Parameters<typeof POST>[0];
    expect((await POST(forged)).status).toBe(400);
  });
});
