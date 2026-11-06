"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { STATUS_LABEL, type OrderStatus } from "@/lib/orders/status";
import { usePoll } from "@/lib/use-poll";

const STEPS: OrderStatus[] = ["new", "preparing", "ready", "picked_up"];

/** Polling stops after this long, so a tab left open overnight goes quiet. */
const GIVE_UP_AFTER_MS = 3 * 60 * 60 * 1000;

const finished = (status: OrderStatus) =>
  status === "picked_up" || status === "cancelled";

/**
 * The order's progress, updated as the kitchen moves it on the board. While
 * payment is still being confirmed (Stripe's webhook can trail the redirect by
 * a second or two) it says so rather than showing a step. Polls only while the
 * page is in view.
 */
export function OrderStatusTracker({
  id,
  initial,
}: {
  id: string;
  initial: OrderStatus;
}) {
  const [status, setStatus] = useState(initial);
  const [since] = useState(() => Date.now());
  const { clear } = useCart();

  // Arriving here means the order was placed: the cart has done its job.
  useEffect(() => clear(), [clear]);

  usePoll(
    async (signal) => {
      if (Date.now() - since > GIVE_UP_AFTER_MS) return false;
      const response = await fetch(`/api/orders/${id}`, { cache: "no-store", signal });
      if (!response.ok) throw new Error(`Status poll failed: ${response.status}`);
      const next = ((await response.json()) as { status: OrderStatus }).status;
      setStatus(next);
      return !finished(next);
    },
    { every: 5_000, whenHidden: null, maxBackoff: 60_000, enabled: !finished(status) },
  );

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
        This order was cancelled. If you were charged, we&rsquo;ll refund you. Please call
        us.
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
