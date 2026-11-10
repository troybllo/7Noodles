"use client";

import { useEffect, useState } from "react";
import { findDish } from "@/lib/menu";
import { useCart } from "@/lib/cart-store";

/** How long the note stays up, and how long it takes to leave, in milliseconds. */
const SHOW_FOR = 2600;
const LEAVE_FOR = 240;

/**
 * A small note confirming a dish was added, with a button to view the
 * order. Announced to screen readers through a polite live region, which stays
 * in the page so the announcement is never missed.
 */
export function AddedNote() {
  const { lastAdded, setOpen } = useCart();
  const [visible, setVisible] = useState<{ name: string; at: number } | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    const name = findDish(lastAdded.slug)?.item.nameEn;
    if (!name) return;
    const show = window.setTimeout(() => {
      setLeaving(false);
      setVisible({ name, at: lastAdded.at });
    }, 0);
    const leave = window.setTimeout(() => setLeaving(true), SHOW_FOR - LEAVE_FOR);
    const hide = window.setTimeout(() => setVisible(null), SHOW_FOR);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(leave);
      window.clearTimeout(hide);
    };
  }, [lastAdded]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[45] flex justify-center px-4 lg:bottom-6"
    >
      {visible ? (
        <div
          key={visible.at}
          className={`bg-brand text-paper shadow-float pointer-events-auto flex items-center gap-4 py-2 pr-2 pl-5 ${leaving ? "motion-safe:animate-[note-out_240ms_var(--ease-out-soft)_both]" : "motion-safe:animate-[note-in_var(--duration-base)_var(--ease-out-expo)]"}`}
        >
          <span className="text-sm">
            Added <strong className="font-semibold">{visible.name}</strong>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-paper text-brand min-h-11 px-4 text-xs font-bold tracking-[0.08em] uppercase transition-transform duration-(--duration-fast) active:scale-95"
          >
            View
          </button>
        </div>
      ) : null}
    </div>
  );
}
