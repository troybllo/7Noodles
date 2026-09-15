import { MAX_QUANTITY } from "@/lib/cart";

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  /** Names the dish, so the buttons read "Remove one Dandan Noodle". */
  label: string;
  size?: "sm" | "md";
  tone?: "ink" | "cream";
};

/**
 * Minus, the count, plus: a pill in the typewriter face. Going below one asks
 * the parent to remove the dish; the parent decides what that means.
 */
export function QuantityStepper({
  quantity,
  onChange,
  label,
  size = "md",
  tone = "ink",
}: QuantityStepperProps) {
  const ring = tone === "ink" ? "border-ink text-ink" : "border-cream text-cream";
  const box = size === "sm" ? "h-9 text-sm" : "h-11 text-base";
  const button = size === "sm" ? "w-9" : "w-11";

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={`inline-flex items-center rounded-full border-2 font-mono ${ring} ${box}`}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity > 1 ? `Remove one ${label}` : `Remove ${label}`}
        className={`${button} h-full rounded-l-full transition-colors hover:bg-current/10 focus-visible:outline-offset-[-3px]`}
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={`Add one more ${label}`}
        className={`${button} h-full rounded-r-full transition-colors hover:bg-current/10 focus-visible:outline-offset-[-3px] disabled:opacity-40`}
      >
        +
      </button>
    </div>
  );
}
