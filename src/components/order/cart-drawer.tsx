"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { CartLines } from "./cart-lines";
import { EmptyBowl } from "./empty-bowl";

/**
 * The order, in a panel sliding in from the right on cream paper.
 *
 * A native modal `<dialog>`: the browser traps focus inside it, makes the page
 * behind inert, closes it on Escape and returns focus to the button that
 * opened it. Clicking the dimmed page behind it also closes it, and so does
 * navigating away.
 */
export function CartDrawer() {
  const { lines, open, setOpen } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const { itemCount } = totals(lines);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  // Following a link inside the drawer, or any navigation, closes it.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="cart-title"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
      className="paper-cream text-ink m-0 ml-auto h-dvh max-h-none w-full max-w-md p-0 shadow-[-1rem_0_3rem_rgb(20_8_6/0.35)] backdrop:bg-[rgb(18_16_14/0.55)] open:flex"
    >
      <div className="flex w-full flex-col px-6 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <h2 id="cart-title" className="font-poster text-3xl uppercase">
            Your order
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-hand-caps text-ink text-base tracking-[0.06em] uppercase underline decoration-2 underline-offset-4"
          >
            Close
          </button>
        </div>
        <p className="font-hand text-ink/80 mt-1 text-lg">
          {itemCount === 0
            ? "Nothing in the bowl yet."
            : `${itemCount} ${itemCount === 1 ? "dish" : "dishes"} for pickup`}
        </p>

        {itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <EmptyBowl className="text-chili w-40" />
            <Link
              href="/order"
              className="bg-ink text-cream inline-flex h-12 items-center rounded-full px-8 font-mono"
            >
              Start an order
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-6 mt-4 flex-1 overflow-y-auto px-6">
              <CartLines onNavigate={() => setOpen(false)} />
            </div>
            <Link
              href="/checkout"
              className="bg-ink text-cream mt-6 inline-flex h-14 items-center justify-center rounded-full font-mono text-lg transition-transform hover:-translate-y-0.5 active:translate-y-px"
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </dialog>
  );
}
