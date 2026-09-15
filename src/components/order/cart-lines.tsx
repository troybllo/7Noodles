import Link from "next/link";
import { priceLines, totals } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatCad } from "@/lib/money";
import { QuantityStepper } from "./quantity-stepper";

/**
 * The order's lines with steppers, then subtotal, HST and total, as the drawer
 * and checkout both show them. `onNavigate` lets the drawer close when a dish
 * name is followed.
 *
 * Only for use inside client components; it reads the cart.
 */
export function CartLines({
  editable = true,
  onNavigate,
}: {
  editable?: boolean;
  onNavigate?: () => void;
}) {
  const { lines, set } = useCart();
  const priced = priceLines(lines);
  const sum = totals(lines);

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {priced.map((line) => (
          <li
            key={line.slug}
            className="border-ink/20 flex items-start justify-between gap-4 border-b border-dashed py-4"
          >
            <div className="min-w-0">
              <Link
                href={`/menu/${line.category.slug}/${line.slug}`}
                {...(onNavigate ? { onClick: onNavigate } : {})}
                className="font-nav text-ink block leading-snug font-bold hover:underline"
              >
                {line.item.nameEn}
              </Link>
              <span lang="zh" className="text-ink/70 block text-sm">
                {line.item.nameZh}
              </span>
              {editable ? (
                <div className="mt-3">
                  <QuantityStepper
                    size="sm"
                    quantity={line.quantity}
                    onChange={(next) => set(line.slug, next)}
                    label={line.item.nameEn}
                  />
                </div>
              ) : (
                <span className="text-ink/80 mt-1 block font-mono text-sm">
                  × {line.quantity}
                </span>
              )}
            </div>
            <span className="shrink-0 font-mono">{formatCad(line.lineTotalCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 flex flex-col gap-1.5 font-mono text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCad(sum.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>HST (13%)</dt>
          <dd>{formatCad(sum.taxCents)}</dd>
        </div>
        <div className="border-ink/30 mt-2 flex justify-between border-t pt-3 text-lg">
          <dt>Total</dt>
          <dd>{formatCad(sum.totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}
