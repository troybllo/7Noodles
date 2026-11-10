"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { CartLines } from "./cart-lines";
import { Button } from "@/components/ui/button";
import { Panda7 } from "@/components/brand/panda-7";

/**
 * The order, in a panel sliding in from the right.
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
      className="cart-drawer bg-paper text-brand backdrop:bg-brand/55 shadow-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md p-0 open:flex lg:backdrop:backdrop-blur-sm"
    >
      <div className="flex w-full flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <h2 id="cart-title" className="font-display text-3xl">
            Your order
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 min-h-11 px-2 text-sm font-semibold underline underline-offset-4"
          >
            Close
          </button>
        </div>
        <p className="text-brand-deep mt-1 text-sm">
          {itemCount === 0
            ? "Nothing in the bowl yet."
            : `${itemCount} ${itemCount === 1 ? "dish" : "dishes"} for pickup`}
        </p>

        {itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <Panda7 alt="" className="w-36" sizes="9rem" />
            <Button href="/order" size="lg" onClick={() => setOpen(false)}>
              Start an order
            </Button>
          </div>
        ) : (
          <>
            <div className="-mx-6 mt-4 flex-1 overflow-y-auto px-6">
              <CartLines onNavigate={() => setOpen(false)} />
            </div>
            <Button
              href="/checkout"
              size="xl"
              className="mt-6"
              onClick={() => setOpen(false)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
    </dialog>
  );
}
