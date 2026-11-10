"use client";

import { roughPath } from "@/design/hand-drawn";
import { totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";

const BOWL = [
  roughPath(
    [
      [2, 10],
      [5, 18],
      [12, 21],
      [19, 18],
      [22, 10],
    ],
    { seed: 13, wobble: 0.4 },
  ),
  roughPath(
    [
      [1, 10],
      [12, 9],
      [23, 10],
    ],
    { seed: 15, wobble: 0.3 },
  ),
  roughPath(
    [
      [7, 7],
      [21, 1],
    ],
    { seed: 17, wobble: 0.3 },
  ),
  roughPath(
    [
      [9, 8],
      [23, 3],
    ],
    { seed: 19, wobble: 0.3 },
  ),
];

/**
 * Opens the order drawer. A hand-drawn bowl with the number of dishes in the
 * order beside it, in the navigation bar's own colour.
 */
export function CartButton({ className }: { className?: string }) {
  const { lines, setOpen } = useCart();
  const { itemCount } = totals(lines);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={
        itemCount === 0
          ? "Your order, empty"
          : `Your order, ${itemCount} ${itemCount === 1 ? "dish" : "dishes"}`
      }
      className={`relative -m-2.5 flex size-11 items-center justify-center transition-transform duration-(--duration-fast) ease-(--ease-out-soft) active:scale-90 ${className ?? ""}`}
      style={{ color: "var(--bar-label)" }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        {BOWL.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      {itemCount > 0 ? (
        <span
          key={itemCount}
          className="bg-paper text-brand absolute top-1 right-0 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full px-1 text-[0.65rem] leading-none font-bold motion-safe:animate-[badge-pop_420ms_var(--ease-pop)]"
        >
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
