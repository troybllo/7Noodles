"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { STATUS_LABEL, type OrderStatus } from "@/lib/orders/status";

const STEPS: OrderStatus[] = ["new", "preparing", "ready", "picked_up"];
const POLL_MS = 5000;

/**
 * The order's progress, updated as the kitchen moves it on the board. While
 * payment is still being confirmed (Stripe's webhook can trail the redirect
 * by a second or two) it says so rather than showing a step.
 */
export function OrderStatusTracker({
  id,
  initial,
}: {
  id: string;
  initial: OrderStatus;
}) {
  const [status, setStatus] = useState(initial);
  const { clear } = useCart();

  // Arriving here means the order was placed: the cart has done its job.
  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (status === "picked_up" || status === "cancelled") return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/orders/${id}`, { cache: "no-store" });
      if (response.ok)
        setStatus(((await response.json()) as { status: OrderStatus }).status);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [id, status]);

  if (status === "pending_payment") {
    return (
      <p role="status" className="mt-10 text-lg font-semibold">
        Confirming your payment…
      </p>
    );
  }
  if (status === "cancelled") {
    return (
      <p role="status" className="mt-10 text-lg font-semibold">
        This order was cancelled. If you were charged, we&rsquo;ll refund you — please
        call us.
      </p>
    );
  }

  const current = STEPS.indexOf(status);
  return (
    <ol aria-label="Order progress" className="mt-10 grid grid-cols-4 gap-2">
      {STEPS.map((step, i) => (
        <li
          key={step}
          aria-current={i === current ? "step" : undefined}
          className={`border-t-4 pt-3 text-sm font-semibold ${i <= current ? "border-brand" : "border-brand/15 text-brand-deep"}`}
        >
          {STATUS_LABEL[step]}
        </li>
      ))}
    </ol>
  );
}
