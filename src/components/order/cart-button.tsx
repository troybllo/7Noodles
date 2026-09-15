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
      className={`relative flex items-center ${className ?? ""}`}
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
        className="h-full w-auto"
      >
        {BOWL.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      {itemCount > 0 ? (
        <span className="bg-chili text-cream absolute -top-[0.35em] -right-[0.6em] flex h-[1.35em] min-w-[1.35em] items-center justify-center rounded-full px-[0.3em] font-mono text-[0.7em] leading-none">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
