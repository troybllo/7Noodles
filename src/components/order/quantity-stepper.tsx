import { MAX_QUANTITY } from "@/lib/cart";

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  /** Names the dish, so the buttons read "Remove one Dandan Noodle". */
  label: string;
  size?: "sm" | "md";
  tone?: "ink" | "bone";
};

/**
 * Minus, the count, plus, in a box. Going below one asks
 * the parent to remove the dish; the parent decides what that means.
 */
export function QuantityStepper({
  quantity,
  onChange,
  label,
  size = "md",
  tone = "ink",
}: QuantityStepperProps) {
  const ring = tone === "ink" ? "border-brand text-brand" : "border-paper text-paper";
  // The small size stays a full thumb's width on phones.
  const box = size === "sm" ? "h-11 text-sm sm:h-9" : "h-11 text-base";
  const button = size === "sm" ? "w-11 sm:w-9" : "w-11";

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={`inline-flex items-center border font-semibold ${ring} ${box}`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity > 1 ? `Remove one ${label}` : `Remove ${label}`}
        className={`${button} h-full transition-[background-color,scale] duration-(--duration-fast) ease-(--ease-out-soft) hover:bg-current/10 focus-visible:outline-offset-[-3px] active:scale-90`}
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center tabular-nums">
        <span
          key={quantity}
          className="inline-block motion-safe:animate-[badge-pop_320ms_var(--ease-pop)]"
        >
          {quantity}
        </span>
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={`Add one more ${label}`}
        className={`${button} h-full transition-[background-color,scale] duration-(--duration-fast) ease-(--ease-out-soft) hover:bg-current/10 focus-visible:outline-offset-[-3px] active:scale-90 disabled:opacity-40`}
      >
        +
      </button>
    </div>
  );
}
