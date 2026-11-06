"use client";

import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { TapedFrame } from "@/components/hand/taped-frame";

/**
 * The running order beside the ordering menu: a slip of paper taped up on
 * desktop that stays in view, and a bar pinned to the bottom of the screen on phones.
 * Both open the full order in the drawer.
 */
export function OrderSummary() {
  const { lines, setOpen } = useCart();
  const sum = totals(lines);
  const empty = sum.itemCount === 0;

  return (
    <>
      <aside aria-label="Your order" className="sticky top-36 hidden lg:block">
        <TapedFrame tape="top" tilt={1} className="text-sm">
          <div className="bg-paper text-brand flex flex-col gap-4 p-6">
            <h2 className="font-display text-2xl">Your order</h2>
            <p className="text-brand-deep text-sm">
              {empty
                ? "Add a dish to start."
                : `${sum.itemCount} ${sum.itemCount === 1 ? "dish" : "dishes"}`}
            </p>
            <dl className="flex flex-col gap-1 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCad(sum.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>HST</dt>
                <dd>{formatCad(sum.taxCents)}</dd>
              </div>
              <div className="border-brand/20 mt-1 flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatCad(sum.totalCents)}</dd>
              </div>
            </dl>
            <Button tone="outline" onClick={() => setOpen(true)} disabled={empty}>
              View order
            </Button>
            {empty ? null : (
              <Button href="/checkout" size="lg">
                Checkout
              </Button>
            )}
          </div>
        </TapedFrame>
      </aside>

      {empty ? null : (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-brand text-paper shadow-float flex h-14 w-full items-center justify-between rounded-full px-6 text-sm font-semibold"
          >
            <span>
              View order · {sum.itemCount} {sum.itemCount === 1 ? "dish" : "dishes"}
            </span>
            <span className="tabular-nums">{formatCad(sum.totalCents)}</span>
          </button>
        </div>
      )}
    </>
  );
}
