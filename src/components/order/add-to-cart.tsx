"use client";

import { useCart } from "@/lib/cart-store";
import { QuantityStepper } from "./quantity-stepper";

type AddToCartProps = {
  slug: string;
  /** The dish's English name, for accessible labels. */
  name: string;
  /**
   * `button` is the full "Add to order" pill for a dish page or order row;
   * `plus` is a small round button set over a dish card's photograph.
   */
  variant?: "button" | "plus";
  tone?: "ink" | "cream";
};

/**
 * Adds a dish to the order. Once the dish is in the cart, the button becomes a
 * stepper showing how many, so the same control adds, changes and removes.
 */
export function AddToCart({
  slug,
  name,
  variant = "button",
  tone = "ink",
}: AddToCartProps) {
  const { lines, add, set } = useCart();
  const quantity = lines.find((line) => line.slug === slug)?.quantity ?? 0;

  if (variant === "plus") {
    return (
      <button
        type="button"
        onClick={(event) => {
          // The card around it is a link; adding must not also navigate.
          event.preventDefault();
          event.stopPropagation();
          add(slug);
        }}
        aria-label={
          quantity > 0
            ? `Add another ${name} (${quantity} in your order)`
            : `Add ${name} to your order`
        }
        className="bg-ink text-cream relative flex size-11 items-center justify-center rounded-full font-mono text-xl shadow-[0_0.2rem_0.6rem_rgb(20_8_6/0.35)] transition-transform duration-[--duration-fast] hover:scale-105 active:scale-95"
      >
        +
        {quantity > 0 ? (
          <span className="bg-chili text-cream absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[0.7rem]">
            {quantity}
          </span>
        ) : null}
      </button>
    );
  }

  if (quantity > 0) {
    return (
      <QuantityStepper
        quantity={quantity}
        onChange={(next) => set(slug, next)}
        label={name}
        tone={tone}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(slug)}
      aria-label={`Add ${name} to your order`}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 font-mono text-base transition-transform duration-[--duration-fast] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] ${
        tone === "ink" ? "bg-ink text-cream" : "bg-cream text-ink"
      }`}
    >
      Add to order
    </button>
  );
}
