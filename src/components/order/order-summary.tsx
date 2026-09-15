"use client";

import Link from "next/link";
import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";

/**
 * The running order beside the ordering menu: a taped note on desktop that
 * stays in view, and a bar pinned to the bottom of the screen on phones.
 * Both open the full order in the drawer.
 */
export function OrderSummary() {
  const { lines, setOpen } = useCart();
  const sum = totals(lines);
  const empty = sum.itemCount === 0;

  return (
    <>
      <aside
        aria-label="Your order"
        className="bg-cream text-ink sticky top-24 hidden rotate-[1deg] flex-col gap-4 p-6 shadow-[0_0.5rem_1.5rem_rgb(20_8_6/0.25)] lg:flex"
      >
        <h2 className="font-poster text-2xl uppercase">Your order</h2>
        <p className="font-hand text-lg">
          {empty
            ? "Add a dish to start."
            : `${sum.itemCount} ${sum.itemCount === 1 ? "dish" : "dishes"}`}
        </p>
        <dl className="flex flex-col gap-1 font-mono text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCad(sum.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>HST</dt>
            <dd>{formatCad(sum.taxCents)}</dd>
          </div>
          <div className="border-ink/30 mt-1 flex justify-between border-t pt-2 text-base">
            <dt>Total</dt>
            <dd>{formatCad(sum.totalCents)}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={empty}
          className="border-ink h-11 rounded-full border-2 font-mono disabled:opacity-40"
        >
          View order
        </button>
        {empty ? null : (
          <Link
            href="/checkout"
            className="bg-ink text-cream inline-flex h-12 items-center justify-center rounded-full font-mono"
          >
            Checkout
          </Link>
        )}
      </aside>

      {empty ? null : (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-ink text-cream flex h-14 w-full items-center justify-between rounded-full px-6 font-mono shadow-[0_0.5rem_1.5rem_rgb(20_8_6/0.35)]"
          >
            <span>
              View order · {sum.itemCount} {sum.itemCount === 1 ? "dish" : "dishes"}
            </span>
            <span>{formatCad(sum.totalCents)}</span>
          </button>
        </div>
      )}
    </>
  );
}
