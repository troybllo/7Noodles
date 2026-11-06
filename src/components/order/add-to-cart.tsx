"use client";

import { useId, useRef, useState } from "react";
import { lineKey, quantityOf } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { defaultSelection, type MenuItem, type Selection } from "@/lib/menu";
import { formatCad } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "./quantity-stepper";

type AddToCartProps = {
  item: MenuItem;
  /**
   * `button` is the full "Add to order" pill for a dish page or order row;
   * `plus` is a small round button set over a dish card's photograph.
   */
  variant?: "button" | "plus";
  tone?: "ink" | "bone";
};

/**
 * Adds a dish to the order.
 *
 * A dish without choices becomes a stepper once it is in the cart, so the same
 * control adds, changes and removes. A dish with choices — wonton size, beef or
 * chicken, how spicy — opens a short sheet first, and each combination becomes
 * its own line in the cart, changed from there.
 */
export function AddToCart({ item, variant = "button", tone = "ink" }: AddToCartProps) {
  const { lines, add, set } = useCart();
  const sheet = useRef<HTMLDialogElement>(null);
  const quantity = quantityOf(lines, item.slug);
  const hasOptions = item.options.length > 0;
  const name = item.nameEn;

  if (!item.available) {
    return variant === "plus" ? null : (
      <span className="border-brand/25 text-brand-deep inline-flex h-11 items-center rounded-full border px-5 text-sm">
        Coming soon
      </span>
    );
  }

  const start = (event: React.MouseEvent) => {
    // The card around a `plus` button is a link; adding must not also navigate.
    event.preventDefault();
    event.stopPropagation();
    if (hasOptions) sheet.current?.showModal();
    else add(item.slug);
  };

  const options = hasOptions ? (
    <OptionSheet
      ref={sheet}
      item={item}
      onAdd={(selection) => add(item.slug, selection)}
    />
  ) : null;

  if (variant === "plus") {
    return (
      <>
        <button
          type="button"
          onClick={start}
          aria-label={
            quantity > 0
              ? `Add another ${name} (${quantity} in your order)`
              : `Add ${name} to your order`
          }
          className="bg-brand text-paper shadow-float relative flex size-11 items-center justify-center rounded-full text-xl transition-transform duration-(--duration-fast) hover:scale-105 active:scale-95"
        >
          +
          {quantity > 0 ? (
            <span className="bg-paper text-brand absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[0.7rem] font-semibold">
              {quantity}
            </span>
          ) : null}
        </button>
        {options}
      </>
    );
  }

  if (!hasOptions && quantity > 0) {
    return (
      <QuantityStepper
        quantity={quantity}
        onChange={(next) => set(lineKey(item.slug, {}), next)}
        label={name}
        tone={tone}
      />
    );
  }

  return (
    <>
      <Button
        onClick={start}
        aria-label={`Add ${name} to your order`}
        tone={tone === "ink" ? "solid" : "inverse"}
      >
        {hasOptions ? "Choose & add" : "Add to order"}
        {hasOptions && quantity > 0 ? (
          <span className="bg-paper text-brand rounded-full px-2 text-xs">
            {quantity}
          </span>
        ) : null}
      </Button>
      {options}
    </>
  );
}

function OptionSheet({
  ref,
  item,
  onAdd,
}: {
  ref: React.Ref<HTMLDialogElement>;
  item: MenuItem;
  onAdd: (selection: Selection) => void;
}) {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(item));
  const titleId = useId();
  const delta = item.options.reduce(
    (sum, option) =>
      sum +
      (option.choices.find((c) => c.id === selection[option.id])?.priceDeltaCents ?? 0),
    0,
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // However it closes (Add, Cancel, Escape, the backdrop), it opens fresh next time.
      onClose={() => setSelection(defaultSelection(item))}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog itself.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="bg-paper text-brand backdrop:bg-brand/60 m-auto w-[min(28rem,calc(100vw-2rem))] rotate-[-0.6deg] rounded-sm p-0 shadow-2xl backdrop:backdrop-blur-sm"
    >
      <form
        method="dialog"
        onSubmit={() => onAdd(selection)}
        className="flex flex-col gap-6 p-6 sm:p-8"
      >
        <header>
          <h2 id={titleId} className="font-display text-2xl leading-tight">
            {item.nameEn}
          </h2>
          <p lang="zh" className="font-cjk text-brand-deep mt-1 text-sm">
            {item.nameZh}
          </p>
        </header>

        {item.options.map((option) => (
          <fieldset key={option.id} className="flex flex-col gap-2">
            <legend className="text-brand-deep mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
              {option.labelEn} <span lang="zh">· {option.labelZh}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.choices.map((choice) => (
                <label
                  key={choice.id}
                  className="border-brand/20 has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-paper has-[:focus-visible]:outline-brand cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
                >
                  <input
                    type="radio"
                    name={option.id}
                    value={choice.id}
                    checked={selection[option.id] === choice.id}
                    onChange={() =>
                      setSelection((s) => ({ ...s, [option.id]: choice.id }))
                    }
                    className="sr-only"
                  />
                  {choice.labelEn}
                  {choice.priceDeltaCents
                    ? ` (+${formatCad(choice.priceDeltaCents)})`
                    : ""}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={(event) => event.currentTarget.closest("dialog")?.close()}
            className="text-brand-deep text-sm underline underline-offset-4"
          >
            Cancel
          </button>
          <Button type="submit">Add · {formatCad(item.priceCents + delta)}</Button>
        </div>
      </form>
    </dialog>
  );
}
