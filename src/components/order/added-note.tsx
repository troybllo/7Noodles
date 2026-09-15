"use client";

import { useEffect, useState } from "react";
import { findDish } from "@/lib/menu";
import { useCart } from "@/lib/cart-store";

/** How long the note stays up, in milliseconds. */
const SHOW_FOR = 2600;

/**
 * A small taped note confirming a dish was added, with a button to view the
 * order. Announced to screen readers through a polite live region, which stays
 * in the page so the announcement is never missed.
 */
export function AddedNote() {
  const { lastAdded, setOpen } = useCart();
  const [visible, setVisible] = useState<{ name: string; at: number } | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    const name = findDish(lastAdded.slug)?.item.nameEn;
    if (!name) return;
    const show = window.setTimeout(() => setVisible({ name, at: lastAdded.at }), 0);
    const hide = window.setTimeout(() => setVisible(null), SHOW_FOR);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [lastAdded]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[45] flex justify-center px-6"
    >
      {visible ? (
        <div
          key={visible.at}
          className="bg-cream text-ink pointer-events-auto flex rotate-[-1.5deg] items-center gap-4 px-5 py-3 shadow-[0_0.5rem_1.5rem_rgb(20_8_6/0.3)] motion-safe:animate-[note-in_320ms_cubic-bezier(0.16,1,0.3,1)]"
        >
          <span className="font-hand text-lg">
            Added <strong className="font-bold">{visible.name}</strong> to your order
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="font-hand-caps text-chili text-base tracking-[0.06em] uppercase underline decoration-2 underline-offset-4"
          >
            View
          </button>
        </div>
      ) : null}
    </div>
  );
}
