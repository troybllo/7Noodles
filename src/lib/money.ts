/**
 * Every monetary value in this codebase is an integer count of cents. Prices,
 * tax, tips and totals never touch a float, and never round more than once —
 * at the point a subtotal becomes a displayed or charged amount.
 */

export type Cents = number;

const CAD = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

export function formatCad(cents: Cents): string {
  return CAD.format(cents / 100);
}

/**
 * Multiplies cents by a rate and rounds half away from zero, which is what
 * Canadian tax rounding expects. `Math.round` rounds half toward positive
 * infinity, which skews negative amounts such as refunds.
 */
export function applyRate(cents: Cents, rate: number): Cents {
  const scaled = cents * rate;
  return Math.sign(scaled) * Math.round(Math.abs(scaled));
}
